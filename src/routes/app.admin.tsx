import { createFileRoute } from "@tanstack/react-router";
import { Activity, Database, Users } from "lucide-react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { StatCard } from "@/components/air/stat-card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { models, predictionHistory } from "@/lib/air-data";

export const Route = createFileRoute("/app/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — AirPredict" },
      { name: "description", content: "Manage users, datasets, prediction logs and model performance for the AirPredict system." },
      { property: "og:title", content: "Admin Panel — AirPredict" },
      { property: "og:description", content: "Users, datasets, prediction logs and model performance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminPage,
});

const users = [
  { name: "Aanu Khan", email: "demo@airpredict.ai", role: "Admin", status: "Active" },
  { name: "Priya Sharma", email: "priya@city.gov", role: "Analyst", status: "Active" },
  { name: "Rahul Verma", email: "rahul@enviro.org", role: "Viewer", status: "Active" },
  { name: "Sara Iqbal", email: "sara@healthdept.in", role: "Analyst", status: "Suspended" },
];

const accuracyCurve = Array.from({ length: 12 }, (_, i) => ({
  epoch: `E${i + 1}`,
  accuracy: Number((72 + i * 1.9 - Math.sin(i) * 1.2).toFixed(1)),
  loss: Number((0.42 - i * 0.026).toFixed(3)),
}));

function AdminPage() {
  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Admin panel</h1>
        <p className="text-sm text-muted-foreground">System health, users and model operations</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Registered users" value="1,284" footer="+112 this month" />
        <StatCard icon={Activity} label="Predictions served" value="46,910" footer="Last 30 days" tone="accent" />
        <StatCard icon={Database} label="Datasets stored" value="27" footer="18.4 GB total" tone="warn" />
        <StatCard icon={Activity} label="System uptime" value="99.96%" footer="No incidents in 60 days" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="glass rounded-3xl p-5">
          <h2 className="text-base font-semibold">Training accuracy</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={accuracyCurve}>
                <CartesianGrid strokeDasharray="4 4" stroke="var(--color-border)" />
                <XAxis dataKey="epoch" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[65, 100]} />
                <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid var(--color-border)", background: "var(--color-card)", fontSize: 12 }} />
                <Line type="monotone" dataKey="accuracy" stroke="var(--color-chart-2)" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="text-base font-semibold">Model performance</h2>
          <div className="mt-4 space-y-5">
            {models.map((m) => (
              <div key={m.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{m.name}</span>
                  <span className="text-muted-foreground">{m.accuracy}% · RMSE {m.rmse} · MAE {m.mae}</span>
                </div>
                <Progress value={m.progress} className="mt-2" />
              </div>
            ))}
          </div>
          <Button className="mt-6 w-full rounded-full" onClick={() => toast.success("Retraining queued for XGBoost")}>
            Retrain models
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h2 className="text-base font-semibold">Manage users</h2>
          <div className="mt-4 divide-y divide-border/70 text-sm">
            {users.map((u) => (
              <div key={u.email} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.email} · {u.role}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    u.status === "Active" ? "bg-aqi-good/15 text-aqi-good" : "bg-destructive/12 text-destructive"
                  }`}
                >
                  {u.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-5">
          <h2 className="text-base font-semibold">Prediction logs</h2>
          <div className="mt-4 divide-y divide-border/70 text-sm">
            {predictionHistory.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-medium">{r.id}</p>
                  <p className="text-xs text-muted-foreground">{r.location} · {r.date} {r.time}</p>
                </div>
                <span className="text-muted-foreground">{r.predicted} µg/m³</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
