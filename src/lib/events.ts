export interface EventItem {
    id: number;
    title: string;
    date: string;
    startDate: string;
    location: string;
    link: string;
    description: string | string[];
    imageUrl: string;
    imageFit?: "cover" | "contain";
    isNew?: boolean;
    priority?: number;
    price?: string;
    time?: string;
    subtitle?: string;
    featured?: boolean;
}

const FEATURED_FALLBACK_IDS = [14, 15];

export function filterUpcomingEvents(events: EventItem[]): EventItem[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events
        .filter((event) => {
            const eventDate = parseLocalDate(event.startDate);
            return eventDate !== null && eventDate >= today;
        })
        .sort((a, b) => {
            const aPriority = a.priority ?? Infinity;
            const bPriority = b.priority ?? Infinity;
            if (aPriority !== bPriority) return aPriority - bPriority;
            return (parseLocalDate(a.startDate)?.getTime() ?? 0) - (parseLocalDate(b.startDate)?.getTime() ?? 0);
        });
}

/** Parse YYYY-MM-DD as local calendar date (avoid UTC off-by-one). */
function parseLocalDate(dateStr: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateStr);
    if (!match) {
        const fallback = new Date(dateStr);
        return Number.isNaN(fallback.getTime()) ? null : fallback;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    return new Date(year, month - 1, day);
}

export function getUpcomingFeaturedEvents(events: EventItem[]): EventItem[] {
    const upcoming = filterUpcomingEvents(events);

    const flagged = upcoming.filter((event) => event.featured);
    if (flagged.length > 0) return flagged;

    return upcoming.filter((event) => FEATURED_FALLBACK_IDS.includes(event.id));
}

export function formatEventDate(dateStr: string, locale: string) {
    const date = parseLocalDate(dateStr) ?? new Date(dateStr);
    return {
        day: date.getDate().toString(),
        month: date.toLocaleString(locale, { month: "short" }),
        weekday: date.toLocaleString(locale, { weekday: "long" }),
    };
}
