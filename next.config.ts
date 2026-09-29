import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [75, 85],
  },
  // Transcripts are served by the bot's dashboard on the VPS
  // (mesa_dashboard.py:/transcript/<id> on port 8050).
  // Route mesark.net/t/<id> → http://82.153.70.41:8050/transcript/<id>
  // so the HTML loads in-browser with a clean URL under the main domain.
  rewrites: async () => [
    {
      source: "/t/:id",
      destination: "http://82.153.70.41:8050/transcript/:id",
    },
  ],
  redirects: async () => [
    {
      source: "/store",
      destination: "https://mesark.tip4serv.com/",
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
