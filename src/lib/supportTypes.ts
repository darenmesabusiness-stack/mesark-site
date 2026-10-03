export const SUPPORT_TYPES = [
  ["general", "General support"],
  ["question", "Question"],
  ["ban", "Ban appeal"],
  ["cheater", "Report a player"],
  ["store", "Store issue"],
  ["rank", "Purchased rank support"],
  ["report_staff", "Report staff"],
  ["hof", "Hall of Fame application"],
  ["creator", "Creator application"],
  ["bm_shirt", "Black market · Custom shirt"],
  ["bm_cave", "Black market · Custom cave"],
  ["bm_permanent", "Black market · Permanent rank"],
] as const;
export const supportLabel = (type: string) =>
  SUPPORT_TYPES.find(([key]) => key === type)?.[1] ?? "Support";
