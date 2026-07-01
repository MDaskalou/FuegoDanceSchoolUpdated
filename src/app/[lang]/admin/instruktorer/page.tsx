import { getInstructors } from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export default async function AdminInstruktorerPage() {
  const instructors = await getInstructors();

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 5"
        title="Instruktörer"
        description="Instruktörer får en egen yta för tillgänglighet, intern planering och koppling till kurser."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <article key={instructor.id} className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
            <h2 className="font-playfair text-2xl font-bold">{instructor.name}</h2>
            <p className="mt-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#c2521c]">
              {instructor.role}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {instructor.specialties.map((specialty) => (
                <span key={specialty} className="rounded-md bg-[#231f1c]/5 px-2.5 py-1 font-sans text-xs text-[#5f5650]">
                  {specialty}
                </span>
              ))}
            </div>
            <p className="mt-4 font-sans text-sm leading-6 text-[#5f5650]">{instructor.availabilityNote}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
