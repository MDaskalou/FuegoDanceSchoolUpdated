import type { ScheduleItemDto } from "@/admin/types/adminDtos";

export interface CalendarEventLayout {
  top: number;
  height: number;
  left: number;
  width: number;
}

function getMinutesFromDayStart(value: string, dayStartHour: number) {
  const date = new Date(value);
  return (date.getHours() - dayStartHour) * 60 + date.getMinutes();
}

function overlaps(a: ScheduleItemDto, b: ScheduleItemDto) {
  return new Date(a.startsAt).getTime() < new Date(b.endsAt).getTime()
    && new Date(b.startsAt).getTime() < new Date(a.endsAt).getTime();
}

function getOverlapGroups(items: ScheduleItemDto[]) {
  const sorted = [...items].sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  );
  const groups: ScheduleItemDto[][] = [];

  for (const item of sorted) {
    const lastGroup = groups[groups.length - 1];

    if (!lastGroup) {
      groups.push([item]);
      continue;
    }

    const groupEnd = Math.max(...lastGroup.map((event) => new Date(event.endsAt).getTime()));

    if (new Date(item.startsAt).getTime() < groupEnd) {
      lastGroup.push(item);
    } else {
      groups.push([item]);
    }
  }

  return groups;
}

export function getCalendarEventLayouts(
  items: ScheduleItemDto[],
  dayStartHour: number,
  hourHeight: number,
) {
  const layouts = new Map<string, CalendarEventLayout>();

  getOverlapGroups(items).forEach((group) => {
    const tracks: ScheduleItemDto[][] = [];

    group.forEach((item) => {
      const trackIndex = tracks.findIndex((track) => !track.some((trackItem) => overlaps(trackItem, item)));
      const safeTrackIndex = trackIndex === -1 ? tracks.length : trackIndex;

      if (!tracks[safeTrackIndex]) {
        tracks[safeTrackIndex] = [];
      }

      tracks[safeTrackIndex].push(item);
    });

    const trackCount = Math.max(1, tracks.length);

    tracks.forEach((track, trackIndex) => {
      track.forEach((item) => {
        const startMinutes = getMinutesFromDayStart(item.startsAt, dayStartHour);
        const endMinutes = getMinutesFromDayStart(item.endsAt, dayStartHour);
        const durationMinutes = Math.max(15, endMinutes - startMinutes);

        layouts.set(item.id, {
          top: (startMinutes / 60) * hourHeight,
          height: (durationMinutes / 60) * hourHeight,
          left: (trackIndex / trackCount) * 100,
          width: 100 / trackCount,
        });
      });
    });
  });

  return layouts;
}
