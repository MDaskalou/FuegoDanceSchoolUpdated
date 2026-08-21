import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "values",
        title: {
            sv: "Våra Kärnvärden",
            en: "Our Core Values",
        },
        description: {
            sv: "Läs om Fuego Dance Schools kärnvärden: gemenskap, utveckling, glädje och teknik.",
            en: "Learn about Fuego Dance School's core values: community, growth, joy, and technique.",
        },
    });
}

export default function ValuesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
