import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  // Transcripts are served by the bot (mesa_dashboard.py /transcript/<id>) behind
  // nginx at https://bot.mesark.net/t/<id>. Route mesark.net/t/<id> there so the HTML
  // loads in-browser with a clean URL under the main domain, over HTTPS end to end.
  rewrites: async () => [
    {
      source: "/t/:id",
      destination: "https://bot.mesark.net/t/:id",
    },
  ],
  redirects: async () => [
    {
      source: "/store",
      destination: "https://store.mesark.net/",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      // Higgsfield-generated art + hero loops. Filenames are stable, so a
      // week of edge cache with background revalidation is safe.
      source: "/:dir(art|video)/:file*",
      headers: [
        { key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" },
      ],
    },
    {
      source: "/t/:id",
      headers: [
        // Allow iframing the transcript for future embed use cases.
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "no-referrer" },
      ],
    },
    {
      source: "/((?!t/).*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Strict-Transport-Security",
          value: "max-age=63072000; includeSubDomains; preload",
        },
      ],
    },
  ],
};

export default nextConfig;
