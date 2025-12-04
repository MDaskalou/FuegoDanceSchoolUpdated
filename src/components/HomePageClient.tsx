"use client";

import React from 'react';
import Hero from './Hero';
import ScheduleSection from './Schedule';
import About from "@/components/About";
import TestimonialsSection from './TestimonialsSection';
import InstagramFeed from './InstagramFeeds';
import { ContactSection } from './Contact';

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
                <TestimonialsSection />
                <InstagramFeed />
            </main>
            <ContactSection />
        </>
    );
}