"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Edit3,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type { CourseDto, InstructorDto, ScheduleItemDto } from "@/admin/types/adminDtos";

interface AdminCoursesWorkspaceProps {
  initialCourses: CourseDto[];
  instructors: InstructorDto[];
  scheduleItems: ScheduleItemDto[];
}

type CourseFormErrors = Record<string, string>;
type CourseWizardStep = 1 | 2 | 3 | 4;

const courseLevels: CourseDto["level"][] = ["Beginner", "Improver", "Intermediate", "Advanced"];

const courseStatuses: Array<{ value: CourseDto["status"]; label: string; description: string }> = [
  { value: "planning", label: "Planering", description: "Intern planering, inte redo ännu." },
  { value: "open", label: "Öppen", description: "Redo för nästa steg mot anmälan eller publicering." },
  { value: "active", label: "Aktiv", description: "Kursen pågår." },
  { value: "completed", label: "Avslutad", description: "Kursen är genomförd." },
];

const beginnerLevelOneCurriculum: CourseDto["curriculum"] = {
  purpose:
    "Introducera absoluta nybörjare till grunderna i Bachata Sensual med fokus på musikalitet, kroppsmekanik, trygghet i grundpositioner och kontrollerade rörelsemönster.",
  prerequisites: "Inga tidigare danserfarenheter krävs. Nivån är anpassad för absoluta nybörjare.",
  durationWeeks: 12,
  lessonDurationMinutes: 60,
  finalGoals: [
    "Hitta 1:an och 5:an i bachatamusik och starta dansen på rätt takt.",
    "Hålla grundtakten 1-2-3-tap solo och i par.",
    "Förstå stabil men flexibel frame samt grundläggande tension.",
    "Använda små kontrollerade steg med balans och tydlig viktöverföring.",
    "Förstå raka, diagonala och kvadratiska rörelsemönster.",
  ],
  basicPositions: ["Close position", "Social position", "Open position", "Shadow position"],
  movementPatterns: [
    "Raka linjer: fram, bak, vänster och höger.",
    "Diagonala linjer för positionsbyten och mjukare riktningar.",
    "Kvadratiska mönster/box patterns för kontroll av tyngdpunkt.",
  ],
  soloSkills: [
    "Grundsteg i sidled",
    "Rompe adelante",
    "Cuadrado",
    "V-step",
    "Open Basic med höftisolering",
    "Outside basic",
    "Paso de Madrid",
    "Simple turn solo",
    "Open close-isolering av bröstkorg och höft",
  ],
  partnerSkills: [
    "Close, Social, Open och Shadow position",
    "Cambio på raka och diagonala linjer",
    "Completo",
    "Simple turn i par",
    "Diagonal Lateral Waves med grundmekanik",
    "Hip roll med grundläggande isolering",
    "Pinza och Paseala i geometriska mönster",
    "Impulso och Slide",
    "Översiktlig mekanik för Head rolls",
  ],
  progressionCriteria:
    "Eleven är redo för Level 2 när hen visar komfort med isolerade rörelser, kan hålla takten och behärskar grundpositionerna samt rummets axlar.",
};

function listToText(items: string[]) {
  return items.join("\n");
}

function textToList(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function createEmptyCourse(instructors: InstructorDto[]): CourseDto {
  return {
    id: `course_${Date.now()}`,
    title: "",
    level: "Beginner",
    season: "Vårtermin 2027",
    status: "planning",
    goal: "",
    techniques: "",
    leadInstructorId: instructors[0]?.id ?? "",
    instructorIds: instructors.slice(0, 2).map((instructor) => instructor.id),
    plannedLessons: beginnerLevelOneCurriculum.durationWeeks,
    completedLessons: 0,
    curriculum: beginnerLevelOneCurriculum,
  };
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("sv-SE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function getCourseProgress(course: CourseDto) {
  if (course.plannedLessons <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((course.completedLessons / course.plannedLessons) * 100));
}

function getCourseInstructorIds(course: CourseDto) {
  return course.instructorIds?.length ? course.instructorIds : [course.leadInstructorId].filter(Boolean);
}

export function AdminCoursesWorkspace({
  initialCourses,
  instructors,
  scheduleItems,
}: AdminCoursesWorkspaceProps) {
  const [courses, setCourses] = useState(initialCourses);
  const [draft, setDraft] = useState<CourseDto>(() => createEmptyCourse(instructors));
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<CourseDto | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [currentStep, setCurrentStep] = useState<CourseWizardStep>(1);

  const instructorById = useMemo(
    () => new Map(instructors.map((instructor) => [instructor.id, instructor])),
    [instructors],
  );

  const scheduleItemsByCourseId = useMemo(() => {
    return scheduleItems.reduce<Record<string, ScheduleItemDto[]>>((groups, item) => {
      groups[item.courseId] = [...(groups[item.courseId] ?? []), item];
      return groups;
    }, {});
  }, [scheduleItems]);

  const linkedScheduleItems = editingCourseId ? scheduleItemsByCourseId[editingCourseId] ?? [] : [];
  const deleteScheduleItems = courseToDelete ? scheduleItemsByCourseId[courseToDelete.id] ?? [] : [];
  const sortedDeleteScheduleItems = [...deleteScheduleItems].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );

  const formErrors = useMemo<CourseFormErrors>(() => {
    const errors: CourseFormErrors = {};

    if (!draft.title.trim()) {
      errors.title = "Titel krävs.";
    }

    if (!draft.season.trim()) {
      errors.season = "Säsong krävs.";
    }

    if (!draft.goal.trim()) {
      errors.goal = "Övergripande plan krävs.";
    }

    if (!draft.techniques.trim()) {
      errors.techniques = "Rörelser och tekniker krävs.";
    }

    if (!draft.leadInstructorId || !instructorById.has(draft.leadInstructorId)) {
      errors.leadInstructorId = "Välj en huvudansvarig instruktör.";
    }

    if (getCourseInstructorIds(draft).filter((id) => instructorById.has(id)).length < 2) {
      errors.instructorIds = "Välj minst två instruktörer till kursen.";
    }

    if (draft.plannedLessons < 1) {
      errors.plannedLessons = "Planerade lektioner måste vara minst 1.";
    }

    if (draft.completedLessons < 0) {
      errors.completedLessons = "Genomförda lektioner kan inte vara negativt.";
    } else if (draft.completedLessons > draft.plannedLessons) {
      errors.completedLessons = "Genomförda lektioner kan inte vara fler än planerade.";
    }

    if (!draft.curriculum.purpose.trim()) {
      errors["curriculum.purpose"] = "Huvudsyfte krävs.";
    }

    if (!draft.curriculum.prerequisites.trim()) {
      errors["curriculum.prerequisites"] = "Förkunskapskrav krävs.";
    }

    if (draft.curriculum.durationWeeks < 1) {
      errors["curriculum.durationWeeks"] = "Kurslängd måste vara minst 1 vecka.";
    }

    if (draft.curriculum.lessonDurationMinutes < 15) {
      errors["curriculum.lessonDurationMinutes"] = "Lektionstid måste vara minst 15 minuter.";
    }

    if (draft.curriculum.finalGoals.length < 1) {
      errors["curriculum.finalGoals"] = "Lägg till minst ett slutmål.";
    }

    if (draft.curriculum.basicPositions.length < 1) {
      errors["curriculum.basicPositions"] = "Lägg till minst en grundposition.";
    }

    if (draft.curriculum.movementPatterns.length < 1) {
      errors["curriculum.movementPatterns"] = "Lägg till minst ett rörelsemönster.";
    }

    if (draft.curriculum.soloSkills.length < 1) {
      errors["curriculum.soloSkills"] = "Lägg till minst en solo-färdighet.";
    }

    if (draft.curriculum.partnerSkills.length < 1) {
      errors["curriculum.partnerSkills"] = "Lägg till minst en par-färdighet.";
    }

    if (!draft.curriculum.progressionCriteria.trim()) {
      errors["curriculum.progressionCriteria"] = "Progressionskriterier krävs.";
    }

    return errors;
  }, [draft, instructorById]);

  const stepFields: Record<CourseWizardStep, Array<keyof CourseDto>> = {
    1: ["title", "season", "level", "status"],
    2: ["leadInstructorId", "instructorIds"],
    3: ["plannedLessons", "completedLessons", "goal", "techniques"],
    4: [],
  };
  const curriculumStepFields = [
    "curriculum.purpose",
    "curriculum.prerequisites",
    "curriculum.durationWeeks",
    "curriculum.lessonDurationMinutes",
    "curriculum.finalGoals",
    "curriculum.basicPositions",
    "curriculum.movementPatterns",
    "curriculum.soloSkills",
    "curriculum.partnerSkills",
    "curriculum.progressionCriteria",
  ];
  const isFormValid = Object.keys(formErrors).length === 0;
  const isCurrentStepValid =
    stepFields[currentStep].every((field) => !formErrors[field]) &&
    (currentStep !== 4 || curriculumStepFields.every((field) => !formErrors[field]));
  const isEditing = editingCourseId !== null;
  const hasMissingLeadInstructor =
    Boolean(draft.leadInstructorId) && !instructorById.has(draft.leadInstructorId);
  const selectedInstructorIds = getCourseInstructorIds(draft);
  const originalCourse = editingCourseId ? courses.find((course) => course.id === editingCourseId) : undefined;
  const isEditingLinkedCourse = linkedScheduleItems.length > 0;
  const changedScheduleRelevantFields =
    Boolean(originalCourse) &&
    (originalCourse?.title !== draft.title || originalCourse?.level !== draft.level);

  function startNewCourse() {
    setDraft(createEmptyCourse(instructors));
    setEditingCourseId(null);
    setCurrentStep(1);
    setFormError("");
    setIsEditorOpen(true);
  }

  function editCourse(course: CourseDto) {
    setDraft({
      ...course,
      instructorIds: getCourseInstructorIds(course),
      techniques: course.techniques ?? "",
      curriculum: course.curriculum ?? beginnerLevelOneCurriculum,
    });
    setEditingCourseId(course.id);
    setCurrentStep(1);
    setFormError("");
    setIsEditorOpen(true);
  }

  function requestDeleteCourse(course: CourseDto) {
    setCourseToDelete(course);
    setDeleteError("");
  }

  function closeEditor() {
    if (!isSaving) {
      setIsEditorOpen(false);
      setFormError("");
    }
  }

  function closeDeleteModal() {
    if (!isDeleting) {
      setCourseToDelete(null);
      setDeleteError("");
    }
  }

  function updateDraft<K extends keyof CourseDto>(key: K, value: CourseDto[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateCurriculum<K extends keyof CourseDto["curriculum"]>(
    key: K,
    value: CourseDto["curriculum"][K],
  ) {
    setDraft((current) => ({
      ...current,
      curriculum: {
        ...current.curriculum,
        [key]: value,
      },
    }));
  }

  function updateLeadInstructor(instructorId: string) {
    setDraft((current) => {
      const nextInstructorIds = Array.from(new Set([instructorId, ...getCourseInstructorIds(current)]));

      return {
        ...current,
        leadInstructorId: instructorId,
        instructorIds: nextInstructorIds,
      };
    });
  }

  function toggleCourseInstructor(instructorId: string) {
    setDraft((current) => {
      if (current.leadInstructorId === instructorId) {
        return current;
      }

      const currentIds = getCourseInstructorIds(current);
      const exists = currentIds.includes(instructorId);
      const nextInstructorIds = exists
        ? currentIds.filter((id) => id !== instructorId)
        : [...currentIds, instructorId];

      return {
        ...current,
        instructorIds: nextInstructorIds,
      };
    });
  }

  function goToNextStep() {
    if (isCurrentStepValid) {
      setCurrentStep((step) => Math.min(4, step + 1) as CourseWizardStep);
    }
  }

  function goToPreviousStep() {
    setCurrentStep((step) => Math.max(1, step - 1) as CourseWizardStep);
  }

  async function saveCourse() {
    if (!isFormValid || isSaving) {
      return;
    }

    setIsSaving(true);
    setFormError("");
    const courseToSave: CourseDto = {
      ...draft,
      instructorIds: Array.from(new Set([draft.leadInstructorId, ...getCourseInstructorIds(draft)])).filter(Boolean),
    };

    try {
      await Promise.resolve();
      setCourses((currentCourses) => {
        const exists = currentCourses.some((course) => course.id === courseToSave.id);

        if (exists) {
          return currentCourses.map((course) => (course.id === courseToSave.id ? courseToSave : course));
        }

        return [...currentCourses, courseToSave];
      });
      setIsEditorOpen(false);
    } catch {
      setFormError("Kursen kunde inte sparas. Försök igen.");
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteCourse() {
    if (!courseToDelete || deleteScheduleItems.length > 0 || isDeleting) {
      return;
    }

    setIsDeleting(true);
    setDeleteError("");

    try {
      await Promise.resolve();
      setCourses((currentCourses) => currentCourses.filter((course) => course.id !== courseToDelete.id));
      setCourseToDelete(null);
    } catch {
      setDeleteError("Kursen kunde inte tas bort. Försök igen.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 rounded-md border border-[#231f1c]/10 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#c2521c]">
            {courses.length} kurser
          </p>
          <p className="mt-1 font-sans text-sm text-[#6c625b]">
            Skapa, uppdatera och skydda kurser som används i schemat.
          </p>
        </div>
        <button
          type="button"
          onClick={startNewCourse}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-[#f26722] px-4 font-sans text-sm font-bold text-white transition hover:bg-[#c2521c]"
        >
          <Plus size={17} />
          Ny kurs
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {courses.map((course) => {
          const leadInstructor = instructorById.get(course.leadInstructorId);
          const courseInstructorNames = getCourseInstructorIds(course)
            .map((id) => instructorById.get(id)?.name ?? "(instruktör saknas)")
            .join(", ");
          const progress = getCourseProgress(course);
          const linkedItems = scheduleItemsByCourseId[course.id] ?? [];

          return (
            <article key={course.id} className="rounded-md border border-[#231f1c]/10 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="truncate font-playfair text-2xl font-bold text-[#231f1c]">{course.title}</h2>
                  <p className="mt-1 font-sans text-sm text-[#6c625b]">{course.season}</p>
                </div>
                <span className="shrink-0 rounded-md bg-[#231f1c]/5 px-2.5 py-1 font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#5f5650]">
                  {course.status}
                </span>
              </div>

              <div className="mt-4 grid gap-2 font-sans text-sm text-[#5f5650]">
                <p className="flex items-center gap-2 font-bold text-[#c2521c]">
                  <BookOpen size={15} />
                  {course.level}
                </p>
                <p className="flex items-center gap-2">
                  <UserRound size={15} />
                  {leadInstructor?.name ?? "(instruktör saknas)"} ansvarar
                </p>
                <p className="flex items-center gap-2">
                  <UserRound size={15} />
                  {courseInstructorNames}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays size={15} />
                  {linkedItems.length} kopplade schemapass
                </p>
              </div>

              <div className="mt-4 space-y-2 font-sans text-sm leading-6 text-[#5f5650]">
                <p className="line-clamp-2">{course.goal}</p>
                <p className="line-clamp-2 text-[#6c625b]">{course.techniques}</p>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-[#231f1c]/5 p-3 font-sans text-xs text-[#5f5650]">
                <div>
                  <p className="font-bold text-[#231f1c]">{course.curriculum.durationWeeks} veckor</p>
                  <p className="mt-0.5">Läroplan</p>
                </div>
                <div>
                  <p className="font-bold text-[#231f1c]">{course.curriculum.finalGoals.length} mål</p>
                  <p className="mt-0.5">Slutmål</p>
                </div>
                <div>
                  <p className="font-bold text-[#231f1c]">
                    {course.curriculum.soloSkills.length + course.curriculum.partnerSkills.length}
                  </p>
                  <p className="mt-0.5">Färdigheter</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-3 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                  <span>Lektioner</span>
                  <span>
                    {course.completedLessons}/{course.plannedLessons}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#231f1c]/10">
                  <div className="h-2 rounded-full bg-[#f26722]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={() => editCourse(course)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-[#231f1c]/10 bg-white px-3 font-sans text-sm font-bold text-[#4f4742] transition hover:border-[#f26722]/50 hover:text-[#c2521c]"
                >
                  <Edit3 size={16} />
                  Redigera
                </button>
                <button
                  type="button"
                  onClick={() => requestDeleteCourse(course)}
                  className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-md border border-red-200 bg-red-50 px-3 font-sans text-sm font-bold text-red-700 transition hover:border-red-300 hover:bg-red-100"
                >
                  <Trash2 size={16} />
                  Ta bort
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {isEditorOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#231f1c]/45 px-3 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-editor-title"
          onClick={closeEditor}
        >
          <section
            className="flex max-h-[calc(100vh-3rem)] w-full max-w-3xl flex-col overflow-hidden rounded-md border border-[#231f1c]/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#231f1c]/10 px-5 py-4">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-[#c2521c]">
                  Kurser
                </p>
                <h2 id="course-editor-title" className="mt-1 font-playfair text-2xl font-bold">
                  {isEditing ? "Redigera kurs" : "Ny kurs"}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#231f1c]/10 text-[#5f5650] transition hover:border-[#f26722]/50 hover:text-[#c2521c] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Stäng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="min-h-0 space-y-4 overflow-y-auto p-5">
              <div className="rounded-md bg-[#231f1c]/5 p-2">
                <div className="mb-2 flex items-center justify-between font-sans text-xs font-bold uppercase tracking-[0.14em] text-[#7b6f67]">
                  <span>Steg {currentStep} av 4</span>
                  <span>
                    {currentStep === 1 && "Grundinformation"}
                    {currentStep === 2 && "Instruktörer"}
                    {currentStep === 3 && "Kursinnehåll"}
                    {currentStep === 4 && "Läroplan"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => setCurrentStep(step as CourseWizardStep)}
                      className={`h-2 rounded-full transition ${
                        currentStep >= step ? "bg-[#f26722]" : "bg-[#231f1c]/15"
                      }`}
                      aria-label={`Gå till steg ${step}`}
                    />
                  ))}
                </div>
              </div>

              {currentStep === 1 && isEditingLinkedCourse && changedScheduleRelevantFields && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 font-sans text-sm leading-6 text-amber-900">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={17} className="mt-0.5 shrink-0" />
                    <p>
                      Den här kursen används i {linkedScheduleItems.length} schemapass. Ändringar av namn eller nivå
                      påverkar hur kursen visas i adminflödet.
                    </p>
                  </div>
                </div>
              )}

              {formError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 font-sans text-sm font-bold text-red-700">
                  {formError}
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Titel</span>
                    <input
                      value={draft.title}
                      onChange={(event) => updateDraft("title", event.target.value)}
                      className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                    />
                    {formErrors.title && <p className="mt-1.5 font-sans text-xs font-bold text-red-700">{formErrors.title}</p>}
                  </label>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Säsong
                    </span>
                    <input
                      value={draft.season}
                      onChange={(event) => updateDraft("season", event.target.value)}
                      className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                    />
                    {formErrors.season && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">{formErrors.season}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Nivå</span>
                    <select
                      value={draft.level}
                      onChange={(event) => updateDraft("level", event.target.value as CourseDto["level"])}
                      className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                    >
                      {courseLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">Status</span>
                    <select
                      value={draft.status}
                      onChange={(event) => updateDraft("status", event.target.value as CourseDto["status"])}
                      className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                    >
                      {courseStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1.5 font-sans text-xs leading-5 text-[#7b6f67]">
                      {courseStatuses.find((status) => status.value === draft.status)?.description}
                    </p>
                  </label>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Huvudansvarig
                    </span>
                    <select
                      value={draft.leadInstructorId}
                      onChange={(event) => updateLeadInstructor(event.target.value)}
                      className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                    >
                      {hasMissingLeadInstructor && (
                        <option value={draft.leadInstructorId}>(instruktör saknas)</option>
                      )}
                      {instructors.map((instructor) => (
                        <option key={instructor.id} value={instructor.id}>
                          {instructor.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Instruktörer kopplade till kursen
                      </span>
                      <span className="font-sans text-xs text-[#7b6f67]">{selectedInstructorIds.length} valda</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {hasMissingLeadInstructor && (
                        <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 font-sans text-xs font-bold text-amber-900">
                          (instruktör saknas)
                        </span>
                      )}
                      {instructors.map((instructor) => {
                        const checked = selectedInstructorIds.includes(instructor.id);
                        const isLead = draft.leadInstructorId === instructor.id;

                        return (
                          <button
                            key={instructor.id}
                            type="button"
                            disabled={isLead}
                            onClick={() => toggleCourseInstructor(instructor.id)}
                            className={`rounded-md border px-3 py-2 font-sans text-xs font-bold transition ${
                              checked
                                ? "border-[#f26722] bg-white text-[#c2521c]"
                                : "border-[#231f1c]/10 bg-white/70 text-[#5f5650]"
                            } ${isLead ? "cursor-not-allowed opacity-80" : "hover:border-[#f26722]/50"}`}
                          >
                            {instructor.name}
                            {isLead ? " · ansvarig" : ""}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {(formErrors.leadInstructorId || formErrors.instructorIds) && (
                    <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                      {formErrors.leadInstructorId ?? formErrors.instructorIds}
                    </p>
                  )}
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Planerade
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={draft.plannedLessons}
                        onChange={(event) => updateDraft("plannedLessons", Number(event.target.value))}
                        className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                      />
                      {formErrors.plannedLessons && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">{formErrors.plannedLessons}</p>
                      )}
                    </label>

                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Genomförda
                      </span>
                      <input
                        type="number"
                        min={0}
                        value={draft.completedLessons}
                        onChange={(event) => updateDraft("completedLessons", Number(event.target.value))}
                        className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                      />
                      {formErrors.completedLessons && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors.completedLessons}
                        </p>
                      )}
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Övergripande plan
                    </span>
                    <textarea
                      value={draft.goal}
                      onChange={(event) => updateDraft("goal", event.target.value)}
                      rows={3}
                      className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                    />
                    {formErrors.goal && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">{formErrors.goal}</p>
                    )}
                  </label>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Rörelser och tekniker
                    </span>
                    <textarea
                      value={draft.techniques}
                      onChange={(event) => updateDraft("techniques", event.target.value)}
                      rows={3}
                      className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                    />
                    {formErrors.techniques && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">{formErrors.techniques}</p>
                    )}
                  </label>
                </div>
              )}

              {currentStep === 4 && (
                <div className="grid gap-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Kurslängd i veckor
                      </span>
                      <input
                        type="number"
                        min={1}
                        value={draft.curriculum.durationWeeks}
                        onChange={(event) => updateCurriculum("durationWeeks", Number(event.target.value))}
                        className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                      />
                      {formErrors["curriculum.durationWeeks"] && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors["curriculum.durationWeeks"]}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Minuter per lektion
                      </span>
                      <input
                        type="number"
                        min={15}
                        value={draft.curriculum.lessonDurationMinutes}
                        onChange={(event) => updateCurriculum("lessonDurationMinutes", Number(event.target.value))}
                        className="mt-1.5 h-10 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 font-sans text-sm outline-none focus:border-[#f26722]"
                      />
                      {formErrors["curriculum.lessonDurationMinutes"] && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors["curriculum.lessonDurationMinutes"]}
                        </p>
                      )}
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Huvudsyfte
                    </span>
                    <textarea
                      value={draft.curriculum.purpose}
                      onChange={(event) => updateCurriculum("purpose", event.target.value)}
                      rows={3}
                      className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                    />
                    {formErrors["curriculum.purpose"] && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                        {formErrors["curriculum.purpose"]}
                      </p>
                    )}
                  </label>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Förkunskapskrav
                    </span>
                    <textarea
                      value={draft.curriculum.prerequisites}
                      onChange={(event) => updateCurriculum("prerequisites", event.target.value)}
                      rows={2}
                      className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                    />
                    {formErrors["curriculum.prerequisites"] && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                        {formErrors["curriculum.prerequisites"]}
                      </p>
                    )}
                  </label>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Slutmål
                      </span>
                      <textarea
                        value={listToText(draft.curriculum.finalGoals)}
                        onChange={(event) => updateCurriculum("finalGoals", textToList(event.target.value))}
                        rows={7}
                        className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                      />
                      {formErrors["curriculum.finalGoals"] && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors["curriculum.finalGoals"]}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Grundpositioner
                      </span>
                      <textarea
                        value={listToText(draft.curriculum.basicPositions)}
                        onChange={(event) => updateCurriculum("basicPositions", textToList(event.target.value))}
                        rows={7}
                        className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                      />
                      {formErrors["curriculum.basicPositions"] && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors["curriculum.basicPositions"]}
                        </p>
                      )}
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Rörelsemönster och geometri
                    </span>
                    <textarea
                      value={listToText(draft.curriculum.movementPatterns)}
                      onChange={(event) => updateCurriculum("movementPatterns", textToList(event.target.value))}
                      rows={4}
                      className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                    />
                    {formErrors["curriculum.movementPatterns"] && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                        {formErrors["curriculum.movementPatterns"]}
                      </p>
                    )}
                  </label>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Solo-färdigheter
                      </span>
                      <textarea
                        value={listToText(draft.curriculum.soloSkills)}
                        onChange={(event) => updateCurriculum("soloSkills", textToList(event.target.value))}
                        rows={9}
                        className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                      />
                      {formErrors["curriculum.soloSkills"] && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors["curriculum.soloSkills"]}
                        </p>
                      )}
                    </label>

                    <label className="block">
                      <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                        Par-färdigheter
                      </span>
                      <textarea
                        value={listToText(draft.curriculum.partnerSkills)}
                        onChange={(event) => updateCurriculum("partnerSkills", textToList(event.target.value))}
                        rows={9}
                        className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                      />
                      {formErrors["curriculum.partnerSkills"] && (
                        <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                          {formErrors["curriculum.partnerSkills"]}
                        </p>
                      )}
                    </label>
                  </div>

                  <label className="block">
                    <span className="font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                      Bedömning och progression
                    </span>
                    <textarea
                      value={draft.curriculum.progressionCriteria}
                      onChange={(event) => updateCurriculum("progressionCriteria", event.target.value)}
                      rows={3}
                      className="mt-1.5 w-full rounded-md border border-[#231f1c]/15 bg-white px-3 py-3 font-sans text-sm leading-6 outline-none focus:border-[#f26722]"
                    />
                    {formErrors["curriculum.progressionCriteria"] && (
                      <p className="mt-1.5 font-sans text-xs font-bold text-red-700">
                        {formErrors["curriculum.progressionCriteria"]}
                      </p>
                    )}
                  </label>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#231f1c]/10 bg-[#fbf9f6] px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeEditor}
                disabled={isSaving}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#231f1c]/15 bg-white px-4 font-sans text-sm font-bold text-[#5f5650] transition hover:border-[#f26722]/50 hover:text-[#c2521c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Avbryt
              </button>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={isSaving}
                  className="inline-flex h-11 items-center justify-center rounded-md border border-[#231f1c]/15 bg-white px-4 font-sans text-sm font-bold text-[#5f5650] transition hover:border-[#f26722]/50 hover:text-[#c2521c] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Föregående
                </button>
              )}
              {currentStep < 4 && (
                <button
                  type="button"
                  onClick={goToNextStep}
                  disabled={!isCurrentStepValid || isSaving}
                  className="inline-flex h-11 items-center justify-center rounded-md bg-[#231f1c] px-5 font-sans text-sm font-bold text-white transition hover:bg-[#3b332e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Nästa
                </button>
              )}
              {currentStep === 4 && (
                <button
                  type="button"
                  onClick={saveCourse}
                  disabled={!isFormValid || isSaving}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-[#231f1c] px-5 font-sans text-sm font-bold text-white transition hover:bg-[#3b332e] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Save size={17} />
                  {isSaving ? "Sparar..." : "Spara kurs"}
                </button>
              )}
            </div>
          </section>
        </div>
      )}

      {courseToDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#231f1c]/45 px-3 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="course-delete-title"
          onClick={closeDeleteModal}
        >
          <section
            className="w-full max-w-xl rounded-md border border-[#231f1c]/10 bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#231f1c]/10 px-5 py-4">
              <div>
                <p className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-red-700">
                  Ta bort kurs
                </p>
                <h2 id="course-delete-title" className="mt-1 font-playfair text-2xl font-bold">
                  {courseToDelete.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#231f1c]/10 text-[#5f5650] transition hover:border-[#f26722]/50 hover:text-[#c2521c] disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Stäng"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 p-5">
              {deleteError && (
                <div className="rounded-md border border-red-200 bg-red-50 p-3 font-sans text-sm font-bold text-red-700">
                  {deleteError}
                </div>
              )}

              {deleteScheduleItems.length > 0 ? (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={20} className="mt-0.5 shrink-0 text-amber-700" />
                    <div>
                      <h3 className="font-sans text-sm font-bold text-amber-950">
                        Kursen används i {deleteScheduleItems.length} schemapass
                      </h3>
                      <p className="mt-1 font-sans text-sm leading-6 text-amber-900">
                        Dessa schemapass måste flyttas eller tas bort innan kursen kan tas bort.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    {sortedDeleteScheduleItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="rounded-md bg-white/75 px-3 py-2 font-sans text-sm">
                        <p className="font-bold text-[#231f1c]">{item.title}</p>
                        <p className="mt-0.5 text-xs font-bold uppercase tracking-[0.12em] text-[#7b6f67]">
                          {formatDateTime(item.startsAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="rounded-md border border-red-200 bg-red-50 p-4">
                  <div className="flex items-start gap-3">
                    <Trash2 size={20} className="mt-0.5 shrink-0 text-red-700" />
                    <p className="font-sans text-sm leading-6 text-red-900">
                      Kursen saknar kopplade schemapass och kan tas bort permanent från mockdatan.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#231f1c]/10 bg-[#fbf9f6] px-5 py-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={isDeleting}
                className="inline-flex h-11 items-center justify-center rounded-md border border-[#231f1c]/15 bg-white px-4 font-sans text-sm font-bold text-[#5f5650] transition hover:border-[#f26722]/50 hover:text-[#c2521c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Stäng
              </button>
              {deleteScheduleItems.length === 0 && (
                <button
                  type="button"
                  onClick={deleteCourse}
                  disabled={isDeleting}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-red-700 px-5 font-sans text-sm font-bold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDeleting ? <CheckCircle2 size={17} /> : <Trash2 size={17} />}
                  {isDeleting ? "Tar bort..." : "Ta bort kurs"}
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
