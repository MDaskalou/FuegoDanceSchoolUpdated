"use client";

import React from "react";
import EventsWidget from "@/components/EventsWidget";

export default function EventsPageClient() {
    return (
        <div className="pt-24 bg-[#1a1a1a] min-h-screen text-white">
            <section className="py-16">
                <div className="container mx-auto max-w-5xl px-4">
                    <h2 className="text-4xl font-bold text-orange-500 mb-8 text-center font-serif">
                        Kommande Events
                    </h2>
                    <div className="w-full rounded-xl bg-[#262626] shadow-2xl shadow-black/70 border-2 border-orange-500/50 mx-auto">
                        <EventsWidget />
                    </div>
                </div>
            </section>
        </div>
    );
}