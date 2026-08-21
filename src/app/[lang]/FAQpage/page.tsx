import React from "react";
import FAQPageClient from "@/components/FAQPageClient";

export async function generateStaticParams() {
    return [
        { lang: "sv" },
        { lang: "en" },
    ];
}

export default function FAQPage({ params }: { params: { lang: string } }) {
    return <FAQPageClient params={params} />;
}
