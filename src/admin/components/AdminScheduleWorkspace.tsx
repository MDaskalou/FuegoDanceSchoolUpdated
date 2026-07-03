"use client";

import { useMemo, useState } from "react";
import {
  CalendarDays,
  CalendarRange,
  Clock,
  Edit3,
  List,
  Plus,
  Repeat,
  Save,
  StickyNote,
  Users,
  X,
} from "lucide-react";
import type {
  CourseDto,
  InstructorDto,
  RoomDto,
  ScheduleItemDto,
} from "@/admin/types/adminDtos";
import { getCalendarEventLayouts } from "@/admin/utils/calendarLayout";

type ScheduleView = "week" | "month" | "list";

interface AdminScheduleWorkspaceProps {
  initialScheduleItems: ScheduleItemDto[];
  courses: CourseDto[];
  instructors: InstructorDto[];
  rooms: RoomDto[];
}

const viewOptions: Array<{ id: ScheduleView; label: string; icon: typeof CalendarDays }> = [
  { id: "week", label: "Vecka", icon: CalendarDays },
  { id: "month", label: "Månad", icon: CalendarRange },
  { id: "list", label: "Lista", icon: List },
];

const scheduleTypes: Array<{ value: ScheduleItemDto["type"]; label: string }> = [
  { value: "course", label: "Kurs" },
  { value: "private", label: "Privatlektion" },
  { value: "training", label: "Träning" },
  { value: "event", label: "Event" },
  { value: "internal", label: "Internt" },
];

const weekDayLabels = ["Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag", "Söndag"];
const monthDayLabels = ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
const dayStartHour = 7;
const dayEndHour = 22;
const hourHeight = 64;
const timeSlots = Array.from({ length: dayEndHour - dayStartHour + 1 }, (_, index) => dayStartHour + index);
const WEEK_GRID_COLUMNS = "68px repeat(7, minmax(150px, 1fr))";
const MONTH_GRID_COLUMNS = "44px repeat(7, minmax(0, 1fr))";

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toInputDateTime(value: string) {
  return value.slice(0, 16);
}

function withDateAndTime(date: Date, hour: number, minute = 0) {
  return `${toDateKey(date)}T${pad(hour)}:${pad(minute)}:00+01:00`;
}

function withDatePart(value: string, date: Date) {
  return `${toDateKey(date)}T${value.slice(11, 19)}+01:00`;
}

function withWeekOffset(value: string, weekOffset: number) {
  const date = new Date(value);
  date.setDate(date.getDate() + weekOffset * 7);
  return `${toDateKey(date)}T${value.slice(11, 19)}+01:00`;
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(value));
}

function formatMonthTitle(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function isToday(date: Date) {
  return toDateKey(date) === toDateKey(new Date());
}

function getWeekNumber(date: Date) {
  const target = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  return Math.ceil((((target.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getMondayForWeek(value: string) {
  const date = new Date(value);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  date.setHours(12, 0, 0, 0);
  return date;
}

function getWeekDates(value: string) {
  const monday = getMondayForWeek(value);

  return weekDayLabels.map((label, index) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + index);
    return { label, date, key: toDateKey(date) };
  });
}

function getMonthCalendarDates(value: string) {
  const focusDate = new Date(value);
  const month = focusDate.getMonth();
  const firstOfMonth = new Date(focusDate.getFullYear(), month, 1, 12);
  const firstDay = firstOfMonth.getDay();
  const mondayOffset = firstDay === 0 ? -6 : 1 - firstDay;
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() + mondayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + index);

    return {
      date,
      key: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
    };
  });
}

function getStartHour(value: string) {
  return Number(value.slice(11, 13));
}

export function AdminScheduleWorkspace({
  initialScheduleItems,
  courses,
  instructors,
  rooms,
}: AdminScheduleWorkspaceProps) {
  const [view, setView] = useState<ScheduleView>("week");
  const [scheduleItems, setScheduleItems] = useState(initialScheduleItems);
  const [selectedId, setSelectedId] = useState(initialScheduleItems[0]?.id ?? "");
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const selectedItem = scheduleItems.find((item) => item.id === selectedId) ?? scheduleItems[0];

  const [draft, setDraft] = useState<ScheduleItemDto>(
    selectedItem ?? {
      id: "schedule_new",
      title: "",
      type: "course",
      courseId: courses[0]?.id ?? "",
      instructorId: courses[0]?.instructorIds?.[0] ?? courses[0]?.leadInstructorId ?? instructors[0]?.id ?? "",
      instructorIds: courses[0]?.instructorIds?.length
        ? courses[0].instructorIds
        : courses[0]?.leadInstructorId
          ? [courses[0].leadInstructorId]
          : instructors[0]
            ? [instructors[0].id]
            : [],
      assistantInstructorIds: [],
      roomId: rooms[0]?.id ?? "",
      level: courses[0]?.level ?? "Beginner",
      startsAt: "2027-01-15T18:00:00+01:00",
      endsAt: "2027-01-15T19:00:00+01:00",
      recurrenceWeeks: 1,
      visibility: "public",
      internalNotes: "",
    },
  );

  const courseById = useMemo(() => new Map(courses.map((course) => [course.id, course])), [courses]);
  const instructorById = useMemo(
    () => new Map(instructors.map((instructor) => [instructor.id, instructor])),
    [instructors],
  );
  const roomById = useMemo(() => new Map(rooms.map((room) => [room.id, room])), [rooms]);
  const focusDate = scheduleItems[0]?.startsAt ?? draft.startsAt;
  const weekDates = useMemo(() => getWeekDates(focusDate), [focusDate]);
  const monthDates = useMemo(() => getMonthCalendarDates(focusDate), [focusDate]);
  const visibleMonthTitle = formatMonthTitle(focusDate);

  const itemsByDate = useMemo(() => {
    return scheduleItems.reduce<Record<string, ScheduleItemDto[]>>((groups, item) => {
      const key = item.startsAt.slice(0, 10);
      groups[key] = [...(groups[key] ?? []), item];
      return groups;
    }, {});
  }, [scheduleItems]);

  const leadNames = draft.instructorIds
    .map((id) => instructorById.get(id)?.name)
    .filter(Boolean)
    .join(", ");

  function selectItem(item: ScheduleItemDto) {
    setSelectedId(item.id);
    setDraft({
      ...item,
      instructorIds: item.instructorIds?.length ? item.instructorIds : [item.instructorId],
      assistantInstructorIds: item.assistantInstructorIds ?? [],
      recurrenceWeeks: item.recurrenceWeeks ?? 1,
    });
    setIsEditorOpen(true);
  }

  function startNewItem(date?: Date, hour = 18, minute = 0) {
    const course = courses[0];
    const startsAt = date ? withDateAndTime(date, hour, minute) : "2027-01-15T18:00:00+01:00";
    const endsAt = date ? withDateAndTime(date, hour + 1, minute) : "2027-01-15T19:00:00+01:00";

    setSelectedId("");
    setDraft({
      id: `schedule_${Date.now()}`,
      title: "Nytt schemapass",
      type: "course",
      courseId: course?.id ?? "",
      instructorId: course?.instructorIds?.[0] ?? course?.leadInstructorId ?? instructors[0]?.id ?? "",
      instructorIds: course?.instructorIds?.length
        ? course.instructorIds
        : course?.leadInstructorId
          ? [course.leadInstructorId]
          : instructors[0]
            ? [instructors[0].id]
            : [],
      assistantInstructorIds: [],
      roomId: rooms[0]?.id ?? "",
      level: course?.level ?? "Beginner",
      startsAt,
      endsAt,
      recurrenceWeeks: 12,
      visibility: "public",
      internalNotes: "Intern anteckning för planering.",
    });
    setIsEditorOpen(true);
  }

  function saveDraft() {
    setScheduleItems((items) => {
      const exists = items.some((item) => item.id === draft.id);

      if (exists) {
        return items.map((item) => (item.id === draft.id ? draft : item));
      }

      const recurrenceCount = Math.max(1, Math.min(52, draft.recurrenceWeeks));
      const repeatedItems = Array.from({ length: recurrenceCount }, (_, index) => ({
        ...draft,
        id: index === 0 ? draft.id : `${draft.id}_week_${index + 1}`,
        startsAt: withWeekOffset(draft.startsAt, index),
        endsAt: withWeekOffset(draft.endsAt, index),
        recurrenceWeeks: recurrenceCount,
      }));

      return [...items, ...repeatedItems];
    });
    setSelectedId(draft.id);
    setIsEditorOpen(false);
  }

  function updateDraft<K extends keyof ScheduleItemDto>(key: K, value: ScheduleItemDto[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function toggleLeadInstructor(instructorId: string) {
    setDraft((current) => {
      const exists = current.instructorIds.includes(instructorId);
      const nextIds = exists
        ? current.instructorIds.filter((id) => id !== instructorId)
        : [...current.instructorIds, instructorId];

      return {
        ...current,
        instructorIds: nextIds,
        instructorId: nextIds[0] ?? "",
        assistantInstructorIds: current.assistantInstructorIds.filter((id) => !nextIds.includes(id)),
      };
    });
  }

  function toggleAssistantInstructor(instructorId: string) {
    setDraft((current) => {
      const exists = current.assistantInstructorIds.includes(instructorId);

      return {
        ...current,
        assistantInstructorIds: exists
          ? current.assistantInstructorIds.filter((id) => id !== instructorId)
          : [...current.assistantInstructorIds, instructorId],
      };
    });
  }

  function getLeadInstructors(item: ScheduleItemDto) {
    return (item.instructorIds?.length ? item.instructorIds : [item.instructorId])
      .map((id) => instructorById.get(id)?.name)
      .filter(Boolean)
      .join(", ");
  }

  function renderCompactCard(item: ScheduleItemDto) {
    const course = courseById.get(item.courseId);
    const room = roomById.get(item.roomId);
    const isSelected = item.id === draft.id;

    return (
      <button
        key={item.id}
        type="button"
        onClick={() => selectItem(item)}
        title={`${course?.title ?? ""} · ${room?.name ?? ""} · ${item.internalNotes}`}
        className={`w-full rounded-md border px-2.5 py-2 text-left shadow-sm transition ${
          isSelected
            ? "border-[#f26722] bg-[#fff7f1]"
            : "border-[#231f1c]/10 bg-white hover:border-[#f26722]/50"
        }`}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="font-sans text-[11px] font-bold leading-4 text-[#c2521c]">
              {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
            </p>
            <h3 className="truncate font-sans text-sm font-bold leading-5 text-[#231f1c]">{item.title}</h3>
          </div>
          <span className="rounded bg-[#231f1c]/5 px-1.5 py-1 font-sans text-[10px] font-bold uppercase text-[#5f5650]">
            {item.visibility === "public" ? "Pub" : "Int"}
          </span>
        </div>
        <p className="mt-1 truncate font-sans text-xs text-[#6c625b]">{getLeadInstructors(item)}</p>
      </button>
    );
  }

  function getTimeFromClick(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const y = Math.max(0, event.clientY - rect.top);
    const rawMinutes = (y / hourHeight) * 60;
    const roundedMinutes = Math.round(rawMinutes / 15) * 15;
    const hour = dayStartHour + Math.floor(roundedMinutes / 60);
    const minute = roundedMinutes % 60;

    return {
      hour: Math.min(dayEndHour - 1, hour),
      minute,
    };
  }

  function renderWeekGrid() {
    return (
      <section className="overflow-hidden rounded-md border border-[#231f1c]/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <div className="min-w-[1180px]">
            <div
              className="sticky top-0 z-20 grid border-b border-[#231f1c]/10 bg-white"
              style={{ gridTemplateColumns: WEEK_GRID_COLUMNS }}
            >
              <div className="border-r border-[#231f1c]/10 bg-[#fbf9f6] px-2 py-3 font-sans text-xs font-bold text-[#7b6f67]">
                GMT+01
              </div>
              {weekDates.map((day) => (
                <button
                  key={day.key}
                  type="button"
                  onClick={() => startNewItem(day.date)}
                  className="border-r border-[#231f1c]/10 bg-[#fbf9f6] px-3 py-3 text-center transition hover:bg-[#fff7f1]"
                >
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]">
                    {day.label.slice(0, 3)}
                  </p>
                  <span
                    className={`mt-1 inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 font-sans text-lg font-bold ${
                      isToday(day.date) ? "bg-[#f26722] text-white" : "text-[#231f1c]"
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                </button>
              ))}
            </div>

            <div className="grid" style={{ gridTemplateColumns: WEEK_GRID_COLUMNS }}>
              <div className="bg-[#fbf9f6]">
                {timeSlots.slice(0, -1).map((hour) => (
                  <div
                    key={hour}
                    className="border-b border-r border-[#231f1c]/10 px-2 pt-2 text-right font-sans text-xs font-bold text-[#7b6f67]"
                    style={{ height: hourHeight }}
                  >
                    {pad(hour)}:00
                  </div>
                ))}
              </div>

              {weekDates.map((day) => {
                const items = itemsByDate[day.key] ?? [];
                const layouts = getCalendarEventLayouts(items, dayStartHour, hourHeight);

                return (
                  <div
                    key={day.key}
                    className="relative border-r border-[#231f1c]/10 bg-white"
                    style={{ height: (dayEndHour - dayStartHour) * hourHeight }}
                    onClick={(event) => {
                      const time = getTimeFromClick(event);
                      startNewItem(day.date, time.hour, time.minute);
                    }}
                  >
                    {timeSlots.slice(0, -1).map((hour) => (
                      <div
                        key={hour}
                        className="border-b border-[#231f1c]/10 transition hover:bg-[#fff7f1]/70"
                        style={{ height: hourHeight }}
                      />
                    ))}

                    {items.map((item) => {
                      const layout = layouts.get(item.id);

                      if (!layout) {
                        return null;
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            selectItem(item);
                          }}
                          title={`${courseById.get(item.courseId)?.title ?? ""} · ${roomById.get(item.roomId)?.name ?? ""} · ${item.internalNotes}`}
                          className={`absolute z-10 overflow-hidden rounded-md border px-2 py-1.5 text-left shadow-sm transition hover:shadow-md ${
                            item.visibility === "public"
                              ? "border-[#f26722]/35 bg-[#fff1e9] text-[#231f1c]"
                              : "border-[#231f1c]/15 bg-[#f3f0ed] text-[#231f1c]"
                          }`}
                          style={{
                            top: layout.top + 4,
                            height: Math.max(30, layout.height - 8),
                            left: `calc(${layout.left}% + 4px)`,
                            width: `calc(${layout.width}% - 8px)`,
                          }}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <div className="min-w-0">
                              <p className="font-sans text-[10px] font-bold leading-3 text-[#c2521c]">
                                {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
                              </p>
                              <p className="truncate font-sans text-xs font-bold leading-4">{item.title}</p>
                            </div>
                            <span className="rounded bg-white/70 px-1 py-0.5 font-sans text-[9px] font-bold uppercase text-[#5f5650]">
                              {item.visibility === "public" ? "Pub" : "Int"}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }

  function renderMonthGrid() {
    return (
      <section className="rounded-md border border-[#231f1c]/10 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="font-playfair text-2xl font-bold capitalize">{visibleMonthTitle}</h2>
            <p className="mt-1 font-sans text-sm text-[#6c625b]">
              Klicka på en dag för att lägga till ett schemapass.
            </p>
          </div>
          <span className="w-fit rounded-md bg-[#231f1c]/5 px-3 py-2 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]">
            Månadsvy
          </span>
        </div>

        <div
          className="grid border-l border-t border-[#231f1c]/10"
          style={{ gridTemplateColumns: MONTH_GRID_COLUMNS }}
        >
          <div className="border-b border-r border-[#231f1c]/10 bg-[#fbf9f6] px-2 py-2 text-center font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7b6f67]">
            V
          </div>
          {monthDayLabels.map((label) => (
            <div
              key={label}
              className="border-b border-r border-[#231f1c]/10 bg-[#fbf9f6] px-2 py-2 text-center font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]"
            >
              {label}
            </div>
          ))}
          {Array.from({ length: 6 }, (_, rowIndex) => {
            const week = monthDates.slice(rowIndex * 7, rowIndex * 7 + 7);

            return (
              <div key={rowIndex} className="contents">
                <div className="flex h-[108px] items-start justify-center border-b border-r border-[#231f1c]/10 bg-[#fbf9f6] px-2 py-3 font-sans text-xs font-bold text-[#7b6f67]">
                  {getWeekNumber(week[0].date)}
                </div>
                {week.map((day) => {
                  const items = itemsByDate[day.key] ?? [];

                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => startNewItem(day.date)}
                      className={`h-[108px] overflow-hidden border-b border-r border-[#231f1c]/10 p-2 text-left transition hover:bg-[#fff7f1] ${
                        day.isCurrentMonth ? "bg-white" : "bg-[#fbf9f6] text-[#9a8f87]"
                      }`}
                    >
                      <div className="mb-1.5 flex items-center justify-between gap-2">
                        <span
                          className={`inline-flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 font-sans text-sm font-bold ${
                            isToday(day.date) ? "bg-[#f26722] text-white" : ""
                          }`}
                        >
                          {day.date.getDate()}
                        </span>
                        <Plus size={13} className="text-[#f26722]" />
                      </div>
                      <div className="space-y-1">
                        {items.slice(0, 3).map((item) => (
                          <span
                            key={item.id}
                            role="button"
                            tabIndex={0}
                            onClick={(event) => {
                              event.stopPropagation();
                              selectItem(item);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter" || event.key === " ") {
                                event.preventDefault();
                                event.stopPropagation();
                                selectItem(item);
                              }
                            }}
                            className={`block truncate rounded-md px-1.5 py-1 font-sans text-[10px] font-bold leading-4 ${
                              item.type === "event"
                                ? "bg-green-100 text-green-800"
                                : item.visibility === "internal"
                                  ? "bg-[#231f1c]/10 text-[#5f5650]"
                                  : "bg-[#f26722]/10 text-[#c2521c]"
                            }`}
                          >
                            {formatTime(item.startsAt)} {item.title}
                          </span>
                        ))}
                        {items.length > 3 && (
                          <span className="block font-sans text-[10px] font-bold text-[#7b6f67]">
                            +{items.length - 3} fler
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  function renderListTable() {
    return (
      <section className="overflow-hidden rounded-md border border-[#231f1c]/10 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse font-sans text-sm">
            <thead className="bg-[#fbf9f6] text-left text-xs uppercase tracking-[0.14em] text-[#5f5650]">
              <tr>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Datum</th>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Tid</th>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Titel</th>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Typ</th>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Instruktörer</th>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Lokal</th>
                <th className="border-b border-[#231f1c]/10 px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduleItems.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => selectItem(item)}
                  className="cursor-pointer border-b border-[#231f1c]/10 transition hover:bg-[#fff7f1]"
                >
                  <td className="px-4 py-3 text-[#5f5650]">{formatDate(item.startsAt)}</td>
                  <td className="px-4 py-3 font-bold text-[#c2521c]">
                    {formatTime(item.startsAt)} - {formatTime(item.endsAt)}
                  </td>
                  <td className="px-4 py-3 font-bold text-[#231f1c]">{item.title}</td>
                  <td className="px-4 py-3 text-[#5f5650]">{item.type}</td>
                  <td className="px-4 py-3 text-[#5f5650]">{getLeadInstructors(item)}</td>
                  <td className="px-4 py-3 text-[#5f5650]">{roomById.get(item.roomId)?.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded bg-[#231f1c]/5 px-2 py-1 text-xs font-bold uppercase text-[#5f5650]">
                      {item.visibility}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  return (
    <div>
      <section className="min-w-0">
        <div className="mb-4 flex flex-col gap-3 rounded-md border border-[#231f1c]/10 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="grid grid-cols-3 gap-1 rounded-md bg-[#231f1c]/5 p-1">
            {viewOptions.map((option) => {
              const Icon = option.icon;
              const isActive = view === option.id;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setView(option.id)}
                  className={`flex h-10 items-center justify-center gap-2 rounded-md px-3 font-sans text-sm font-bold transition ${
                    isActive ? "bg-[#231f1c] text-white" : "text-[#5f5650] hover:bg-white"
                  }`}
                >
                  <Icon size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => startNewItem()}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#f26722] px-4 font-sans text-sm font-bold text-white transition hover:bg-[#c2521c]"
          >
            <Plus size={17} />
            Nytt pass
          </button>
        </div>

        {view === "week" && renderWeekGrid()}
        {view === "month" && renderMonthGrid()}
        {view === "list" && renderListTable()}
      </section>

      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#231f1c]/45 px-3 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="schedule-editor-title"
          onClick={() => setIsEditorOpen(false)}
        >
      <aside
        className="flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-[#231f1c]/10 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 border-b border-[#231f1c]/10 px-5 py-4">
          <div>
            <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#c2521c]">
              Schemapass
            </p>
            <h2 id="schedule-editor-title" className="mt-1 font-playfair text-2xl font-bold">
              Lägg till / redigera
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Edit3 size={22} className="hidden text-[#f26722] sm:block" />
            <button
              type="button"
              onClick={() => setIsEditorOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#231f1c]/10 text-[#5f5650] transition hover:border-[#f26722]/50 hover:text-[#c2521c]"
              aria-label="Stäng"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 space-y-3 overflow-y-auto px-5 pb-5">
          <details open className="rounded-md border border-[#231f1c]/10 bg-[#fbf9f6] p-3">
            <summary className="cursor-pointer font-sans text-sm font-bold text-[#4f4742]">Grundinfo</summary>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Titel</span>
                <input
                  value={draft.title}
                  onChange={(event) => updateDraft("title", event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                />
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Typ</span>
                  <select
                    value={draft.type}
                    onChange={(event) => updateDraft("type", event.target.value as ScheduleItemDto["type"])}
                    className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                  >
                    {scheduleTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                    Synlighet
                  </span>
                  <select
                    value={draft.visibility}
                    onChange={(event) =>
                      updateDraft("visibility", event.target.value as ScheduleItemDto["visibility"])
                    }
                    className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                  >
                    <option value="public">Publikt</option>
                    <option value="internal">Internt</option>
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Kurs</span>
                <select
                  value={draft.courseId}
                  onChange={(event) => {
                    const course = courseById.get(event.target.value);
                    updateDraft("courseId", event.target.value);
                    if (course) {
                      updateDraft("level", course.level);
                      updateDraft(
                        "instructorIds",
                        course.instructorIds?.length
                          ? course.instructorIds
                          : course.leadInstructorId
                            ? [course.leadInstructorId]
                            : [],
                      );
                      updateDraft("instructorId", course.instructorIds?.[0] ?? course.leadInstructorId ?? "");
                    }
                  }}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                >
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </details>

          <details className="rounded-md border border-[#231f1c]/10 bg-[#fbf9f6] p-3">
            <summary className="cursor-pointer font-sans text-sm font-bold text-[#4f4742]">
              <span className="inline-flex items-center gap-2">
                <Users size={15} />
                Instruktörer
              </span>
            </summary>
            <div className="mt-3 space-y-3">
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                    Huvudansvariga
                  </span>
                  <span className="font-sans text-xs text-[#7b6f67]">{draft.instructorIds.length} valda</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {instructors.map((instructor) => {
                    const checked = draft.instructorIds.includes(instructor.id);
                    const disabled = false;

                    return (
                      <button
                        key={instructor.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => toggleLeadInstructor(instructor.id)}
                        className={`rounded-md border px-3 py-2 font-sans text-xs font-bold transition ${
                          checked
                            ? "border-[#f26722] bg-white text-[#c2521c]"
                            : "border-[#231f1c]/10 bg-white/70 text-[#5f5650]"
                        } ${disabled ? "cursor-not-allowed opacity-50" : "hover:border-[#f26722]/50"}`}
                      >
                        {instructor.name}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 font-sans text-xs leading-5 text-[#7b6f67]">Valda: {leadNames || "ingen"}.</p>
              </div>

              <div>
                <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                  Hjälpinstruktörer
                </span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {instructors.map((instructor) => {
                    const checked = draft.assistantInstructorIds.includes(instructor.id);
                    const isLead = draft.instructorIds.includes(instructor.id);

                    return (
                      <button
                        key={instructor.id}
                        type="button"
                        disabled={isLead}
                        onClick={() => toggleAssistantInstructor(instructor.id)}
                        className={`rounded-md border px-3 py-2 font-sans text-xs font-bold transition ${
                          checked
                            ? "border-[#f26722] bg-white text-[#c2521c]"
                            : "border-[#231f1c]/10 bg-white/70 text-[#5f5650]"
                        } ${isLead ? "cursor-not-allowed opacity-50" : "hover:border-[#f26722]/50"}`}
                      >
                        {instructor.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </details>

          <details open className="rounded-md border border-[#231f1c]/10 bg-[#fbf9f6] p-3">
            <summary className="cursor-pointer font-sans text-sm font-bold text-[#4f4742]">Tid & upprepning</summary>
            <div className="mt-3 space-y-3">
              <label className="block">
                <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Lokal</span>
                <select
                  value={draft.roomId}
                  onChange={(event) => updateDraft("roomId", event.target.value)}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                >
                  {rooms.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                    <Clock size={14} />
                    Start
                  </span>
                  <input
                    type="datetime-local"
                    value={toInputDateTime(draft.startsAt)}
                    onChange={(event) => updateDraft("startsAt", `${event.target.value}:00+01:00`)}
                    className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                  />
                </label>

                <label className="block">
                  <span className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                    <Clock size={14} />
                    Slut
                  </span>
                  <input
                    type="datetime-local"
                    value={toInputDateTime(draft.endsAt)}
                    onChange={(event) => updateDraft("endsAt", `${event.target.value}:00+01:00`)}
                    className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                  />
                </label>
              </div>

              <label className="block">
                <span className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                  <Repeat size={14} />
                  Antal veckor framåt
                </span>
                <input
                  type="number"
                  min={1}
                  max={52}
                  value={draft.recurrenceWeeks}
                  onChange={(event) => updateDraft("recurrenceWeeks", Number(event.target.value))}
                  className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                />
              </label>
            </div>
          </details>

          <details className="rounded-md border border-[#231f1c]/10 bg-[#fbf9f6] p-3">
            <summary className="cursor-pointer font-sans text-sm font-bold text-[#4f4742]">
              <span className="inline-flex items-center gap-2">
                <StickyNote size={15} />
                Anteckningar
              </span>
            </summary>
            <textarea
              value={draft.internalNotes}
              onChange={(event) => updateDraft("internalNotes", event.target.value)}
              rows={4}
              className="mt-3 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
            />
          </details>

          <button
            type="button"
            onClick={saveDraft}
            disabled={draft.instructorIds.length === 0}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[#231f1c] px-4 font-sans text-sm font-bold text-white transition hover:bg-[#3b332e] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save size={17} />
            Spara i mockdata
          </button>
        </div>
      </aside>
        </div>
      )}
    </div>
  );
}
