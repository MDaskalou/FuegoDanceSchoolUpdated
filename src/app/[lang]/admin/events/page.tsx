import { getEvents } from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export default async function AdminEventsPage() {
  const events = await getEvents();

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 4"
        title="Events"
        description="Här planeras eventflödet med skapa, redigera, schemaläggning och publiceringsstatus."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {events.map((event) => (
          <article key={event.id} className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold">{event.title}</h2>
                <p className="mt-1 font-sans text-sm text-[#6c625b]">{event.location}</p>
              </div>
              <span className="rounded-md bg-[#f26722]/10 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#c2521c]">
                {event.status}
              </span>
            </div>
            <p className="mt-4 font-sans text-sm leading-6 text-[#5f5650]">{event.shortDescription}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
