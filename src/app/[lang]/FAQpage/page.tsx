// src/app/[lang]/FAQpage/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { IconType } from 'react-icons'; // FIX: IconType
import { FaChevronDown, FaChevronUp, FaPlus, FaMinus } from 'react-icons/fa';

// --- Typdefinitioner ---
interface Question { q: string; a: string; }
interface Category { id: string; title: string; questions: Question[]; }

// --- FAQ Item Component (Individuell fråga) ---
const AccordionItem: React.FC<{ question: Question }> = ({ question }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Klasser för utseende
    const itemClasses = "bg-[#262626] p-4 rounded-lg my-2 transition-all duration-300 shadow-lg";
    const buttonClasses = "flex justify-between items-center w-full text-left";

    return (
        <div className={itemClasses}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={buttonClasses}
                aria-expanded={isOpen}
            >
                <span className="text-base font-medium text-gray-200">{question.q}</span>
                {isOpen ? <FaMinus className="text-orange-500 w-4 h-4 ml-4 flex-shrink-0" /> : <FaPlus className="text-orange-500 w-4 h-4 ml-4 flex-shrink-0" />}
            </button>

            {/* Svarspanel */}
            <div
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 pt-3' : 'max-h-0'
                }`}
                // Lägger till en liten max-höjd för att animera
                style={{ maxHeight: isOpen ? '999px' : '0' }}
            >
                <p className="text-sm text-gray-400 border-t border-white/10 pt-3 mt-3">
                    {question.a}
                </p>
            </div>
        </div>
    );
};


// --- FAQ Category Component (En kategori med frågor) ---
const AccordionCategory: React.FC<{ category: Category }> = ({ category }) => {
    // Öppna den första kategorin som standard
    const [isCategoryOpen, setIsCategoryOpen] = useState(category.id === 'Allmänt'); // Använda strängen för att matcha

    const categoryButtonClasses = "w-full bg-[#262626] p-6 rounded-xl text-left text-xl font-bold transition-colors duration-200 hover:bg-[#311a18] shadow-2xl mb-4";

    return (
        <div className="w-full">
            <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className={categoryButtonClasses}
                aria-controls={`faq-panel-${category.id}`}
                aria-expanded={isCategoryOpen}
            >
                <div className="flex justify-between items-center">
                    <span className="text-gray-100">{category.title}</span>
                    {isCategoryOpen ? <FaChevronUp className="text-orange-500 w-4 h-4" /> : <FaChevronDown className="text-orange-500 w-4 h-4" />}
                </div>
            </button>

            {/* Panel för frågor */}
            <div
                id={`faq-panel-${category.id}`}
                className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
                    isCategoryOpen ? 'max-h-full' : 'max-h-0'
                }`}
                style={{ maxHeight: isCategoryOpen ? '9999px' : '0' }}
            >
                <div className="pl-4 pr-0">
                    {category.questions.map((q, qIndex) => (
                        <AccordionItem key={qIndex} question={q} />
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- Huvudkomponent (FAQ Sida) ---
export default function FAQPage() {
    const { t } = useTranslation("faqTranslation");
    const [isMounted, setIsMounted] = useState(false); // NYTT STATE FÖR HYDRERING

    // Effekt: Fixar Hydration Error
    useEffect(() => {
        // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
        setIsMounted(true);
    }, []);

    // Laddar kategorier från JSON (returnerar en tom array om data saknas)
    const categories: Category[] = t("categories", { returnObjects: true }) as Category[] || [];

    // Rendera tom placeholder under SSR
    if (!isMounted) {
        return <div className="pt-24 pb-16 min-h-screen"></div>;
    }

    // Klientrenderad kod
    return (
        <div className="pt-24 pb-16 bg-transparent min-h-screen text-white">
            <div className="container mx-auto max-w-3xl px-4">

                <h1 className="text-5xl sm:text-6xl font-bold text-center mb-10 pt-8">
                    {t('faqPageTitle', { defaultValue: 'Vanliga frågor' })}
                </h1>

                {/* Vår dynamiska Accordion-struktur */}
                <div className="space-y-4">
                    {/* Använder category.title som id då den är unik i din JSON */}
                    {Array.isArray(categories) && categories.map((category, index) => (
                        <AccordionCategory
                            key={index}
                            category={{ ...category, id: category.title || `cat-${index}` }}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}