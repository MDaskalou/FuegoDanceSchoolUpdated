"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useMemo, useEffect } from "react";
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
        i18nInstanceLocal.init({
            lng: lang,
            resources,
            fallbackLng: "sv",
            supportedLngs: ["sv", "en"],
            defaultNS: namespaces[0],
            fallbackNS: namespaces[0],
            ns: namespaces,
            initImmediate: false,
            react: {
                bindI18n: 'languageChanged',
                useSuspense: false,
            },
        });
        return i18nInstanceLocal;
    }, []);

    useEffect(() => {
        const init = async () => {
            Object.entries(resources ?? {}).forEach(([language, languageResources]) => {
                Object.entries(languageResources ?? {}).forEach(([namespace, namespaceResources]) => {
                    i18n.addResourceBundle(language, namespace, namespaceResources, true, true);
                });
            });

            if (i18n.language !== lang) {
                await i18n.changeLanguage(lang);
            }
        };

        init();
    }, [i18n, lang, namespaces, resources]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
