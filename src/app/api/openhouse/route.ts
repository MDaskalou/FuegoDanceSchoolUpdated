import { NextResponse } from "next/server";
import { handleOpenHousePost } from "@/lib/openHouse.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Test phase only.
 *
 * Required before any call leaves the server:
 * - OPEN_HOUSE_ENV=test
 * - OPEN_HOUSE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<TEST_DEPLOYMENT>/exec
 * - OPEN_HOUSE_APPS_SCRIPT_SECRET=<shared secret with the test Apps Script>
 * - OPEN_HOUSE_EVENT_ID=<current open-house occasion, chosen by the server>
 * - TURNSTILE_SECRET_KEY=<server-side Turnstile secret for this environment>
 *
 * Set those in .env.local and in Netlify Deploy Previews. Leave them unset in
 * Netlify Production. The route returns 503 and does not call Apps Script when
 * the test mode or the test URL is missing. The current production deployment
 * id is refused even if it is placed in OPEN_HOUSE_APPS_SCRIPT_URL.
 *
 * A future production publish needs a separate Apps Script deployment and a
 * reviewed code change. Do not point these variables at the production sheet.
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
