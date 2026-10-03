"use client";

import { useActionState, useRef, useState } from "react";
import { gpsToPin, pinToGps } from "@/data/cave-calibration";
import type { Cave } from "@/data/caves";

type Save = (prev: { error: string | null }, form: FormData) => Promise<{ error: string | null }>;
const isGif = (url: string) => /\.gif($|\?)/i.test(url);

/**
 * Add or edit one cave: click the map to drop the pin (GPS fills in) or type the GPS, then the
 * name, notes, admin teleport and walkthrough clip. Saving puts it on /maps straight away.
 */
export function CaveEditor({
  action,
  map,
  cave,
  others,
}: {
  action: Save;
  map: { slug: string; name: string; image: { src: string; w: number; h: number } | null };
  cave: Cave | null;
  others: { id: string; name: string; x?: number; y?: number }[];
}) {
  const [state, formAction, pending] = useActionState(action, { error: null });
  const [name, setName] = useState(cave?.name ?? "");
  const [lat, setLat] = useState(cave ? String(cave.lat) : "");
  const [lon, setLon] = useState(cave ? String(cave.lon) : "");
  const [video, setVideo] = useState(cave?.video ?? "");
  const [upload, setUpload] = useState<{ busy: boolean; error: string | null }>({ busy: false, error: null });
  const fileRef = useRef<HTMLInputElement>(null);

  const pin = map.image && lat !== "" && lon !== "" ? gpsToPin(map.slug, Number(lat), Number(lon)) : null;

  const placePin = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const gps = pinToGps(map.slug, ((e.clientX - r.left) / r.width) * 100, ((e.clientY - r.top) / r.height) * 100);
    if (gps) {
      setLat(String(gps.lat));
      setLon(String(gps.lon));
    }
  };

  const uploadClip = async (file: File) => {
    setUpload({ busy: true, error: null });
    const body = new FormData();
    body.set("file", file);
    body.set("map", map.slug);
    body.set("name", name || "cave");
    try {
      const res = await fetch("/api/staff/caves/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "The upload failed. Try again.");
      setVideo(data.url);
      setUpload({ busy: false, error: null });
    } catch (e) {
      setUpload({ busy: false, error: e instanceof Error ? e.message : "The upload failed. Try again." });
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <form action={formAction} className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <input type="hidden" name="map" value={map.slug} />
      <input type="hidden" name="id" value={cave?.id ?? ""} />
      <input type="hidden" name="video" value={video} />

      <div className="grid content-start gap-3">
        {map.image ? (
          <>
            <p className="hud-label !text-sm">Click the map to drop the pin</p>
            <div
              role="button"
              tabIndex={-1}
              onClick={placePin}
              className="relative aspect-square w-full cursor-crosshair overflow-hidden border border-border bg-bg-secondary"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={map.image.src} alt={`${map.name} map`} draggable={false} className="absolute inset-0 h-full w-full select-none" />
              {others.map((o) =>
                o.x !== undefined && o.y !== undefined ? (
                  <span
                    key={o.id}
                    title={o.name}
                    className="absolute h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-bg-primary bg-text-primary/50"
                    style={{ left: `${o.x}%`, top: `${o.y}%` }}
                  />
                ) : null,
              )}
              {pin && (
                <span
                  className="absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-bg-primary bg-accent shadow-[0_0_0_4px_rgba(232,123,53,0.35)]"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                />
              )}
            </div>
            <p className="text-sm text-text-muted">Grey dots are the other caves on this map. Fine-tune with the GPS boxes.</p>
          </>
        ) : (
          <p className="border border-border bg-bg-card/60 p-4 text-sm text-text-muted">
            {map.name} has no map art, so its spots show as cards. Just fill in the GPS.
          </p>
        )}
      </div>

      <div className="grid content-start gap-5">
        {state.error && <p className="border-l-2 border-accent bg-bg-card/80 px-4 py-3 text-sm">{state.error}</p>}
        <label className="grid gap-1">
          <span className="hud-label !text-sm">Cave name</span>
          <input
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            className="border border-border bg-bg-primary px-3 py-2 focus:border-accent/50 focus:outline-none"
          />
        </label>
        <div className="flex gap-3">
          <label className="grid flex-1 gap-1">
            <span className="hud-label !text-sm">GPS latitude</span>
            <input
              name="lat"
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
              className="border border-border bg-bg-primary px-3 py-2 font-mono focus:border-accent/50 focus:outline-none"
            />
          </label>
          <label className="grid flex-1 gap-1">
            <span className="hud-label !text-sm">GPS longitude</span>
            <input
              name="lon"
              type="number"
              step="0.1"
              min={0}
              max={100}
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
              className="border border-border bg-bg-primary px-3 py-2 font-mono focus:border-accent/50 focus:outline-none"
            />
          </label>
        </div>
        <label className="grid gap-1">
          <span className="hud-label !text-sm">Notes (one per line: chokes, flyers, structure damage…)</span>
          <textarea
            name="notes"
            defaultValue={cave?.notes.join("\n") ?? ""}
            rows={5}
            className="border border-border bg-bg-primary px-3 py-2 text-sm focus:border-accent/50 focus:outline-none"
          />
        </label>
        <label className="grid gap-1">
          <span className="hud-label !text-sm">Admin teleport (optional)</span>
          <input
            name="spi"
            defaultValue={cave?.spi ?? ""}
            placeholder="Cheat SPI x y z yaw pitch"
            className="border border-border bg-bg-primary px-3 py-2 font-mono text-sm placeholder:text-text-muted/50 focus:border-accent/50 focus:outline-none"
          />
        </label>

        <div className="grid gap-2">
          <span className="hud-label !text-sm">Walkthrough clip (GIF, MP4 or WebM, up to 4 MB)</span>
          {video ? (
            isGif(video) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video} alt="" className="aspect-video w-full border border-border object-cover" />
            ) : (
              <video key={video} src={video} autoPlay muted loop playsInline className="aspect-video w-full border border-border object-cover" />
            )
          ) : (
            <div className="flex aspect-video w-full items-center justify-center border border-dashed border-border text-sm text-text-muted">No clip yet</div>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <label className="cursor-pointer border border-border px-3 py-2 font-display text-base font-extrabold uppercase tracking-wide transition hover:border-accent hover:text-accent">
              {upload.busy ? "Uploading…" : video ? "Replace clip" : "Upload clip"}
              <input
                ref={fileRef}
                type="file"
                accept="image/gif,video/mp4,video/webm"
                disabled={upload.busy}
                onChange={(e) => e.target.files?.[0] && uploadClip(e.target.files[0])}
                className="sr-only"
              />
            </label>
            {video && !upload.busy && (
              <button type="button" onClick={() => setVideo("")} className="text-sm text-text-muted underline underline-offset-4 hover:text-accent">
                Remove clip
              </button>
            )}
          </div>
          {upload.error && <p className="text-sm text-accent">{upload.error}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-border pt-5">
          <button
            type="submit"
            disabled={pending || upload.busy}
            className="clip-corner-sm bg-accent px-6 py-3 font-display text-xl font-extrabold uppercase tracking-wide text-bg-primary transition hover:bg-[#ff8c45] disabled:opacity-60"
          >
            {pending ? "Saving…" : cave ? "Save cave" : "Add cave"}
          </button>
          <span className="text-sm text-text-muted">Saving puts it on the map straight away.</span>
        </div>
      </div>
    </form>
  );
}
