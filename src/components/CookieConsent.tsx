"use client";

import React, { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import Link from 'next/link';

export default function CookieConsent() {
    const { t } = useTranslation("cookieTranslation");
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Kolla om användaren redan har accepterat cookies
        const consent = localStorage.getItem('cookieConsent');

        if (!consent) {
            // Vi använder en timer på 0ms för att flytta uppdateringen till nästa "tick".
            // Detta löser ESLint-felet och förhindrar synkrona omrendreringar.
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 0);

            // Rensa timern om komponenten avmonteras
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', 'all');
        setIsVisible(false);
    };

    const handleAcceptNecessary = () => {
        localStorage.setItem('cookieConsent', 'necessary');
        setIsVisible(false);
    };

    const handleCustomize = () => {
        // Här kan du lägga till logik för att öppna en modal med detaljerade inställningar
        console.log('Öppna cookie-inställningar');
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]" />

            {/* Cookie Banner */}
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                {/* Uppdaterad bakgrundsfärg till mörkgrå med orange kant */}
                <div className="bg-[#262626] border border-orange-500/30 max-w-2xl w-full rounded-3xl p-8 sm:p-10 shadow-2xl relative">

                    {/* Logo/Heading */}
                    <div className="text-center mb-6">
                        <h2 className="text-white text-2xl sm:text-3xl font-bold mb-2">
                            {t('consentTitle', { defaultValue: 'Vi hanterar data för din upplevelse' })}
                        </h2>
                        <div className="w-16 h-1 bg-orange-500 mx-auto rounded-full mt-3"></div>
                    </div>

                    {/* Body Text */}
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

                    {/* Policy Link */}
                    <div className="mb-8 text-center sm:text-left">
                        <Link
                            href="/privacy-policy"
                            className="text-orange-400 underline hover:text-orange-300 transition-colors text-sm"
                        >
                            {t('policyLink', { defaultValue: 'Vår policy för kakor och spårningstekniker' })}
                        </Link>
                    </div>

                    {/* Buttons - Uppdaterade till Orange tema */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={handleAcceptNecessary}
                            className="
                                flex-1 bg-transparent border-2 border-gray-500 text-gray-300 font-bold py-3 px-6 rounded-full
                                transition-all duration-300 hover:border-white hover:text-white hover:bg-white/5
                                uppercase text-xs sm:text-sm tracking-wider
                            "
                        >
                            {t('acceptNecessary', { defaultValue: 'Endast nödvändiga' })}
                        </button>

                        <button
                            onClick={handleCustomize}
                            className="
                                flex-1 bg-transparent border-2 border-orange-500 text-orange-500 font-bold py-3 px-6 rounded-full
                                transition-all duration-300 hover:bg-orange-500 hover:text-white
                                uppercase text-xs sm:text-sm tracking-wider
                            "
                        >
                            {t('customize', { defaultValue: 'Anpassa' })}
                        </button>

                        <button
                            onClick={handleAcceptAll}
                            className="
                                flex-1 bg-orange-500 border-2 border-orange-500 text-white font-bold py-3 px-6 rounded-full
                                transition-all duration-300 hover:bg-orange-600 hover:border-orange-600 hover:scale-[1.02] hover:shadow-lg hover:shadow-orange-500/20
                                uppercase text-xs sm:text-sm tracking-wider
                            "
                        >
                            {t('acceptAll', { defaultValue: 'Tillåt alla' })}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}