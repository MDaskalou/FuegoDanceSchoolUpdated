"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { FaChevronDown, FaPlus, FaMinus } from 'react-icons/fa';

// --- Typdefinitioner ---
interface Question { q: string; a: string; }
interface Category { id: string; title: string; questions: Question[]; }

// Vi behåller interfacet ifall det behövs för importer, men vi använder det inte i funktionen nedan för att slippa ESLint-varningar
export interface FAQPageClientProps {
    params: { lang: string };
}

// --- FAQ Item Component (Individuell fråga) ---
const AccordionItem: React.FC<{ question: Question }> = ({ question }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`
            border-b border-white/5 last:border-0 
            transition-colors duration-300
            ${isOpen ? 'bg-white/5' : 'hover:bg-white/[0.02]'}
        `}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full text-left p-5 focus:outline-none group"
                aria-expanded={isOpen}
            >
                <span className={`
                    text-base font-medium transition-colors duration-300 pr-4
                    ${isOpen ? 'text-orange-500' : 'text-gray-200 group-hover:text-white'}
                `}>
                    {question.q}
                </span>

                {/* Ikon-container */}
                <div className={`
                    flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border border-white/10
                    transition-all duration-300
                    ${isOpen ? 'bg-orange-500 border-orange-500 rotate-180' : 'group-hover:border-orange-500'}
                `}>
                    {isOpen ? (
                        <FaMinus className="text-white w-3 h-3" />
                    ) : (
                        <FaPlus className="text-orange-500 w-3 h-3 group-hover:text-orange-300" />
                    )}
                </div>
            </button>

            {/* Svarspanel */}
            <div
                className={`overflow-hidden transition-[max-height, opacity] duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <div className="px-5 pb-6 pt-0 text-sm sm:text-base text-gray-400 leading-relaxed">
                    {question.a}
                </div>
            </div>
        </div>
    );
};


// --- FAQ Category Component (En kategori med frågor) ---
const AccordionCategory: React.FC<{ category: Category; defaultOpen?: boolean }> = ({ category, defaultOpen = false }) => {
    const [isCategoryOpen, setIsCategoryOpen] = useState(defaultOpen);

    return (
        <div className="w-full mb-6 rounded-2xl bg-[#262626] border border-white/5 shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-orange-500/20">
            <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="w-full p-6 flex justify-between items-center text-left focus:outline-none group bg-gradient-to-r from-[#262626] to-[#2a2a2a]"
                aria-controls={`faq-panel-${category.id}`}
                aria-expanded={isCategoryOpen}
            >
                <span className="text-xl sm:text-2xl font-bold text-white tracking-wide group-hover:text-orange-500 transition-colors">
                    {category.title}
                </span>

                {/* Roterande Chevron */}
                <FaChevronDown
                    className={`
                        w-5 h-5 text-orange-500 transition-transform duration-500
                        ${isCategoryOpen ? 'rotate-180' : 'rotate-0 group-hover:translate-y-1'}
                    `}
                />
            </button>

            {/* Panel för frågor */}
            <div
                id={`faq-panel-${category.id}`}
                className={`overflow-hidden transition-[max-height] duration-700 ease-in-out ${
                    isCategoryOpen ? 'max-h-[2000px]' : 'max-h-0'
                }`}
            >
                <div className="bg-[#1f1f1f] border-t border-white/5">
                    {category.questions.map((q, qIndex) => (
                        <AccordionItem key={qIndex} question={q} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Huvudkomponent (Client) ---
// FIX: Tog bort { params } från argumenten eftersom den inte användes (löser ESLint-felet "unused var")
export default function FAQPageClient({params}:FAQPageClientProps){
    const { t } = useTranslation("faqTranslation");
    const [isMounted, setIsMounted] = useState(false);
    const { lang } = params;


    useEffect(() => {
        // FIX: Använder setTimeout(0) för att undvika "synchronous state update"-felet
        const timer = setTimeout(() => {
            setIsMounted(true);
        }, 0);
        return () => clearTimeout(timer);
    }, []);

    const categories: Category[] = t("categories", { returnObjects: true }) as Category[] || [];

    if (!isMounted) {
        return <div className="pt-24 pb-16 min-h-screen"></div>;
    }

    return (
        <div className="pt-24 pb-16 bg-transparent min-h-screen text-white">
            <div className="container mx-auto max-w-3xl px-4">

                <div className="text-center mb-12 pt-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
                        {t('faqPageTitle', { defaultValue: 'Vanliga frågor' })}
                    </h1>
                    <div className="w-24 h-1 bg-orange-500 mx-auto rounded-full"></div>
                </div>

                <div className="space-y-2">
                    {Array.isArray(categories) && categories.map((category, index) => (
                        <AccordionCategory
                            key={index}
                            // Skapar ett ID baserat på titeln för att undvika Hydration Error
                            category={{ ...category, id: category.title.replace(/\s/g, "") }}
                            // Öppnar alltid den första kategorin i listan automatiskt
                            defaultOpen={index === 0}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}