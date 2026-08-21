import type { ReactNode } from "react";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "instructors",
        title: {
            sv: "Instruktörer",
            en: "Instructors",
        },
        description: {
            sv: "Möt instruktörerna som leder dig genom våra Bachata-kurser och workshops. Läs om deras bakgrund och specialområden.",
            en: "Meet the instructors who guide you through our Bachata courses and workshops. Learn about their background and specialties.",
        },
    });
}

export default function InstructorsLayout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
