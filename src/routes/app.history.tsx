import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AqiBadge } from "@/components/air/aqi-badge";
import { Input } from "@/components/ui/input";
import { categoryForPm25, predictionHistory, stations } from "@/lib/air-data";

export const Route = createFileRoute("/app/history")({
  head: () => ({
    meta: [
      { title: "History — AirPredict" },
      { name: "description", content: "Browse and search previous PM2.5 predictions by date and monitoring location." },
      { property: "og:title", content: "History — AirPredict" },
      { property: "og:description", content: "Search previous PM2.5 predictions by date and location." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("all");

  const rows = useMemo(
    () =>
      predictionHistory.filter(
        (r) =>
          (location === "all" || r.location === location) &&
          (!date || r.date === date) &&
          (r.location + r.id).toLowerCase().includes(query.toLowerCase()),
      ),
    [query, date, location],
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Prediction history</h1>
        <p className="text-sm text-muted-foreground">{predictionHistory.length} stored predictions</p>
      </div>

      <div className="glass rounded-3xl p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-card/70 pl-9"
            />
          </div>
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-card/70" />
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-9 rounded-md border border-input bg-card/70 px-3 text-sm"
          >
            <option value="all">All locations</option>
            {stations.map((s) => (
              <option key={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[46rem] text-sm">
            <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="pb-3">ID</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Location</th>
                <th className="pb-3">Current</th>
                <th className="pb-3">Predicted</th>
                <th className="pb-3">Category</th>
                <th className="pb-3">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/70">
              {rows.map((r) => (
                <tr key={r.id} className="transition-colors hover:bg-secondary/50">
                  <td className="py-3 font-medium">{r.id}</td>
                  <td className="py-3 text-muted-foreground">{r.date} · {r.time}</td>
                  <td className="py-3">{r.location}</td>
                  <td className="py-3">{r.current}</td>
                  <td className="py-3 font-medium">{r.predicted}</td>
                  <td className="py-3"><AqiBadge category={categoryForPm25(r.predicted)} /></td>
                  <td className="py-3 text-muted-foreground">{r.confidence}%</td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    No predictions match those filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
