"use client";

import { useTranslation } from "react-i18next";
import { FaStar } from "react-icons/fa";
import { CheckCircle2 } from "lucide-react";

interface Testimonial {
    id: number;
    name: string;
    text: string;
}

export default function SocialProofStrip() {
    const { t } = useTranslation("testimonialsTranslation");
    const testimonials = t("testimonials", { returnObjects: true });
    const items = Array.isArray(testimonials) ? testimonials as Testimonial[] : [];
    const featured = items.find((item) => item.id === 2) ?? items[0];

    if (!featured) return null;

    return (
        <section className="bg-[#171717] border-y border-white/10 px-4 py-8 sm:py-10">
            <div className="mx-auto grid max-w-6xl items-center gap-6 md:grid-cols-[1fr_auto]">
                <div>
                    <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-400">
                        {[...Array(5)].map((_, index) => (
                            <FaStar key={index} className="h-3.5 w-3.5" />
                        ))}
                        <span className="ml-1 uppercase tracking-[0.18em]">
                            {t("proofRatingLabel")}
                        </span>
                    </div>

                    <blockquote className="max-w-3xl text-xl font-light italic leading-relaxed text-white sm:text-2xl">
                        &quot;{t("featuredProofQuote", { defaultValue: featured.text })}&quot;
                    </blockquote>
                    <p className="mt-3 text-sm font-semibold text-gray-400">
                        - {featured.name}, Fuego Dance School
                    </p>
                </div>

                <div className="grid gap-3 text-sm font-semibold text-gray-200 sm:grid-cols-3 md:grid-cols-1">
                    {["proofPointBeginner", "proofPointNoPartner", "proofPointSafe"].map((key) => (
                        <div key={key} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-3">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-orange-400" />
                            <span>{t(key)}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
