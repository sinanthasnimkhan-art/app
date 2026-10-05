import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, BellRing, Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AqiBadge } from "@/components/air/aqi-badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CONFIDENCE,
  CURRENT_PM25,
  PREDICTED_PM25,
  categoryForPm25,
  categoryStyles,
  hourlyForecast,
  pipelineSteps,
} from "@/lib/air-data";

export const Route = createFileRoute("/app/predict")({
  head: () => ({
    meta: [
      { title: "AI Prediction — AirPredict" },
      { name: "description", content: "Watch the AirPredict AI pipeline run and get a 24-hour PM2.5 prediction with AQI category and risk level." },
      { property: "og:title", content: "AI Prediction — AirPredict" },
      { property: "og:description", content: "Run the AI pipeline and get a 24-hour PM2.5 prediction." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PredictPage,
});

const alerts = [
  "Wear an N95 mask when outdoors",
  "Avoid outdoor exercise between 17:00 and 22:00",
  "Keep windows closed this evening",
  "Run an air purifier in bedrooms overnight",
];

function PredictPage() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(pipelineSteps.length);

  useEffect(() => {
    if (!running) return;
    if (step >= pipelineSteps.length) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setStep((s) => s + 1), 750);
    return () => clearTimeout(t);
  }, [running, step]);

  const done = !running && step >= pipelineSteps.length;
  const category = categoryForPm25(PREDICTED_PM25);
  const style = categoryStyles[category];

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">AI prediction engine</h1>
          <p className="text-sm text-muted-foreground">Ensemble forecast for the next 24 hours</p>
        </div>
        <Button
          className="rounded-full"
          disabled={running}
          onClick={() => {
            setStep(0);
            setRunning(true);
          }}
        >
          {running ? <Loader2 className="mr-1 size-4 animate-spin" /> : <Sparkles className="mr-1 size-4" />}
          {running ? "Predicting…" : "Run prediction"}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <div className="glass rounded-3xl p-6">
          <h2 className="text-base font-semibold">Processing pipeline</h2>
          <Progress value={(Math.min(step, pipelineSteps.length) / pipelineSteps.length) * 100} className="mt-4" />
          <div className="mt-5 space-y-3">
            {pipelineSteps.map((s, i) => {
              const state = i < step ? "done" : i === step && running ? "active" : "idle";
              return (
                <div
                  key={s.title}
                  className={`flex items-start gap-3 rounded-2xl p-3 transition-colors ${
                    state === "idle" ? "opacity-55" : "bg-card/70"
                  }`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold ${
                      state === "done"
                        ? "bg-accent/20 text-accent"
                        : state === "active"
                          ? "gradient-brand text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {state === "done" ? <Check className="size-4" /> : state === "active" ? <Loader2 className="size-3.5 animate-spin" /> : i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{s.title}</p>
                    <p className="text-xs text-muted-foreground">{s.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className={`glass rounded-3xl p-6 ${done ? "" : "opacity-60"}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold">Prediction results</h2>
              <AqiBadge category={category} />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-xs uppercase text-muted-foreground">Current PM2.5</p>
                <p className="mt-1 text-2xl font-semibold">{CURRENT_PM25}</p>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-xs uppercase text-muted-foreground">Predicted PM2.5</p>
                <p className="mt-1 flex items-center gap-1 text-2xl font-semibold">
                  {PREDICTED_PM25} <ArrowUpRight className="size-5 text-aqi-unhealthy" />
                </p>
              </div>
              <div className="rounded-2xl bg-secondary/70 p-4">
                <p className="text-xs uppercase text-muted-foreground">Confidence</p>
                <p className="mt-1 text-2xl font-semibold">{CONFIDENCE}%</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <span className={`rounded-full px-3 py-1 ${style.bg} ${style.text}`}>Risk level: High</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">Trend: rising ▲</span>
              <span className="rounded-full bg-secondary px-3 py-1 text-muted-foreground">Horizon: 24 hours</span>
            </div>
            <div className="mt-5 h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyForecast}>
                  <defs>
                    <linearGradient id="pred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-4)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--color-chart-4)" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval={3} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid var(--color-border)",
                      background: "var(--color-card)",
                      fontSize: 12,
                    }}
                  />
                  <Area type="monotone" dataKey="predicted" stroke="var(--color-chart-4)" strokeWidth={2.5} fill="url(#pred)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <BellRing className="size-4 text-aqi-unhealthy" /> Early warning system
            </h2>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {(["Good", "Moderate", "Unhealthy", "Very Unhealthy", "Hazardous"] as const).map((c) => (
                <span
                  key={c}
                  className={`rounded-full px-3 py-1 ${categoryStyles[c].bg} ${categoryStyles[c].text} ${
                    c === category ? "ring-2 ring-offset-1 ring-offset-background " + categoryStyles[c].ring : ""
                  }`}
                >
                  {categoryStyles[c].emoji} {c}
                </span>
              ))}
            </div>
            <ul className="mt-5 space-y-2.5">
              {alerts.map((a) => (
                <li key={a} className="flex items-start gap-3 rounded-2xl bg-card/70 p-3 text-sm">
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-aqi-unhealthy animate-pulse-ring" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
