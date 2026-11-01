const EVENT_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isOpenHouseEventId(value) {
    return typeof value === "string" && value.length <= 64 && EVENT_ID_PATTERN.test(value);
}

function normalizedEmail(value) {
    return typeof value === "string" ? value.trim().toLowerCase() : "";
}

/**
 * Sheet decision used by the test Apps Script.
 * registrationId is matched inside the current eventId. A reused browser id
 * from an earlier event can therefore be stored again for a later event.
 * An email match returns the incoming payloadHash so a Swedish and an English
 * submission are not treated as a hash conflict.
 */
export function applyRegistration(rows, incoming) {
    const eventId = incoming.eventId;
    const email = normalizedEmail(incoming.email);
    const registrationId = incoming.registrationId;
    const record = {
        registrationId,
        name: incoming.name,
        email,
        role: incoming.role,
        referral: incoming.referral,
        courses: Array.isArray(incoming.courses) ? [...incoming.courses] : [],
        message: incoming.message,
        language: incoming.language,
        payloadHash: incoming.payloadHash,
        eventId,
    };

    const idRow = rows.find(
        (row) => row.registrationId === registrationId && row.eventId === eventId
    );
    if (idRow) {
        if (idRow.payloadHash !== record.payloadHash) {
            return { result: "error" };
        }
        return {
            result: "success",
            alreadyRegistered: true,
            payloadHash: record.payloadHash,
        };
    }

    const emailRow = rows.find(
        (row) => row.eventId === eventId && normalizedEmail(row.email) === email
    );
    if (emailRow) {
        return {
            result: "success",
            alreadyRegistered: true,
            payloadHash: record.payloadHash,
        };
    }

    rows.push(record);
    return {
        result: "success",
        alreadyRegistered: false,
        payloadHash: record.payloadHash,
    };
}

export function createRegistrationLock(rows = []) {
    let tail = Promise.resolve();
    return {
        rows,
        submit(incoming) {
            const job = tail.then(() => applyRegistration(rows, incoming));
            tail = job.then(
                () => undefined,
                () => undefined
            );
            return job;
        },
    };
}
