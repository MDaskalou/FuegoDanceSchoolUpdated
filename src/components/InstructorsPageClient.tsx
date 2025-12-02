"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import InstructorCard, { Instructor } from './InstructorCard';

// 1. Lägg till interfacet för params
export interface InstructorsPageClientProps {
    params: { lang: string };
}

// 2. Ta emot params i funktionen
export default function InstructorsPageClient({ params }: InstructorsPageClientProps) {
    const { t } = useTranslation("instructorTranslation");
    const [isMounted, setIsMounted] = useState(false);

    // 3. Använd params i en useEffect för att göra både TypeScript och ESLint nöjda
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            // console.log("Instructors page loaded for lang:", params.lang);
        }
        setIsMounted(true);
    }, [params]);

    // Hämta datan som en array av objekt
    const instructors = t('instructorsData', { returnObjects: true }) as Instructor[];

    // Kontrollera att det faktiskt är en array
    const allInstructors = Array.isArray(instructors) ? instructors : [];

    // Filtrera baserat på roll
    const mainInstructors = allInstructors.filter(i => i.role === 'main');
    const helperInstructors = allInstructors.filter(i => i.role === 'helper');

    // Förhindra hydration mismatch genom att inte rendera förrän klienten är redo
    if (!isMounted) {
        return <div className="py-20 bg-[#1a1a1a] min-h-screen"></div>;
    }

    return (
        <section className="py-20 bg-[#1a1a1a] min-h-screen">
            <div className="container mx-auto px-4">

                {/* --- HUVUDINSTRUKTÖRER --- */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {t('instructorsTitle', { defaultValue: 'Möt våra huvudinstruktörer' })}
                    </h2>
                    <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
                    {mainInstructors.map((instructor, index) => (
                        <InstructorCard
                            key={instructor.id}
                            instructor={instructor}
                            index={index}
                        />
                    ))}
                </div>


                {/* --- HJÄLPINSTRUKTÖRER --- */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t('helperInstructorsTitle', { defaultValue: 'Våra hjälpinsruktörer & assistansdansare' })}
                    </h2>
                    <div className="w-24 h-1 bg-orange-500/50 mx-auto rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {helperInstructors.map((instructor, index) => (
                        <InstructorCard
                            key={instructor.id}
                            instructor={instructor}
                            index={index}
                        />
                    ))}
                </div>

            </div>
        </section>
    );
}