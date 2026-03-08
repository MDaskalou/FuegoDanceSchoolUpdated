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
import {FeatureSection} from './FeatureSection';
import BootcampFeature from "@/components/BootcampFeature";

export interface HomePageClientProps {
    params: { lang: string };
}

export default function HomePageClient({ params }: HomePageClientProps) {
    return (
        <>
            <Hero />
            <main>
                <BootcampFeature/>
                 <About />
                <ScheduleSection />
                <FeatureSection showSeeAllButton={true} />
                 <PriceSection />
                <EventSection showSeeAllButton={true} lang={params.lang} />
                <TestimonialsSection />
                 <InstagramFeed />
            </main>
            {/* <ContactSection /> */}
        </>
    );
}