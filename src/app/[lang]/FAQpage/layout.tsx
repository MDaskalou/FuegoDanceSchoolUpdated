import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "FAQpage",
        title: {
            sv: "Vanliga Frågor",
            en: "Frequently Asked Questions",
        },
        description: {
            sv: "Hitta svar på vanliga frågor om kurser, priser, drop-in och det praktiska kring Fuego Dance School.",
            en: "Find answers to common questions about courses, prices, drop-in, and practical info at Fuego Dance School.",
        },
    });
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
