import React from "react";
import Hero from "@/components/Hero";
import SocialProofStrip from "@/components/SocialProofStrip";
import BootcampFeature from "@/components/BootcampFeature";
import About from "@/components/About";
import ScheduleSection from "@/components/Schedule";
import PriceSection from "@/components/Price";
import FeatureSection from "@/components/FeatureSection";
import EventSection from "@/components/Event";
import TestimonialsSection from "@/components/TestimonialsSection";
import PartnersSection from "@/components/PartnersSection";
import InstagramFeed from "@/components/InstagramFeeds";

export async function generateStaticParams() {
    return [
        { lang: "sv" },
        { lang: "en" },
    ];
}

export default async function Home({ params }: { params: { lang: string } }) {
    const { lang } = params;

    return (
        <>
            <Hero />
            <SocialProofStrip lang={lang} />
            <BootcampFeature />
            <About lang={lang} />
            <ScheduleSection lang={lang} />
            <PriceSection lang={lang} />
            <FeatureSection />
            <EventSection showSeeAllButton lang={lang} />
            <TestimonialsSection lang={lang} />
            <PartnersSection lang={lang} />
            <InstagramFeed />
        </>
    );
}
