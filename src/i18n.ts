import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { i18n as i18nConfig } from 'i18next';

const i18nOptions = {
    defaultNS: 'common',
    fallbackLng: 'sv',
    supportedLngs: ['sv', 'en'],
};

export default async function initTranslations(
    locale: string,
    namespaces: string[],
    i18nInstance?: i18nConfig,
    resources?: any
) {
    i18nInstance = i18nInstance || createInstance();

    i18nInstance.use(initReactI18next);

    if (!resources) {
        i18nInstance.use(
            resourcesToBackend(
                (language: string, namespace: string) =>
                    // FIX: Ändrat från ../../ till ../ eftersom filen ligger i src/
                    import(`../public/locales/${language}/${namespace}.json`)
            )
        );
    }

    await i18nInstance.init({
        lng: locale,
        resources,
        fallbackLng: i18nOptions.fallbackLng,
        supportedLngs: i18nOptions.supportedLngs,
        defaultNS: i18nOptions.defaultNS,
        fallbackNS: i18nOptions.defaultNS,
        ns: namespaces,
        preload: resources ? [] : [locale],
    });

    return {
        i18n: i18nInstance,
        resources: i18nInstance.services.resourceStore.data,
        t: i18nInstance.t,
    };
}