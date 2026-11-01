import {
    isHoneypotTripped,
    payloadFingerprint,
    validateRegistration,
} from "./openHouseShared.mjs";
import { isOpenHouseEventId } from "./openHouseRegistry.mjs";
import { verifyTurnstileToken } from "./turnstile.mjs";

export const PRODUCTION_DEPLOYMENT_ID =
    "AKfycbyz1pVbPGyUNspPhDZ0nMTeeenNsBk4o4ZrpN8tcQZTtacTt4CPwGBtb9il3KzKPbM5ig";

const TRUSTED_REDIRECT_HOSTS = new Set([
    "script.google.com",
    "script.googleusercontent.com",
]);

export function resolveTestTarget(env) {
    if (env.OPEN_HOUSE_ENV !== "test") {
        return { ok: false, reason: "test_mode_required" };
    }

    const urlValue = env.OPEN_HOUSE_APPS_SCRIPT_URL;
    const secret = env.OPEN_HOUSE_APPS_SCRIPT_SECRET;
    const eventId = typeof env.OPEN_HOUSE_EVENT_ID === "string" ? env.OPEN_HOUSE_EVENT_ID.trim() : "";
    if (typeof urlValue !== "string" || typeof secret !== "string" || secret.trim() === "" || !isOpenHouseEventId(eventId)) {
        return { ok: false, reason: "missing_config" };
    }
    if (urlValue.includes(PRODUCTION_DEPLOYMENT_ID)) {
        return { ok: false, reason: "production_blocked" };
    }

    let url;
    try {
        url = new URL(urlValue);
    } catch {
        return { ok: false, reason: "invalid_url" };
    }

    if (url.protocol !== "https:" || url.username || url.password) {
        return { ok: false, reason: "invalid_url" };
    }
    if (url.hostname !== "script.google.com") {
        return { ok: false, reason: "untrusted_host" };
    }
    if (!/^\/macros\/s\/[^/]+\/exec$/.test(url.pathname)) {
        return { ok: false, reason: "invalid_url" };
    }

    return { ok: true, url: url.toString(), secret, eventId };
}

function trustedRedirect(location, baseUrl) {
    if (typeof location !== "string" || location.trim() === "") return null;
    let url;
    try {
        url = new URL(location, baseUrl);
    } catch {
        return null;
    }
    if (url.protocol !== "https:" || url.username || url.password) return null;
    if (!TRUSTED_REDIRECT_HOSTS.has(url.hostname)) return null;
    if (url.toString().includes(PRODUCTION_DEPLOYMENT_ID)) return null;
    return url;
}

function interpretScriptResult(parsed, expectedPayloadHash) {
    if (!parsed || typeof parsed !== "object" || parsed.result !== "success") {
        return { status: 502, body: { ok: false } };
    }

    if (parsed.alreadyRegistered === true) {
        if (parsed.payloadHash !== expectedPayloadHash) {
            return { status: 409, body: { ok: false, code: "registration_conflict" } };
        }
        return {
            status: 200,
            body: { ok: true, alreadyRegistered: true, leadRecorded: false },
        };
    }

    if (parsed.payloadHash != null && parsed.payloadHash !== expectedPayloadHash) {
        return { status: 409, body: { ok: false, code: "registration_conflict" } };
    }

    return {
        status: 200,
        body: { ok: true, alreadyRegistered: false, leadRecorded: true },
    };
}

async function readScriptJson(response) {
    const text = await response.text();
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

export async function submitToAppsScript({
    fetchImpl,
    url,
    secret,
    eventId,
    registration,
    timeoutMs = 12000,
}) {
    const payloadHash = await payloadFingerprint(registration);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const posted = await fetchImpl(url, {
            method: "POST",
            redirect: "manual",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                registrationId: registration.registrationId,
                name: registration.name,
                email: registration.email,
                role: registration.role,
                referral: registration.referral,
                courses: registration.courses,
                message: registration.message,
                language: registration.language,
                payloadHash,
                eventId,
                secret,
            }),
            signal: controller.signal,
        });

        let resultResponse = posted;
        if (posted.status >= 300 && posted.status < 400) {
            const nextUrl = trustedRedirect(posted.headers.get("location"), url);
            if (!nextUrl) {
                return { status: 502, body: { ok: false } };
            }
            resultResponse = await fetchImpl(nextUrl.toString(), {
                method: "GET",
                redirect: "manual",
                signal: controller.signal,
            });
            if (resultResponse.status >= 300 && resultResponse.status < 400) {
                return { status: 502, body: { ok: false } };
            }
        }

        if (resultResponse.status < 200 || resultResponse.status >= 300) {
            return { status: 502, body: { ok: false } };
        }

        const parsed = await readScriptJson(resultResponse);
        return interpretScriptResult(parsed, payloadHash);
    } catch (error) {
        if (error && error.name === "AbortError") {
            return { status: 504, body: { ok: false } };
        }
        return { status: 502, body: { ok: false } };
    } finally {
        clearTimeout(timer);
    }
}

export async function handleOpenHousePost(body, env, fetchImpl) {
    if (isHoneypotTripped(body)) {
        return { status: 200, body: { ok: true } };
    }

    const validated = validateRegistration(body);
    if (!validated.ok) {
        return { status: 400, body: { ok: false } };
    }

    const target = resolveTestTarget(env);
    if (!target.ok) {
        return { status: 503, body: { ok: false } };
    }

    const turnstile = await verifyTurnstileToken({
        fetchImpl,
        secret: env.TURNSTILE_SECRET_KEY,
        token: typeof body.turnstileToken === "string" ? body.turnstileToken : "",
    });
    if (!turnstile.ok) {
        return { status: turnstile.status, body: { ok: false } };
    }

    return submitToAppsScript({
        fetchImpl,
        url: target.url,
        secret: target.secret,
        eventId: target.eventId,
        registration: validated.value,
    });
}
