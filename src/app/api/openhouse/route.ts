import { NextResponse } from "next/server";
import { handleOpenHousePost } from "@/lib/openHouse.mjs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Open House registration. Test and production Netlify projects use the same
 * variable names with different values.
 *
 * Required:
 * - OPEN_HOUSE_ENV=test or production
 * - OPEN_HOUSE_DEPLOYMENT_ID
 * - OPEN_HOUSE_APPS_SCRIPT_URL=https://script.google.com/macros/s/<that id>/exec
 * - OPEN_HOUSE_APPS_SCRIPT_SECRET
 * - OPEN_HOUSE_EVENT_ID
 * - TURNSTILE_SECRET_KEY
 * - NEXT_PUBLIC_TURNSTILE_SITE_KEY at build time
 *
 * OPEN_HOUSE_ENV selects the allowed Turnstile hostnames. Test allows
 * localhost, 127.0.0.1, and the Netlify test site. Production allows
 * fuegodanceschool.se and www.fuegodanceschool.se.
 *
 * The URL deployment id must equal OPEN_HOUSE_DEPLOYMENT_ID. The legacy
 * production deployment is refused. There is no second URL or secret to
 * fall back to. Missing or invalid configuration returns 503 and does not
 * call Apps Script.
 *
 * A failed configuration check on the separate test hosts logs one fixed
 * reason code. The browser response stays { ok: false }.
 */
function requestHostname(request: Request): string {
    return request.headers.get("host") ?? "";
}

export async function POST(request: Request) {
    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ ok: false }, { status: 400 });
    }

    const result = await handleOpenHousePost(body, process.env, fetch, requestHostname(request));
    return NextResponse.json(result.body, { status: result.status });
}
