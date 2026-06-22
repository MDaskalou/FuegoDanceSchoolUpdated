"use client";

import React, { FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { FaMapMarkerAlt, FaEnvelope, FaInstagram, FaFacebook } from 'react-icons/fa';

export const Footer = () => {
    const { t, i18n } = useTranslation("footerTranslation");
    const currentLang = i18n.language;
    const currentYear = new Date().getFullYear();
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubscribe = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus("loading");

        try {
            const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    language: currentLang,
                    source: "footer",
                }),
            });

            if (!response.ok) {
                throw new Error("Newsletter signup failed");
            }

            setEmail("");
            setStatus("success");
        } catch {
            setStatus("error");
        }
    };

    // Uppdaterade länkar för att matcha din sajtstruktur
    const quickLinks = [
        { href: `/`, label: t('nav.home', { defaultValue: 'Hem' }) },
        { href: `/#schedule`, label: t('nav.schedule', { defaultValue: 'Schema' }) }, // Antar ankarlänk på startsidan
        { href: `/courses`, label: t('nav.courses', { defaultValue: 'Kurser' }) },
        { href: `/#prices`, label: t('nav.prices', { defaultValue: 'Priser' }) }, // Antar ankarlänk på startsidan
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
                            {/* Sociala medier */}
                            <a href="https://www.instagram.com/fuegodanceschool/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram className="w-6 h-6 hover:text-orange-500 transition-colors" />
                            </a>
                            <a href="https://www.facebook.com/fuegodschool" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
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
                                    {/* Notera: Om länken börjar med /#, använd bara länken. Annars lägg till språk-prefix. */}
                                    <Link
                                        href={link.href.startsWith('/#') || link.href === '/' ? `/${currentLang}${link.href === '/' ? '' : link.href}` : `/${currentLang}${link.href}`}
                                        className="hover:text-white transition-colors text-sm"
                                    >
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
                                <a href="mailto:info@fuegodanceschool.se" className="hover:text-white transition-colors">
                                    {t('email', { defaultValue: 'info@fuegodanceschool.se' })}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Kolumn 4: Bli en del av familjen (CTA) */}
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-white">
                            {t('familyCtaTitle', { defaultValue: 'Bli en del av familjen' })}
                        </h4>
                        <p className="text-sm">
                            {t('familyCtaText', { defaultValue: 'Prenumerera på vårt nyhetsbrev för att få uppdateringar om nya kurser och sociala events.' })}
                        </p>
                        <form onSubmit={handleSubscribe} className="mt-4 space-y-3">
                            <label htmlFor="newsletter-email" className="sr-only">
                                {t('newsletterEmailLabel', { defaultValue: 'E-postadress' })}
                            </label>
                            <div className="flex flex-col gap-2 sm:flex-row md:flex-col lg:flex-row">
                                <input
                                    id="newsletter-email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    placeholder={t('newsletterEmailPlaceholder', { defaultValue: 'Din e-postadress' })}
                                    className="min-w-0 flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-orange-500"
                                />
                                <button
                                    type="submit"
                                    disabled={status === "loading"}
                                    className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {status === "loading"
                                        ? t('subscribeLoading', { defaultValue: 'Skickar...' })
                                        : t('subscribeButton', { defaultValue: 'Prenumerera' })}
                                </button>
                            </div>
                            <p className="text-xs text-gray-500">
                                {t('newsletterConsent', { defaultValue: 'Du kan avregistrera dig när som helst.' })}
                            </p>
                            {status === "success" && (
                                <p className="text-sm font-medium text-green-400">
                                    {t('subscribeSuccess', { defaultValue: 'Tack! Du är nu med på listan.' })}
                                </p>
                            )}
                            {status === "error" && (
                                <p className="text-sm font-medium text-red-400">
                                    {t('subscribeError', { defaultValue: 'Något gick fel. Försök igen om en stund.' })}
                                </p>
                            )}
                        </form>
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
