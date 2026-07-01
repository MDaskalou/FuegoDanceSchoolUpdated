import {
  currentAdminUser,
  mockCourses,
  mockDashboardSummary,
  mockEvents,
  mockHeroImages,
  mockInstructors,
  mockInternalNews,
  mockMonthlyLetters,
  mockRooms,
  mockScheduleItems,
} from "@/admin/data/mockAdminData";

export async function getCurrentAdminUser() {
  return currentAdminUser;
}

export async function getDashboardSummary() {
  return mockDashboardSummary;
}

export async function getCourses() {
  return mockCourses;
}

export async function getScheduleItems() {
  return mockScheduleItems;
}

export async function getEvents() {
  return mockEvents;
}

export async function getHeroImages() {
  return mockHeroImages;
}

export async function getInstructors() {
  return mockInstructors;
}

export async function getRooms() {
  return mockRooms;
}

export async function getInternalNews() {
  return mockInternalNews;
}

export async function getMonthlyLetters() {
  return mockMonthlyLetters;
}
