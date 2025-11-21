// src/i18n/TranslationProvider.tsx
"use client";
import { I18nextProvider } from "react-i18next";
import { ReactNode } from "react";
import i18n, { supportedLngs } from "./config";

interface TranslationProviderProps {
    children: ReactNode;
    lang: string;
}
export default function TranslationProvider({
                                                children,
                                                lang,
                                            }: TranslationProviderProps) {
    if (i18n.language !== lang) {
        if (Object.keys(supportedLngs).includes(lang)) {
            i18n.changeLanguage(lang);
        } else {
            i18n.changeLanguage("sv");
        }
    }
    return (
        <I18nextProvider i18n={i18n} defaultNS={"navbarTranslation"}>
            {children}
        </I18nextProvider>
    );
}