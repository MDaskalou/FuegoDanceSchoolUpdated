import type { MetadataRoute } from "next";
import { SITE_URL, SUPPORTED_LANGS } from "@/lib/seo";

const PATHS = [
    "",
    "courses",
    "gift-card",
    "events",
    "instructors",
    "openhouse",
    "FAQpage",
    "values",
    "privacy-policy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return SUPPORTED_LANGS.flatMap((lang) =>
        PATHS.map((path) => {
            const suffix = path ? `${path}/` : "";
            return {
                url: `${SITE_URL}/${lang}/${suffix}`,
                lastModified,
                changeFrequency: path === "gift-card" || path === "" ? "weekly" : "monthly",
                priority: path === "" ? 1 : path === "gift-card" || path === "courses" ? 0.9 : 0.7,
            };
        })
    );
}
