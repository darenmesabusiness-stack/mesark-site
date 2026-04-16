export interface WipeSchedule {
  cluster: string;
  /** 0 = Sunday, 1 = Monday, ..., 6 = Saturday */
  dayOfWeek: number;
  /** Hour in EST (24h format) */
  hour: number;
  /** Minute */
  minute: number;
}

export const wipeSchedules: WipeSchedule[] = [
  { cluster: "Solo", dayOfWeek: 1, hour: 13, minute: 0 },      // Monday 1 PM EST
  { cluster: "100x", dayOfWeek: 3, hour: 13, minute: 0 },      // Wednesday 1 PM EST
  { cluster: "Duo", dayOfWeek: 5, hour: 13, minute: 0 },       // Friday 1 PM EST
  { cluster: "3/6 Man", dayOfWeek: 6, hour: 13, minute: 0 },   // Saturday 1 PM EST
];

/**
 * Get the next wipe time for a given schedule entry.
 * Returns a Date in UTC that represents the next occurrence
 * of the wipe day/time in America/New_York timezone.
 */
export function getNextWipe(schedule: WipeSchedule, now: Date = new Date()): Date {
  // Convert "now" to EST components
  const estString = now.toLocaleString("en-US", { timeZone: "America/New_York" });
  const estNow = new Date(estString);

  const currentDay = estNow.getDay();
  const currentHour = estNow.getHours();
  const currentMinute = estNow.getMinutes();

  let daysUntil = schedule.dayOfWeek - currentDay;

  // If it's today but the time has passed, go to next week
  if (daysUntil === 0) {
    const pastWipe =
      currentHour > schedule.hour ||
      (currentHour === schedule.hour && currentMinute >= schedule.minute);
    if (pastWipe) {
      daysUntil = 7;
    }
  } else if (daysUntil < 0) {
    daysUntil += 7;
  }

  // Build the target date in EST
  const target = new Date(estNow);
  target.setDate(target.getDate() + daysUntil);
  target.setHours(schedule.hour, schedule.minute, 0, 0);

  // Convert back: figure out the offset between EST target and real UTC
  const targetEstString = target.toLocaleString("en-US", { timeZone: "America/New_York" });
  const diff = target.getTime() - new Date(targetEstString).getTime();

  return new Date(target.getTime() + diff);
}
