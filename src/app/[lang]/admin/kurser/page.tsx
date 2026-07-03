import { getCourses, getInstructors, getScheduleItems } from "@/admin/api/adminApi";
import { AdminCoursesWorkspace } from "@/admin/components/AdminCoursesWorkspace";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";

export default async function AdminKurserPage() {
  const [courses, instructors, scheduleItems] = await Promise.all([
    getCourses(),
    getInstructors(),
    getScheduleItems(),
  ]);

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 3"
        title="Kurser"
        description="Kurslistan blir grunden för kursdetalj, kursmål, översiktlig planering och detaljplanering per lektion."
      />

      <AdminCoursesWorkspace
        initialCourses={courses}
        instructors={instructors}
        scheduleItems={scheduleItems}
      />
    </section>
  );
}
