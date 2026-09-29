"use client";

import { useEffect, useRef } from "react";

interface Ember {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  life: number;
  max: number;
  hue: number;
}

/**
 * Rising ember particles on a canvas. Pauses when off-screen and renders
 * nothing for users who prefer reduced motion.
 */
export function EmberField({ density = 70, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const count = window.innerWidth < 768 ? Math.round(density * 0.45) : density;

    const spawn = (initial = false): Ember => ({
      x: Math.random() * w,
      y: initial ? Math.random() * h : h + 10,
      r: Math.random() * 1.8 + 0.4,
      vy: -(Math.random() * 0.6 + 0.25),
      vx: (Math.random() - 0.5) * 0.25,
      life: 0,
      max: Math.random() * 500 + 300,
      hue: 18 + Math.random() * 18,
    });

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const embers: Ember[] = Array.from({ length: count }, () => spawn(true));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.life++;
        e.x += e.vx + Math.sin((e.life + i * 40) / 60) * 0.3;
        e.y += e.vy;
        const t = e.life / e.max;
        const alpha = t < 0.1 ? t * 10 : 1 - Math.max(0, (t - 0.6) / 0.4);
        if (e.y < -10 || e.life > e.max) {
          embers[i] = spawn();
          continue;
        }
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 4);
        g.addColorStop(0, `hsla(${e.hue + 10}, 100%, 70%, ${alpha})`);
        g.addColorStop(0.35, `hsla(${e.hue}, 95%, 55%, ${alpha * 0.55})`);
        g.addColorStop(1, `hsla(${e.hue}, 90%, 45%, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (visible) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(tick);
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
