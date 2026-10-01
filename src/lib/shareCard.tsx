import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

/**
 * The 1200x630 card Discord/X show when a profile link is pasted: real-ARK cluster art,
 * the name in MESA's display face and up to four stats.
 */
export const cardSize = { width: 1200, height: 630 };

export async function shareCard({
  kicker,
  title,
  art,
  stats,
}: {
  kicker: string;
  title: string;
  art: string; // a /art/ark/*.jpg render
  stats: { label: string; value: string }[];
}) {
  // Literal, folder-scoped paths so file tracing ships only these files with the route.
  const [display, mono, bg] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/BigShoulders-Black.ttf")),
    readFile(join(process.cwd(), "assets/fonts/JetBrainsMono-Medium.ttf")),
    readFile(join(process.cwd(), "public/art/ark", art.split("/").pop() ?? "siege.jpg")),
  ]);
  const titleSize = title.length > 16 ? 80 : title.length > 10 ? 104 : 132;

  // Text on the left, the cluster's portrait render on the right (as on the cluster cards).
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#07080b", color: "#efe8de" }}>
        <img
          src={`data:image/jpeg;base64,${bg.toString("base64")}`}
          width={520}
          height={630}
          style={{ position: "absolute", right: 0, top: 0, width: 520, height: 630, objectFit: "cover", objectPosition: "50% 30%" }}
        />
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            width: 520,
            height: 630,
            display: "flex",
            backgroundImage: "linear-gradient(90deg, #07080b 0%, rgba(7,8,11,0.55) 30%, rgba(7,8,11,0) 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -200,
            top: -260,
            width: 760,
            height: 520,
            display: "flex",
            borderRadius: 9999,
            backgroundImage: "radial-gradient(circle, rgba(232,123,53,0.22) 0%, rgba(232,123,53,0) 70%)",
          }}
        />
        <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "56px 64px", width: 780 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontFamily: "Mono", fontSize: 22, letterSpacing: 5, color: "#8d8c8f" }}>
            <div style={{ width: 48, height: 2, background: "#e87b35" }} />
            {kicker.toUpperCase()}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontFamily: "Display", fontSize: titleSize, lineHeight: 0.9, textTransform: "uppercase", maxWidth: 720 }}>{title}</div>
            <div style={{ display: "flex", gap: 44, marginTop: 36 }}>
              {stats.map((s) => (
                <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ fontFamily: "Display", fontSize: 64, lineHeight: 1, color: "#e87b35" }}>{s.value}</div>
                  <div style={{ fontFamily: "Mono", fontSize: 17, letterSpacing: 3, color: "#8d8c8f", marginTop: 8 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 34, letterSpacing: 2 }}>
            MESA<span style={{ color: "#e87b35", marginLeft: 12 }}>MESARK.NET</span>
          </div>
        </div>
      </div>
    ),
    {
      ...cardSize,
      fonts: [
        { name: "Display", data: display, weight: 900, style: "normal" },
        { name: "Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
