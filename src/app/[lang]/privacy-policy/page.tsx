import type { Metadata } from "next";
import PrivacyPolicyClient from "@/components/PrivacyPolicyClient";
import { buildPageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
    return [{ lang: "sv" }, { lang: "en" }];
}

export async function generateMetadata({
    params,
}: {
    params: { lang: string };
}): Promise<Metadata> {
    return buildPageMetadata({
        lang: params.lang,
        pathAfterLang: "privacy-policy",
        title: {
            sv: "Integritetspolicy & Cookies",
            en: "Privacy Policy & Cookies",
        },
        description: {
            sv: "Information om hur Fuego Dance School hanterar dina personuppgifter och cookies.",
            en: "How Fuego Dance School handles personal data and cookies.",
        },
    });
}

export default function PrivacyPolicyPage() {
    return <PrivacyPolicyClient />;
}
