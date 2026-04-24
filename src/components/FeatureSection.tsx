"use client";

import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2, Clock, Users, Flame } from "lucide-react";

// --- Konstanter utanför komponenten ---
const EVENT_LINKS = {
    guidedSocial: "https://app.coursely.se/checkout/FuegoDance/dropinPackages?fbclid=IwY2xjawRYMuFleHRuA2FlbQIxMABicmlkETAxR1FGNFV6OEoxWVZmbWx5c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHl6KcdHom_zZTHeZeDbXEY5mJ0B6Pxm7LnarBTIqhTC0VdZkBggaJxgnHRjp_aem_sjvSi_YlL3bxy-d288QDfw",
    sundayFunday: "https://app.coursely.se/checkout/FuegoDance/dropinPackages?fbclid=IwY2xjawRYMuFleHRuA2FlbQIxMABicmlkETAxR1FGNFV6OEoxWVZmbWx5c3J0YwZhcHBfaWQQMjIyMDM5MTc4ODIwMDg5MgABHl6KcdHom_zZTHeZeDbXEY5mJ0B6Pxm7LnarBTIqhTC0VdZkBggaJxgnHRjp_aem_sjvSi_YlL3bxy-d288QDfw"
} as const;

interface Props {
    id?: string;
    showSeeAllButton?: boolean;
}

// --- Återanvändbar EventCard-komponent ---
interface EventCardProps {
    imageSrc: string;
    imageAlt: string;
    badgeText: string;
    badgeColor: string;
    title: string;
    subtitle: string;
    accentColor: string;
    children: React.ReactNode;
    ctaHref: string;
    ctaText: string;
    ctaVariant?: 'solid' | 'outline';
    decorativeIcon?: React.ReactNode;
}

const EventCard: React.FC<EventCardProps> = ({
                                                 imageSrc,
                                                 imageAlt,
                                                 badgeText,
                                                 badgeColor,
                                                 title,
                                                 subtitle,
                                                 accentColor,
                                                 children,
                                                 ctaHref,
                                                 ctaText,
                                                 ctaVariant = 'solid',
                                                 decorativeIcon,
                                             }) => (
    <div className="group relative bg-[#1e1e1e] rounded-3xl overflow-hidden flex flex-col
        border border-white/5
        transition-all duration-500
        hover:border-orange-500/40
        hover:shadow-[0_8px_60px_rgba(249,115,22,0.12)]
        hover:-translate-y-1
    ">
        {/* Bild */}
        <div className="relative h-72 w-full overflow-hidden">
            <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 brightness-75"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] via-[#1e1e1e]/30 to-transparent" />

            {/* Dekorativ glöd uppe i hörnet */}
            <div className={`absolute -top-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-30 ${accentColor}`} />

            {/* Badge */}
            <div className="absolute top-4 left-4">
                <span className={`${badgeColor} text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg`}>
                    {badgeText}
                </span>
            </div>

            {/* Dekorativ ikon */}
            {decorativeIcon && (
                <div className="absolute bottom-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                    {decorativeIcon}
                </div>
            )}
        </div>

        {/* Innehåll */}
        <div className="p-8 flex-grow flex flex-col">
            {/* Titel + subtitle */}
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-white mb-1 uppercase tracking-wide group-hover:text-orange-400 transition-colors duration-300">
                    {title}
                </h3>
                <p className="text-sm font-medium text-orange-400/80 italic">{subtitle}</p>
            </div>

            {/* Innehållsslot */}
            <div className="flex-grow">{children}</div>

            {/* CTA */}
            <div className="mt-8">
                <Link
                    href={ctaHref}
                    className={`
                        inline-flex items-center justify-center w-full font-bold py-3.5 px-6 rounded-xl
                        transition-all duration-300 group/btn text-sm uppercase tracking-wider
                        ${ctaVariant === 'solid'
                        ? 'bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40'
                        : 'bg-transparent border-2 border-orange-500/60 text-orange-400 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                    }
                    `}
                >
                    <span>{ctaText}</span>
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
            </div>
        </div>
    </div>
);


// --- Huvudkomponenten ---
export const FeatureSection: React.FC<Props> = ({ id = 'feature', showSeeAllButton = false }) => {
    const { t, i18n } = useTranslation('featureTranslation');
    const currentLang = i18n.language;

    const guided = useMemo(() => ({
        title: t('guidedSocial.title'),
        subtitle: t('guidedSocial.subtitle'),
        when: t('guidedSocial.when'),
        time: t('guidedSocial.time'),
        price: t('guidedSocial.price'),
        cta: t('guidedSocial.cta'),
        soloParLabel: t('guidedSocial.soloParLabel'),
    }), [t]);

    const sunday = useMemo(() => ({
        title: t('sundayFunday.title'),
        subtitle: t('sundayFunday.subtitle'),
        when: t('sundayFunday.when'),
        workshopTime: t('sundayFunday.workshopTime'),
        socialTime: t('sundayFunday.socialTime'),
        price: t('sundayFunday.price'),
        cta: t('sundayFunday.cta'),
        workshopLabel: t('sundayFunday.workshopLabel'),
        socialLabel: t('sundayFunday.socialLabel'),
        priceLabel: t('sundayFunday.priceLabel'),
    }), [t]);

    const guidedBenefitsRaw = t('guidedSocial.benefits', { returnObjects: true });
    const guidedBenefits: string[] = Array.isArray(guidedBenefitsRaw) ? guidedBenefitsRaw : [];

    return (
        <section id={id} className="relative py-20 sm:py-32 bg-transparent text-white overflow-hidden">

            {/* Bakgrundsdekor */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(249,115,22,0.04)_0%,_transparent_60%)]" />

            <div className="container mx-auto max-w-6xl px-4 relative z-10">

                {/* Rubrik */}
                <div className="text-center mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
                        — Events —
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-white font-serif">
                        {t('title')}
                    </h2>
                    <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                </div>

                {/* Kort-grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* EVENT 1: GUIDED SOCIAL */}
                    <EventCard
                        imageSrc="/img/Feature/GuidedSocialDance.png"
                        imageAlt={guided.title}
                        badgeText={guided.when}
                        badgeColor="bg-orange-600"
                        title={guided.title}
                        subtitle={guided.subtitle}
                        accentColor="bg-orange-500"
                        ctaHref={EVENT_LINKS.guidedSocial}
                        ctaText={guided.cta}
                        ctaVariant="solid"
                        decorativeIcon={<Flame className="w-16 h-16 text-orange-300" />}
                    >
                        {/* Benefits */}
                        <ul className="space-y-2.5 mb-6">
                            {guidedBenefits.map((item, i) => (
                                <li key={i} className="flex items-start text-sm text-gray-400">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2.5 mt-0.5 shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        {/* Info-chips */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                                <Clock className="w-3.5 h-3.5 text-orange-400" />
                                <span className="text-orange-400 font-bold text-sm">{guided.time}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-2 rounded-lg">
                                <Users className="w-3.5 h-3.5 text-orange-400" />
                                <span className="text-orange-400 font-bold text-sm">{guided.price}</span>
                                <span className="text-[10px] text-gray-500 uppercase">{guided.soloParLabel}</span>
                            </div>
                        </div>
                    </EventCard>

                    {/* EVENT 2: SUNDAY FUNDAY */}
                    <EventCard
                        imageSrc="/img/Feature/SundayFunday.png"
                        imageAlt={sunday.title}
                        badgeText={sunday.when}
                        badgeColor="bg-pink-600"
                        title={sunday.title}
                        subtitle={sunday.subtitle}
                        accentColor="bg-pink-500"
                        ctaHref={EVENT_LINKS.sundayFunday}
                        ctaText={sunday.cta}
                        ctaVariant="outline"
                        decorativeIcon={<Flame className="w-16 h-16 text-pink-300" />}
                    >
                        {/* Tidsschema */}
                        <div className="space-y-0 mb-6 rounded-xl overflow-hidden border border-white/5">
                            <div className="flex justify-between items-center text-sm px-4 py-3 bg-white/[0.03] border-b border-white/5">
                                <span className="text-gray-400 font-medium">{sunday.workshopLabel}</span>
                                <span className="text-white font-bold">{sunday.workshopTime}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-4 py-3 bg-white/[0.03] border-b border-white/5">
                                <span className="text-gray-400 font-medium">{sunday.socialLabel}</span>
                                <span className="text-white font-bold">{sunday.socialTime}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm px-4 py-3 bg-orange-500/5">
                                <span className="text-gray-400 font-bold">{sunday.priceLabel}</span>
                                <span className="text-orange-400 font-bold">{sunday.price}</span>
                            </div>
                        </div>
                    </EventCard>

                </div>

                {/* Se alla events */}
                {showSeeAllButton && (
                    <div className="text-center mt-12">
                        <Link
                            href={`/${currentLang}/events`}
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold uppercase tracking-wider text-gray-300 transition-all duration-300 hover:border-orange-500/40 hover:text-orange-400 hover:bg-orange-500/5"
                        >
                            {t('seeAllEvents')}
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}

            </div>

            {/* Undre dekorativ linje */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        </section>
    );
};

export default FeatureSection;