import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import {
    analyticsConsentGranted,
    buildGenerateLeadEvent,
    clearRegistrationAttempt,
    getOpenHouseFieldErrors,
    openHouseSubmissionState,
    payloadFingerprint,
    rememberRegistrationId,
    shouldTrackLead,
} from "../src/lib/openHouseShared.mjs";
import {
    PRODUCTION_DEPLOYMENT_ID,
    handleOpenHousePost,
} from "../src/lib/openHouse.mjs";
import {
    PRODUCTION_TURNSTILE_HOSTS,
    TEST_TURNSTILE_HOSTS,
} from "../src/lib/turnstile.mjs";
import {
    applyRegistration,
    createRegistrationLock,
} from "../src/lib/openHouseRegistry.mjs";

const TEST_DEPLOYMENT_ID = "AKfycbTESTONLYopenHouseDeployment";
const PRODUCTION_DEPLOYMENT_ONLY_ID = "AKfycbPRODUCTIONONLYopenHouseDeployment";
const TEST_URL = `https://script.google.com/macros/s/${TEST_DEPLOYMENT_ID}/exec`;
const PRODUCTION_URL = `https://script.google.com/macros/s/${PRODUCTION_DEPLOYMENT_ONLY_ID}/exec`;
const TEST_ENV = {
    OPEN_HOUSE_ENV: "test",
    OPEN_HOUSE_DEPLOYMENT_ID: TEST_DEPLOYMENT_ID,
    OPEN_HOUSE_APPS_SCRIPT_URL: TEST_URL,
    OPEN_HOUSE_APPS_SCRIPT_SECRET: "test-secret",
    OPEN_HOUSE_EVENT_ID: "open-house-test",
    TURNSTILE_SECRET_KEY: "turnstile-test-secret",
};
const PRODUCTION_ENV = {
    OPEN_HOUSE_ENV: "production",
    OPEN_HOUSE_DEPLOYMENT_ID: PRODUCTION_DEPLOYMENT_ONLY_ID,
    OPEN_HOUSE_APPS_SCRIPT_URL: PRODUCTION_URL,
    OPEN_HOUSE_APPS_SCRIPT_SECRET: "production-secret",
    OPEN_HOUSE_EVENT_ID: "open-house-prod",
    TURNSTILE_SECRET_KEY: "turnstile-production-secret",
};

const registrationId = "8b6f5c2e-1a4d-4f8b-9c3e-123456789abc";

function registration(overrides = {}) {
    return {
        registrationId,
        name: "Ada Lovelace",
        email: "Ada@Example.com",
        role: "lead",
        referral: "instagram",
        courses: ["level-2", "level-1"],
        message: "First time",
        language: "sv",
        company_website: "",
        oh_hp: "",
        turnstileToken: "valid-token",
        ...overrides,
    };
}

function allowTurnstile(fetchImpl) {
    return async (url, init) => {
        if (String(url).startsWith("https://challenges.cloudflare.com/")) {
            return httpResult(200, { success: true, hostname: "localhost", action: "open_house" });
        }
        return fetchImpl(url, init);
    };
}

function memoryStorage() {
    const values = new Map();
    return {
        getItem(key) {
            return values.has(key) ? values.get(key) : null;
        },
        setItem(key, value) {
            values.set(key, value);
        },
        removeItem(key) {
            values.delete(key);
        },
    };
}

function httpResult(status, body, headers = {}) {
    const mapped = new Map(
        Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value])
    );
    return {
        status,
        headers: { get: (name) => mapped.get(name.toLowerCase()) ?? null },
        async text() {
            return typeof body === "string" ? body : JSON.stringify(body);
        },
    };
}

function mockFetch(responses) {
    const calls = [];
    const fetchImpl = async (url, init) => {
        calls.push({ url, init });
        const next = responses.shift();
        if (!next) throw new Error("unexpected fetch");
        if (typeof next === "function") return next(url, init);
        return next;
    };
    return { fetchImpl, calls };
}

const normalized = {
    name: "Ada Lovelace",
    email: "ada@example.com",
    role: "lead",
    referral: "instagram",
    courses: ["level-2", "level-1"],
    message: "First time",
    language: "sv",
};

const hash = await payloadFingerprint(normalized);
const reorderedHash = await payloadFingerprint({
    ...normalized,
    courses: ["level-1", "level-2"],
});
assert.equal(hash, reorderedHash);

const changedHash = await payloadFingerprint({ ...normalized, email: "ada@other.test" });
assert.notEqual(hash, changedHash);

const storage = memoryStorage();
const firstAttempt = rememberRegistrationId(storage, hash);
const retry = rememberRegistrationId(storage, hash);
assert.equal(firstAttempt.reused, false);
assert.equal(retry.reused, true);
assert.equal(retry.registrationId, firstAttempt.registrationId);
const changed = rememberRegistrationId(storage, changedHash);
assert.equal(changed.reused, false);
assert.notEqual(changed.registrationId, firstAttempt.registrationId);

const honeypot = await handleOpenHousePost(
    registration({ company_website: "https://spam.test" }),
    TEST_ENV,
    async () => {
        throw new Error("honeypot called Apps Script");
    }
);
assert.equal(honeypot.status, 200);
assert.deepEqual(honeypot.body, { ok: true });
assert.equal("leadRecorded" in honeypot.body, false);

const autofilledHoneypot = await handleOpenHousePost(
    registration({ oh_hp: "https://saved-company.example" }),
    TEST_ENV,
    async () => {
        throw new Error("autofilled honeypot called Apps Script");
    }
);
assert.equal(autofilledHoneypot.status, 200);
assert.deepEqual(autofilledHoneypot.body, { ok: true });
assert.equal("leadRecorded" in autofilledHoneypot.body, false);

const blankHoneypot = await handleOpenHousePost(
    registration({ oh_hp: "   ", company_website: "   " }),
    TEST_ENV,
    allowTurnstile(async () => {
        throw new Error("blank honeypot should reach Apps Script");
    })
);
assert.equal(blankHoneypot.status, 502);

const invalid = await handleOpenHousePost(
    registration({ email: "not-an-email" }),
    TEST_ENV,
    async () => {
        throw new Error("invalid registration called Apps Script");
    }
);
assert.equal(invalid.status, 400);

const unknownRole = await handleOpenHousePost(
    registration({ role: "Förare" }),
    TEST_ENV,
    async () => {
        throw new Error("translated label called Apps Script");
    }
);
assert.equal(unknownRole.status, 400);

const missingEnv = await handleOpenHousePost(registration(), {}, async () => {
    throw new Error("missing env called Apps Script");
});
assert.equal(missingEnv.status, 503);

const productionEnv = await handleOpenHousePost(
    registration(),
    {
        ...TEST_ENV,
        OPEN_HOUSE_APPS_SCRIPT_URL: `https://script.google.com/macros/s/${PRODUCTION_DEPLOYMENT_ID}/exec`,
    },
    async () => {
        throw new Error("production deployment was called");
    }
);
assert.equal(productionEnv.status, 503);

const untrusted = mockFetch([
    httpResult(302, "", { location: "https://evil.example/collect" }),
]);
const untrustedResult = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(untrusted.fetchImpl));
assert.equal(untrustedResult.status, 502);
assert.equal(untrusted.calls.length, 1);

const echoUrl = "https://script.googleusercontent.com/macros/echo?user_content_key=test";
const successFetch = mockFetch([
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, { result: "success", alreadyRegistered: false, payloadHash: hash }),
]);
const success = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(successFetch.fetchImpl));
assert.equal(success.status, 200);
assert.equal(success.body.leadRecorded, true);
assert.equal(success.body.alreadyRegistered, false);
assert.equal(successFetch.calls[0].url, TEST_URL);
assert.equal(successFetch.calls[0].init.method, "POST");
assert.equal(successFetch.calls[0].init.redirect, "manual");
const posted = JSON.parse(successFetch.calls[0].init.body);
assert.equal(posted.turnstileToken, undefined);
assert.equal(posted.oh_hp, undefined);
assert.equal(posted.company_website, undefined);
assert.equal(posted.secret, "test-secret");
assert.equal(posted.payloadHash, hash);
assert.equal(posted.eventId, "open-house-test");
assert.equal(posted.email, "ada@example.com");
assert.deepEqual(posted.courses, ["level-2", "level-1"]);
assert.equal(successFetch.calls[1].url, echoUrl);
assert.equal(successFetch.calls[1].init.method, "GET");

const duplicateFetch = mockFetch([
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, { result: "success", alreadyRegistered: true, payloadHash: hash }),
]);
const duplicate = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(duplicateFetch.fetchImpl));
assert.equal(duplicate.body.alreadyRegistered, true);
assert.equal(duplicate.body.leadRecorded, false);

const conflictFetch = mockFetch([
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, { result: "success", alreadyRegistered: true, payloadHash: changedHash }),
]);
const conflict = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(conflictFetch.fetchImpl));
assert.equal(conflict.status, 409);
assert.equal(conflict.body.leadRecorded, undefined);

const missingHashFetch = mockFetch([
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, { result: "success", alreadyRegistered: true }),
]);
const missingHash = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(missingHashFetch.fetchImpl));
assert.equal(missingHash.status, 409);

const htmlFetch = mockFetch([
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, "<html><title>Fel</title>doGet</html>"),
]);
const htmlResult = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(htmlFetch.fetchImpl));
assert.equal(htmlResult.status, 502);

const timeoutFetch = mockFetch([
    () => Promise.reject(Object.assign(new Error("aborted"), { name: "AbortError" })),
]);
const timeout = await handleOpenHousePost(registration(), TEST_ENV, allowTurnstile(timeoutFetch.fetchImpl));
assert.equal(timeout.status, 504);

const leadStorage = memoryStorage();
assert.equal(shouldTrackLead(leadStorage, registrationId, false), false);
assert.equal(shouldTrackLead(leadStorage, registrationId, true), true);
assert.equal(shouldTrackLead(leadStorage, registrationId, true), false);
assert.equal(analyticsConsentGranted("all", null), true);
assert.equal(analyticsConsentGranted("necessary", null), false);
assert.equal(analyticsConsentGranted(null, null), false);
assert.equal(analyticsConsentGranted("custom", JSON.stringify({ analytics: true })), true);
assert.equal(analyticsConsentGranted("custom", JSON.stringify({ analytics: "yes" })), false);
assert.equal(analyticsConsentGranted("custom", "{"), false);
const leadEvent = buildGenerateLeadEvent(2);
assert.deepEqual(Object.keys(leadEvent), ["event", "form_id", "course_interest_count"]);
assert.equal(JSON.stringify(leadEvent).includes("@"), false);

clearRegistrationAttempt(storage);
const afterClear = rememberRegistrationId(storage, hash);
assert.equal(afterClear.reused, false);

const emptyFields = getOpenHouseFieldErrors({ name: "  ", email: "", role: "", referral: "" });
assert.deepEqual(Object.keys(emptyFields).sort(), ["email", "name", "referral", "role"]);

const invalidEmail = getOpenHouseFieldErrors({
    name: "Test Open House",
    email: "not-an-email",
    role: "lead",
    referral: "google",
});
assert.deepEqual(invalidEmail, { email: true });

const missingRole = getOpenHouseFieldErrors({
    name: "Test Open House",
    email: "openhouse-test@example.com",
    role: "",
    referral: "google",
});
assert.deepEqual(missingRole, { role: true });

const missingReferral = getOpenHouseFieldErrors({
    name: "Test Open House",
    email: "openhouse-test@example.com",
    role: "follow",
    referral: "",
});
assert.deepEqual(missingReferral, { referral: true });

const corrected = getOpenHouseFieldErrors({
    name: " Test Open House ",
    email: " OpenHouse-Test@Example.com ",
    role: "lead",
    referral: "google",
});
assert.deepEqual(corrected, {});
assert.equal(
    getOpenHouseFieldErrors({
        name: "Test Open House",
        email: "openhouse-test@example.com",
        role: "lead",
        referral: "google",
    }).name,
    undefined
);

function readLocale(file) {
    return JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}
const swedish = readLocale("public/locales/sv/openhouseTranslation.json");
const english = readLocale("public/locales/en/openhouseTranslation.json");
for (const key of ["nameError", "emailError", "roleError", "referralError"]) {
    assert.equal(typeof swedish[key], "string");
    assert.equal(typeof english[key], "string");
    assert.notEqual(swedish[key], english[key]);
}
assert.equal(swedish.nameError, "Ange ditt namn.");
assert.equal(english.nameError, "Enter your name.");
assert.equal(swedish.rateLimitError, "För många försök just nu. Vänta några minuter och försök igen.");
assert.equal(english.rateLimitError, "Too many attempts right now. Wait a few minutes and try again.");
assert.notEqual(swedish.rateLimitError, english.rateLimitError);

assert.equal(existsSync("netlify.toml"), false);
const rateLimitSource = readFileSync("netlify/edge-functions/open-house-rate-limit.ts", "utf8");
assert.ok(rateLimitSource.includes('path: "/api/openhouse"'));
assert.equal(rateLimitSource.includes('"/api/openhouse/"'), false);
assert.ok(rateLimitSource.includes('method: "POST"'));
assert.equal(rateLimitSource.includes("action:"), false);
assert.ok(rateLimitSource.includes("windowLimit: 40"));
assert.ok(rateLimitSource.includes("windowSize: 180"));
assert.ok(rateLimitSource.includes('aggregateBy: ["ip", "domain"]'));
assert.ok(rateLimitSource.includes('onError: "bypass"'));
assert.equal(rateLimitSource.includes("/api/chat"), false);
assert.equal(rateLimitSource.includes("/api/newsletter"), false);
assert.equal(rateLimitSource.includes("request.json"), false);
assert.equal(rateLimitSource.includes("request.text"), false);

const formSource = readFileSync("src/components/OpenHouseForm.tsx", "utf8");
const validationReturn = formSource.indexOf("if (firstInvalid)");
const postCall = formSource.indexOf('fetch("/api/openhouse/"');
assert.ok(formSource.includes("noValidate"));
assert.ok(validationReturn > 0);
assert.ok(postCall > validationReturn);
assert.ok(formSource.includes('focus({ preventScroll: true })'));
assert.ok(formSource.includes('aria-describedby={fieldErrors.name ? "name-error" : undefined}'));
assert.ok(formSource.includes("openHouseSubmissionState"));
assert.ok(formSource.includes('submissionState === "created"'));
assert.ok(formSource.includes('name="oh_hp"'));
assert.ok(formSource.includes('id="oh_hp"'));
assert.ok(formSource.includes("Leave blank"));
assert.ok(formSource.includes('autoComplete="oh-hp"'));
assert.equal(formSource.includes("readOnly"), false);
assert.equal(formSource.includes("company_website"), false);
assert.equal(formSource.includes("Company website"), false);
assert.equal(formSource.includes("alreadyRegistered"), false);
assert.ok(formSource.includes('action: "open_house"'));
assert.ok(formSource.includes("turnstileToken"));
assert.ok(formSource.includes("resetTurnstile()"));
assert.ok(formSource.includes("response.status === 429"));
assert.ok(formSource.includes('t("rateLimitError")'));
assert.equal(formSource.split("clearRegistrationAttempt(").length - 1, 1);
assert.ok(formSource.includes("NEXT_PUBLIC_TURNSTILE_SITE_KEY"));
assert.equal(formSource.includes("NEXT_PUBLIC_TURNSTILE_PRODUCTION_SITE_KEY"), false);
assert.equal(formSource.includes("selectTurnstileSiteKey"), false);
assert.equal(formSource.includes("TURNSTILE_SECRET_KEY"), false);
assert.equal(formSource.includes("TURNSTILE_PRODUCTION_SECRET_KEY"), false);
assert.equal(formSource.includes("APPS_SCRIPT_SECRET"), false);
assert.equal(formSource.includes("OPEN_HOUSE_APPS_SCRIPT_URL"), false);
assert.equal(formSource.includes("OPEN_HOUSE_PRODUCTION_"), false);

const { OPEN_HOUSE_EVENT_ID, ...envWithoutEvent } = TEST_ENV;
const missingEvent = await handleOpenHousePost(registration(), envWithoutEvent, async () => {
    throw new Error("missing event called Apps Script");
});
assert.equal(missingEvent.status, 503);

const invalidEvent = await handleOpenHousePost(
    registration(),
    { ...TEST_ENV, OPEN_HOUSE_EVENT_ID: "Ada@Example.com" },
    async () => {
        throw new Error("invalid event called Apps Script");
    }
);
assert.equal(invalidEvent.status, 503);

const clientEventFetch = mockFetch([
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, { result: "success", alreadyRegistered: false, payloadHash: hash }),
]);
await handleOpenHousePost(
    registration({ eventId: "other-event" }),
    TEST_ENV,
    allowTurnstile(clientEventFetch.fetchImpl)
);
assert.equal(JSON.parse(clientEventFetch.calls[0].init.body).eventId, "open-house-test");

const englishHash = await payloadFingerprint({ ...normalized, language: "en" });
assert.notEqual(englishHash, hash);

function registryFetch(rows) {
    let last = null;
    return allowTurnstile(async (url, init) => {
        if (init && init.method === "POST") {
            const body = JSON.parse(init.body);
            last = applyRegistration(rows, body);
            return httpResult(302, "", { location: echoUrl });
        }
        return httpResult(200, last);
    });
}

function publicRegistrationResponse(result) {
    return {
        status: result.status,
        keys: Object.keys(result.body).sort(),
        containsAddress: JSON.stringify(result.body).includes("@"),
        leadRecorded: result.body.leadRecorded,
        alreadyRegistered: result.body.alreadyRegistered,
    };
}

const sheetRows = [];
const swedishSubmission = await handleOpenHousePost(
    registration(),
    TEST_ENV,
    registryFetch(sheetRows)
);
const englishSubmission = await handleOpenHousePost(
    registration({
        registrationId: "8b6f5c2e-1a4d-4f8b-9c3e-123456789abd",
        language: "en",
    }),
    TEST_ENV,
    registryFetch(sheetRows)
);
assert.equal(sheetRows.length, 1);
assert.equal(swedishSubmission.status, 200);
assert.equal(englishSubmission.status, 200);
assert.equal(swedishSubmission.body.leadRecorded, true);
assert.equal(englishSubmission.body.leadRecorded, false);
assert.deepEqual(publicRegistrationResponse(swedishSubmission).keys, publicRegistrationResponse(englishSubmission).keys);
assert.equal(publicRegistrationResponse(englishSubmission).containsAddress, false);
assert.equal(englishSubmission.body.code, undefined);
assert.equal(shouldTrackLead(memoryStorage(), "8b6f5c2e-1a4d-4f8b-9c3e-123456789abd", englishSubmission.body.leadRecorded), false);

const tabRows = [];
const firstTab = await handleOpenHousePost(registration(), TEST_ENV, registryFetch(tabRows));
const secondTab = await handleOpenHousePost(
    registration({ registrationId: "8b6f5c2e-1a4d-4f8b-9c3e-123456789abe" }),
    TEST_ENV,
    registryFetch(tabRows)
);
assert.equal(tabRows.length, 1);
assert.equal(firstTab.body.leadRecorded, true);
assert.equal(secondTab.body.leadRecorded, false);
assert.equal(secondTab.status, firstTab.status);

const eventRows = [];
await handleOpenHousePost(registration(), TEST_ENV, registryFetch(eventRows));
const laterEvent = await handleOpenHousePost(
    registration({ registrationId: "8b6f5c2e-1a4d-4f8b-9c3e-123456789abf" }),
    { ...TEST_ENV, OPEN_HOUSE_EVENT_ID: "open-house-next" },
    registryFetch(eventRows)
);
assert.equal(eventRows.length, 2);
assert.equal(laterEvent.status, 200);
assert.equal(laterEvent.body.leadRecorded, true);
assert.equal(laterEvent.body.alreadyRegistered, false);

const conflictRows = [];
await handleOpenHousePost(registration(), TEST_ENV, registryFetch(conflictRows));
const changedPayload = await handleOpenHousePost(
    registration({ email: "ada@other.test" }),
    TEST_ENV,
    registryFetch(conflictRows)
);
assert.equal(conflictRows.length, 1);
assert.equal(changedPayload.status, 502);
assert.equal(changedPayload.body.leadRecorded, undefined);

const lock = createRegistrationLock();
const concurrent = await Promise.all([
    lock.submit({
        registrationId,
        ...normalized,
        payloadHash: hash,
        eventId: "open-house-test",
    }),
    lock.submit({
        registrationId: "8b6f5c2e-1a4d-4f8b-9c3e-123456789ab1",
        ...normalized,
        language: "en",
        payloadHash: englishHash,
        eventId: "open-house-test",
    }),
]);
assert.equal(lock.rows.length, 1);
assert.equal(concurrent.filter((result) => result.alreadyRegistered).length, 1);
assert.equal(concurrent.filter((result) => result.result === "success").length, 2);

async function turnstileOutcome(token, siteverify, env = TEST_ENV) {
    const calls = [];
    const result = await handleOpenHousePost(
        registration({ turnstileToken: token }),
        env,
        async (url, init) => {
            calls.push(String(url));
            if (String(url).startsWith("https://challenges.cloudflare.com/")) {
                const params = new URLSearchParams(init.body);
                assert.equal(params.get("secret"), env.TURNSTILE_SECRET_KEY);
                assert.equal(params.get("response"), token);
                if (siteverify instanceof Error) throw siteverify;
                return siteverify;
            }
            throw new Error("Apps Script was called");
        }
    );
    return { result, calls };
}

const verifiedCalls = [];
const verified = await handleOpenHousePost(registration(), TEST_ENV, async (url, init) => {
    verifiedCalls.push(String(url));
    if (String(url).startsWith("https://challenges.cloudflare.com/")) {
        return httpResult(200, { success: true, hostname: "localhost", action: "open_house" });
    }
    if (init && init.method === "POST") {
        return httpResult(302, "", { location: echoUrl });
    }
    return httpResult(200, { result: "success", alreadyRegistered: false, payloadHash: hash });
});
assert.equal(verified.status, 200);
assert.equal(verified.body.leadRecorded, true);
assert.equal(verifiedCalls[0], "https://challenges.cloudflare.com/turnstile/v0/siteverify");
assert.equal(verifiedCalls[1], TEST_URL);

const missingToken = await turnstileOutcome("", httpResult(200, { success: true }));
assert.equal(missingToken.result.status, 400);
assert.deepEqual(missingToken.calls, []);

const invalidToken = await turnstileOutcome(
    "invalid-token",
    httpResult(200, { success: false, "error-codes": ["invalid-input-response"] })
);
assert.equal(invalidToken.result.status, 400);
assert.equal(invalidToken.calls.length, 1);

const spentToken = await turnstileOutcome(
    "spent-token",
    httpResult(200, { success: false, "error-codes": ["timeout-or-duplicate"] })
);
assert.equal(spentToken.result.status, 400);
assert.equal(spentToken.calls.length, 1);

const cloudflareDown = await turnstileOutcome("valid-token", httpResult(500, "unavailable"));
assert.equal(cloudflareDown.result.status, 502);
assert.equal(cloudflareDown.calls.length, 1);

const cloudflareNetwork = await turnstileOutcome("valid-token", new Error("network"));
assert.equal(cloudflareNetwork.result.status, 502);
assert.equal(cloudflareNetwork.calls.length, 1);

async function acceptedHostname(hostname) {
    const calls = [];
    const result = await handleOpenHousePost(registration(), TEST_ENV, async (url, init) => {
        calls.push(String(url));
        if (String(url).startsWith("https://challenges.cloudflare.com/")) {
            return httpResult(200, { success: true, hostname, action: "open_house" });
        }
        if (init && init.method === "POST") {
            return httpResult(302, "", { location: echoUrl });
        }
        return httpResult(200, { result: "success", alreadyRegistered: false, payloadHash: hash });
    });
    return { result, calls };
}

for (const hostname of ["localhost", "127.0.0.1", "charming-platypus-787e76.netlify.app"]) {
    const accepted = await acceptedHostname(hostname);
    assert.equal(accepted.result.status, 200);
    assert.equal(accepted.result.body.leadRecorded, true);
    assert.equal(accepted.calls[1], TEST_URL);
}

for (const hostname of [
    "example.com",
    "other-site.netlify.app",
    "charming-platypus-787e76.netlify.app.evil.com",
    "not-charming-platypus-787e76.netlify.app",
    "localhost.localdomain",
    "127.0.0.1.nip.io",
    "fuegodanceschool.se",
    "www.fuegodanceschool.se",
    "fuegodanceschool.se.evil.com",
    "www.fuegodanceschool.se.evil.com",
]) {
    const denied = await turnstileOutcome(
        "valid-token",
        httpResult(200, { success: true, hostname, action: "open_house" })
    );
    assert.equal(denied.result.status, 400);
    assert.equal(denied.calls.length, 1);
}

const previewWithoutSuccess = await turnstileOutcome(
    "valid-token",
    httpResult(200, {
        success: false,
        hostname: "charming-platypus-787e76.netlify.app",
        action: "open_house",
    })
);
assert.equal(previewWithoutSuccess.result.status, 400);
assert.equal(previewWithoutSuccess.calls.length, 1);

const notTestMode = await turnstileOutcome(
    "valid-token",
    httpResult(200, { success: true, hostname: "localhost", action: "open_house" }),
    { ...TEST_ENV, OPEN_HOUSE_ENV: "production" }
);
assert.equal(notTestMode.result.status, 400);
assert.equal(notTestMode.calls.length, 1);

const turnstileSource = readFileSync("src/lib/turnstile.mjs", "utf8");
assert.ok(turnstileSource.includes('"charming-platypus-787e76.netlify.app"'));
assert.ok(turnstileSource.includes('"fuegodanceschool.se"'));
assert.ok(turnstileSource.includes('"www.fuegodanceschool.se"'));
assert.equal(turnstileSource.includes(".includes("), false);
for (const host of PRODUCTION_TURNSTILE_HOSTS) {
    assert.equal(TEST_TURNSTILE_HOSTS.has(host), false);
}

const wrongAction = await turnstileOutcome(
    "valid-token",
    httpResult(200, { success: true, hostname: "localhost", action: "other" })
);
assert.equal(wrongAction.result.status, 400);
assert.equal(wrongAction.calls.length, 1);

const { TURNSTILE_SECRET_KEY, ...envWithoutTurnstile } = TEST_ENV;
const missingTurnstile = await handleOpenHousePost(registration(), envWithoutTurnstile, async () => {
    throw new Error("missing Turnstile secret made an external call");
});
assert.equal(missingTurnstile.status, 503);

const honeypotWithToken = await handleOpenHousePost(
    registration({ company_website: "https://spam.example" }),
    TEST_ENV,
    async () => {
        throw new Error("honeypot made an external call");
    }
);
assert.equal(honeypotWithToken.status, 200);
assert.equal("leadRecorded" in honeypotWithToken.body, false);

const retryStorage = memoryStorage();
const retryFingerprint = await payloadFingerprint({
    name: "Ada Lovelace",
    email: "ada@example.com",
    role: "lead",
    referral: "instagram",
    courses: ["level-1", "level-2"],
    message: "First time",
    language: "sv",
});
const retryAttempt = rememberRegistrationId(retryStorage, retryFingerprint);
const failedRetry = await handleOpenHousePost(
    registration(),
    TEST_ENV,
    allowTurnstile(async () => {
        throw new Error("Apps Script failed");
    })
);
assert.equal(failedRetry.status, 502);
const repeatedAttempt = rememberRegistrationId(retryStorage, retryFingerprint);
assert.equal(repeatedAttempt.reused, true);
assert.equal(repeatedAttempt.registrationId, retryAttempt.registrationId);

const productionSource = readFileSync("scripts/open-house-production/Code.gs", "utf8");
const productionHeaders = [
    "timestamp",
    "registrationId",
    "name",
    "email",
    "role",
    "referral",
    "courses",
    "message",
    "language",
    "payloadHash",
    "eventId",
];
assert.equal(existsSync("scripts/open-house-production/Code.gs"), true);
assert.ok(productionSource.includes('var PRODUCTION_SPREADSHEET_NAME = "Fuego Open House – Registrations"'));
assert.ok(productionSource.includes('var PRODUCTION_SHEET_NAME = "Registrations"'));
assert.ok(productionSource.includes('scriptProperty("PRODUCTION_SPREADSHEET_ID")'));
assert.ok(productionSource.includes('scriptProperty("OPEN_HOUSE_SECRET")'));
assert.ok(productionSource.includes("function openProductionSheet()"));
assert.ok(productionSource.includes("spreadsheet.getId() !== spreadsheetId"));
assert.ok(productionSource.includes("parent.getId() !== spreadsheetId"));
assert.ok(productionSource.includes("function validateRegistration("));
assert.ok(productionSource.includes("LockService.getScriptLock()"));
assert.ok(productionSource.includes("function sha256Hex("));
assert.ok(productionSource.includes("function findByRegistrationId("));
assert.ok(productionSource.includes("function findByEmail("));
assert.ok(productionSource.includes('result: "success"'));
assert.ok(productionSource.includes("alreadyRegistered: true"));
assert.ok(productionSource.includes("alreadyRegistered: false"));
assert.ok(productionSource.includes('result: "error"'));
assert.ok(productionSource.includes("payloadHash: registration.payloadHash"));
assert.equal(productionSource.includes("getActiveSpreadsheet"), false);
assert.equal(productionSource.includes("openByUrl"), false);
assert.equal(productionSource.includes("openTestSheet"), false);
assert.equal(productionSource.includes("TEST_SPREADSHEET"), false);
assert.equal(productionSource.includes("Open House TEST"), false);
assert.equal(productionSource.includes('OPEN_HOUSE_SECRET = "'), false);
assert.equal(productionSource.includes('PRODUCTION_SPREADSHEET_ID = "'), false);
const headerBlock = productionSource.slice(
    productionSource.indexOf("var HEADERS = ["),
    productionSource.indexOf("];", productionSource.indexOf("var HEADERS = ["))
);
for (let index = 0; index < productionHeaders.length; index += 1) {
    const header = `"${productionHeaders[index]}"`;
    assert.ok(headerBlock.includes(header));
    if (index > 0) {
        assert.ok(headerBlock.indexOf(`"${productionHeaders[index - 1]}"`) < headerBlock.indexOf(header));
    }
}
assert.equal(headerBlock.split("\n").filter((line) => line.includes('"')).length, productionHeaders.length);

const testAppsScript = readFileSync("scripts/open-house-test/Code.gs", "utf8");
assert.ok(testAppsScript.includes('var TEST_SPREADSHEET_NAME = "Open House TEST"'));
assert.ok(testAppsScript.includes('var TEST_SHEET_NAME = "Open House TEST"'));
assert.ok(testAppsScript.includes("function openTestSheet()"));
assert.ok(testAppsScript.includes('scriptProperty("TEST_SPREADSHEET_ID")'));
assert.equal(testAppsScript.includes("PRODUCTION_SPREADSHEET_NAME"), false);
assert.equal(testAppsScript.includes("openProductionSheet"), false);

async function submitWithHostname(env, hostname, scriptResponses) {
    const calls = [];
    const result = await handleOpenHousePost(registration(), env, async (url, init) => {
        calls.push({ url: String(url), init });
        if (String(url).startsWith("https://challenges.cloudflare.com/")) {
            const params = new URLSearchParams(init.body);
            assert.equal(params.get("secret"), env.TURNSTILE_SECRET_KEY);
            return httpResult(200, { success: true, hostname, action: "open_house" });
        }
        const next = scriptResponses.shift();
        if (!next) throw new Error("unexpected Apps Script call");
        return next;
    });
    return { result, calls };
}

for (const hostname of ["fuegodanceschool.se", "www.fuegodanceschool.se"]) {
    const accepted = await submitWithHostname(PRODUCTION_ENV, hostname, [
        httpResult(302, "", { location: echoUrl }),
        httpResult(200, { result: "success", alreadyRegistered: false, payloadHash: hash }),
    ]);
    assert.equal(accepted.result.status, 200);
    assert.equal(accepted.result.body.leadRecorded, true);
    assert.equal(accepted.calls[1].url, PRODUCTION_URL);
    const posted = JSON.parse(accepted.calls[1].init.body);
    assert.equal(posted.secret, "production-secret");
    assert.equal(posted.eventId, "open-house-prod");
    assert.equal(posted.turnstileToken, undefined);
    assert.equal(posted.payloadHash, hash);
    assert.equal(accepted.calls.some((call) => call.url === TEST_URL), false);
}

for (const hostname of ["localhost", "127.0.0.1", "charming-platypus-787e76.netlify.app", "example.com"]) {
    const denied = await turnstileOutcome(
        "valid-token",
        httpResult(200, { success: true, hostname, action: "open_house" }),
        PRODUCTION_ENV
    );
    assert.equal(denied.result.status, 400);
    assert.equal(denied.calls.length, 1);
}

const productionWithoutSuccess = await turnstileOutcome(
    "valid-token",
    httpResult(200, { success: false, hostname: "fuegodanceschool.se", action: "open_house" }),
    PRODUCTION_ENV
);
assert.equal(productionWithoutSuccess.result.status, 400);
assert.equal(productionWithoutSuccess.calls.length, 1);

const productionWrongAction = await turnstileOutcome(
    "valid-token",
    httpResult(200, { success: true, hostname: "www.fuegodanceschool.se", action: "other" }),
    PRODUCTION_ENV
);
assert.equal(productionWrongAction.result.status, 400);
assert.equal(productionWrongAction.calls.length, 1);

for (const env of [
    { ...PRODUCTION_ENV, OPEN_HOUSE_APPS_SCRIPT_URL: undefined },
    { ...PRODUCTION_ENV, OPEN_HOUSE_APPS_SCRIPT_SECRET: "" },
    { ...PRODUCTION_ENV, TURNSTILE_SECRET_KEY: "" },
    { ...PRODUCTION_ENV, OPEN_HOUSE_DEPLOYMENT_ID: "" },
    { ...PRODUCTION_ENV, OPEN_HOUSE_EVENT_ID: "" },
    { ...PRODUCTION_ENV, OPEN_HOUSE_ENV: "staging" },
    {
        ...PRODUCTION_ENV,
        OPEN_HOUSE_APPS_SCRIPT_URL: `https://script.google.com/macros/s/${PRODUCTION_DEPLOYMENT_ID}/exec`,
    },
    { ...TEST_ENV, OPEN_HOUSE_DEPLOYMENT_ID: PRODUCTION_DEPLOYMENT_ID },
    { ...TEST_ENV, OPEN_HOUSE_APPS_SCRIPT_URL: PRODUCTION_URL },
    {
        ...TEST_ENV,
        OPEN_HOUSE_APPS_SCRIPT_URL: `https://script.google.com/macros/s/${TEST_DEPLOYMENT_ID}extra/exec`,
    },
]) {
    const stopped = await handleOpenHousePost(registration(), env, async () => {
        throw new Error("invalid configuration called a service");
    });
    assert.equal(stopped.status, 503);
}

const ignoredProductionVariables = {
    ...TEST_ENV,
    OPEN_HOUSE_PRODUCTION_DEPLOYMENT_ID: PRODUCTION_DEPLOYMENT_ONLY_ID,
    OPEN_HOUSE_PRODUCTION_APPS_SCRIPT_URL: PRODUCTION_URL,
    OPEN_HOUSE_PRODUCTION_APPS_SCRIPT_SECRET: "production-secret",
    TURNSTILE_PRODUCTION_SECRET_KEY: "turnstile-production-secret",
};
const testWrite = await submitWithHostname(ignoredProductionVariables, "localhost", [
    httpResult(302, "", { location: echoUrl }),
    httpResult(200, { result: "success", alreadyRegistered: false, payloadHash: hash }),
]);
assert.equal(testWrite.result.status, 200);
assert.equal(testWrite.calls[1].url, TEST_URL);
assert.equal(JSON.parse(testWrite.calls[1].init.body).secret, "test-secret");
assert.equal(testWrite.calls.some((call) => call.url === PRODUCTION_URL), false);

const testCrossRedirect = await submitWithHostname(TEST_ENV, "localhost", [
    httpResult(302, "", { location: PRODUCTION_URL }),
]);
assert.equal(testCrossRedirect.result.status, 502);
assert.equal(testCrossRedirect.calls.length, 2);
assert.equal(testCrossRedirect.calls[1].url, TEST_URL);

const productionCrossRedirect = await submitWithHostname(PRODUCTION_ENV, "fuegodanceschool.se", [
    httpResult(302, "", { location: TEST_URL }),
]);
assert.equal(productionCrossRedirect.result.status, 502);
assert.equal(productionCrossRedirect.calls.length, 2);
assert.equal(productionCrossRedirect.calls[1].url, PRODUCTION_URL);

const productionHoneypot = await handleOpenHousePost(
    registration({ company_website: "https://spam.example" }),
    PRODUCTION_ENV,
    async () => {
        throw new Error("production honeypot made an external call");
    }
);
assert.equal(productionHoneypot.status, 200);
assert.equal("leadRecorded" in productionHoneypot.body, false);

const productionInvalid = await handleOpenHousePost(
    registration({ email: "not-an-email" }),
    PRODUCTION_ENV,
    async () => {
        throw new Error("invalid production registration made an external call");
    }
);
assert.equal(productionInvalid.status, 400);

assert.equal(openHouseSubmissionState({ ok: true }), "rejected");
assert.equal(openHouseSubmissionState({ ok: true, leadRecorded: true, alreadyRegistered: false }), "created");
assert.equal(openHouseSubmissionState({ ok: true, alreadyRegistered: true, leadRecorded: false }), "duplicate");
assert.equal(openHouseSubmissionState({ ok: true, leadRecorded: true, alreadyRegistered: true }), "rejected");
assert.equal(openHouseSubmissionState({ ok: false, leadRecorded: true }), "rejected");
assert.equal(openHouseSubmissionState(null), "rejected");

const openHouseSource = readFileSync("src/lib/openHouse.mjs", "utf8");
assert.equal(openHouseSource.includes("OPEN_HOUSE_TEST_DEPLOYMENT_ID"), false);
assert.equal(openHouseSource.includes("OPEN_HOUSE_PRODUCTION_"), false);
assert.equal(openHouseSource.includes("TURNSTILE_PRODUCTION_SECRET_KEY"), false);
assert.ok(openHouseSource.includes("OPEN_HOUSE_DEPLOYMENT_ID"));
assert.ok(openHouseSource.includes("TURNSTILE_SECRET_KEY"));

console.log("open house tests passed");
