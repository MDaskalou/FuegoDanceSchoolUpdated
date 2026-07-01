import { getHeroImages } from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export default async function AdminMediaPage() {
  const heroImages = await getHeroImages();

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 4"
        title="Media"
        description="Media samlar hero-bilder, bildbank, alt-texter och publiceringsstatus."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {heroImages.map((image) => (
          <article key={image.id} className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold">{image.title}</h2>
                <p className="mt-1 font-mono text-xs text-[#6c625b]">{image.imageUrl}</p>
              </div>
              <span className="rounded-md bg-[#231f1c]/5 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]">
                {image.status}
              </span>
            </div>
            <p className="mt-4 font-sans text-sm leading-6 text-[#5f5650]">Alt-text: {image.altText}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
