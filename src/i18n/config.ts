// src/i18n/config.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";

export const supportedLngs = { sv: "Svenska", en: "English" };

const options = {
    fallbackLng: "sv",
    supportedLngs: Object.keys(supportedLngs),
    defaultNS: "navbarTranslation",
    fallbackNS: "navbarTranslation",

    backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
        requestOptions: {
            cache: "no-store",
        },
    },

    detection: {
        order: ["path"],
        caches: []
    },

    interpolation: {
        escapeValue: false
    },

    react: {
        useSuspense: false,
        bindI18n: 'languageChanged',
        bindI18nStore: 'added removed',
    },

    preload: ["sv", "en"],
};

i18n
    .use(Backend)
    .use(initReactI18next)
    .init(options);

export default i18n;
