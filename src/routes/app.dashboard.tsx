import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, CloudSun, Gauge, ShieldAlert, Timer, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AqiBadge } from "@/components/air/aqi-badge";
import { StatCard } from "@/components/air/stat-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CONFIDENCE,
  CURRENT_AQI,
  CURRENT_PM25,
  PREDICTED_PM25,
  dailyForecast,
  hourlyForecast,
  monthlyTrend,
  weeklyForecast,
} from "@/lib/air-data";

export const Route = createFileRoute("/app/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — AirPredict" },
      { name: "description", content: "Live PM2.5, AQI, 24-hour forecast and confidence scoring in one air quality dashboard." },
      { property: "og:title", content: "Dashboard — AirPredict" },
      { property: "og:description", content: "Live PM2.5, AQI and 24-hour AI forecasts." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const chartTheme = {
  grid: "var(--color-border)",
  primary: "var(--color-chart-1)",
  accent: "var(--color-chart-2)",
  warn: "var(--color-chart-4)",
};

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-4">
        <h3 className="text-base font-semibold">{title}</h3>
        {subtitle ? <p className="text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          {children as React.ReactElement}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

const tooltipStyle = {
  borderRadius: 14,
  border: "1px solid var(--color-border)",
  background: "var(--color-card)",
  color: "var(--color-foreground)",
  fontSize: 12,
};

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">Air quality dashboard</h1>
          <p className="text-sm text-muted-foreground">Central Business District · updated 3 minutes ago</p>
        </div>
        <Button asChild className="rounded-full">
          <Link to="/app/predict">Run new prediction</Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard icon={Activity} label="Current PM2.5" value={CURRENT_PM25} unit="µg/m³" footer={<AqiBadge category="Moderate" />} />
        <StatCard icon={TrendingUp} label="Predicted PM2.5" value={PREDICTED_PM25} unit="µg/m³" tone="warn" footer={<span className="text-aqi-unhealthy">▲ +97% vs now</span>} />
        <StatCard icon={Gauge} label="Air Quality Index" value={CURRENT_AQI} footer="US EPA scale" tone="accent" />
        <StatCard icon={CloudSun} label="Air Quality Status" value="Moderate" footer="Sensitive groups should take care" />
        <StatCard icon={Timer} label="Forecast Time" value="Next 24 Hours" footer="Peak expected at 19:00" tone="accent" />
        <StatCard icon={ShieldAlert} label="Confidence Score" value={`${CONFIDENCE}%`} footer="LSTM ensemble · RMSE 6.1" tone="warn" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="PM2.5 — next 24 hours" subtitle="Predicted concentration in µg/m³">
          <AreaChart data={hourlyForecast}>
            <defs>
              <linearGradient id="pm" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartTheme.primary} stopOpacity={0.45} />
                <stop offset="100%" stopColor={chartTheme.primary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={3} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="pm25" stroke={chartTheme.primary} strokeWidth={2.5} fill="url(#pm)" />
          </AreaChart>
        </ChartCard>

        <ChartCard title="AQI trend" subtitle="Hourly air quality index">
          <LineChart data={hourlyForecast}>
            <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={3} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="aqi" stroke={chartTheme.accent} strokeWidth={2.5} dot={false} />
          </LineChart>
        </ChartCard>
      </div>

      <div className="glass rounded-3xl p-5">
        <Tabs defaultValue="hourly">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-base font-semibold">Forecast horizons</h3>
            <TabsList className="rounded-full">
              <TabsTrigger value="hourly" className="rounded-full">Hourly</TabsTrigger>
              <TabsTrigger value="daily" className="rounded-full">Daily</TabsTrigger>
              <TabsTrigger value="weekly" className="rounded-full">Weekly</TabsTrigger>
              <TabsTrigger value="monthly" className="rounded-full">Monthly</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="hourly" className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyForecast}>
                <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pm25" fill={chartTheme.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="daily" className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyForecast}>
                <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend />
                <Line type="monotone" dataKey="pm25" name="PM2.5" stroke={chartTheme.primary} strokeWidth={2.5} />
                <Line type="monotone" dataKey="aqi" name="AQI" stroke={chartTheme.warn} strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="weekly" className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyForecast}>
                <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="pm25" fill={chartTheme.accent} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>

          <TabsContent value="monthly" className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend}>
                <defs>
                  <linearGradient id="month" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={chartTheme.accent} stopOpacity={0.4} />
                    <stop offset="100%" stopColor={chartTheme.accent} stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
                <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="pm25" stroke={chartTheme.accent} strokeWidth={2.5} fill="url(#month)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </div>

      <ChartCard title="Historical vs predicted" subtitle="Model output compared against observed readings">
        <LineChart data={hourlyForecast}>
          <CartesianGrid strokeDasharray="4 4" stroke={chartTheme.grid} />
          <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={2} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          <Line type="monotone" dataKey="actual" name="Observed" stroke={chartTheme.primary} strokeWidth={2.5} dot={false} />
          <Line type="monotone" dataKey="predicted" name="Predicted" stroke={chartTheme.warn} strokeWidth={2.5} strokeDasharray="6 4" dot={false} />
        </LineChart>
      </ChartCard>
    </div>
  );
}
