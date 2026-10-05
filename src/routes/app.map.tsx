import { createFileRoute } from "@tanstack/react-router";
import { Crosshair, MapPin } from "lucide-react";
import { useState } from "react";

import { AqiBadge } from "@/components/air/aqi-badge";
import { aqiFromPm25, categoryForPm25, categoryStyles, stations } from "@/lib/air-data";

export const Route = createFileRoute("/app/map")({
  head: () => ({
    meta: [
      { title: "Pollution Map — AirPredict" },
      { name: "description", content: "Color-coded AQI markers for nearby monitoring stations, pollution hotspots and your location." },
      { property: "og:title", content: "Pollution Map — AirPredict" },
      { property: "og:description", content: "Color-coded AQI markers and pollution hotspots near you." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const [selected, setSelected] = useState(stations[2]!);
  const category = categoryForPm25(selected.pm25);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Pollution hotspot map</h1>
        <p className="text-sm text-muted-foreground">Tap a marker to inspect a monitoring station</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="glass relative h-[26rem] overflow-hidden rounded-3xl sm:h-[32rem]">
          <div className="absolute inset-0 gradient-hero" />
          <svg className="absolute inset-0 size-full opacity-40" aria-hidden>
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M48 0H0V48" fill="none" stroke="var(--color-border)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            <path d="M0 320 C160 260 260 380 420 300 S720 200 960 280" stroke="var(--color-chart-2)" strokeWidth="14" fill="none" opacity="0.25" />
            <path d="M120 0 C160 160 90 280 180 420 S260 540 240 640" stroke="var(--color-chart-1)" strokeWidth="10" fill="none" opacity="0.2" />
          </svg>

          {stations.map((s) => {
            const c = categoryStyles[categoryForPm25(s.pm25)];
            const active = s.id === selected.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
                aria-label={s.name}
              >
                <span className="relative grid place-items-center">
                  <span className={`absolute size-10 rounded-full ${c.dot} opacity-40 animate-pulse-ring`} />
                  <span
                    className={`relative grid size-9 place-items-center rounded-full ${c.dot} text-[10px] font-bold text-white shadow-soft transition-transform ${
                      active ? "scale-125 ring-4 ring-primary/30" : ""
                    }`}
                  >
                    {Math.round(s.pm25)}
                  </span>
                </span>
              </button>
            );
          })}

          <div className="absolute left-[40%] top-[52%] -translate-x-1/2 -translate-y-1/2">
            <span className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-soft">
              <Crosshair className="size-3.5" /> You are here
            </span>
          </div>

          <div className="glass-soft absolute bottom-4 left-4 rounded-2xl p-3 text-xs">
            <p className="mb-2 font-semibold">AQI legend</p>
            <div className="flex flex-wrap gap-2">
              {(["Good", "Moderate", "Unhealthy", "Very Unhealthy", "Hazardous"] as const).map((c) => (
                <span key={c} className="flex items-center gap-1.5">
                  <span className={`size-2.5 rounded-full ${categoryStyles[c].dot}`} /> {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="glass rounded-3xl p-6">
            <p className="flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
              <MapPin className="size-3.5" /> Selected station
            </p>
            <h2 className="mt-2 text-xl font-semibold">{selected.name}</h2>
            <AqiBadge category={category} className="mt-3" />
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-xs text-muted-foreground">PM2.5</p>
                <p className="mt-1 text-2xl font-semibold">{selected.pm25}</p>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-xs text-muted-foreground">AQI</p>
                <p className="mt-1 text-2xl font-semibold">{aqiFromPm25(selected.pm25)}</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{categoryStyles[category].advice}</p>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="text-base font-semibold">Nearby stations</h3>
            <div className="mt-3 divide-y divide-border/70">
              {stations.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className="flex w-full items-center justify-between gap-3 py-3 text-left text-sm hover:text-primary"
                >
                  <span className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${categoryStyles[categoryForPm25(s.pm25)].dot}`} />
                    {s.name}
                  </span>
                  <span className="text-muted-foreground">{s.pm25} µg/m³</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
