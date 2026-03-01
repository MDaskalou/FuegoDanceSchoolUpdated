"use client";

import { useTranslation } from "react-i18next";
import { useInView } from "@/hooks/useInView";
import EventCarousel from "@/components/EventCarousel";
import React from "react";
import { FaCalendarPlus } from "react-icons/fa";

export interface EventItem {
    id: number;
    title: string;
    date: string;
    startDate: string; // YYYY-MM-DD for filtering
    location: string;
    link: string;
    description: string;
    imageUrl: string;
    isNew?: boolean;
    priority?: number;
}

const filterUpcomingEvents = (events: EventItem[]): EventItem[] => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
        .filter((event) => {
            const eventDate = new Date(event.startDate);
            return !Number.isNaN(eventDate.getTime()) && eventDate >= today;
        })
        .sort((a, b) => {
            // Prioriterade events först
            const aPriority = a.priority ?? Infinity;
            const bPriority = b.priority ?? Infinity;

            if (aPriority !== bPriority) return aPriority - bPriority;

            // Resten sorteras på datum
            return new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
        });
};

type EventSectionProps = {
    id?: string;
};

export const Event = ({ id = "events" }: EventSectionProps) => {
    const { t } = useTranslation("eventTranslation");
    const { ref: sectionRef, inView } = useInView(0.1);

    const allEvents = t("events", {
        returnObjects: true,
    }) as unknown as EventItem[];
    const normalizedEvents: EventItem[] = Array.isArray(allEvents)
        ? allEvents
        : [];

    // ✅ No longer slicing to 3 — show ALL upcoming events via carousel
    const upcomingEvents = filterUpcomingEvents(normalizedEvents);

    return (
        <section
            id={id}
            data-event-section
            ref={sectionRef}
            className="py-20 sm:py-32 bg-transparent text-white scroll-mt-24"
        >
            <div className="container mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-12">
                    {t("eventsTitle")}
                </h2>

                {upcomingEvents.length > 0 ? (
                    // ✅ Replaced the static grid with EventCarousel
                    // - 1–3 events: renders as a normal responsive grid (no carousel)
                    // - 4+ events: activates swipeable carousel with arrows + dots
                    <div
                        className={`
              mb-16 transition-all duration-700 ease-out
              ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
            `}
                    >
                        <EventCarousel events={upcomingEvents} />
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-[#262626] rounded-3xl border border-white/5 shadow-2xl max-w-2xl mx-auto mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-orange-500/10 p-4 rounded-full">
                                <FaCalendarPlus className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            {t("comingSoonTitle") || t("noUpcomingEvents")}
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
                            {t("comingSoonDescription") || t("noUpcomingEvents")}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Event;