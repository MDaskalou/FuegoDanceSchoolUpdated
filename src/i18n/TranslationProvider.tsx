"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useMemo, useEffect, useState } from "react";
import { createInstance, Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

interface TranslationProviderProps {
    children: ReactNode;
    lang: string;
    namespaces: string[];
    resources: Resource; // Denna saknades i ditt interface
    i18nInstance?: any; // optionally accept a pre-initialized i18n instance from server
}

export default function TranslationProvider({
                                                children,
                                                lang,
                                                namespaces,
                                                resources,
                                                i18nInstance,
                                            }: TranslationProviderProps) {
    // If an initialized i18n instance is provided (from server), use it directly
    if (i18nInstance) {
        return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
    }

    // Skapa en instans som lever under komponentens livstid (memoized)
    const i18n = useMemo(() => {
        const i18nInstanceLocal = createInstance();

        // We don't call .init here synchronously; we'll init in useEffect and track readiness
        i18nInstanceLocal
            .use(initReactI18next)
            .use(
                resourcesToBackend(
                    (language: string, namespace: string) =>
                        import(`../../public/locales/${language}/${namespace}.json`)
                )
            );

        return i18nInstanceLocal;
    }, [/* stable */]);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        i18n
            .init({
                lng: lang,
                resources,
                fallbackLng: "sv",
                supportedLngs: ["sv", "en"],
                defaultNS: namespaces[0],
                fallbackNS: namespaces[0],
                ns: namespaces,
                detection: {
                    caches: [],
                },
            })
            .then(() => {
                if (mounted) setReady(true);
            })
            .catch((err) => {
                console.error("i18n init error:", err);
                if (mounted) setReady(true); // still render (will show keys) but avoid blocking forever
            });

        return () => {
            mounted = false;
        };
    }, [i18n, lang, namespaces, resources]);

    if (!ready) {
        // You can return a loader/skeleton here if desired
        return null;
    }

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}