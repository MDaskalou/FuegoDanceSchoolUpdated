// src/app/[lang]/FAQpage/page.tsx
// (MÅSTE VARA EN SERVER COMPONENT - INGEN "use client" HÄR!)

import FAQPageClient from '@/components/FAQPageClient'; // Importera client-komponenten
import React from 'react';

// 1. generateStaticParams ligger här (Server Component)
export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

// 2. Server Page component (destrukturerar propsen för renare överföring)
export default function FAQPage({ params }: { params: { lang: string } }) {
    // Returnerar Client Componenten och skickar 'params' vidare.
    return <FAQPageClient params={params} />;
}