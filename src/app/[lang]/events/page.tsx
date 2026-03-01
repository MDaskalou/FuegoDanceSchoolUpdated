import { Metadata } from "next";
import EventsPageClient from "./EventsPageClient";

export const metadata: Metadata = {
    title: "Events | Fuego Dance School",
    description: "Alla events och workshops hos Fuego Dance School — stående events och kommande.",
};

export default function EventsPage() {
    return <EventsPageClient />;
}