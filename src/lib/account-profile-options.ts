export const PROFILE_ACCENTS = { ember: "#f5782b", gold: "#e9bf57", teal: "#50c9bd", violet: "#b995ef" } as const;
export type ProfileAccent = keyof typeof PROFILE_ACCENTS;
export type AccountProfile = { id: string; bio: string; accent: ProfileAccent; published: boolean };
