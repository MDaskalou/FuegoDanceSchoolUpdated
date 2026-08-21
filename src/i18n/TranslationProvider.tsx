"use client";

import { I18nextProvider } from "react-i18next";
import { ReactNode, useEffect, useMemo } from "react";
import { createInstance, Resource } from "i18next";
import { initReactI18next } from "react-i18next";
import resourcesToBackend from "i18next-resources-to-backend";

interface TranslationProviderProps {
    children: ReactNode;
    lang: string;
    namespaces: readonly string[];
    resources: Resource;
}

export default function TranslationProvider({
    children,
    lang,
    namespaces,
    resources,
}: TranslationProviderProps) {
    const defaultNS = namespaces[0] ?? "navbarTranslation";

    const i18n = useMemo(() => {
        const instance = createInstance();
        instance.use(initReactI18next);

        // Prefer preloaded resources from the server; keep backend as fallback for missing ns
        if (!resources) {
            instance.use(
                resourcesToBackend(
                    (language: string, namespace: string) =>
                        import(`../../public/locales/${language}/${namespace}.json`)
                )
            );
        }

        instance.init({
            lng: lang,
            resources,
            fallbackLng: "sv",
            supportedLngs: ["sv", "en"],
            defaultNS,
            fallbackNS: defaultNS,
            ns: [...namespaces],
            initImmediate: true,
            react: {
                bindI18n: "languageChanged",
                useSuspense: false,
            },
        });
        return instance;
        // Intentionally create once per mount; language/resources synced in useEffect
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        Object.entries(resources ?? {}).forEach(([language, languageResources]) => {
            Object.entries(languageResources ?? {}).forEach(([namespace, namespaceResources]) => {
                i18n.addResourceBundle(language, namespace, namespaceResources, false, true);
            });
        });

        if (i18n.language !== lang) {
            void i18n.changeLanguage(lang);
        }
    }, [i18n, lang, resources]);

    return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
