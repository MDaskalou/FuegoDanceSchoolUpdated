import EventCarousel from "@/components/EventCarousel";
import { FaCalendarPlus } from "react-icons/fa";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getServerT } from "@/i18n";
import { filterUpcomingEvents, type EventItem } from "@/lib/events";

export type { EventItem };

type EventSectionProps = {
    id?: string;
    showSeeAllButton?: boolean;
    lang?: string;
};

export default async function Event({
    id = "events",
    showSeeAllButton = false,
    lang = "sv",
}: EventSectionProps) {
    const t = await getServerT(lang, "eventTranslation");

    const allEvents = t("events", { returnObjects: true }) as unknown as EventItem[];
    const normalizedEvents: EventItem[] = Array.isArray(allEvents) ? allEvents : [];
    const upcomingEvents = filterUpcomingEvents(normalizedEvents);
    const ctaLabel = t("eventsCtaButton", { defaultValue: "Läs mer & Boka" });
    const seeAllLabel = lang.startsWith("en") ? "See all events" : "Se alla events";

    return (
        <section
            id={id}
            data-event-section
            className="py-20 sm:py-32 bg-transparent text-white scroll-mt-24"
        >
            <div className="container mx-auto max-w-7xl px-4 text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-orange-500 mb-12">
                    {t("eventsTitle")}
                </h2>

                {upcomingEvents.length > 0 ? (
                    <div className="mb-16">
                        <EventCarousel events={upcomingEvents} ctaLabel={ctaLabel} />
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-[#262626] rounded-3xl border border-white/5 shadow-2xl max-w-2xl mx-auto mb-16">
                        <div className="flex justify-center mb-6">
                            <div className="bg-orange-500/10 p-4 rounded-full">
                                <FaCalendarPlus className="w-10 h-10 text-orange-500" />
                            </div>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                            {t("comingSoonTitle") || t("noUpcomingEvents")}
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-lg mx-auto">
                            {t("comingSoonDescription") || t("noUpcomingEvents")}
                        </p>
                    </div>
                )}

                {showSeeAllButton && (
                    <Link
                        href={`/${lang}/events`}
                        className="inline-flex items-center gap-2 rounded-full border-2 border-orange-500 px-8 py-3 text-sm font-bold uppercase tracking-wider text-orange-500 transition-all duration-300 hover:bg-orange-500 hover:text-white"
                    >
                        {seeAllLabel}
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
        </section>
    );
}
