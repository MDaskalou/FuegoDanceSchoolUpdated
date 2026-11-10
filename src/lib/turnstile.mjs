const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export const TURNSTILE_ACTION = "open_house";

export const TEST_TURNSTILE_HOSTS = new Set([
    "localhost",
    "127.0.0.1",
    "charming-platypus-787e76.netlify.app",
]);

export const PRODUCTION_TURNSTILE_HOSTS = new Set([
    "fuegodanceschool.se",
    "www.fuegodanceschool.se",
]);

function hostsForMode(mode) {
    if (mode === "test") return TEST_TURNSTILE_HOSTS;
    if (mode === "production") return PRODUCTION_TURNSTILE_HOSTS;
    return null;
}

export async function verifyTurnstileToken({ fetchImpl, secret, token, mode }) {
    const allowedHosts = hostsForMode(mode);
    if (!allowedHosts) {
        return { ok: false, status: 503 };
    }
    if (typeof secret !== "string" || secret.trim() === "") {
        return { ok: false, status: 503 };
    }
    if (typeof token !== "string" || token.trim() === "" || token.length > 2048) {
        return { ok: false, status: 400 };
    }

    let response;
    try {
        response = await fetchImpl(SITEVERIFY_URL, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                secret,
                response: token,
            }),
        });
    } catch {
        return { ok: false, status: 502 };
    }

    if (!response || response.status < 200 || response.status >= 300) {
        return { ok: false, status: 502 };
    }

    let parsed;
    try {
        parsed = JSON.parse(await response.text());
    } catch {
        return { ok: false, status: 502 };
    }

    if (!parsed || parsed.success !== true) {
        return { ok: false, status: 400 };
    }
    if (parsed.action !== TURNSTILE_ACTION || !allowedHosts.has(parsed.hostname)) {
        return { ok: false, status: 400 };
    }

    return { ok: true };
}
