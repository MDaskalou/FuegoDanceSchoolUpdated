// src/components/EventsSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import EventCard from '@/components/EventCard';
import React from "react";

// --- Typdefinitioner (måste matcha din JSON-struktur) ---
interface EventItem {
    id: number;
    title: string;
    date: string;
    startDate: string; // VIKTIGT: Måste vara i YYYY-MM-DD
    location: string;
    link: string;
    description: string;
    imageUrl: string;
    isNew?: boolean;
}

// --- Filtreringsfunktion för att dölja gamla events ---
const filterUpcomingEvents = (events: EventItem[]): EventItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filter och sort (denna funktion fungerar endast om 'events' är en array)
    return events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= today;
    }).sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
    });
};


// --- Kärnkomponenten (Hemside-preview) ---
export const Event = () => {
    const { t, i18n } = useTranslation("eventTranslation");
    const { ref: sectionRef, inView } = useInView(0.1);

    const currentLang = i18n.language;

    // 1. Hämta alla events från JSON
    const allEvents: EventItem[] = t("events", { returnObjects: true }) as EventItem[] || [];

    // 2. FIX: Filtrera och sortera kommande events ENDAST om allEvents är en array
    const upcomingEvents = Array.isArray(allEvents)
        ? filterUpcomingEvents(allEvents) // Kör filtreringen endast om det är en array
        : []; // Returnera en tom array som fallback

    // 3. Visa endast de 3 nästkommande evenemangen
    const featuredEvents = upcomingEvents.slice(0, 3);

    // Enkel animeringsklass för staggering på startsidan
    const animateClass = (index: number) =>
        `transition-all duration-700 ease-out ${inView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'} delay-${index * 150}`;

    return (
        <section
            id="events" // Ankar-ID
            ref={sectionRef}
            className="py-20 sm:py-32 bg-transparent text-white"
        >
            <div className="container mx-auto max-w-7xl px-4 text-center">

                {/* Rubrik */}
                <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-12">
                    {t("eventsTitle")}
                </h2>

                {/* === Events Grid === */}
                {/* Vi använder featuredEvents som vi VET är en array, tack vare fixen ovan. */}
                {featuredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">

                        {featuredEvents.map((event, index) => (
                            // EventCard hanterar styling och innehåll
                            <EventCard
                                key={event.id}
                                event={event}
                                animateClass={animateClass(index)}
                            />
                        ))}

                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#262626] rounded-xl border border-white/10 shadow-lg">
                        <p className="text-xl text-gray-300">
                            {t('noUpcomingEvents', { defaultValue: 'Inga kommande evenemang planerade just nu. Håll utkik!' })}
                        </p>
                    </div>
                )}

                {/* Global CTA - Länkar till eventsidan (om du skapar en senare) eller bara Läs Mer */}
                <div className="text-center mt-10">
                    <Link
                        // Länkar till en framtida dedikerad eventsida, eller #kontakt/nyhetsbrev
                        href={`/${currentLang}/events`}
                        className="
                            rounded-full bg-orange-500 px-10 py-3 text-lg font-bold uppercase
                            tracking-wider text-white shadow-xl transition-all duration-300
                            hover:bg-orange-600 hover:scale-105 active:scale-95
                        "
                    >
                        {t("eventsCta")}
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default Event;