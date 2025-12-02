// src/app/[lang]/FAQpage/page.tsx
import React from 'react';

// Vi använder den centrala komponenten i 'components'-mappen
import FAQPageClient from '@/components/FAQPageClient';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

// 2. Server Page component
// Tar emot 'params' och skickar dem vidare till Client Component
export default function FAQPage({ params }: { params: { lang: string } }) {
    return <FAQPageClient params={params} />;
}