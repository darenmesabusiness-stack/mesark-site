/** Public Steam image CDN only. Never put a Steam ID/profile URL in page markup. */
export function steamAvatar(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return /^https:\/\/(avatars\.(?:steamstatic\.com|akamai\.steamstatic\.com|fastly\.steamstatic\.com)|steamcdn-a\.akamaihd\.net|cdn\.akamai\.steamstatic\.com)\/(?:steamcommunity\/public\/images\/avatars\/[a-f0-9]{2}\/)?[a-f0-9]{40}(?:_full|_medium)?\.jpg$/i.test(
    value,
  )
    ? value
    : null;
}
