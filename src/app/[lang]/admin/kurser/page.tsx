import { getCourses } from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export default async function AdminKurserPage() {
  const courses = await getCourses();

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 3"
        title="Kurser"
        description="Kurslistan blir grunden för kursdetalj, kursmål, översiktlig planering och detaljplanering per lektion."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        {courses.map((course) => (
          <article key={course.id} className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-playfair text-2xl font-bold">{course.title}</h2>
                <p className="mt-1 font-sans text-sm text-[#6c625b]">{course.season}</p>
              </div>
              <span className="rounded-md bg-[#231f1c]/5 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]">
                {course.status}
              </span>
            </div>
            <p className="mt-4 font-sans text-sm font-bold text-[#c2521c]">{course.level}</p>
            <p className="mt-2 font-sans text-sm leading-6 text-[#5f5650]">{course.goal}</p>
            <div className="mt-4 h-2 rounded-full bg-[#231f1c]/10">
              <div
                className="h-2 rounded-full bg-[#f26722]"
                style={{ width: `${(course.completedLessons / course.plannedLessons) * 100}%` }}
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
