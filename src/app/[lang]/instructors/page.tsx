// src/app/[lang]/instructors/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import InstructorCard from '@/components/InstructorCard';

interface Instructor {
    id: number;
    name: string;
    focus: string;
    bio: string;
    imageSrc: string;
    role: 'main' | 'helper'
}

const DUMMY_INSTRUCTORS: Instructor[] = [
    { id: 1, name: "Mikael", focus: "Bachata Sensual, Teknik", bio: "Mikael har undervisat i över 8 år...", imageSrc: "/img/Instructors/instruktörMikael.jpg", role: 'main' },
    { id: 2, name: "Irina", focus: "Follower Styling, Koreografi", bio: "Med en bakgrund inom balett och modern dans...", imageSrc: "/img/Instructors/instruktörIrina.jpg", role: 'main' },
    { id: 3, name: "Tomas & Jennifer", focus: "Bachata Nivå 2 & 3", bio: "Ett dynamiskt par kända för sin pedagogik...", imageSrc: "/img/Instructors/instruktörJennifer.jpg", role: 'main' },
    { id: 4, name: "Nora", focus: "Social Dans", bio: "Hjälper till att skapa en bra stämning...", imageSrc: "/img/Instructors/instruktörNora.jpg", role: 'helper' },
];

export default function InstructorsPage() {
    const { t } = useTranslation("instructorTranslation");
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div className="pt-24 pb-16 min-h-screen bg-gray-900"></div>;
    }

    const instructors: Instructor[] = t("instructorsData", { returnObjects: true }) as Instructor[] || DUMMY_INSTRUCTORS;

    const mainInstructors = instructors.filter(i => i.role === 'main');
    const helperInstructors = instructors.filter(i => i.role === 'helper');

    return (
        <div className="pt-24 pb-16 bg-transparent min-h-screen text-white">
            <div className="container mx-auto max-w-7xl px-4">

                {/* --- HUVUDINSTRUKTÖRER --- */}
                <h1 className="text-5xl sm:text-6xl font-bold text-orange-500 mb-12 text-center pt-8">
                    {t('instructorsTitle', { defaultValue: 'Möt Våra Instruktörer' })}
                </h1>

                {/* Grid för Huvudinstruktörer */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {mainInstructors.length > 0 ? (
                        mainInstructors.map((instructor, index) => (
                            <InstructorCard
                                key={instructor.id}
                                instructor={instructor}
                                index={index}
                            />
                        ))
                    ) : (
                        <p className="text-xl col-span-full text-center">Instruktörsdata laddas eller saknas.</p>
                    )}
                </div>

                {/* --- HJÄLPINSTRUKTÖRER --- */}
                {helperInstructors.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-10 text-center">
                            {t('helperInstructorsTitle', { defaultValue: 'Våra Hjälpinstruktörer' })}
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {helperInstructors.map((instructor, index) => (
                                <InstructorCard
                                    key={instructor.id}
                                    instructor={instructor}
                                    index={index}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}