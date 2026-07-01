import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

interface AdminPlaceholderPageProps {
  phase: string;
  title: string;
  description: string;
  items: string[];
}

export function AdminPlaceholderPage({
  phase,
  title,
  description,
  items,
}: AdminPlaceholderPageProps) {
  return (
    <section>
      <AdminPageHeader eyebrow={phase} title={title} description={description} />
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold">Planerad vy</h2>
          <p className="mt-2 font-sans text-sm leading-6 text-[#6c625b]">
            Den här sidan är klickbar i fas 1 så vi kan bestämma struktur,
            datafält och endpoints innan vi bygger full funktion.
          </p>
        </div>

        <div className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold">Behöver innehålla</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item} className="flex gap-3">
                <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#f26722]" />
                <p className="font-sans text-sm leading-6 text-[#5f5650]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
