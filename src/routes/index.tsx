import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BellRing,
  BrainCircuit,
  CloudSun,
  Gauge,
  LineChart,
  MapPinned,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { AqiBadge } from "@/components/air/aqi-badge";
import { Logo } from "@/components/air/logo";
import { ParticleField } from "@/components/air/particles";
import { Button } from "@/components/ui/button";
import { CURRENT_PM25, PREDICTED_PM25, models, pipelineSteps } from "@/lib/air-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AirPredict — AI PM2.5 Air Quality Forecasting" },
      {
        name: "description",
        content:
          "AirPredict forecasts PM2.5 and AQI up to 24 hours ahead using Random Forest, LSTM and XGBoost models, with live dashboards and early health warnings.",
      },
      { property: "og:title", content: "AirPredict — AI PM2.5 Air Quality Forecasting" },
      {
        property: "og:description",
        content: "From monitoring air pollution to predicting it — AI forecasts, live AQI maps and early warnings.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  { icon: BrainCircuit, title: "AI Forecast Engine", text: "Ensemble of Random Forest, LSTM and XGBoost predicts PM2.5 24 hours ahead." },
  { icon: LineChart, title: "Live Dashboards", text: "Hourly, daily, weekly and monthly trends with historical vs predicted overlays." },
  { icon: MapPinned, title: "Pollution Hotspots", text: "Color-coded AQI markers across nearby monitoring stations and your location." },
  { icon: BellRing, title: "Early Warnings", text: "Health advisories delivered the moment air quality is forecast to deteriorate." },
  { icon: Gauge, title: "Confidence Scoring", text: "Every prediction ships with a confidence score, RMSE and MAE transparency." },
  { icon: ShieldCheck, title: "Admin Control", text: "Dataset uploads, model performance tracking and full prediction logs." },
];

function Landing() {
  return (
    <div className="min-h-screen gradient-hero">
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <Logo />
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild className="rounded-full">
              <Link to="/signup">Get started</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <ParticleField />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Sparkles className="size-3.5 text-accent" /> AI-based PM2.5 forecasting system
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
            From Monitoring Air Pollution to <span className="text-gradient-brand">Predicting It.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
            AirPredict combines historical station data, weather and human-activity signals to forecast PM2.5
            concentration, interpret AQI and deliver early health warnings before pollution peaks.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/app/predict">
                Get Prediction <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full bg-card/60 backdrop-blur">
              <Link to="/app/dashboard">View Dashboard</Link>
            </Button>
          </div>

          <div className="mt-14 grid gap-4 sm:grid-cols-3">
            <div className="glass rounded-3xl p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Current PM2.5</p>
              <p className="mt-2 text-3xl font-semibold">{CURRENT_PM25} <span className="text-base text-muted-foreground">µg/m³</span></p>
              <AqiBadge category="Moderate" className="mt-3" />
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Predicted · next 24h</p>
              <p className="mt-2 text-3xl font-semibold">{PREDICTED_PM25} <span className="text-base text-muted-foreground">µg/m³</span></p>
              <AqiBadge category="Unhealthy" className="mt-3" />
            </div>
            <div className="glass rounded-3xl p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Air quality outlook</p>
              <p className="mt-2 flex items-center gap-2 text-3xl font-semibold">
                <CloudSun className="size-7 text-accent" /> Moderate
              </p>
              <p className="mt-3 text-sm text-muted-foreground">Risk rising after 18:00</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-semibold">Everything a forecasting platform needs</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Built as a complete decision system — not just a monitoring dashboard.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/12 text-primary">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="glass grid gap-8 rounded-4xl p-8 lg:grid-cols-2 lg:p-12">
          <div>
            <h2 className="text-3xl font-semibold">About AirPredict</h2>
            <p className="mt-4 text-muted-foreground">
              Conventional systems tell you how polluted the air is right now. AirPredict learns from five years of
              station readings, meteorological records, traffic density and industrial activity to estimate what the
              air will look like in the hours ahead — so citizens, schools and city authorities can act early.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { k: "5 yrs", v: "Training data" },
                { k: "24 h", v: "Forecast horizon" },
                { k: "94.8%", v: "Best model accuracy" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-secondary/70 p-4">
                  <p className="text-xl font-semibold">{s.k}</p>
                  <p className="text-xs text-muted-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">AI workflow</h3>
            {pipelineSteps.map((step, i) => (
              <div key={step.title} className="flex items-start gap-3 rounded-2xl bg-card/70 p-3.5">
                <span className="grid size-7 shrink-0 place-items-center rounded-full gradient-brand text-xs font-semibold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs text-muted-foreground">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <h2 className="text-3xl font-semibold">The models behind the forecast</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {models.map((m) => (
            <div key={m.name} className="glass rounded-3xl p-6">
              <h3 className="text-lg font-semibold">{m.name}</h3>
              <p className="mt-3 text-3xl font-semibold text-gradient-brand">{m.accuracy}%</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Accuracy</p>
              <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
                <span>RMSE {m.rmse}</span>
                <span>MAE {m.mae}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/60 bg-card/50 backdrop-blur">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              AI-based PM2.5 air quality forecasting and early-warning system.
            </p>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Product</p>
            <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
              <Link to="/app/dashboard" className="hover:text-foreground">Dashboard</Link>
              <Link to="/app/predict" className="hover:text-foreground">AI Prediction</Link>
              <Link to="/app/analytics" className="hover:text-foreground">Analytics</Link>
              <Link to="/app/map" className="hover:text-foreground">Pollution Map</Link>
            </div>
          </div>
          <div className="text-sm">
            <p className="font-semibold">Account</p>
            <div className="mt-3 flex flex-col gap-2 text-muted-foreground">
              <Link to="/login" className="hover:text-foreground">Log in</Link>
              <Link to="/signup" className="hover:text-foreground">Create account</Link>
              <Link to="/app/settings" className="hover:text-foreground">Settings</Link>
            </div>
          </div>
        </div>
        <p className="border-t border-border/60 px-6 py-5 text-center text-xs text-muted-foreground">
          © 2026 AirPredict · Demo prototype with simulated data
        </p>
      </footer>
    </div>
  );
}
