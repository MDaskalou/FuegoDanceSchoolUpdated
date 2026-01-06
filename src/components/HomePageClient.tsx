"use client";

import React from 'react';
import Hero from './Hero';
import ScheduleSection from './Schedule';
import About from "@/components/About";
import TestimonialsSection from './TestimonialsSection';
import InstagramFeed from './InstagramFeeds';
import { ContactSection } from './Contact';
import PriceSection from './Price';
import EventSection from './Event';

export interface HomePageClientProps {
    params: { lang: string };
}

export default function HomePageClient({ params }: HomePageClientProps) {
    return (
        <>
            <Hero />
            <main>
                <About />
                <ScheduleSection />
                <PriceSection />
                <EventSection />
                <TestimonialsSection />
                <InstagramFeed />
            </main>
            <ContactSection />
        </>
    );
}