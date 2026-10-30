const FALLBACK_GTM_ID = "GTM-5MHP987L";

/** Public container ids only. Rejects anything that must not be interpolated into HTML. */
const GTM_ID_PATTERN = /^GTM-[A-Z0-9]+$/;

export function resolveGtmId(
    value: string | undefined = process.env.NEXT_PUBLIC_GTM_ID
): string {
    const trimmed = value?.trim() ?? "";
    return GTM_ID_PATTERN.test(trimmed) ? trimmed : FALLBACK_GTM_ID;
}

export const GTM_ID = resolveGtmId();
