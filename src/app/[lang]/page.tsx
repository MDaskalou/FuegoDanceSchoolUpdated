import HomePageClient from '@/components/HomePageClient';
import React from 'react';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

// FIX: Ta bort searchParams från props
export default function Home({ params }: { params: { lang: string } }) {
    return <HomePageClient params={params} />;
}
