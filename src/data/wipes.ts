export interface WipeSchedule {
  cluster: string;
  /** 0 = Sunday, 1 = Monday, ..., 6 = Saturday */
  dayOfWeek: number;
  /** Hour in EST (24h format) */
  hour: number;
  /** Minute */
  minute: number;
  /** Wipes every N weeks (default 1). */
  everyWeeks?: number;
  /** Any real wipe date (YYYY-MM-DD, EST) — sets which weeks are wipe weeks. */
  anchorDate?: string;
}

export const wipeSchedules: WipeSchedule[] = [
  { cluster: "Solo", dayOfWeek: 1, hour: 13, minute: 0 },      // Monday 1 PM EST
  // Every other Wednesday since Oct 2026 (no wipe Sep 30, then Oct 7, Oct 21, ...).
  { cluster: "100x", dayOfWeek: 3, hour: 13, minute: 0, everyWeeks: 2, anchorDate: "2026-10-07" },
  { cluster: "3/4 Man", dayOfWeek: 5, hour: 13, minute: 0 },   // Friday 1 PM EST
  { cluster: "Duo", dayOfWeek: 6, hour: 13, minute: 0 },       // Saturday 1 PM EST
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

  // Every-N-weeks clusters: push to the next week that lines up with the anchor.
  const every = schedule.everyWeeks ?? 1;
  if (every > 1 && schedule.anchorDate) {
    const [ay, am, ad] = schedule.anchorDate.split("-").map(Number);
    const candidate = Date.UTC(estNow.getFullYear(), estNow.getMonth(), estNow.getDate() + daysUntil);
    const weeks = Math.round((candidate - Date.UTC(ay, am - 1, ad)) / (7 * 86400000));
    const offset = ((weeks % every) + every) % every;
    if (offset !== 0) daysUntil += 7 * (every - offset);
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

const SHORT_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/** Short cadence label, e.g. "Mon" or "Every 2nd Wed". */
export function shortCadence(schedule: WipeSchedule): string {
  const day = SHORT_DAYS[schedule.dayOfWeek];
  return (schedule.everyWeeks ?? 1) > 1 ? `Every ${ordinal(schedule.everyWeeks!)} ${day}` : day;
}

function ordinal(n: number): string {
  return n === 2 ? "2nd" : n === 3 ? "3rd" : `${n}th`;
}
