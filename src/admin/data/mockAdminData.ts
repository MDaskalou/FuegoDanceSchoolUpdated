import type {
  CourseDto,
  CurrentAdminUserDto,
  DashboardSummaryDto,
  EventDto,
  HeroImageDto,
  InstructorDto,
  InternalNewsDto,
  MonthlyLetterDto,
  RoomDto,
  ScheduleItemDto,
} from "@/admin/types/adminDtos";

export const currentAdminUser: CurrentAdminUserDto = {
  id: "user_mikael",
  name: "Mikael",
  role: "Admin",
  email: "mikael@fuegodanceschool.se",
};

export const mockInstructors: InstructorDto[] = [
  {
    id: "inst_mikael",
    name: "Mikael",
    role: "Admin",
    specialties: ["Bachata Sensual", "Musicality"],
    availabilityNote: "Kan ta privatlektioner onsdagar och söndagar.",
  },
  {
    id: "inst_sofie",
    name: "Sofie",
    role: "Instructor",
    specialties: ["Beginner", "Partnerwork"],
    availabilityNote: "Ej tillgänglig vecka 42.",
  },
  {
    id: "inst_sisco",
    name: "Sisco",
    role: "Instructor",
    specialties: ["Intermediate", "Social dance"],
    availabilityNote: "Tillgänglig för workshops på helger.",
  },
];

export const mockRooms: RoomDto[] = [
  { id: "room_main", name: "Stora salen", capacity: 34 },
  { id: "room_studio", name: "Studion", capacity: 18 },
];

export const mockCourses: CourseDto[] = [
  {
    id: "course_beginner_spring",
    title: "Bachata Beginner",
    level: "Beginner",
    season: "Vårtermin 2027",
    status: "planning",
    goal: "Eleverna ska kunna dansa en trygg social grund med timing, bassteg och enkla turer.",
    leadInstructorId: "inst_sofie",
    plannedLessons: 8,
    completedLessons: 0,
  },
  {
    id: "course_improver_spring",
    title: "Bachata Improver",
    level: "Improver",
    season: "Vårtermin 2027",
    status: "open",
    goal: "Bygga flyt, tydligare connection och enklare variationer i partnerwork.",
    leadInstructorId: "inst_mikael",
    plannedLessons: 8,
    completedLessons: 0,
  },
  {
    id: "course_intermediate_spring",
    title: "Bachata Intermediate",
    level: "Intermediate",
    season: "Vårtermin 2027",
    status: "active",
    goal: "Utveckla body movement, musicality och tryggare social improvisation.",
    leadInstructorId: "inst_sisco",
    plannedLessons: 10,
    completedLessons: 3,
  },
];

export const mockScheduleItems: ScheduleItemDto[] = [
  {
    id: "schedule_001",
    title: "Beginner lektion 1",
    type: "course",
    courseId: "course_beginner_spring",
    instructorId: "inst_sofie",
    instructorIds: ["inst_sofie", "inst_mikael"],
    assistantInstructorIds: [],
    roomId: "room_main",
    level: "Beginner",
    startsAt: "2027-01-12T18:00:00+01:00",
    endsAt: "2027-01-12T19:15:00+01:00",
    recurrenceWeeks: 8,
    visibility: "public",
    internalNotes: "Första lektionen: extra fokus på välkomnande och nivåkontroll.",
  },
  {
    id: "schedule_002",
    title: "Intermediate technique",
    type: "course",
    courseId: "course_intermediate_spring",
    instructorId: "inst_sisco",
    instructorIds: ["inst_sisco"],
    assistantInstructorIds: ["inst_sofie"],
    roomId: "room_main",
    level: "Intermediate",
    startsAt: "2027-01-13T19:30:00+01:00",
    endsAt: "2027-01-13T20:45:00+01:00",
    recurrenceWeeks: 10,
    visibility: "public",
    internalNotes: "Förbered övning för isolations och transitions.",
  },
  {
    id: "schedule_003",
    title: "Privatträning instruktörer",
    type: "training",
    courseId: "course_improver_spring",
    instructorId: "inst_mikael",
    instructorIds: ["inst_mikael"],
    assistantInstructorIds: ["inst_sisco"],
    roomId: "room_studio",
    level: "Improver",
    startsAt: "2027-01-14T17:00:00+01:00",
    endsAt: "2027-01-14T18:00:00+01:00",
    recurrenceWeeks: 1,
    visibility: "internal",
    internalNotes: "Intern genomgång av vårterminens kursmål.",
  },
];

export const mockEvents: EventDto[] = [
  {
    id: "event_social_jan",
    title: "Fuego Night",
    startsAt: "2027-01-24T20:00:00+01:00",
    status: "draft",
    location: "Göteborg",
    shortDescription: "Socialkväll med bachata, animations och prova-på-pass.",
  },
  {
    id: "event_workshop_feb",
    title: "Beginner Bootcamp",
    startsAt: "2027-02-07T12:00:00+01:00",
    status: "scheduled",
    location: "Stora salen",
    shortDescription: "Intensiv introduktion för nya elever innan kursstart.",
  },
];

export const mockHeroImages: HeroImageDto[] = [
  {
    id: "hero_main",
    title: "Vårtermin hero",
    imageUrl: "/img/Hero/HeroMain.jpg",
    altText: "Dansare på Fuego Dance School",
    status: "published",
    sortOrder: 1,
  },
  {
    id: "hero_summer",
    title: "Sommarkampanj",
    imageUrl: "/img/Hero/HeroSummer.png",
    altText: "Fuego sommardans",
    status: "draft",
    sortOrder: 2,
  },
];

export const mockInternalNews: InternalNewsDto[] = [
  {
    id: "news_001",
    title: "Planeringsmöte inför vårterminen",
    priority: "important",
    publishedAt: "2026-12-10T09:00:00+01:00",
    audience: ["Admin", "Instructor", "Coordinator"],
  },
  {
    id: "news_002",
    title: "Ny rutin för intern passanteckning",
    priority: "normal",
    publishedAt: "2026-12-15T09:00:00+01:00",
    audience: ["Admin", "Instructor"],
  },
];

export const mockMonthlyLetters: MonthlyLetterDto[] = [
  {
    id: "letter_jan",
    title: "Instruktörsbrev januari",
    month: "2027-01",
    status: "draft",
    audience: ["Admin", "Instructor"],
  },
];

export const mockDashboardSummary: DashboardSummaryDto = {
  todaysClasses: 3,
  upcomingEvents: mockEvents.length,
  coursesMissingPlans: 2,
  unpublishedHeroImages: mockHeroImages.filter((image) => image.status !== "published").length,
};
