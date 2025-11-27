import InstructorsPageClient from "@/components/InstructorsPageClient";
import React from 'react';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

export default function InstrutorsPage({ params }: { params: { lang: string } }) {
    return <InstructorsPageClient params={params} />;
}