"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2 } from "lucide-react";

interface Props {
    id?: string;
}

export const FeatureSection: React.FC<Props> = ({ id = 'feature' }) => {
    const { t, i18n } = useTranslation('featureTranslation');
    const currentLang = i18n.language || 'sv';

    // --- ÄNDRA DINA LÄNKAR HÄR ---
    const links = {
        guidedSocial: "https://app.coursely.se/activity/zoix7gzytqz1mtl8",
        sundayFunday: "https://app.coursely.se/activity/lk1k7x5lokmv1bp1"

        // Exempel på extern länk om du vill använda det istället:
        // guidedSocial: "https://dinkurs.se/guided-social-booking",
    };

    // Build feature data from translations. If keys are missing, we'll fallback to empty array which triggers the comingSoon state.
    const guided = {
        title: t('guidedSocial.title', { defaultValue: '' }),
        subtitle: t('guidedSocial.subtitle', { defaultValue: '' }),
        when: t('guidedSocial.when', { defaultValue: '' }),
        time: t('guidedSocial.time', { defaultValue: '' }),
        price: t('guidedSocial.price', { defaultValue: '' }),
        cta: t('guidedSocial.cta', { defaultValue: '' }),
    };

    const sunday = {
        title: t('sundayFunday.title', { defaultValue: '' }),
        subtitle: t('sundayFunday.subtitle', { defaultValue: '' }),
        when: t('sundayFunday.when', { defaultValue: '' }),
        workshopTime: t('sundayFunday.workshopTime', { defaultValue: '' }),
        socialTime: t('sundayFunday.socialTime', { defaultValue: '' }),
        price: t('sundayFunday.price', { defaultValue: '' }),
        cta: t('sundayFunday.cta', { defaultValue: '' }),
    };

    const hasData = true
    // (guided.title || sunday.title);

    return (
        <section id={id} className="py-16 bg-[#1a1a1a] scroll-mt-20">
            <div className="container mx-auto max-w-6xl px-4">

                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center font-serif">
                    {t('title', { defaultValue: 'Våra Stående Events' })}
                </h2>

                {!hasData ? (
                    <div className="py-16 flex items-center justify-center">
                        <span className="text-gray-300 text-xl font-semibold">{t('comingSoon', { defaultValue: 'Kommer snart' })}</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* EVENT 1: GUIDED SOCIAL */}
                        <div className="group relative bg-[#262626] rounded-3xl overflow-hidden border border-orange-500/20 transition-all duration-500 hover:border-orange-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] flex flex-col">
                            <div className="relative h-72 w-full overflow-hidden">
                                <Image
                                    src="/img/Feature/GuidedSocialDance.png"
                                    alt={guided.title || 'Guided Bachata Social'}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#262626] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                        {guided.when || 'Varje Onsdag'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-2xl font-bold text-orange-500 mb-2 uppercase">{guided.title || 'Guidad Socialdans'}</h3>
                                <p className="text-gray-300 mb-4 font-medium italic">{guided.subtitle || 'Practice with intention & build confidence.'}</p>

                                <ul className="space-y-2 mb-6">
                                    {[
                                        "Få personlig feedback på din teknik",
                                        "Korrigera vanor i realtid på socialgolvet",
                                        "En trygg miljö för alla nivåer"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-400">
                                            <CheckCircle2 className="w-4 h-4 text-orange-500 mr-2 mt-0.5 shrink-0" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-wrap gap-3 mb-8">
                                    <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-orange-500/20">
                                        <span className="text-orange-400 font-bold block text-sm">{guided.time || '18:30 – 20:30'}</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">{guided.when || 'Onsdagar'}</span>
                                    </div>
                                    <div className="bg-[#1a1a1a] px-4 py-2 rounded-xl border border-orange-500/20">
                                        <span className="text-orange-400 font-bold block text-sm">{guided.price || '150kr / 200kr'}</span>
                                        <span className="text-[10px] text-gray-500 uppercase font-bold">Solo / Par</span>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href={links.guidedSocial}
                                        className="inline-flex items-center justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 group/btn"
                                    >
                                        <span>{guided.cta || 'Mer Info'}</span>
                                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* EVENT 2: SUNDAY FUNDAY */}
                        <div className="group relative bg-[#262626] rounded-3xl overflow-hidden border border-orange-500/20 transition-all duration-500 hover:border-orange-500 hover:shadow-[0_0_40px_rgba(249,115,22,0.15)] flex flex-col">
                            <div className="relative h-72 w-full overflow-hidden">
                                <Image
                                    src="/img/Feature/SundayFunday.png"
                                    alt={sunday.title || 'Sunday Funday Bachata'}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#262626] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                                        {sunday.when || 'Varje Söndag'}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8 flex-grow flex flex-col">
                                <h3 className="text-2xl font-bold text-orange-500 mb-2 uppercase">{sunday.title || 'Sunday Funday'}</h3>
                                <p className="text-gray-300 mb-4 font-medium italic text-pink-400/80">{sunday.subtitle || '100% Bachata'}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Workshop</span>
                                        <span className="text-white font-bold">{sunday.workshopTime || '14:00 – 15:00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                        <span className="text-gray-400">Bachata Social</span>
                                        <span className="text-white font-bold">{sunday.socialTime || '15:00 – 18:00'}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400 font-bold">Pris:</span>
                                        <span className="text-orange-400 font-bold">{sunday.price || '80kr Social / 120kr All-in'}</span>
                                    </div>
                                </div>


                                <div className="mt-auto">
                                    <Link
                                        href={links.sundayFunday}
                                        className="inline-flex items-center justify-center w-full bg-transparent border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 group/btn"
                                    >
                                        <span>{sunday.cta || 'Mer Info'}</span>
                                        <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </section>
    );
};