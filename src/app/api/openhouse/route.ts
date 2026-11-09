import { NextResponse } from "next/server";
import { handleOpenHousePost } from "@/lib/openHouse.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Open House registration. Test and production use different variables.
 *
 * OPEN_HOUSE_ENV=test requires:
 * - OPEN_HOUSE_TEST_DEPLOYMENT_ID
 * - OPEN_HOUSE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<that id>/exec
 * - OPEN_HOUSE_APPS_SCRIPT_SECRET
 * - OPEN_HOUSE_EVENT_ID
 * - TURNSTILE_SECRET_KEY
 * Turnstile hostnames are localhost, 127.0.0.1, and the Netlify test site.
 * The public test site key is NEXT_PUBLIC_TURNSTILE_SITE_KEY.
 *
 * OPEN_HOUSE_ENV=production requires:
 * - OPEN_HOUSE_PRODUCTION_DEPLOYMENT_ID
 * - OPEN_HOUSE_PRODUCTION_APPS_SCRIPT_URL=https://script.google.com/macros/s/<that id>/exec
 * - OPEN_HOUSE_PRODUCTION_APPS_SCRIPT_SECRET
 * - OPEN_HOUSE_EVENT_ID
 * - TURNSTILE_PRODUCTION_SECRET_KEY
 * Turnstile hostnames are fuegodanceschool.se and www.fuegodanceschool.se.
 * The public production site key is NEXT_PUBLIC_TURNSTILE_PRODUCTION_SITE_KEY.
 *
 * Each mode calls only its own allowlisted deployment. There is no fallback
 * to the other URL or secret. The two deployment ids and the two pairs of
 * secrets must differ. The legacy production deployment cannot be allowlisted.
 * Missing, unknown, or conflicting configuration returns 503 and does not
 * call Apps Script. Secrets stay on the server.
 */
export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const result = await handleOpenHousePost(body, process.env, fetch);
    return NextResponse.json(result.body, { status: result.status });
}
