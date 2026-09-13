"use client";

import React, { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ArrowRight, CheckCircle2, Clock, Sparkles, Ticket } from "lucide-react";

const SUNDAY_SOCIAL_LINK =
    "https://app.coursely.se/checkout/FuegoDance/dropinPackages";

interface Props {
    id?: string;
}

export const FeatureSection: React.FC<Props> = ({ id = "feature" }) => {
    const { t, i18n } = useTranslation("featureTranslation");
    const currentLang = (i18n.language || "sv").startsWith("en") ? "en" : "sv";
    const isEnglish = currentLang === "en";

    useEffect(() => {
        void i18n.loadNamespaces("featureTranslation");
    }, [i18n, currentLang]);

    const guided = useMemo(
        () => ({
            title: t("guidedSocial.title", { defaultValue: "Sunday Social Dance" }),
            subtitle: t("guidedSocial.subtitle", {
                defaultValue: isEnglish
                    ? "Simple social dancing on Sundays – no classes, no pressure. Just come and have fun on the floor."
                    : "Enkel socialdans på söndagar – inga lektioner, inget krav. Bara kom och ha kul på golvet.",
            }),
            time: t("guidedSocial.time", { defaultValue: "15:00 – 18:00" }),
            price: t("guidedSocial.price", { defaultValue: isEnglish ? "80 SEK" : "80 kr" }),
            memberDiscount: t("guidedSocial.memberDiscount", {
                defaultValue: isEnglish ? "50% off for all members" : "50% rabatt för alla medlemmar",
            }),
            courseBonus: t("guidedSocial.courseBonus", {
                defaultValue: isEnglish ? "Free when buying 3+ courses" : "Gratis vid köp av 3+ kurser",
            }),
            cta: t("guidedSocial.cta", { defaultValue: isEnglish ? "More info & book" : "Mer info & boka" }),
        }),
        [t, isEnglish]
    );

    const guidedBenefitsRaw = t("guidedSocial.benefits", { returnObjects: true });
    const guidedBenefits: string[] = Array.isArray(guidedBenefitsRaw) ? guidedBenefitsRaw : [];

    return (
        <section id={id} className="relative py-12 sm:py-16 text-white overflow-hidden">
            <div className="container mx-auto max-w-6xl px-4 relative z-10">
                <div className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-500 hover:border-orange-500/20 hover:shadow-[0_24px_70px_rgba(249,115,22,0.1)]">
                    {/* Banner – full bredd, naturligt bildformat */}
                    <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
                        <Image
                            src="/img/Feature/SundaySocialDance.png"
                            alt={guided.title}
                            fill
                            className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.01]"
                            priority
                            sizes="(max-width: 768px) 100vw, 1152px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent opacity-80" />
                    </div>

                    {/* Innehåll */}
                    <div className="relative px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-9">
                        <p className="mb-6 max-w-2xl text-base sm:text-lg text-gray-300 leading-relaxed">
                            {guided.subtitle}
                        </p>

                        <ul className="mb-8 grid gap-3 sm:grid-cols-3">
                            {guidedBenefits.map((item, i) => (
                                <li
                                    key={i}
                                    className="flex items-start gap-2.5 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5 text-sm text-gray-300"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-wrap gap-3">
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
                                    <Clock className="h-4 w-4 text-orange-400" />
                                    <span className="text-sm font-bold text-white">{guided.time}</span>
                                </div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5">
                                    <Ticket className="h-4 w-4 text-orange-400" />
                                    <span className="text-sm font-bold text-white">{guided.price}</span>
                                </div>
                                <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-xs font-semibold text-orange-300">
                                    {guided.memberDiscount}
                                </div>
                                <div className="inline-flex items-center rounded-full border border-orange-500/20 bg-orange-500/10 px-4 py-2.5 text-xs font-semibold text-orange-300">
                                    {guided.courseBonus}
                                </div>
                            </div>

                            <Link
                                href={SUNDAY_SOCIAL_LINK}
                                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:bg-orange-400 hover:shadow-orange-500/35"
                            >
                                <Sparkles className="h-4 w-4" />
                                {guided.cta}
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
