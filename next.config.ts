import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
