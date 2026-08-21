// src/components/EventCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaTag } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import type { EventItem } from '@/lib/events';

interface EventCardProps {
    event: EventItem;
    // Används för animationer på startsidan, valfri här
    animateClass?: string;
}

const EventCard: React.FC<EventCardProps> = ({ event, animateClass = '' }) => {
    // FIX: use the same namespace as the Event section + translation files
    const { t } = useTranslation("eventTranslation");

    // NYCKEL: Kontrollera om länken är extern
    const isExternal = event.link && (event.link.startsWith('http://') || event.link.startsWith('https://'));
    const description = Array.isArray(event.description)
        ? event.description.join(" ")
        : event.description;

    return (
        <div
            className={`
                bg-[#262626] rounded-2xl shadow-xl border border-white/10 overflow-hidden
                transform hover:scale-[1.02] transition-all duration-300 ${animateClass}
            `}
        >
            {/* Event Bild */}
            <div className={`relative w-full h-48 ${event.imageFit === "contain" ? "bg-[#f8e9d8]" : ""}`}>
                <Image
                    src={event.imageUrl || '/img/event_placeholder.jpg'} // Fallback bild
                    alt={event.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className={event.imageFit === "contain" ? "object-contain" : "object-cover"}
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
                    {event.time && (
                        <span className="flex items-center">
                            <FaClock className="w-4 h-4 mr-2 text-white" /> {event.time}
                        </span>
                    )}
                    {event.price && (
                        <span className="flex items-center">
                            <FaTag className="w-4 h-4 mr-2 text-white" /> {event.price}
                        </span>
                    )}
                </div>

                <p className="text-gray-300 mb-4 line-clamp-3">{description}</p>

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
