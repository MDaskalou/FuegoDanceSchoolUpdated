declare module "@/lib/openHouseShared.mjs" {
    export const COURSE_KEYS: readonly string[];
    export const ROLE_KEYS: readonly string[];
    export const REFERRAL_KEYS: readonly string[];

    export function openHouseSubmissionState(data: {
        ok?: boolean;
        leadRecorded?: boolean;
        alreadyRegistered?: boolean;
    } | null | undefined): "rejected" | "created" | "duplicate";

    export function getOpenHouseFieldErrors(fields: {
        name?: string;
        email?: string;
        role?: string;
        referral?: string;
    }): Partial<Record<"name" | "email" | "role" | "referral", true>>;

    export function payloadFingerprint(registration: {
        name: string;
        email: string;
        role: string;
        referral: string;
        courses: readonly string[];
        message: string;
        language: string;
    }): Promise<string>;

    export function rememberRegistrationId(
        storage: { getItem(key: string): string | null; setItem(key: string, value: string): void },
        fingerprint: string
    ): { registrationId: string; reused: boolean };

    export function clearRegistrationAttempt(storage: { removeItem(key: string): void }): void;

    export function analyticsConsentGranted(
        consent: string | null,
        preferencesJson: string | null
    ): boolean;

    export function shouldTrackLead(
        storage: {
            getItem(key: string): string | null;
            setItem(key: string, value: string): void;
        },
        registrationId: string,
        leadRecorded: boolean
    ): boolean;

    export function buildGenerateLeadEvent(courseInterestCount: number): {
        event: "generate_lead";
        form_id: "open_house";
        course_interest_count: number;
    };
}

declare module "@/lib/openHouse.mjs" {
    export function handleOpenHousePost(
        body: unknown,
        env: Record<string, string | undefined>,
        fetchImpl: typeof fetch,
        hostname?: string
    ): Promise<{ status: number; body: Record<string, unknown> }>;
}
