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
import BootcampFeature from "@/components/BootcampFeature";
import SocialProofStrip from "@/components/SocialProofStrip";
import FuegoGalleryStrip from "@/components/FuegoGalleryStrip";

export interface HomePageClientProps {
    params: { lang: string };
}

export default function HomePageClient({ params }: HomePageClientProps) {
    return (
        <>
            <Hero />
            <main>
                <SocialProofStrip />
                <BootcampFeature/>
                 <About />
                <FuegoGalleryStrip />
                <ScheduleSection />
                 <PriceSection />
                <EventSection showSeeAllButton={true} lang={params.lang} />
                <TestimonialsSection />
                 <InstagramFeed />
            </main>
            {/* <ContactSection /> */}
        </>
    );
}
