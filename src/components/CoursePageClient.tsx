// src/components/CoursesPageClient.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import CourselyWidget from '@/components/CourselyWidget';

interface CoursesPageClientProps {
    params: { lang: string };
}

export default function CoursesPageClient({ params }: CoursesPageClientProps) {
    const { t } = useTranslation("aboutTranslation");
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const pageTitle = isClient
        ? t('coursesPageTitle', { defaultValue: 'Våra Kurser & Schema' })
        : 'Våra Kurser & Schema';

    return (
        <div className="pt-24 bg-[#1a1a1a] min-h-screen text-white">
            <div className="container mx-auto max-w-5xl">

                <h1 className="text-4xl font-bold text-orange-500 mb-8 text-center px-4">
                    {pageTitle}
                </h1>

                <div
                    className="
                        w-full rounded-xl bg-[#262626] shadow-2xl shadow-black/70
                        border-2 border-orange-500/50 mx-auto mb-16
                        transform translate-x-0.5
                    "
                >
                    {/* Viktigt: undvik rubrik-dubblering */}
                    <CourselyWidget showHeader={false} />
                </div>
            </div>
        </div>
    );
}
