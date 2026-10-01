import type { Metadata } from "next";

/** Site name and the short line used wherever mesark.net is described or shared. */
export const SITE = {
  name: "MESARK",
  url: "https://mesark.net",
  description: "ARK: Survival Evolved PvP servers run by IMIAN.",
  cover: { url: "/og-mesark.jpg", width: 1200, height: 630, alt: "MESARK: ARK: Survival Evolved PvP, run by IMIAN" },
} as const;

/**
 * Title, description and link-preview tags for one page. The layout's title template adds
 * " | MESARK" to <title>; previews show the page title with MESARK as the site name.
 * `image: null` leaves the preview image to an opengraph-image file in the route.
 */
export function pageMeta({
  title,
  description,
  image = SITE.cover,
  noindex = false,
}: {
  title: string;
  description: string;
  image?: { url: string; width?: number; height?: number; alt?: string } | null;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, siteName: SITE.name, type: "website", ...(image ? { images: [image] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(image ? { images: [image.url] } : {}) },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}
