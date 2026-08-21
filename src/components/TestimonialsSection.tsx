import Image from "next/image";
import { getServerT } from "@/i18n";
import { FaQuoteLeft, FaStar, FaGoogle, FaExternalLinkAlt } from "react-icons/fa";

interface Testimonial {
    id: number;
    name: string;
    text: string;
    imageSrc: string;
    source?: "Google" | "Trustpilot";
}

interface TestimonialsSectionProps {
    lang: string;
}

export default async function TestimonialsSection({ lang }: TestimonialsSectionProps) {
    const t = await getServerT(lang, "testimonialsTranslation");

    const GOOGLE_LINK = "https://www.google.com/maps/place/FuegoDanceSchool/";
    const TRUSTPILOT_LINK = "https://se.trustpilot.com/review/fuegodanceschool.com";

    const tData = t("testimonials", { returnObjects: true });
    const items = Array.isArray(tData) ? (tData as Testimonial[]) : [];
    const duplicatedItems = items.length > 0 ? [...items, ...items] : [];

    return (
        <section className="py-24 bg-[#1f1210] overflow-hidden">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                        {t("title", { defaultValue: "Vad våra elever säger" })}
                    </h2>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 text-base font-bold text-white">
                        <a
                            href={GOOGLE_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group flex items-center gap-3 bg-[#262626] px-8 py-4 rounded-full
                                border border-white/10 shadow-lg hover:shadow-orange-500/20 hover:border-orange-500/50
                                transition-all duration-300 transform hover:-translate-y-1
                            "
                        >
                            <div className="bg-white p-1.5 rounded-full">
                                <FaGoogle className="text-black text-lg" />
                            </div>
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-xs text-gray-400 font-normal uppercase tracking-wider">Betyg på Google</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-yellow-400 text-lg">{t("googleRating", { defaultValue: "⭐ 4.9" })}</span>
                                    <FaExternalLinkAlt className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </a>

                        <a
                            href={TRUSTPILOT_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="
                                group flex items-center gap-3 bg-[#262626] px-8 py-4 rounded-full
                                border border-white/10 shadow-lg hover:shadow-green-500/20 hover:border-green-500/50
                                transition-all duration-300 transform hover:-translate-y-1
                            "
                        >
                            <FaStar className="text-green-500 text-3xl" />
                            <div className="flex flex-col items-start leading-none gap-1">
                                <span className="text-xs text-gray-400 font-normal uppercase tracking-wider">Betyg på Trustpilot</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-lg">{t("trustpilotRating", { defaultValue: "4.5 / 5" })}</span>
                                    <FaExternalLinkAlt className="text-gray-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>
                        </a>
                    </div>
                </div>

                {duplicatedItems.length > 0 && (
                    <div className="relative w-full">
                        <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
                            {duplicatedItems.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="mx-6 h-full">
                                    <div
                                        className="
                                            w-[90vw] md:w-[500px] bg-black p-10 rounded-[2rem] shadow-2xl
                                            relative flex flex-col items-center text-center border border-white/5
                                            transition-all duration-300 hover:scale-[1.01] hover:border-orange-500/20 group h-full
                                        "
                                    >
                                        <FaQuoteLeft className="text-orange-500/20 text-5xl absolute top-8 left-8 transition-colors group-hover:text-orange-500/40" />

                                        <div className="absolute top-8 right-8 text-2xl opacity-40 group-hover:opacity-80 transition-opacity">
                                            {item.source === "Trustpilot" ? (
                                                <FaStar className="text-green-500" title="Från Trustpilot" />
                                            ) : (
                                                <FaGoogle className="text-white" title="Från Google Reviews" />
                                            )}
                                        </div>

                                        <div className="relative w-28 h-28 mb-6 rounded-full border-2 border-orange-500 p-1 shadow-[0_0_20px_rgba(249,115,22,0.2)]">
                                            <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-800">
                                                <Image
                                                    src={item.imageSrc}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-4 tracking-wide group-hover:text-orange-500 transition-colors">
                                            {item.name}
                                        </h3>

                                        <p className="text-gray-300 text-lg leading-relaxed italic opacity-90 font-light">
                                            &quot;{item.text}&quot;
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
