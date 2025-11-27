import CoursesPageClient from '@/components/CoursePageClient';
import React from 'react';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

// FIX: Ta bort searchParams
export default function CoursesPage({ params }: { params: { lang: string } }) {
    return <CoursesPageClient params={params} />;
}