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
    resources: Resource;
    i18nInstance?: any;
}

export default function TranslationProvider({
                                                children,
                                                lang,
                                                namespaces,
                                                resources,
                                                i18nInstance,
                                            }: TranslationProviderProps) {

    // 1. Om en instans skickas med från servern, använd den direkt
    if (i18nInstance) {
        return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
    }

    // 2. Skapa instansen (memoized så den inte skapas om vid varje render)
    const i18n = useMemo(() => {
        const i18nInstanceLocal = createInstance();
        i18nInstanceLocal
            .use(initReactI18next)
            .use(
                resourcesToBackend(
                    (language: string, namespace: string) =>
                        import(`../../public/locales/${language}/${namespace}.json`)
                )
            );
        return i18nInstanceLocal;
    }, []);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            // Om instansen inte är initierad, gör det nu
            if (!i18n.isInitialized) {
                await i18n.init({
                    lng: lang,
                    resources,
                    fallbackLng: "sv",
                    supportedLngs: ["sv", "en"],
                    defaultNS: namespaces[0],
                    fallbackNS: namespaces[0],
                    ns: namespaces,
                    react: {
                        bindI18n: 'languageChanged',
                        useSuspense: false,
                    },
                });
            } else if (i18n.language !== lang) {
                // Om den redan är initierad men språket i URL ändras, byt bara språk
                await i18n.changeLanguage(lang);
            }

            if (mounted) setReady(true);
        };

        init();

        return () => {
            mounted = false;
        };
    }, [i18n, lang, namespaces, resources]);

    // 3. Vänta tills instansen är redo innan vi renderar barnen
    // Annars kommer komponenten krascha eller visa tomma nycklar
    if (!ready) return null;

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}