// src/components/EventsSection.tsx
"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useInView } from "@/hooks/useInView";
import EventCard from '@/components/EventCard';
import React from "react";
import { FaCalendarPlus } from "react-icons/fa"; // Lade till en ikon för "tomt läge"

// --- Typdefinitioner ---
interface EventItem {
    id: number;
    title: string;
    date: string;
    startDate: string;
    location: string;
    link: string;
    description: string;
    imageUrl: string;
    isNew?: boolean;
}

// --- Filtreringsfunktion ---
const filterUpcomingEvents = (events: EventItem[]): EventItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(event => {
        const eventDate = new Date(event.startDate);
        return eventDate >= today;
    }).sort((a, b) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
    });
};

export const Event = () => {
    const { t, i18n } = useTranslation("eventTranslation");
    const { ref: sectionRef, inView } = useInView(0.1);

    const currentLang = i18n.language;

    // Hämta och filtrera events
    const allEvents: EventItem[] = t("events", { returnObjects: true }) as EventItem[] || [];

    const upcomingEvents = Array.isArray(allEvents)
        ? filterUpcomingEvents(allEvents)
        : [];

    const featuredEvents = upcomingEvents.slice(0, 3);

    const animateClass = (index: number) =>
        `transition-all duration-700 ease-out ${inView
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-10'} delay-${index * 150}`;

    return (
        <section
            id="events"
            ref={sectionRef}
            className="py-20 sm:py-32 bg-transparent text-white"
        >
            <div className="container mx-auto max-w-7xl px-4 text-center">

                {/* Rubrik */}
                <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-12">
                    {t("eventsTitle")}
                </h2>

                {/* === Events Grid === */}
                {featuredEvents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-16">
                        {featuredEvents.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                animateClass={animateClass(index)}
                            />
                        ))}
                    </div>
                ) : (
                    // --- UPPDATERAT: Meddelande när inga event finns ---
                    <div className="text-center py-20 px-6 bg-[#262626] rounded-3xl border border-white/5 shadow-2xl max-w-2xl mx-auto mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-orange-500/10 p-4 rounded-full">
                                <FaCalendarPlus className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            {t('noEventsTitle', { defaultValue: 'Nya event kommer snart!' })}
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
                            {t('noEventsDesc', { defaultValue: 'Just nu planerar vi för fullt inför kommande termin. Håll utkik här eller på våra sociala medier för uppdateringar.' })}
                        </p>
                    </div>
                )}

                {/* --- UPPDATERAT: Knappen leder nu till /events istället för /courses --- */}
                {/* Vi visar bara knappen om det faktiskt finns events att se */}
                {featuredEvents.length > 0 && (
                    <div className="text-center mt-10">
                        <Link
                            href={`/${currentLang}/events`} // ÄNDRAT HÄR
                            className="
                                inline-block rounded-full bg-orange-500 px-10 py-3 text-lg font-bold uppercase
                                tracking-wider text-white shadow-xl transition-all duration-300
                                hover:bg-orange-600 hover:scale-105 active:scale-95
                            "
                        >
                            {t("eventsCta")}
                        </Link>
                    </div>
                )}

            </div>
        </section>
    );
};

export default Event;