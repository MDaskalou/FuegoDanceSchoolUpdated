// src/components/Footer.tsx
"use client";

import React from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { FaMapMarkerAlt, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';

export const Footer = () => {
    const { t, i18n } = useTranslation("footerTranslation");
    const currentLang = i18n.language;
    const currentYear = new Date().getFullYear();

    // Notera: Här kan du definiera navigeringslänkar som används i Navbar för enkelhet
    const quickLinks = [
        { href: `#heroreel`, label: t('nav.home', { defaultValue: 'Hem' }) },
        { href: `#schedule`, label: t('nav.schedule', { defaultValue: 'Schema' }) },
        { href: `/courses`, label: t('nav.courses', { defaultValue: 'Kurser' }) },
        { href: `#prices`, label: t('nav.prices', { defaultValue: 'Priser' }) },
        { href: `/instructors`, label: t('nav.instructors', { defaultValue: 'Instruktörer' }) },
        { href: `/FAQpage`, label: t('nav.faq', { defaultValue: 'FAQ' }) },
    ];

    return (
        <footer className="bg-black text-gray-400 border-t border-white/10 pt-16 pb-8">
            <div className="container mx-auto max-w-7xl px-4">

                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-700 pb-12">

                    {/* Kolumn 1: Logotyp & Intro */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-white">
                            {t('footerTitle', { defaultValue: 'Fuego Dance School' })}
                        </h3>
                        <p className="text-sm">
                            {t('footerMotto', { defaultValue: 'Din plats för Bachata, gemenskap och utveckling.' })}
                        </p>
                        <div className="flex space-x-4 pt-2">
                            {/* Sociala medier (Ersätt # med dina riktiga länkar) */}
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram className="w-6 h-6 hover:text-orange-500 transition-colors" />
                            </a>
                            <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                                <FaFacebook className="w-6 h-6 hover:text-orange-500 transition-colors" />
                            </a>
                        </div>
                    </div>

                    {/* Kolumn 2: Snabbnavigering */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">
                            {t('navLinksTitle', { defaultValue: 'Snabbnavigering' })}
                        </h4>
                        <ul className="space-y-2">
                            {quickLinks.map((link, index) => (
                                <li key={index}>
                                    <Link href={`/${currentLang}${link.href}`} className="hover:text-white transition-colors text-sm">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolumn 3: Kontaktinformation */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">
                            {t('contactInfoTitle', { defaultValue: 'Kontakt & Studio' })}
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center">
                                <FaMapMarkerAlt className="w-4 h-4 mr-3 flex-shrink-0 text-orange-500" />
                                <div>
                                    {t('address', { defaultValue: 'Doktor Westrings Gata 14D' })}<br/>
                                    {t('city', { defaultValue: '413 24 Göteborg' })}
                                </div>
                            </li>
                            <li className="flex items-center">
                                <FaEnvelope className="w-4 h-4 mr-3 flex-shrink-0 text-orange-500" />
                                <a href="mailto:info@fuegoschool.se" className="hover:text-white transition-colors">
                                    {t('email', { defaultValue: 'info@fuegoschool.se' })}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Kolumn 4: Bli en del av familjen (Exempel CTA) */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">
                            {t('familyCtaTitle', { defaultValue: 'Bli en del av familjen' })}
                        </h4>
                        <p className="text-sm">
                            {t('familyCtaText', { defaultValue: 'Prenumerera på vårt nyhetsbrev för att få uppdateringar om nya kurser och sociala events.' })}
                        </p>
                        {/* Här skulle ett nyhetsbrevformulär ligga */}
                        <button className="mt-4 bg-orange-500 px-4 py-2 rounded-full text-white font-semibold text-sm hover:bg-orange-600">
                            Prenumerera
                        </button>
                    </div>

                </div>

                {/* Copyright */}
                <div className="text-center pt-8 text-sm text-gray-500">
                    {t('copyright', { year: currentYear, defaultValue: `© ${currentYear} Fuego Dance School. All rights reserved.` })}
                </div>

            </div>
        </footer>
    );
};