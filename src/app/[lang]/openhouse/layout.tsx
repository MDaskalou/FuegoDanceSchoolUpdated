import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "openhouse",
        title: {
            sv: "Föranmälan till Vinterkurserna",
            en: "Pre-registration for Winter Courses",
        },
        description: {
            sv: "Anmäl dig i förväg till kommande Bachata-kurser och välj din nivå och roll.",
            en: "Pre-register for upcoming Bachata courses and choose your level and role.",
        },
    });
}

export default function OpenHouseLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
