"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

declare global {
    interface Window {
        dataLayer: any[];
        gtag: (...args: any[]) => void;
    }
}

export const OPEN_COOKIE_SETTINGS_EVENT = "open-cookie-settings";

export type CookiePreferences = {
    analytics: boolean;
    marketing: boolean;
};

export type ConsentLevel = "all" | "necessary" | "custom";

const CONSENT_KEY = "cookieConsent";
const PREFERENCES_KEY = "cookiePreferences";

const defaultPreferences: CookiePreferences = {
    analytics: false,
    marketing: false,
};

export function openCookieSettings() {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT));
}

const readStoredPreferences = (): CookiePreferences => {
    try {
        const raw = localStorage.getItem(PREFERENCES_KEY);
        if (!raw) return { ...defaultPreferences };
        const parsed = JSON.parse(raw) as Partial<CookiePreferences>;
        return {
            analytics: Boolean(parsed.analytics),
            marketing: Boolean(parsed.marketing),
        };
    } catch {
        return { ...defaultPreferences };
    }
};

const preferencesFromLevel = (level: ConsentLevel): CookiePreferences => {
    if (level === "all") return { analytics: true, marketing: true };
    if (level === "necessary") return { analytics: false, marketing: false };
    return readStoredPreferences();
};

const updateGtm = (
    adState: "granted" | "denied",
    analyticsState: "granted" | "denied"
) => {
    const gtag =
        window.gtag ||
        function (...args: any[]) {
            (window.dataLayer = window.dataLayer || []).push(args);
        };

    gtag("consent", "update", {
        ad_storage: adState,
        analytics_storage: analyticsState,
        ad_user_data: adState,
        ad_personalization: adState,
        personalization_storage: analyticsState,
        functionality_storage: "granted",
        security_storage: "granted",
    });

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "consent_update" });
};

const applyPreferencesToGtm = (preferences: CookiePreferences) => {
    updateGtm(
        preferences.marketing ? "granted" : "denied",
        preferences.analytics ? "granted" : "denied"
    );
};

const persistConsent = (level: ConsentLevel, preferences: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, level);
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

export default function CookieConsent() {
    const { t, i18n } = useTranslation("cookieTranslation");
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

    const restoreConsent = useCallback(() => {
        const consent = localStorage.getItem(CONSENT_KEY) as ConsentLevel | null;
        if (!consent) return false;

        const nextPreferences = preferencesFromLevel(consent);
        setPreferences(nextPreferences);
        applyPreferencesToGtm(nextPreferences);
        return true;
    }, []);

    const openSettings = useCallback(() => {
        const consent = localStorage.getItem(CONSENT_KEY) as ConsentLevel | null;
        const nextPreferences = consent
            ? preferencesFromLevel(consent)
            : { ...defaultPreferences };
        setPreferences(nextPreferences);
        setShowDetails(true);
        setIsVisible(true);
    }, []);

    useEffect(() => {
        const consent = localStorage.getItem(CONSENT_KEY);

        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 0);
            return () => clearTimeout(timer);
        }

        restoreConsent();
    }, [restoreConsent]);

    useEffect(() => {
        const handler = () => openSettings();
        window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, handler);
        return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, handler);
    }, [openSettings]);

    const togglePreference = (key: keyof CookiePreferences) => {
        setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const handleAcceptAll = () => {
        const next = { analytics: true, marketing: true };
        applyPreferencesToGtm(next);
        persistConsent("all", next);
        setPreferences(next);
        setIsVisible(false);
        setShowDetails(false);
    };

    const handleAcceptNecessary = () => {
        const next = { analytics: false, marketing: false };
        applyPreferencesToGtm(next);
        persistConsent("necessary", next);
        setPreferences(next);
        setIsVisible(false);
        setShowDetails(false);
    };

    const handleSaveCustom = () => {
        applyPreferencesToGtm(preferences);
        persistConsent("custom", preferences);
        setIsVisible(false);
        setShowDetails(false);
    };

    const lang = i18n.language?.startsWith("en") ? "en" : "sv";

    if (!isVisible) return null;

    return (
        <>
            <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm" />

            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                <div className="relative w-full max-w-2xl rounded-3xl border border-orange-500/30 bg-[#262626] p-8 shadow-2xl sm:p-10">
                    <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
                            {showDetails ? t("customizeTitle") : t("consentTitle")}
                        </h2>
                        <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-orange-500" />
                    </div>

                    {!showDetails ? (
                        <>
                            <div className="mb-8 space-y-4 text-sm leading-relaxed text-gray-300 sm:text-base">
                                <p>{t("consentDescription1")}</p>
                                <p>{t("consentDescription2")}</p>
                                <p className="mt-2 text-xs italic text-gray-400">
                                    {t("consentDescription3")}
                                </p>
                            </div>

                            <div className="mb-8 text-center sm:text-left">
                                <Link
                                    href={`/${lang}/privacy-policy/`}
                                    className="text-sm text-orange-400 underline transition-colors hover:text-orange-300"
                                >
                                    {t("policyLink")}
                                </Link>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                                <button
                                    onClick={handleAcceptNecessary}
                                    className="flex-1 rounded-full border-2 border-gray-500 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-gray-300 transition-all hover:border-white hover:bg-white/5 hover:text-white sm:text-sm"
                                >
                                    {t("acceptNecessary")}
                                </button>

                                <button
                                    onClick={() => setShowDetails(true)}
                                    className="flex-1 rounded-full border-2 border-orange-500 bg-transparent px-6 py-3 text-xs font-bold uppercase tracking-wider text-orange-500 transition-all hover:bg-orange-500 hover:text-white sm:text-sm"
                                >
                                    {t("customize")}
                                </button>

                                <button
                                    onClick={handleAcceptAll}
                                    className="flex-1 rounded-full border-2 border-orange-500 bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02] hover:bg-orange-600 sm:text-sm"
                                >
                                    {t("acceptAll")}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between rounded-xl border border-gray-700 bg-white/5 p-4">
                                    <div>
                                        <h3 className="text-sm font-bold text-white">
                                            {t("necessaryTitle")}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {t("necessaryDescription")}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked
                                        disabled
                                        className="h-5 w-5 cursor-not-allowed accent-gray-500"
                                    />
                                </div>

                                <div
                                    className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-600 bg-white/5 p-4 transition-colors hover:border-orange-500/50"
                                    onClick={() => togglePreference("analytics")}
                                >
                                    <div>
                                        <h3 className="text-sm font-bold text-white">
                                            {t("analyticsTitle")}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {t("analyticsDescription")}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.analytics}
                                        onChange={() => togglePreference("analytics")}
                                        className="h-5 w-5 cursor-pointer accent-orange-500"
                                    />
                                </div>

                                <div
                                    className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-600 bg-white/5 p-4 transition-colors hover:border-orange-500/50"
                                    onClick={() => togglePreference("marketing")}
                                >
                                    <div>
                                        <h3 className="text-sm font-bold text-white">
                                            {t("marketingTitle")}
                                        </h3>
                                        <p className="text-xs text-gray-400">
                                            {t("marketingDescription")}
                                        </p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={preferences.marketing}
                                        onChange={() => togglePreference("marketing")}
                                        className="h-5 w-5 cursor-pointer accent-orange-500"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                                <button
                                    onClick={() => setShowDetails(false)}
                                    className="px-6 py-3 text-sm font-semibold text-gray-400 transition-colors hover:text-white"
                                >
                                    {t("back")}
                                </button>
                                <button
                                    onClick={handleSaveCustom}
                                    className="flex-1 rounded-full border-2 border-orange-500 bg-orange-500 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:scale-[1.02] hover:bg-orange-600 sm:text-sm"
                                >
                                    {t("savePreferences")}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
