"use client";

import React, { useEffect, useState } from 'react';
// VIKTIGT: Vi importerar Hero som vanligt (inte dynamic).
// Detta tar bort den svarta "Laddar innehåll..."-rutan.
import { Hero } from "@/components/Hero";

import { About } from "@/components/About";
import Schedule from "@/components/Schedule";
import Price from "@/components/Price";
import Event from "@/components/Event";
import InstagramFeed from "@/components/InstagramFeeds";
import TestimonialsSection from "@/components/TestimonialsSection";

interface HomePageClientProps {
    params: { lang: string };
}

export default function HomePageClient({ params }: HomePageClientProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (process.env.NODE_ENV === 'development') {
            // console.log("Home page loaded for lang:", params.lang);
        }
    }, [params]);

    // Om vi inte har mountat än, rendera en tom fragment eller en väldigt enkel loader
    // för att undvika att "råa" översättningsnycklar (heroTitle) blinkar till.
    // Men för snabbast möjliga upplevelse renderar vi direkt.

    return (
        <>
            <Hero />
            <About />
            <Schedule />
            <Price />
            <Event/>
            <InstagramFeed />
            <TestimonialsSection />
        </>
    );
}