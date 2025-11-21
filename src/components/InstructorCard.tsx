// src/components/InstructorCard.tsx
"use client";

import React from 'react';
import Image from 'next/image';
import { useTranslation } from "react-i18next";
import { FaHeart, FaStar } from 'react-icons/fa'; // Ikoner

// --- Typdefinitioner ---
interface Instructor {
    id: number;
    name: string;
    focus: string; // T.ex. Bachata Sensual, Body Movement
    bio: string;
    imageSrc: string; // Sökväg till bild
}

interface InstructorCardProps {
    instructor: Instructor;
    index: number;
}

const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, index }) => {
    // VIKTIGT: Använd rätt namespace
    const { t } = useTranslation("instructorTranslation");

    // Klassen för det yttre kortet: mörk bakgrund, orange border/shadow och hover-effekt
    const cardClasses = `
        bg-[#262626] p-6 rounded-2xl shadow-xl border border-orange-500/30 
        transition-all duration-300 ease-in-out hover:shadow-orange-500/30 hover:shadow-2xl 
        transform hover:scale-[1.02] relative
    `;

    return (
        <div className={cardClasses}>

            {/* Bild */}
            <div className="relative w-full h-64 mb-4 overflow-hidden rounded-xl">
                <Image
                    src={instructor.imageSrc}
                    alt={instructor.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    // object-top är bra för porträttbilder så att ansiktet syns
                    className="object-cover object-top"
                />
            </div>

            {/* Namn & Fokus */}
            <h3 className="text-3xl font-bold mb-1 text-orange-500">{instructor.name}</h3>
            <p className="text-sm italic text-gray-400 mb-4">
                {/* Anta att du har nyckeln 'focusLabel' i din JSON */}
                <span className="font-semibold text-gray-300">
                    {t('focusLabel', { defaultValue: 'Fokus:' })} {instructor.focus}
                </span>
            </p>

            {/* Bio */}
            <p className="text-base text-gray-300 mb-4">{instructor.bio}</p>

            {/* Badge (Exempelvis en "Star Instructor" tagg) */}
            <div className="absolute top-8 right-8 bg-orange-500 text-white p-2 rounded-full shadow-lg">
                <FaStar className="w-4 h-4" />
            </div>

        </div>
    );
};

export default InstructorCard;