import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { LOGO_RATIOS } from "./logo-ratios";

const modules = import.meta.glob<{ url: string }>("@/assets/logos/*.asset.json", {
  eager: true,
  import: "default",
});

type Logo = { src: string; ratio: number };

const allLogos: Logo[] = Object.entries(modules).map(([path, m]) => {
  const file = path.split("/").pop()!.replace(".asset.json", "");
  return { src: m.url, ratio: LOGO_RATIOS[file] ?? 3.6 };
});

// Fixed shuffle so neighbouring logos in a row differ from the file order.
const pool: Logo[] = allLogos
  .map((l, i) => ({ l, k: (i * 37) % allLogos.length }))
  .sort((a, b) => a.k - b.k)
  .map((x) => x.l);

const ANGLE = -30;
const RAD = (ANGLE * Math.PI) / 180;
const UX = Math.cos(RAD);
const UY = Math.sin(RAD);
const NX = -Math.sin(RAD);
const NY = Math.cos(RAD);

type Settings = { logoH: number; gapX: number; gapY: number; opacity: number; speed: number };

const settingsFor = (width: number): Settings => {
  if (width < 768) return { logoH: 40, gapX: 44, gapY: 44, opacity: 0.12, speed: 14 };
  if (width < 1024) return { logoH: 48, gapX: 101, gapY: 48, opacity: 0.07, speed: 20 };
  return { logoH: 80, gapX: 101, gapY: 56, opacity: 0.07, speed: 26 };
};

/** Range of a tilted line (offset y from centre) that falls inside a W x H box. */
const chordAt = (y: number, W: number, H: number): [number, number] | null => {
  const ox = y * NX;
  const oy = y * NY;
  let lo = (-W / 2 - ox) / UX;
  let hi = (W / 2 - ox) / UX;
  const a = (H / 2 - oy) / UY;
  const b = (-H / 2 - oy) / UY;
  lo = Math.max(lo, Math.min(a, b));
  hi = Math.min(hi, Math.max(a, b));
  return hi > lo ? [lo, hi] : null;
};

type Row = { y: number; x0: number; logos: Logo[]; loop: number };

/**
 * Lays out the rows so every logo is on screen at most once at any moment:
 * rows never share logos, and each row's loop is longer than its visible stretch.
 */
const layout = (W: number, H: number, s: Settings): Row[] => {
  const widthOf = (l: Logo) => l.ratio * s.logoH + s.gapX;
  const maxW = Math.max(...pool.map(widthOf));
  let pitch = s.logoH + s.gapY;
  const reach = Math.hypot(W, H) + s.logoH;
  // The orange stripe graphic sits in the bottom-right corner at the same angle.
  // Keep the last row just above it instead of behind it.
  const stripeW = Math.min(W * (W < 768 ? 0.42 : 0.2), 320);
  const cornerY = (W / 2) * NX + (H / 2) * NY;
  const lastY = cornerY - stripeW * 0.55 - s.logoH / 2;

  for (let attempt = 0; attempt < 40; attempt++, pitch *= 1.05) {
    const lines: { y: number; lo: number; hi: number }[] = [];
    const n = Math.ceil(reach / pitch);
    for (let k = 0; k <= n; k++) {
      const y = lastY - k * pitch;
      const parts = [chordAt(y - s.logoH / 2, W, H), chordAt(y + s.logoH / 2, W, H)].filter(Boolean) as [
        number,
        number,
      ][];
      if (!parts.length) continue;
      lines.push({ y, lo: Math.min(...parts.map((p) => p[0])), hi: Math.max(...parts.map((p) => p[1])) });
    }

    const order = [...lines].sort((a, b) => b.hi - b.lo - (a.hi - a.lo));
    const rows = new Map<number, Logo[]>();
    let next = 0;
    let ok = true;
    for (const line of order) {
      const need = line.hi - line.lo + maxW;
      const picked: Logo[] = [];
      let len = 0;
      while (len < need && next < pool.length) {
        picked.push(pool[next]);
        len += widthOf(pool[next]);
        next++;
      }
      if (len < need) {
        ok = false;
        break;
      }
      rows.set(line.y, picked);
    }
    if (!ok) continue;

    // Spread any spare logos across the rows for extra variety.
    let i = 0;
    while (next < pool.length) {
      rows.get(order[i % order.length].y)!.push(pool[next++]);
      i++;
    }

    return lines.map((line) => {
      const logos = rows.get(line.y)!;
      const loop = logos.reduce((sum, l) => sum + widthOf(l), 0);
      const slack = loop - (line.hi - line.lo);
      return { y: line.y, x0: line.lo - slack / 2, logos, loop };
    });
  }
  return [];
};

const LogoMarquee = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const r = el.getBoundingClientRect();
      setSize((prev) =>
        prev && Math.abs(prev.w - r.width) < 1 && Math.abs(prev.h - r.height) < 1 ? prev : { w: r.width, h: r.height }
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const settings = size ? settingsFor(size.w) : null;
  const rows = useMemo(
    () => (size && settings ? layout(size.w, size.h, settings) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size?.w, size?.h]
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 top-16 overflow-hidden"
      style={{ opacity: settings?.opacity ?? 0 }}
    >
      {settings && (
        <div
          className="absolute left-1/2 top-1/2 h-0 w-0"
          style={{ transform: `rotate(${ANGLE}deg)` }}
        >
          {rows.map((row, r) => (
            <div
              key={`${row.y}-${r}`}
              className="absolute flex w-max"
              style={{ left: row.x0, top: row.y - settings.logoH / 2, height: settings.logoH }}
            >
              <div
                className="flex shrink-0 items-center"
                style={{
                  animation: `logo-marquee ${row.loop / (settings.speed - (r % 3) * 3)}s linear infinite ${
                    r % 2 ? "reverse" : "normal"
                  }`,
                }}
              >
                {[...row.logos, ...row.logos].map((logo, i) => (
                  <img
                    key={i}
                    src={logo.src}
                    alt=""
                    loading="eager"
                    className="max-w-none shrink-0 brightness-0 invert"
                    style={{
                      height: settings.logoH,
                      width: logo.ratio * settings.logoH,
                      marginRight: settings.gapX,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LogoMarquee;
