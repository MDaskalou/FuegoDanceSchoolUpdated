import { getServerT } from "@/i18n";
import PartnersCarousel, { type PartnerOffer } from "@/components/PartnersCarousel";

interface PartnersSectionProps {
    lang: string;
}

function asPartners(value: unknown): PartnerOffer[] {
    if (!Array.isArray(value)) return [];

    return value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];

        const partner = item as Partial<PartnerOffer>;
        if (typeof partner.name !== "string" || typeof partner.category !== "string" || typeof partner.offer !== "string") {
            return [];
        }

        return [{
            name: partner.name,
            category: partner.category,
            offer: partner.offer,
            code: typeof partner.code === "string" && partner.code.length > 0 ? partner.code : undefined,
            href: typeof partner.href === "string" && partner.href.length > 0 ? partner.href : undefined,
            logo: typeof partner.logo === "string" && partner.logo.length > 0 ? partner.logo : undefined,
            logoSurface: partner.logoSurface === "light" ? "light" : "dark",
            showName: partner.showName === true,
        }];
    });
}

export default async function PartnersSection({ lang }: PartnersSectionProps) {
    const t = await getServerT(lang, "partnersTranslation");
    const partners = asPartners(t("partners", { returnObjects: true }));

    if (partners.length === 0) return null;

    return (
        <section id="samarbeten" className="scroll-mt-28 border-y border-white/10 bg-[#141414] px-4 py-16 text-white sm:py-20">
            <div className="mx-auto max-w-6xl">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-400">
                    {t("eyebrow")}
                </p>
                <h2 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">
                    {t("title")}
                </h2>
                <p className="mt-3 max-w-xl text-base text-gray-400 sm:text-lg">
                    {t("intro")}
                </p>

                <PartnersCarousel
                    partners={partners}
                    labels={{
                        copy: t("copy"),
                        copied: t("copied"),
                        visit: t("visit"),
                        code: t("codeLabel"),
                        previous: t("previous"),
                        next: t("next"),
                        goTo: t("goTo"),
                    }}
                />
            </div>
        </section>
    );
}
