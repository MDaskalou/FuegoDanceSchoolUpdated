// src/app/[lang]/courses/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import CourselyWidget from '@/components/CourselyWidget';

// OBS: 'metadata' exporten MÅSTE finnas i en separat layout.tsx fil.

export default function CoursesPage() {
    const { t } = useTranslation("aboutTranslation");
    const [isClient, setIsClient] = useState(false);

    // Effekt: Markera när komponenten är monterad på klienten (Fixar Hydration Error)
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setIsClient(true);
    }, []);

    // Använd en placeholder-sträng om vi inte är säkra på klienten
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
                    <CourselyWidget />
                </div>

            </div>
        </div>
    );
}