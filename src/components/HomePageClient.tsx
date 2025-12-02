"use client";

import React, { useEffect } from 'react';
import dynamic from 'next/dynamic';
import { About } from "@/components/About";
import Schedule from "@/components/Schedule";
import Price from "@/components/Price";
import Event from "@/components/Event";
import InstagramFeed from "@/components/InstagramFeeds";
import TestimonialsSection from "@/components/TestimonialsSection";

// 1. Deklarera Hero-komponenten dynamiskt
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

// 2. Huvud Client Component
export default function HomePageClient({ params }: HomePageClientProps) {

    // 3. Fix för ESLint/Build: Vi "använder" params
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // console.log("Home page loaded for lang:", params.lang);
        }
    }, [params]);

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