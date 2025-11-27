// src/components/HomePageClient.tsx
"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { About } from "@/components/About";
import Schedule from "@/components/Schedule";
import Price from "@/components/Price";
import Event from "@/components/Event";
import InstagramFeed from "@/components/InstagramFeeds";
import TestimonialsSection   from "@/components/TestimonialsSection";

// 1. Deklarera Hero-komponenten dynamiskt HÄR (Måste göras i Client Wrapper)
const DynamicHero = dynamic(
    () => import('@/components/Hero').then((mod) => mod.Hero),
    {
        ssr: false,
        loading: () => (
            <div className="h-[calc(100vh-80px)] w-full bg-black flex items-center justify-center">
                <p className="text-white text-xl">Laddar innehåll...</p>
            </div>
        ),
    }
);

interface HomePageClientProps {
    params: { lang: string };
}

// 2. Huvud Client Component som renderar alla sektioner
export default function HomePageClient({ params }: HomePageClientProps) {
    // Du kan använda params.lang här om du behöver det i logiken
    return (
        <>
            <DynamicHero />
            <About />
            <Schedule />
            <Price />
            <Event/>
            <InstagramFeed />
            <TestimonialsSection />

        </>
    );
}