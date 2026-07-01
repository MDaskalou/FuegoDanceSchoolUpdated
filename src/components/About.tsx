"use client";

import { useTranslation } from "react-i18next";
import Link from "next/link";
import Image from "next/image";
import { useInView } from "@/hooks/useInView";
import { HeartHandshake, Music2, ShieldCheck } from "lucide-react";

export const About = () => {
    const { t, i18n } = useTranslation("aboutTranslation");
    const { ref: sectionRef, inView } = useInView(0.2);

    const currentLang = i18n.language;
    const baseTransition = "transition-all duration-1000 ease-out";

    const valueCards = [
        {
            title: t("valueCard1Title"),
            text: t("valueCard1Text"),
            icon: ShieldCheck,
        },
        {
            title: t("valueCard2Title"),
            text: t("valueCard2Text"),
            icon: Music2,
        },
        {
            title: t("valueCard3Title"),
            text: t("valueCard3Text"),
            icon: HeartHandshake,
        },
    ];

    return (
        <section
            id="about-section"
            ref={sectionRef}
            className="relative overflow-hidden bg-[#171717] py-20 text-white sm:py-28"
        >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />

            <div className="container relative z-10 mx-auto max-w-7xl px-4">
                <div className="grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className={`${baseTransition} ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <p className="mb-4 text-xs font-bold uppercase tracking-[0.35em] text-orange-400">
                            {t("aboutEyebrow")}
                        </p>
                        <h2 className="max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                            {t("aboutHeadline")}
                        </h2>
                        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">
                            {t("aboutIntro")}
                        </p>
                        <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-400">
                            {t("aboutOrigin")}
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Link
                                href={`/${currentLang}/courses`}
                                className="inline-flex items-center justify-center rounded-full bg-orange-500 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:bg-orange-600 hover:scale-105"
                            >
                                {t("ctaCourses")}
                            </Link>
                            <Link
                                href={`/${currentLang}/instructors`}
                                className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-all duration-300 hover:border-orange-400 hover:text-orange-300"
                            >
                                {t("ctaInstructor")}
                            </Link>
                        </div>
                    </div>

                    <div className={`${baseTransition} delay-200 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                        <div className="grid grid-cols-2 gap-3 sm:gap-4">
                            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-lg border border-white/10 shadow-2xl sm:col-span-1 sm:aspect-[4/5]">
                                <Image
                                    src="/img/About/Aboutleft1.jpg"
                                    alt={t("aboutImgLeftAlt", { defaultValue: "Fuego dance class" })}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 360px"
                                />
                            </div>
                            <div className="grid gap-3 sm:gap-4">
                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10">
                                    <Image
                                        src="/img/About/About8.jpg"
                                        alt={t("aboutImgMomentAlt", { defaultValue: "Fuego dance moment" })}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 50vw, 280px"
                                    />
                                </div>
                                <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10">
                                    <Image
                                        src="/img/About/About7.jpg"
                                        alt={t("aboutImgCommunityAlt", { defaultValue: "Fuego community" })}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 1024px) 50vw, 280px"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`mt-12 grid gap-4 md:grid-cols-3 ${baseTransition} delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                    {valueCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div key={card.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-6">
                                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="text-xl font-bold text-white">
                                    {card.title}
                                </h3>
                                <p className="mt-3 text-sm leading-relaxed text-gray-400">
                                    {card.text}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default About;
