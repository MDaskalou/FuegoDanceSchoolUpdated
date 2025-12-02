"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslation } from "react-i18next";
import { FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

// --- Typdefinitioner ---
// Vi exporterar denna så att förälder-komponenten kan använda den
export interface Instructor {
    id: number;
    name: string;
    focus: string;
    bio: string;
    imageSrc: string;
    role: "main" | "helper";
    experience?: string;
    specialties?: string[];
    achievements?: string[];
    levels?: string[];
}

interface InstructorCardProps {
    instructor: Instructor;
    index: number;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, index }) => {
    // OBS: Se till att namespace matchar din filstruktur (t.ex. "sv.json" -> "translation" eller "instructors")
    // Om du bara har en fil som heter sv.json brukar namespace vara "translation" eller "common".
    // Här använder jag "instructorTranslation" baserat på din kod, men ändra om det behövs.
    const { t } = useTranslation("instructorTranslation");
    const [isExpanded, setIsExpanded] = useState(false);

    const cardClasses = `
        bg-[#262626] p-6 rounded-2xl shadow-xl border border-orange-500/30 
        transition-all duration-500 ease-in-out hover:shadow-orange-500/30 hover:shadow-2xl 
        transform hover:scale-[1.02] relative flex flex-col h-full
        ${isExpanded ? 'scale-[1.02] z-10' : 'z-0'}
    `;

    return (
        <div className={cardClasses}>

            {/* Bild */}
            <div className="relative w-full h-64 mb-5 overflow-hidden rounded-xl shadow-inner">
                <Image
                    src={instructor.imageSrc}
                    alt={instructor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 hover:scale-110"
                />
            </div>

            {/* Namn & Fokus */}
            <h3 className="text-3xl font-bold mb-2 text-orange-500">{instructor.name}</h3>
            <p className="text-sm italic text-gray-400 mb-4 border-b border-white/10 pb-4">
                <span className="font-semibold text-gray-300 uppercase tracking-wider text-xs">
                    {t('focusLabel', { defaultValue: 'Fokus:' })}
                </span>
                <span className="ml-2">{instructor.focus}</span>
            </p>

            {/* Kort bio */}
            <p className="text-base text-gray-300 mb-4 flex-grow leading-relaxed">
                {instructor.bio}
            </p>

            {/* Expanderat innehåll */}
            <div
                className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${isExpanded ? 'max-h-[1000px] opacity-100 mb-4' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="pt-4 border-t border-orange-500/30 space-y-5 bg-black/20 -mx-2 p-4 rounded-lg mt-2">

                    {/* 🔸 Nivåer / klasser */}
                    {instructor.levels && instructor.levels.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-1">
                                {t('levelsLabel', { defaultValue: 'Undervisar i' })}
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {instructor.levels.map((level, idx) => (
                                    <li key={idx} className="text-sm text-gray-300">
                                        {level}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Erfarenhet */}
                    {instructor.experience && (
                        <div>
                            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-1">
                                {t('experienceLabel', { defaultValue: 'Erfarenhet' })}
                            </h4>
                            <p className="text-sm text-gray-300">{instructor.experience}</p>
                        </div>
                    )}

                    {/* Specialiteter */}
                    {instructor.specialties && instructor.specialties.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-1">
                                {t('specialtiesLabel', { defaultValue: 'Specialiteter' })}
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {instructor.specialties.map((specialty, idx) => (
                                    <li key={idx} className="text-sm text-gray-300">{specialty}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Meriter */}
                    {instructor.achievements && instructor.achievements.length > 0 && (
                        <div>
                            <h4 className="text-sm font-bold text-orange-400 uppercase tracking-widest mb-1">
                                {t('achievementsLabel', { defaultValue: 'Meriter' })}
                            </h4>
                            <ul className="list-disc list-inside space-y-1">
                                {instructor.achievements.map((achievement, idx) => (
                                    <li key={idx} className="text-sm text-gray-300">{achievement}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Läs mer/mindre knapp */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="
                    w-full mt-auto py-3 rounded-xl bg-orange-500 text-white font-bold
                    transition-all duration-300 hover:bg-orange-600 hover:scale-[1.02] hover:shadow-lg
                    flex items-center justify-center gap-2 group
                "
            >
                {isExpanded ? (
                    <>
                        {t('showLess', { defaultValue: 'Visa mindre' })}
                        <FaChevronUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </>
                ) : (
                    <>
                        {t('showMore', { defaultValue: 'Läs mer' })}
                        <FaChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </>
                )}
            </button>

            {/* Star Badge för huvudinstruktörer */}
            {instructor.role === 'main' && (
                <div
                    className="absolute top-4 right-4 bg-orange-500 text-white p-2 rounded-full shadow-lg z-20"
                    title="Huvudinstruktör"
                >
                    <FaStar className="w-4 h-4" />
                </div>
            )}

        </div>
    );
};

export default InstructorCard;