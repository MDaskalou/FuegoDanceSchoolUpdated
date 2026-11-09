import type { Config } from "@netlify/edge-functions";

/**
 * Temporary Open House rate limit, matching Netlify's simplest edge
 * example while we isolate why the limit is not applying.
 *
 * The HTTP method filter is omitted on purpose. Other methods are counted
 * during this test. This is not the final production configuration.
 *
 * An empty return leaves the original request, including its body, on
 * the chain. This file does not read or rewrite that request.
 *
 * onError "bypass" is fail-open only when this function itself throws.
 * Netlify then skips the function and continues to the route instead of
 * serving its generic error page. rateLimit is applied by the platform
 * before the function runs, so a 429 is not a function error and is not
 * bypassed. If the function fails to execute, an under-limit registration
 * can still reach the Open House API.
 */
export default async () => {
    return;
};

export const config: Config = {
    path: "/api/openhouse",
    onError: "bypass",
    rateLimit: {
        windowLimit: 40,
        windowSize: 180,
        aggregateBy: ["ip", "domain"],
    },
};
