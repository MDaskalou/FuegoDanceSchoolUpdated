import { createInstance, type i18n as I18nInstance } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import resourcesToBackend from "i18next-resources-to-backend";

/** All namespaces used by client components under the layout TranslationProvider */
export const APP_NAMESPACES = [
    "navbarTranslation",
    "footerTranslation",
    "bookingCompleteTranslation",
    "cookieTranslation",
    "aboutTranslation",
    "openhouseTranslation",
    "heroTranslation",
    "eventTranslation",
    "instructorTranslation",
    "faqTranslation",
    "valuesTranslation",
    "privacyPolicyTranslation",
    "courselyWidgetTranslation",
] as const;

export type AppNamespace = (typeof APP_NAMESPACES)[number];

const fallbackLng = "sv";
const supportedLngs = ["sv", "en"];

const loadResources = resourcesToBackend(
    (language: string, namespace: string) =>
        import(`../public/locales/${language}/${namespace}.json`)
);

export default async function initTranslations(
    locale: string,
    namespaces: readonly string[],
    i18nInstance?: I18nInstance,
    resources?: Record<string, unknown>
) {
    i18nInstance = i18nInstance || createInstance();

    i18nInstance.use(initReactI18next);

    if (!resources) {
        i18nInstance.use(loadResources);
    }

    const defaultNS = namespaces[0] ?? "navbarTranslation";

    await i18nInstance.init({
        lng: locale,
        resources: resources as never,
        fallbackLng,
        supportedLngs,
        defaultNS,
        fallbackNS: defaultNS,
        ns: [...namespaces],
        preload: resources ? [] : [locale],
    });

    return {
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
        t: i18nInstance.t,
    };
}

/** Server-only translator — does not touch react-i18next global bindings */
export async function getServerT(locale: string, namespace: string) {
    const instance = createInstance();
    instance.use(loadResources);

    await instance.init({
        lng: locale,
        fallbackLng,
        supportedLngs,
        defaultNS: namespace,
        fallbackNS: namespace,
        ns: [namespace],
        initImmediate: false,
    });

    return instance.getFixedT(locale, namespace);
}
