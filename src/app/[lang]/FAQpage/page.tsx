// src/app/[lang]/FAQpage/page.tsx
import React from 'react';

// Vi använder den centrala komponenten i 'components'-mappen
import FAQPageClient from '@/components/FAQPageClient';
import initTranslations from '@/i18n';
import TranslationProvider from '@/i18n/TranslationProvider';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

const i18nNamespaces = ['faqTranslation', 'common', 'footerTranslation'];

export default async function FAQPage({ params }: { params: { lang: string } }) {
    const { resources } = await initTranslations(params.lang, i18nNamespaces);

    return (
        <TranslationProvider namespaces={i18nNamespaces} resources={resources} lang={params.lang}>
            <FAQPageClient params={params} />
        </TranslationProvider>
    );
}