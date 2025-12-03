// src/i18n/TranslationProvider.tsx
"use client";
import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect, useState } from "react";
import i18n, { supportedLngs } from "./config";

interface TranslationProviderProps {
    children: ReactNode;
    lang: string;
}

export default function TranslationProvider({
                                                children,
                                                lang,
                                            }: TranslationProviderProps) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        const initLanguage = async () => {
            try {
                const targetLang = Object.keys(supportedLngs).includes(lang) ? lang : "sv";

                if (!i18n.isInitialized) {
                    await new Promise((resolve) => {
                        i18n.on('initialized', resolve);
                    });
                }

                if (i18n.language !== targetLang) {
                    await i18n.changeLanguage(targetLang);
                }

                if (!i18n.hasResourceBundle(targetLang, 'navbarTranslation')) {
                    await i18n.loadNamespaces(['navbarTranslation']);
                }

                setIsReady(true);
            } catch (error) {
                console.error('Error initializing i18n:', error);
                setIsReady(true);
            }
        };

        initLanguage();
    }, [lang]);


    return (
        <I18nextProvider i18n={i18n} defaultNS={"navbarTranslation"}>
            {children}
        </I18nextProvider>
    );
}