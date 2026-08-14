import React from "react";
import type { Metadata } from "next";
import initTranslations from "@/i18n";
import TranslationProvider from "@/i18n/TranslationProvider";
import PrivacyPolicyClient from "@/components/PrivacyPolicyClient";

export async function generateStaticParams() {
    return [{ lang: "sv" }, { lang: "en" }];
}

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    const isEnglish = params.lang === "en";
    return {
        title: isEnglish
            ? "Privacy Policy & Cookies"
            : "Integritetspolicy & Cookies",
        description: isEnglish
            ? "How Fuego Dance School handles personal data and cookies."
            : "Information om hur Fuego Dance School hanterar dina personuppgifter och cookies.",
    };
}

const i18nNamespaces = ["privacyPolicyTranslation", "common", "footerTranslation"];

export default async function PrivacyPolicyPage({
    params,
}: {
    params: { lang: string };
}) {
    const { resources } = await initTranslations(params.lang, i18nNamespaces);

    return (
        <TranslationProvider
            namespaces={i18nNamespaces}
            resources={resources}
            lang={params.lang}
        >
            <PrivacyPolicyClient />
        </TranslationProvider>
    );
}
