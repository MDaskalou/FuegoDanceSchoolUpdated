import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Gift, ShoppingCart } from "lucide-react";
import { getServerT } from "@/i18n";
import {
    GIFT_CARD_AMOUNTS_SEK,
    GIFT_CARD_CHECKOUT_URL,
    GIFT_CARD_IMAGE_PATH,
} from "@/lib/giftCard";
import { SITE_URL, normalizeLang } from "@/lib/seo";

export async function generateStaticParams() {
    return [{ lang: "sv" }, { lang: "en" }];
}

export default async function GiftCardPage({
    params,
}: {
    params: { lang: string };
}) {
    const lang = normalizeLang(params.lang);
    const isEnglish = lang === "en";
    const t = await getServerT(lang, "giftCardTranslation");

    const benefitsRaw = t("benefits", { returnObjects: true });
    const benefits = Array.isArray(benefitsRaw)
        ? benefitsRaw.filter((item): item is string => typeof item === "string")
        : [];
    const stepsRaw = t("howSteps", { returnObjects: true });
    const steps = Array.isArray(stepsRaw)
        ? stepsRaw.filter((item): item is string => typeof item === "string")
        : [];

    const amountLabels = isEnglish
        ? GIFT_CARD_AMOUNTS_SEK.map((amount) => `${amount.toLocaleString("en-US")} SEK`)
        : GIFT_CARD_AMOUNTS_SEK.map((amount) => `${amount.toLocaleString("sv-SE")} kr`);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        name: isEnglish
            ? "Fuego Dance School Gift Card"
            : "Fuego Dance School Presentkort",
        description: t("lead"),
        image: `${SITE_URL}${GIFT_CARD_IMAGE_PATH}`,
        brand: {
            "@type": "Brand",
            name: "Fuego Dance School",
        },
        category: isEnglish ? "Gift card" : "Presentkort",
        offers: GIFT_CARD_AMOUNTS_SEK.map((amount) => ({
            "@type": "Offer",
            url: GIFT_CARD_CHECKOUT_URL,
            priceCurrency: "SEK",
            price: amount,
            availability: "https://schema.org/InStock",
        })),
    };

    return (
        <section className="bg-[#121212] px-4 pb-20 pt-32 text-white sm:pt-36">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div className="mx-auto max-w-5xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                    {t("eyebrow")}
                </p>
                <h1 className="mt-3 max-w-3xl font-serif text-3xl font-bold leading-tight sm:text-5xl">
                    {t("title")}
                </h1>
                <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-300 sm:text-lg">
                    {t("lead")}
                </p>

                <div className="mt-10 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#141414] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#0a1f16]">
                        <Image
                            src={GIFT_CARD_IMAGE_PATH}
                            alt={t("posterAlt")}
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, 1024px"
                            className="object-contain object-center"
                        />
                    </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-2">
                    {amountLabels.map((amount) => (
                        <span
                            key={amount}
                            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-white"
                        >
                            {amount}
                        </span>
                    ))}
                    <span className="rounded-full border border-dashed border-white/20 px-4 py-2 text-sm font-medium text-gray-300">
                        {isEnglish ? "Your own amount" : "Eget belopp"}
                    </span>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <a
                        href={GIFT_CARD_CHECKOUT_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-7 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-[0_0_28px_rgba(249,115,22,0.28)] transition-all duration-300 hover:bg-orange-600"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {t("cta")}
                    </a>
                    <Link
                        href={`/${lang}/courses`}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:border-orange-400 hover:text-orange-300"
                    >
                        {t("ctaSecondary")}
                    </Link>
                </div>

                <div className="mt-14 grid gap-10 md:grid-cols-2">
                    <div>
                        <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
                            <Gift className="h-5 w-5 text-orange-500" />
                            {t("benefitsTitle")}
                        </h2>
                        <ul className="mt-5 space-y-3">
                            {benefits.map((benefit) => (
                                <li
                                    key={benefit}
                                    className="flex items-start gap-2.5 text-sm leading-relaxed text-gray-300"
                                >
                                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-orange-500" />
                                    <span>{benefit}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-white">{t("howTitle")}</h2>
                        <ol className="mt-5 space-y-3">
                            {steps.map((step, index) => (
                                <li
                                    key={step}
                                    className="flex items-start gap-3 text-sm leading-relaxed text-gray-300"
                                >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500/15 text-xs font-bold text-orange-400">
                                        {index + 1}
                                    </span>
                                    <span>{step}</span>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="mt-14 rounded-3xl border border-white/10 bg-[#1c1c1c] px-6 py-8 sm:px-8">
                    <h2 className="text-2xl font-bold text-white">{t("seoH2")}</h2>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-300 sm:text-base">
                        {t("seoBody")}
                    </p>
                </div>
            </div>
        </section>
    );
}
