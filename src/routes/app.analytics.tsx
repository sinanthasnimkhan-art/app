import { createFileRoute } from "@tanstack/react-router";
import { Download, FileText } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { categoryDistribution, dailyForecast, monthlyTrend, weeklyForecast } from "@/lib/air-data";

export const Route = createFileRoute("/app/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — AirPredict" },
      { name: "description", content: "Weekly and monthly air quality analytics with heatmap, distribution charts and PDF or CSV export." },
      { property: "og:title", content: "Analytics — AirPredict" },
      { property: "og:description", content: "Weekly and monthly PM2.5 analytics with exports." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AnalyticsPage,
});

const pieColors = [
  "var(--color-aqi-good)",
  "var(--color-aqi-moderate)",
  "var(--color-aqi-unhealthy)",
  "var(--color-aqi-very-unhealthy)",
  "var(--color-aqi-hazardous)",
];

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  fontSize: 12,
};

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const hourBuckets = ["00", "04", "08", "12", "16", "20"];

function heatValue(d: number, h: number) {
  return Math.round(40 + Math.sin(d / 1.5) * 18 + Math.cos(h / 1.2) * 26 + (h === 2 || h === 4 ? 30 : 0));
}

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Analytics</h1>
          <p className="text-sm text-muted-foreground">Pattern analysis across weeks and months</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full bg-card/70" onClick={() => toast.success("PDF report exported")}>
            <FileText className="mr-1 size-4" /> Export PDF
          </Button>
          <Button className="rounded-full" onClick={() => toast.success("CSV exported")}>
            <Download className="mr-1 size-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h3 className="text-base font-semibold">Weekly analytics</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyForecast}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Bar dataKey="pm25" name="PM2.5" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="aqi" name="AQI" fill="var(--color-chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-base font-semibold">Monthly analytics</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrend}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="var(--color-chart-1)" strokeWidth={2.5} />
                <Line type="monotone" dataKey="rainfall" name="Rainfall (mm)" stroke="var(--color-chart-2)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-base font-semibold">AQI category distribution</h3>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryDistribution} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={pieColors[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="text-base font-semibold">Pollution heatmap</h3>
          <p className="text-xs text-muted-foreground">Average PM2.5 by day and hour block</p>
          <div className="mt-5 space-y-2">
            {days.map((d, di) => (
              <div key={d} className="flex items-center gap-2">
                <span className="w-9 text-xs text-muted-foreground">{d}</span>
                <div className="flex flex-1 gap-2">
                  {hourBuckets.map((h, hi) => {
                    const v = heatValue(di, hi);
                    return (
                      <div
                        key={h}
                        title={`${d} ${h}:00 — ${v} µg/m³`}
                        className="flex h-10 flex-1 items-center justify-center rounded-xl text-[11px] font-medium text-foreground/80"
                        style={{ background: `color-mix(in oklab, var(--color-chart-4) ${Math.min(v, 100)}%, var(--color-secondary))` }}
                      >
                        {v}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 pl-11 text-[11px] text-muted-foreground">
              {hourBuckets.map((h) => (
                <span key={h} className="flex-1 text-center">{h}:00</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-3xl p-5">
        <h3 className="text-base font-semibold">Daily averages</h3>
        <div className="mt-4 h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyForecast}>
              <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Bar dataKey="pm25" name="PM2.5" fill="var(--color-chart-1)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="humidity" name="Humidity %" fill="var(--color-chart-3)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="temperature" name="Temp °C" fill="var(--color-chart-4)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
