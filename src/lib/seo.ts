import type { Metadata } from "next";

export const SITE_URL = "https://www.fuegodanceschool.se";
export const SUPPORTED_LANGS = ["sv", "en"] as const;
export type SiteLang = (typeof SUPPORTED_LANGS)[number];

export function normalizeLang(lang?: string): SiteLang {
    return lang === "en" ? "en" : "sv";
}

/** pathAfterLang: "" | "courses" | "privacy-policy" (no leading/trailing slashes) */
export function languageAlternates(pathAfterLang = "") {
    const clean = pathAfterLang.replace(/^\/+|\/+$/g, "");
    const suffix = clean ? `${clean}/` : "";

    return {
        canonical: undefined as string | undefined,
        languages: {
            "sv-SE": `/sv/${suffix}`,
            en: `/en/${suffix}`,
            "x-default": `/sv/${suffix}`,
        },
    };
}

export function withLangAlternates(
    lang: string,
    pathAfterLang = ""
): Pick<Metadata, "alternates"> {
    const siteLang = normalizeLang(lang);
    const clean = pathAfterLang.replace(/^\/+|\/+$/g, "");
    const suffix = clean ? `${clean}/` : "";
    const { languages } = languageAlternates(pathAfterLang);

    return {
        alternates: {
            canonical: `/${siteLang}/${suffix}`,
            languages,
        },
    };
}

type RootMetaOptions = {
    lang: string;
    pathAfterLang?: string;
};

export function buildRootMetadata({
    lang,
    pathAfterLang = "",
}: RootMetaOptions): Metadata {
    const siteLang = normalizeLang(lang);
    const isEnglish = siteLang === "en";
    const clean = pathAfterLang.replace(/^\/+|\/+$/g, "");
    const suffix = clean ? `${clean}/` : "";

    const titleDefault = isEnglish
        ? "Fuego Dance School | Bachata in Gothenburg"
        : "Fuego Dance School | Bachata i Göteborg";

    const description = isEnglish
        ? "Learn Bachata at Fuego Dance School in Gothenburg. Courses for all levels."
        : "Lär dig dansa Bachata hos Fuego Dance School i Göteborg. Vi erbjuder kurser för alla nivåer.";

    const ogDescription = isEnglish
        ? "Join our dance family! Bachata courses for all levels in the heart of Gothenburg."
        : "Gå med i vår dansfamilj! Bachatakurser för alla nivåer i hjärtat av Göteborg.";

    return {
        metadataBase: new URL(SITE_URL),
        title: {
            default: titleDefault,
            template: "%s | Fuego Dance School",
        },
        description,
        keywords: isEnglish
            ? ["Bachata", "Dance school", "Gothenburg", "Dance courses", "Bachata Sensual", "Dance", "Fuego"]
            : ["Bachata", "Dansskola", "Göteborg", "Danskurser", "Bachata Sensual", "Dans", "Fuego"],
        authors: [{ name: "Fuego Dance School" }],
        creator: "Fuego Dance School",
        ...withLangAlternates(siteLang, pathAfterLang),
        openGraph: {
            title: titleDefault,
            description: ogDescription,
            url: `${SITE_URL}/${siteLang}/${suffix}`,
            siteName: "Fuego Dance School",
            images: [
                {
                    url: "/img/Hero/Heromain.jpg",
                    width: 1200,
                    height: 630,
                    alt: isEnglish
                        ? "Fuego Dance School dance floor"
                        : "Fuego Dance School Dansgolv",
                },
            ],
            locale: isEnglish ? "en_US" : "sv_SE",
            alternateLocale: isEnglish ? ["sv_SE"] : ["en_US"],
            type: "website",
        },
        icons: {
            icon: "/icon.png",
        },
    };
}

type PageMetaOptions = {
    lang: string;
    pathAfterLang: string;
    title: { sv: string; en: string };
    description: { sv: string; en: string };
};

/** Page-level title/description + hreflang/canonical for a given path. */
export function buildPageMetadata({
    lang,
    pathAfterLang,
    title,
    description,
}: PageMetaOptions): Metadata {
    const siteLang = normalizeLang(lang);
    const isEnglish = siteLang === "en";

    return {
        title: isEnglish ? title.en : title.sv,
        description: isEnglish ? description.en : description.sv,
        ...withLangAlternates(siteLang, pathAfterLang),
    };
}
