export type AdminRole = "Admin" | "Instructor" | "Coordinator";

export type PublishStatus = "draft" | "scheduled" | "published" | "archived";

export interface CurrentAdminUserDto {
  id: string;
  name: string;
  role: AdminRole;
  email: string;
}

export interface CourseCurriculumDto {
  purpose: string;
  prerequisites: string;
  durationWeeks: number;
  lessonDurationMinutes: number;
  finalGoals: string[];
  basicPositions: string[];
  movementPatterns: string[];
  soloSkills: string[];
  partnerSkills: string[];
  progressionCriteria: string;
}

export interface CourseDto {
  id: string;
  title: string;
  level: "Beginner" | "Improver" | "Intermediate" | "Advanced";
  season: string;
  status: "planning" | "open" | "active" | "completed";
  goal: string;
  techniques: string;
  leadInstructorId: string;
  instructorIds: string[];
  plannedLessons: number;
  completedLessons: number;
  curriculum: CourseCurriculumDto;
}

export interface InstructorDto {
  id: string;
  name: string;
  role: AdminRole;
  specialties: string[];
  availabilityNote: string;
}

export interface RoomDto {
  id: string;
  name: string;
  capacity: number;
}

export interface ScheduleItemDto {
  id: string;
  title: string;
  type: "course" | "private" | "training" | "event" | "internal";
  courseId: string;
  instructorId: string;
  instructorIds: string[];
  assistantInstructorIds: string[];
  roomId: string;
  level: CourseDto["level"];
  startsAt: string;
  endsAt: string;
  recurrenceWeeks: number;
  visibility: "public" | "internal";
  internalNotes: string;
}

export interface EventDto {
  id: string;
  title: string;
  startsAt: string;
  status: PublishStatus;
  location: string;
  shortDescription: string;
}

export interface HeroImageDto {
  id: string;
  title: string;
  imageUrl: string;
  altText: string;
  status: PublishStatus;
  sortOrder: number;
}

export interface InternalNewsDto {
  id: string;
  title: string;
  priority: "normal" | "important" | "urgent";
  publishedAt: string;
  audience: AdminRole[];
}

export interface MonthlyLetterDto {
  id: string;
  title: string;
  month: string;
  status: PublishStatus;
  audience: AdminRole[];
}

export interface DashboardSummaryDto {
  todaysClasses: number;
  upcomingEvents: number;
  coursesMissingPlans: number;
  unpublishedHeroImages: number;
}
