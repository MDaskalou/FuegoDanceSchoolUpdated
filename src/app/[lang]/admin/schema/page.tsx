import { getCourses, getInstructors, getRooms, getScheduleItems } from "@/admin/api/adminApi";
import { AdminPageHeader } from "@/admin/components/AdminPageHeader";
import { AdminScheduleWorkspace } from "@/admin/components/AdminScheduleWorkspace";

export default async function AdminSchemaPage() {
  const [scheduleItems, courses, instructors, rooms] = await Promise.all([
    getScheduleItems(),
    getCourses(),
    getInstructors(),
    getRooms(),
  ]);

  return (
    <section>
      <AdminPageHeader
        eyebrow="Fas 2"
        title="Schema"
        description="Första schemavyn med vecka, månad, lista och ett mockat formulär för att lägga till eller redigera pass."
      />

      <AdminScheduleWorkspace
        initialScheduleItems={scheduleItems}
        courses={courses}
        instructors={instructors}
        rooms={rooms}
      />
    </section>
  );
}
