import { getInternalNews, getMonthlyLetters } from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export default async function AdminInterntPage() {
  const [news, letters] = await Promise.all([getInternalNews(), getMonthlyLetters()]);

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 5"
        title="Intern info"
        description="Intern info samlar månadsbrev, viktiga nyheter och information som bara teamet ska se."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold">Viktiga nyheter</h2>
          <div className="mt-4 space-y-3">
            {news.map((item) => (
              <div key={item.id} className="rounded-md bg-[#fbf9f6] p-4">
                <p className="font-sans text-sm font-bold">{item.title}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-[0.14em] text-[#7b6f67]">
                  {item.priority}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
          <h2 className="font-playfair text-2xl font-bold">Månadsbrev</h2>
          <div className="mt-4 space-y-3">
            {letters.map((letter) => (
              <div key={letter.id} className="rounded-md bg-[#fbf9f6] p-4">
                <p className="font-sans text-sm font-bold">{letter.title}</p>
                <p className="mt-1 font-sans text-xs uppercase tracking-[0.14em] text-[#7b6f67]">
                  {letter.month} · {letter.status}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
