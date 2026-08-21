import Link from "next/link";
import { getServerT } from "@/i18n";
import { Sparkles, Percent, Calendar, CheckCircle2, Gift, ShoppingCart } from "lucide-react";

interface Course {
    count: number;
    price: number;
    popular: boolean;
    saving?: number;
}

interface DropInItem {
    labelKey?: string;
    count?: number;
    price: number;
    isSocial: boolean;
    saving?: number;
    highlighted?: boolean;
}

interface PriceCardProps {
    title: string;
    icon: React.ReactNode;
    accentTop?: boolean;
    children: React.ReactNode;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, icon, accentTop = false, children }) => (
    <div className="w-full">
        <div className={`
            h-full p-8 rounded-3xl bg-[#262626] shadow-2xl flex flex-col
            border border-white/5
            transition-all duration-300
            hover:border-orange-500/30
            hover:shadow-[0_8px_40px_rgba(249,115,22,0.08)]
            hover:-translate-y-1
            ${accentTop ? "border-t-2 border-t-orange-500" : ""}
        `}>
            <h3 className="text-xl font-bold mb-8 text-white flex items-center justify-center gap-2.5">
                <span className="text-orange-500">{icon}</span>
                <span>{title}</span>
            </h3>
            {children}
        </div>
    </div>
);

interface PriceRowProps {
    label: string;
    price: string;
    highlighted?: boolean;
    popular?: boolean;
    popularLabel?: string;
    muted?: boolean;
    dashed?: boolean;
    saving?: number;
    savingPrefix?: string;
    bonusText?: string;
}

const PriceRow: React.FC<PriceRowProps> = ({
    label,
    price,
    highlighted,
    popular,
    popularLabel,
    muted,
    dashed,
    saving,
    savingPrefix = "du sparar",
    bonusText,
}) => (
    <li className={`
        flex flex-col py-3 px-4 rounded-xl
        transition-all duration-300 hover:scale-[1.01]
        ${highlighted ? "bg-orange-500/10 border border-orange-500/40 hover:bg-orange-500/15" : ""}
        ${dashed ? "border border-dashed border-white/10 hover:border-white/20" : ""}
        ${!highlighted && !dashed ? "border-b border-white/8 hover:bg-white/5" : ""}
    `}>
        <div className="flex justify-between items-center w-full">
            <span className={`text-base font-medium ${muted ? "text-gray-500" : "text-gray-200"}`}>
                {label}
            </span>
            <div className="flex flex-col items-end">
                <div className="flex items-center gap-3">
                    {popular && popularLabel && (
                        <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow animate-pulse">
                            {popularLabel}
                        </span>
                    )}
                    <span className={`text-xl font-bold ${muted ? "text-gray-500" : "text-white"}`}>
                        {price}
                    </span>
                </div>
                {saving && saving > 0 && (
                    <span className="text-[11px] text-green-400 font-semibold mt-0.5">
                        {savingPrefix} {saving} kr
                    </span>
                )}
            </div>
        </div>

        {bonusText && (
            <div className="mt-2.5 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-orange-400 font-bold uppercase tracking-wider bg-orange-500/5 py-1 px-2 rounded-md border border-orange-500/10 self-start">
                <Gift className="w-3 h-3" />
                {bonusText}
            </div>
        )}
    </li>
);

interface PriceSectionProps {
    lang: string;
}

export default async function PriceSection({ lang }: PriceSectionProps) {
    const t = await getServerT(lang, "priceTranslation");
    const dropInCheckoutUrl = "https://app.coursely.se/checkout/FuegoDance/dropinPackages";

    const coursesRaw = t("courses", { returnObjects: true });
    const dropInItemsRaw = t("dropInItems", { returnObjects: true });

    const courses: Course[] = Array.isArray(coursesRaw) ? coursesRaw : [];
    const dropInItems: DropInItem[] = Array.isArray(dropInItemsRaw) ? dropInItemsRaw : [];

    const getCourseLabel = (count: number) => {
        if (count === 0) return t("socialDanceLabel");
        return `${count} ${t(count === 1 ? "courseLabelSingular" : "courseLabelPlural")}`;
    };

    const getDropInLabel = (item: DropInItem) => {
        if (item.labelKey) return t(item.labelKey);
        return getCourseLabel(item.count ?? 0);
    };

    return (
        <section
            id="prices"
            className="relative py-20 sm:py-32 bg-transparent text-white overflow-hidden"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.03)_0%,_transparent_65%)]" />

            <div className="container mx-auto max-w-6xl px-4 text-center relative z-10">
                <div className="mb-14">
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-orange-500/60 mb-3">
                        - Priser -
                    </p>
                    <h2 className="text-4xl sm:text-5xl font-serif font-bold text-white">
                        {t("priceTitle")}
                    </h2>
                    <div className="mt-4 mx-auto w-16 h-0.5 bg-gradient-to-r from-transparent via-orange-500 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch mb-16">
                    <PriceCard
                        title={t("cardCourseTitle")}
                        icon={<Sparkles className="w-5 h-5" />}
                        accentTop
                    >
                        <ul className="space-y-3 flex-grow">
                            {courses.map((course, index) => (
                                <PriceRow
                                    key={index}
                                    label={getCourseLabel(course.count)}
                                    price={`${course.price} kr`}
                                    highlighted={course.popular}
                                    popular={course.popular}
                                    popularLabel={t("tagPopular")}
                                    saving={course.saving}
                                    savingPrefix={t("savingPrefix")}
                                    bonusText={course.count >= 3 ? t("bonusIncluded") : undefined}
                                />
                            ))}
                        </ul>
                    </PriceCard>

                    <PriceCard
                        title={t("cardDiscountTitle")}
                        icon={<Percent className="w-5 h-5" />}
                    >
                        <ul className="space-y-4 flex-grow">
                            {[
                                t("discountStudent"),
                                t("discountCouple"),
                                t("discountHalfOfSemester"),
                            ].map((text, i) => (
                                <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/8 text-sm text-gray-300 text-left transition-all duration-300 hover:bg-white/[0.06] hover:scale-[1.02]">
                                    <CheckCircle2 className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                                    <span>{text}</span>
                                </li>
                            ))}
                        </ul>
                    </PriceCard>

                    <PriceCard
                        title={t("cardDropInTitle")}
                        icon={<Calendar className="w-5 h-5" />}
                        accentTop
                    >
                        <ul className="space-y-3 flex-grow mb-4">
                            {dropInItems.map((item, index) => (
                                <PriceRow
                                    key={index}
                                    label={getDropInLabel(item)}
                                    price={`${item.price} kr`}
                                    highlighted={item.highlighted}
                                    dashed={item.isSocial}
                                    muted={false}
                                    saving={item.saving}
                                    savingPrefix={t("savingPrefix")}
                                />
                            ))}
                        </ul>
                        <div className="mb-4 flex items-center gap-2 rounded-xl border border-orange-500/25 bg-orange-500/10 px-4 py-3 text-left text-sm font-semibold text-orange-300">
                            <Percent className="h-4 w-4 shrink-0" />
                            <span>{t("memberDropInDiscount")}</span>
                        </div>
                        <a
                            href={dropInCheckoutUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/20 transition-all duration-300 hover:bg-orange-400 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-95"
                        >
                            <ShoppingCart className="h-4 w-4" />
                            {t("dropInCta", {
                                defaultValue: lang === "sv" ? "Köp drop-in" : "Buy drop-in",
                            })}
                        </a>
                        <p className="text-xs italic text-left text-gray-500 border-t border-white/8 pt-4 mt-4 leading-relaxed">
                            {t("dropInNote")}
                        </p>
                    </PriceCard>
                </div>

                <Link
                    href={`/${lang}/courses`}
                    className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-12 py-4 text-base font-bold uppercase tracking-wider text-white shadow-xl shadow-orange-500/20 transition-all duration-300 hover:bg-orange-400 hover:shadow-orange-500/40 hover:scale-105 active:scale-95"
                >
                    {t("ctaBookNow")}
                </Link>
            </div>

            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        </section>
    );
}
