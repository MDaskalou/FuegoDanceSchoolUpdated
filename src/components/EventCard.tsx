// src/components/EventCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

// --- Typdefinitioner (Hämtad från EventsSection) ---
interface EventItem {
    id: number;
    title: string;
    date: string; // Visningsdatum
    startDate: string; // YYYY-MM-DD för filtrering
    location: string;
    link: string; // URL för bokning (kan vara intern eller extern)
    description: string;
    imageUrl: string;
    isNew?: boolean;
}

interface EventCardProps {
    event: EventItem;
    // Används för animationer på startsidan, valfri här
    animateClass?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, animateClass = '' }) => {
    const { t } = useTranslation("eventsTranslation");

    // NYCKEL: Kontrollera om länken är extern
    const isExternal = event.link && (event.link.startsWith('http://') || event.link.startsWith('https://'));

    return (
        <div
            className={`
                bg-[#262626] rounded-2xl shadow-xl border border-white/10 overflow-hidden
                transform hover:scale-[1.02] transition-all duration-300 ${animateClass}
            `}
        >
            {/* Event Bild */}
            <div className="relative w-full h-48">
                <Image
                    src={event.imageUrl || '/img/event_placeholder.jpg'} // Fallback bild
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                />
            </div>

            {/* Event Innehåll */}
            <div className="p-6">

                <h3 className="text-2xl font-bold mb-2 text-orange-500">{event.title}</h3>

                <div className="flex flex-col text-sm text-gray-400 mb-4 space-y-1">
                    <span className="flex items-center">
                        <FaCalendarAlt className="w-4 h-4 mr-2 text-white" /> {event.date}
                    </span>
                    <span className="flex items-center">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2 text-white" /> {event.location}
                    </span>
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">{event.description}</p>

                {/* CTA till eventsidan */}
                <Link
                    href={event.link || `#`}
                    // FIX: Öppna i nytt fönster om länken är extern
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    className="
                        inline-flex items-center bg-orange-500 text-white font-bold px-4 py-2 rounded-full
                        shadow-md hover:bg-orange-600 transition-colors duration-200
                    "
                >
                    {t("eventsCtaButton", { defaultValue: "Läs mer & Boka" })}
                </Link>

            </div>

            {/* "NY" märke */}
            {event.isNew && (
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                    NY
                </div>
            )}
        </div>
    );
};

export default EventCard;