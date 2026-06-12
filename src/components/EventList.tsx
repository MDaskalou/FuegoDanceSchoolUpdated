// src/components/EventList.tsx (eller var du nu renderar eventkorten)

import React from 'react';
import EventCard from '@/components/EventCard'; // FIX: Importera EventCard

// Se till att din Event-typ har en startDate som är en sträng i YYYY-MM-DD format
interface Event {
    id: number;
    title: string;
    startDate: string; // Exempel: "2025-11-08"
    date: string;
    location: string;
    link: string;
    description: string | string[];
    imageUrl: string;
    imageFit?: "cover" | "contain";
    isNew?: boolean;
    price?: string;
    time?: string;
}

interface EventListProps {
    events: Event[]; // Listan med alla events
}

const EventList: React.FC<EventListProps> = ({ events }) => {

    // 1. Sätt dagens datum vid midnatt för en rättvis jämförelse
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 2. Filtrera fram endast kommande evenemang
    const upcomingEvents = events.filter(event => {
        // Skapar ett Date-objekt från evenemangets datumsträng
        const eventDate = new Date(event.startDate);

        // Returnerar TRUE om eventets datum är idag eller i framtiden (>= today)
        return eventDate >= today;
    });

    // Hantera fallet om inga evenemang är kvar
    if (upcomingEvents.length === 0) {
        return <p className="text-center text-white text-xl mt-12">Inga kommande evenemang just nu.</p>;
    }

    // 3. Rendera endast de kommande evenemangen
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map(event => (
                // Använd din befintliga event-kortskomponent här
                <EventCard key={event.id} event={event} />
            ))}
        </div>
    );
};

export default EventList;
