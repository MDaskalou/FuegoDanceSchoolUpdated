// src/app/[lang]/page.tsx
import React from 'react';
import dynamic from 'next/dynamic';
import { About } from "@/components/About";

import Schedule from "@/components/Schedule";
import Price from "@/components/Price";
import Event from "@/components/Event";


// 1. Deklarera Hero-komponenten dynamiskt HÄR
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


export default function Home({ params }: { params: { lang: string } }) {
    return (
        <>
            <DynamicHero />
            <About />
            <Schedule />
            <Price />
            <Event/>

        </>
    );
}

// OBS! Ta bort alla statiska 'import { Hero } from "@/components/Hero"' från denna fil!