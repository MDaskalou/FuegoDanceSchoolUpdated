"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Link from 'next/link';

// Typ-definitioner för TypeScript
declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export default function CookieConsent() {
    const { t } = useTranslation("cookieTranslation");
    const [isVisible, setIsVisible] = useState(false);

    // State för att visa detaljvyn (Anpassa)
    const [showDetails, setShowDetails] = useState(false);

    // State för användarens val (checkboxar)
    const [preferences, setPreferences] = useState({
        analytics: false,
        marketing: false
    });

    useEffect(() => {
        const gtag = window.gtag || function(...args: any[]){ (window.dataLayer = window.dataLayer || []).push(args); };
        const consent = localStorage.getItem('cookieConsent');

        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 0);
            return () => clearTimeout(timer);
        } else {
            // Återställ consent vid sidladdning baserat på sparad nivå
            if (consent === 'all') {
                gtag('consent', 'update', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted',
                    'personalization_storage': 'granted'
                });
            } else if (consent === 'necessary') {
                gtag('consent', 'update', {
                    'ad_storage': 'denied',
                    'analytics_storage': 'denied',
                    'ad_user_data': 'denied',
                    'ad_personalization': 'denied',
                    'personalization_storage': 'denied'
                });
            } else if (consent === 'custom') {
                // Här kan man bygga ut logik för att läsa specifika sparade val från localStorage
                // För säkerhets skull sätter vi 'denied' som default om ingen specifik logik finns
            }
        }
    }, []);

    // Hantera checkbox-klick
    const togglePreference = (key: keyof typeof preferences) => {
        setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAcceptAll = () => {
        updateGtm('granted', 'granted');
        localStorage.setItem('cookieConsent', 'all');
        setIsVisible(false);
    };

    const handleAcceptNecessary = () => {
        updateGtm('denied', 'denied');
        localStorage.setItem('cookieConsent', 'necessary');
        setIsVisible(false);
    };

    const handleSaveCustom = () => {
        // Mappar checkboxar till GTM-signaler
        const adState = preferences.marketing ? 'granted' : 'denied';
        const analyticsState = preferences.analytics ? 'granted' : 'denied';

        updateGtm(adState, analyticsState);
        localStorage.setItem('cookieConsent', 'custom');
        setIsVisible(false);
    };

    // Hjälpfunktion för att skicka till GTM
    const updateGtm = (adState: 'granted' | 'denied', analyticsState: 'granted' | 'denied') => {
        const gtag = window.gtag || function(...args: any[]){ (window.dataLayer = window.dataLayer || []).push(args); };

        gtag('consent', 'update', {
            'ad_storage': adState,
            'analytics_storage': analyticsState,
            'ad_user_data': adState,
            'ad_personalization': adState,
            'personalization_storage': analyticsState,
            'functionality_storage': 'granted', // Alltid granted för att sidan ska funka
            'security_storage': 'granted'
        });

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: 'consent_update' });
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]" />

            {/* Modal Container */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="bg-[#262626] border border-orange-500/30 max-w-2xl w-full rounded-3xl p-8 sm:p-10 shadow-2xl relative">

                    {/* --- HEADER --- */}
                    <div className="text-center mb-6">
                        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                            {showDetails
                                ? t('customizeTitle', { defaultValue: 'Anpassa dina val' })
                                : t('consentTitle', { defaultValue: 'Vi hanterar data för din upplevelse' })
                            }
                        </h2>
                        <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-3"></div>
                    </div>

                    {/* --- VY 1: STANDARDSIDAN --- */}
                    {!showDetails ? (
                        <>
                            {/* Textinnehåll från din bild */}
                            <div className="text-gray-300 text-sm sm:text-base leading-relaxed space-y-4 mb-8">
                                <p>
                                    {t('consentDescription1', {
                                        defaultValue: 'Viss datahantering är nödvändig för att säkerställa att vår tjänst fungerar, vilket innebär att vi använder spårningstekniker såsom cookies. Du kan välja att tillåta ytterligare datahantering som används för att förbättra tjänsten med mer relevant innehåll, anpassad efter dig.'
                                    })}
                                </p>
                                <p>
                                    {t('consentDescription2', {
                                        defaultValue: 'Utöver detta kan du välja att tillåta datahantering av partners som vi samarbetar med.'
                                    })}
                                </p>
                                <p className="text-gray-400 text-xs italic mt-2">
                                    {t('consentDescription3', {
                                        defaultValue: 'Du har möjlighet att när som helst ändra eller återkalla ditt medgivande. Detta gör du under Inställningar i tjänsten.'
                                    })}
                                </p>
                            </div>

                            {/* Länk till policy */}
                            <div className="mb-8 text-center sm:text-left">
                                <Link
                                    href="/privacy-policy"
                                    className="text-orange-400 underline hover:text-orange-300 transition-colors text-sm"
                                >
                                    {t('policyLink', { defaultValue: 'Vår policy för kakor och spårningstekniker' })}
                                </Link>
                            </div>

                            {/* Knappar */}
                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                <button
                                    onClick={handleAcceptNecessary}
                                    className="flex-1 bg-transparent border-2 border-gray-500 text-gray-300 font-bold py-3 px-6 rounded-full hover:border-white hover:text-white hover:bg-white/5 uppercase text-xs sm:text-sm tracking-wider transition-all"
                                >
                                    {t('acceptNecessary', { defaultValue: 'Endast nödvändiga' })}
                                </button>

                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="flex-1 bg-transparent border-2 border-orange-500 text-orange-500 font-bold py-3 px-6 rounded-full hover:bg-orange-500 hover:text-white uppercase text-xs sm:text-sm tracking-wider transition-all"
                                >
                                    {t('customize', { defaultValue: 'Anpassa' })}
                                </button>

                                <button
                                    onClick={handleAcceptAll}
                                    className="flex-1 bg-orange-500 border-2 border-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 hover:scale-[1.02] uppercase text-xs sm:text-sm tracking-wider transition-all"
                                >
                                    {t('acceptAll', { defaultValue: 'Tillåt alla' })}
                                </button>
                            </div>
                        </>
                    ) : (

                        /* --- VY 2: ANPASSA-SIDAN --- */
                        <div className="space-y-6">
                            <div className="space-y-4">
                                {/* Option 1: Nödvändiga */}
                                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-gray-700">
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Nödvändiga</h3>
                                        <p className="text-gray-400 text-xs">Krävs för att sidan ska fungera.</p>
                                    </div>
                                    <input type="checkbox" checked disabled className="w-5 h-5 accent-gray-500 cursor-not-allowed" />
                                </div>

                                {/* Option 2: Analys */}
                                <div
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-gray-600 hover:border-orange-500/50 transition-colors cursor-pointer"
                                    onClick={() => togglePreference('analytics')}
                                >
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Analys & Statistik</h3>
                                        <p className="text-gray-400 text-xs">Hjälper oss förbättra upplevelsen.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={() => togglePreference('analytics')}
                                        className="w-5 h-5 accent-orange-500 cursor-pointer"
                                    />
                                </div>

                                {/* Option 3: Marknadsföring */}
                                <div
                                    className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-gray-600 hover:border-orange-500/50 transition-colors cursor-pointer"
                                    onClick={() => togglePreference('marketing')}
                                >
                                    <div>
                                        <h3 className="text-white font-bold text-sm">Marknadsföring</h3>
                                        <p className="text-gray-400 text-xs">För relevant annonsering.</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={() => togglePreference('marketing')}
                                        className="w-5 h-5 accent-orange-500 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-6 py-3 text-gray-400 hover:text-white font-semibold text-sm transition-colors"
                                >
                                    {t('back', { defaultValue: 'Tillbaka' })}
                                </button>
                                <button
                                    onClick={handleSaveCustom}
                                    className="flex-1 bg-orange-500 border-2 border-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 hover:scale-[1.02] uppercase text-xs sm:text-sm tracking-wider transition-all"
                                >
                                    {t('savePreferences', { defaultValue: 'Spara mina val' })}
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}