import type { Metadata } from "next";
import {
  CalendarDays,
  Camera,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Megaphone,
  Newspaper,
  Route,
  Users,
} from "lucide-react";
import {
  getCourses,
  getDashboardSummary,
  getEvents,
  getHeroImages,
  getInternalNews,
  getScheduleItems,
} from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

const modules = [
  {
    title: "Schema",
    description: "Publikt kursschema, intern planering och privatbokningar.",
    icon: CalendarDays,
    status: "Fas 2",
  },
  {
    title: "Kurser",
    description: "Kursmål, översiktlig planering och detaljplanering.",
    icon: ClipboardList,
    status: "Fas 3",
  },
  {
    title: "Events",
    description: "Skapa, schemalägg och publicera workshops och social events.",
    icon: Megaphone,
    status: "Fas 4",
  },
  {
    title: "Instruktörer",
    description: "Intern schemaläggning, tillgänglighet och månadsbrev.",
    icon: Users,
    status: "Fas 5",
  },
  {
    title: "Nyheter",
    description: "Viktiga interna nyheter och information till teamet.",
    icon: Newspaper,
    status: "Fas 5",
  },
  {
    title: "Hero-bilder",
    description: "Hantera startsidans bilder, alt-texter och publicering.",
    icon: Camera,
    status: "Fas 4",
  },
];

const phaseRoadmap = [
  {
    phase: "Fas 1",
    title: "Grundstruktur",
    description: "Bygger adminens ramverk så allt annat får en stabil plats.",
    icon: LayoutDashboard,
    items: [
      "Admin-layout med sidomeny.",
      "Dashboard med snabb överblick.",
      "Mockdata som visar hur flödena kan fungera.",
      "Enkel routing mellan admin-sidor.",
    ],
  },
  {
    phase: "Fas 2",
    title: "Schema",
    description: "Gör schemat användbart för både publika kurser och intern planering.",
    icon: CalendarDays,
    items: [
      "Veckovy och månadsvy.",
      "Lägg till och redigera schemapass.",
      "Koppla pass till kurs, instruktör, lokal och nivå.",
      "Visa interna anteckningar på pass.",
    ],
  },
  {
    phase: "Fas 3",
    title: "Kurser",
    description: "Samlar kursens mål, struktur och lektionsplanering på ett ställe.",
    icon: ClipboardList,
    items: [
      "Kurslista med status och nivå.",
      "Kursdetalj med praktisk information.",
      "Mål för varje kurs.",
      "Översiktlig planering och detaljplanering per vecka eller lektion.",
    ],
  },
  {
    phase: "Fas 4",
    title: "Events och media",
    description: "Hanterar publikt innehåll som behöver kunna publiceras kontrollerat.",
    icon: Camera,
    items: [
      "Skapa och redigera event.",
      "Hantera hero-bilder.",
      "Publiceringsstatus för utkast, publicerat och arkiverat.",
      "Förbereda bild- och eventendpoints för backenden.",
    ],
  },
  {
    phase: "Fas 5",
    title: "Intern info",
    description: "Ger instruktörer en intern yta för planering och viktiga uppdateringar.",
    icon: FileText,
    items: [
      "Månadsbrev som instruktörer kan läsa.",
      "Viktiga nyheter till teamet.",
      "Instruktörernas interna schema.",
      "Rollstyrd information som inte visas publikt.",
    ],
  },
];

const endpointGroups = [
  "Dashboard",
  "Courses",
  "CoursePlans",
  "Schedules",
  "Events",
  "Instructors",
  "InternalNews",
  "MonthlyLetters",
  "HeroImages",
];

export default async function AdminDashboardPage() {
  const [summary, courses, scheduleItems, events, heroImages, internalNews] = await Promise.all([
    getDashboardSummary(),
    getCourses(),
    getScheduleItems(),
    getEvents(),
    getHeroImages(),
    getInternalNews(),
  ]);

  const stats = [
    { label: "Pass i mockschema", value: scheduleItems.length },
    { label: "Kurser", value: courses.length },
    { label: "Kommande events", value: summary.upcomingEvents },
    { label: "Hero-utkast", value: summary.unpublishedHeroImages },
  ];

  return (
    <section>
      <AdminPageHeader
        eyebrow="Development mode"
        title="Fuego Admin"
        description="Fas 1 är nu en klickbar adminprototyp med DTO-typer, mockdata, ett tunt adminApi-lager och routes som senare kan kopplas till C# endpoints."
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-md border border-[#231f1c]/10 bg-white p-4 shadow-sm">
            <div className="font-sans text-2xl font-bold">{stat.value}</div>
            <div className="font-sans text-xs uppercase tracking-[0.16em] text-[#7b6f67]">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      <section className="mt-6 rounded-md border border-[#231f1c]/10 bg-white p-4 shadow-sm lg:p-5">
        <div className="flex flex-col gap-3 border-b border-[#231f1c]/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-playfair text-2xl font-bold">Fasplan</h2>
            <p className="mt-1 font-sans text-sm text-[#6c625b]">
              Översikten vi bygger mot innan riktiga API:er kopplas in.
            </p>
          </div>
          <div className="inline-flex w-fit items-center gap-2 rounded-md bg-[#f26722]/10 px-3 py-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#c2521c]">
            <Route size={15} />
            Frontend först
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-5">
          {phaseRoadmap.map((phase) => {
            const Icon = phase.icon;

            return (
              <article key={phase.phase} className="rounded-md border border-[#231f1c]/10 bg-[#fbf9f6] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="rounded-md bg-[#231f1c] px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-white">
                    {phase.phase}
                  </span>
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#f26722]/10 text-[#c2521c]">
                    <Icon size={19} />
                  </div>
                </div>
                <h3 className="mt-4 font-playfair text-xl font-bold text-[#231f1c]">{phase.title}</h3>
                <p className="mt-2 min-h-[72px] font-sans text-sm leading-6 text-[#6c625b]">
                  {phase.description}
                </p>
                <div className="mt-4 space-y-3 border-t border-[#231f1c]/10 pt-4">
                  {phase.items.map((item) => (
                    <div key={item} className="flex gap-2.5">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f26722]" />
                      <p className="font-sans text-sm leading-5 text-[#4f4742]">{item}</p>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {modules.map((module) => {
          const Icon = module.icon;

          return (
            <article
              key={module.title}
              className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f26722]/10 text-[#c2521c]">
                  <Icon size={22} />
                </div>
                <span className="rounded-md bg-[#231f1c]/5 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]">
                  {module.status}
                </span>
              </div>
              <h2 className="mt-5 font-playfair text-2xl font-bold text-[#231f1c]">{module.title}</h2>
              <p className="mt-2 font-sans text-sm leading-6 text-[#6c625b]">{module.description}</p>
            </article>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-md border border-[#231f1c]/10 bg-white p-6 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold">Dashboard-data via adminApi</h2>
          <div className="mt-5 space-y-4 font-sans">
            {[
              `Nästa interna nyhet: ${internalNews[0]?.title ?? "Ingen nyhet"}.`,
              `Första kursmål: ${courses[0]?.goal ?? "Saknas"}`,
              `Nästa eventutkast: ${events[0]?.title ?? "Saknas"}.`,
              `Aktiv hero-bild: ${heroImages.find((image) => image.status === "published")?.title ?? "Saknas"}.`,
            ].map((item, index) => (
              <div key={item} className="flex gap-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#231f1c] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="pt-0.5 text-sm leading-6 text-[#5f5650]">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#231f1c]/10 bg-[#231f1c] p-6 text-white shadow-sm">
          <h2 className="font-playfair text-2xl font-bold">API-karta</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {endpointGroups.map((endpoint) => (
              <span
                key={endpoint}
                className="rounded-md border border-white/10 bg-white/10 px-3 py-2 font-mono text-xs text-white/85"
              >
                /api/admin/{endpoint}
              </span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
