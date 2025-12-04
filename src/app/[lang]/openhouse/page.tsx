import React from 'react';
import OpenHouseForm from '@/components/OpenHouseForm';
import initTranslations from '@/i18n';
import TranslationProvider from '@/i18n/TranslationProvider';

// VIKTIGT: Vi måste ladda 'openhouseTranslation' här
const i18nNamespaces = ['openhouseTranslation', 'common'];

export default async function OpenHousePage({ params: { lang } }: { params: { lang: string } }) {
    // 1. Hämta översättningar på servern
    const { resources } = await initTranslations(lang, i18nNamespaces);

    return (
        // 2. Skicka med dem till TranslationProvider så att OpenHouseForm kan använda dem
        <TranslationProvider namespaces={i18nNamespaces} resources={resources} lang={lang}>
            <OpenHouseForm />
        </TranslationProvider>
    );
}