export const COURSE_KEYS = [
    "level-1",
    "level-2",
    "level-3",
    "level-3-technique",
    "level-4",
    "level-4-technique",
    "ramintas-styling",
    "role-rotation",
    "advanced-foundation",
    "footwork",
];

export const ROLE_KEYS = ["lead", "follow"];
export const REFERRAL_KEYS = ["facebook", "instagram", "google", "friend", "other"];
export const LANGUAGES = ["sv", "en"];

const ATTEMPT_KEY = "openHouseRegistrationAttempt";
const LEAD_KEY = "openHouseLeadRecordedIds";
const UUID_PATTERN =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const COURSE_SET = new Set(COURSE_KEYS);
const ROLE_SET = new Set(ROLE_KEYS);
const REFERRAL_SET = new Set(REFERRAL_KEYS);
const LANGUAGE_SET = new Set(LANGUAGES);

export function isUuid(value) {
    return typeof value === "string" && UUID_PATTERN.test(value);
}

export function isHoneypotTripped(body) {
    if (!body || typeof body !== "object") return false;
    const value = body.company_website;
    if (value == null) return false;
    if (typeof value === "string") return value.trim() !== "";
    return true;
}

export function getOpenHouseFieldErrors(fields) {
    const name = typeof fields?.name === "string" ? fields.name.trim() : "";
    const email = typeof fields?.email === "string" ? fields.email.trim().toLowerCase() : "";
    const errors = {};

    if (name.length < 1 || name.length > 120) errors.name = true;
    if (email.length < 1 || email.length > 200 || !EMAIL_PATTERN.test(email)) errors.email = true;
    if (!ROLE_SET.has(fields?.role)) errors.role = true;
    if (!REFERRAL_SET.has(fields?.referral)) errors.referral = true;

    return errors;
}

export function validateRegistration(body) {
    if (!body || typeof body !== "object" || Array.isArray(body)) {
        return { ok: false };
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    const courses = body.courses;

    if (name.length < 1 || name.length > 120) return { ok: false };
    if (email.length > 200 || !EMAIL_PATTERN.test(email)) return { ok: false };
    if (!ROLE_SET.has(body.role)) return { ok: false };
    if (!REFERRAL_SET.has(body.referral)) return { ok: false };
    if (!LANGUAGE_SET.has(body.language)) return { ok: false };
    if (!isUuid(body.registrationId)) return { ok: false };
    if (message.length > 2000) return { ok: false };
    if (!Array.isArray(courses) || courses.length > COURSE_KEYS.length) return { ok: false };

    const uniqueCourses = [];
    for (const course of courses) {
        if (!COURSE_SET.has(course) || uniqueCourses.includes(course)) return { ok: false };
        uniqueCourses.push(course);
    }

    return {
        ok: true,
        value: {
            registrationId: body.registrationId,
            name,
            email,
            role: body.role,
            referral: body.referral,
            courses: uniqueCourses,
            message,
            language: body.language,
        },
    };
}

export async function payloadFingerprint(registration) {
    const canonical = JSON.stringify({
        name: registration.name,
        email: registration.email,
        role: registration.role,
        referral: registration.referral,
        courses: [...registration.courses].sort(),
        message: registration.message,
        language: registration.language,
    });
    const digest = await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(canonical)
    );
    return Array.from(new Uint8Array(digest))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

export function rememberRegistrationId(storage, fingerprint) {
    let stored = null;
    try {
        stored = JSON.parse(storage.getItem(ATTEMPT_KEY) || "null");
    } catch {
        stored = null;
    }

    if (
        stored &&
        stored.fingerprint === fingerprint &&
        isUuid(stored.registrationId)
    ) {
        return { registrationId: stored.registrationId, reused: true };
    }

    const registrationId = crypto.randomUUID();
    storage.setItem(
        ATTEMPT_KEY,
        JSON.stringify({ fingerprint, registrationId })
    );
    return { registrationId, reused: false };
}

export function clearRegistrationAttempt(storage) {
    storage.removeItem(ATTEMPT_KEY);
}

export function analyticsConsentGranted(consent, preferencesJson) {
    if (consent === "all") return true;
    if (consent !== "custom") return false;
    try {
        const parsed = JSON.parse(preferencesJson || "null");
        return Boolean(parsed) && parsed.analytics === true;
    } catch {
        return false;
    }
}

export function shouldTrackLead(storage, registrationId, leadRecorded) {
    if (leadRecorded !== true || !isUuid(registrationId)) return false;

    let ids = [];
    try {
        const parsed = JSON.parse(storage.getItem(LEAD_KEY) || "[]");
        if (Array.isArray(parsed)) {
            ids = parsed.filter((id) => typeof id === "string");
        }
    } catch {
        ids = [];
    }

    if (ids.includes(registrationId)) return false;
    ids.push(registrationId);
    storage.setItem(LEAD_KEY, JSON.stringify(ids));
    return true;
}

export function buildGenerateLeadEvent(courseInterestCount) {
    return {
        event: "generate_lead",
        form_id: "open_house",
        course_interest_count: courseInterestCount,
    };
}
