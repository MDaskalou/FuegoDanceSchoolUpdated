"use client";

import React from 'react';
import { useTranslation } from "react-i18next";
import InstructorCard, { Instructor } from './InstructorCard';

const InstructorsSection = () => {
    // Samma namespace som i kortet
    const { t } = useTranslation("instructorTranslation");

    // 1. Hämta datan som en array av objekt
    // 'as Instructor[]' berättar för TypeScript hur datan ser ut
    const instructors = t('instructorsData', { returnObjects: true }) as Instructor[];

    // Kontrollera att det faktiskt är en array innan vi filtrerar (förhindrar krasch vid laddning)
    const allInstructors = Array.isArray(instructors) ? instructors : [];

    // 2. Filtrera baserat på roll
    const mainInstructors = allInstructors.filter(i => i.role === 'main');
    const helperInstructors = allInstructors.filter(i => i.role === 'helper');

    return (
        <section className="py-20 bg-[#1a1a1a]">
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
};

export default InstructorsSection;