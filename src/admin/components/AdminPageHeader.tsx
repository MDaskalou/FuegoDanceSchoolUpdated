interface AdminPageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function AdminPageHeader({ eyebrow, title, description }: AdminPageHeaderProps) {
  return (
    <div className="mb-6 border-b border-[#231f1c]/10 pb-5">
      <div className="mb-3 inline-flex rounded-md bg-[#231f1c] px-3 py-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-white">
        {eyebrow}
      </div>
      <h1 className="font-playfair text-4xl font-bold leading-tight text-[#231f1c] sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-3xl font-sans text-base leading-7 text-[#5f5650]">
        {description}
      </p>
    </div>
  );
}
