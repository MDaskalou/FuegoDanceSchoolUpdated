import type { Metadata } from "next";
import CoursesPageClient from "@/components/CoursePageClient";
import { buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
    return [{ lang: "sv" }, { lang: "en" }];
}

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "courses",
        title: {
            sv: "Kurser",
            en: "Courses",
        },
        description: {
            sv: "Boka Bachata-kurser hos Fuego Dance School i Göteborg. Nivåer för nybörjare till avancerade.",
            en: "Book Bachata courses at Fuego Dance School in Gothenburg. Levels from beginner to advanced.",
        },
    });
}

export default function CoursesPage({ params }: { params: { lang: string } }) {
    return <CoursesPageClient params={params} />;
}