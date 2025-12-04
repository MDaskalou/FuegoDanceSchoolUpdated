import ValuesPageClient from '@/components/ValuesPageClient';
import React from 'react';
import initTranslations from '@/i18n';
import TranslationProvider from '@/i18n/TranslationProvider';

export async function generateStaticParams() {
    return [
        { lang: 'sv' },
        { lang: 'en' },
    ];
}

const i18nNamespaces = ['valuesTranslation', 'common', 'footerTranslation'];

export default async function ValuesPage({ params }: { params: { lang: string } }) {
    const { resources } = await initTranslations(params.lang, i18nNamespaces);

    return (
        <TranslationProvider namespaces={i18nNamespaces} resources={resources} lang={params.lang}>
            <ValuesPageClient params={params} />
        </TranslationProvider>
    );
}