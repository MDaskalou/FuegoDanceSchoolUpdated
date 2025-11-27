import ValuesPageClient from '@/components/ValuesPageClient';
import React from 'react';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

export default function ValuesPage({ params }: { params: { lang: string } }) {
    return <ValuesPageClient params={params} />;
}