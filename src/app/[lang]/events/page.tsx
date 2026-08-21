import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import EventsPageClient from "./EventsPageClient";

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "events",
        title: {
            sv: "Events",
            en: "Events",
        },
        description: {
            sv: "Alla events och workshops hos Fuego Dance School — stående events och kommande.",
            en: "All events and workshops at Fuego Dance School — recurring and upcoming.",
        },
    });
}

export default function EventsPage() {
    return <EventsPageClient />;
}
