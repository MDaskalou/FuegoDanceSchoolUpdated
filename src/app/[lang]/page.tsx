import HomePageClient from '@/components/HomePageClient';
import React from 'react';
import initTranslations from '@/i18n';
import TranslationProvider from '@/i18n/TranslationProvider';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

// Expanded namespaces to include all translations used on the homepage
const i18nNamespaces = [
    'common',
    'heroTranslation',
    'aboutTranslation',
    'scheduleTranslation',
    'testimonialsTranslation',
    'footerTranslation',
];

export default async function Home({ params }: { params: { lang: string } }) {
    const { resources } = await initTranslations(params.lang, i18nNamespaces);

    return (
        <TranslationProvider namespaces={i18nNamespaces} resources={resources} lang={params.lang}>
            <HomePageClient params={params} />
        </TranslationProvider>
    );
}
