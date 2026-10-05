import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CalendarClock, MapPin, Upload } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { environmentalInputs, stations } from "@/lib/air-data";

export const Route = createFileRoute("/app/data")({
  head: () => ({
    meta: [
      { title: "Data Input — AirPredict" },
      { name: "description", content: "Enter environmental readings or upload a CSV dataset to generate a PM2.5 forecast." },
      { property: "og:title", content: "Data Input — AirPredict" },
      { property: "og:description", content: "Enter readings or upload a CSV dataset for forecasting." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DataPage,
});

function DataPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Data input</h1>
        <p className="text-sm text-muted-foreground">Simulated sensor and environmental parameters</p>
      </div>

      <form
        className="glass rounded-3xl p-6"
        onSubmit={(e) => {
          e.preventDefault();
          toast.success("Parameters submitted to the model");
          navigate({ to: "/app/predict" });
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {environmentalInputs.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              <Input id={f.key} defaultValue={f.value} className="bg-card/70" />
            </div>
          ))}
          <div className="space-y-2">
            <Label htmlFor="datetime">
              <CalendarClock className="mr-1 inline size-3.5" /> Date &amp; time
            </Label>
            <Input id="datetime" type="datetime-local" defaultValue="2026-09-24T08:15" className="bg-card/70" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">
              <MapPin className="mr-1 inline size-3.5" /> Location
            </Label>
            <select
              id="location"
              className="h-9 w-full rounded-md border border-input bg-card/70 px-3 text-sm"
              defaultValue={stations[0]?.name}
            >
              {stations.map((s) => (
                <option key={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button type="submit" className="rounded-full">Generate prediction</Button>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-input bg-card/70 px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary">
            <Upload className="size-4" /> Upload dataset (.csv)
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const name = e.target.files?.[0]?.name;
                if (name) toast.success(`${name} uploaded — 8,642 rows parsed`);
              }}
            />
          </label>
        </div>
      </form>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-base font-semibold">Recent dataset uploads</h2>
        <div className="mt-4 divide-y divide-border/70 text-sm">
          {[
            { name: "cpcb_station_2021_2026.csv", size: "18.4 MB", rows: "1,204,880", when: "2 days ago" },
            { name: "weather_hourly_2026.csv", size: "6.1 MB", rows: "412,300", when: "5 days ago" },
            { name: "traffic_density_q3.csv", size: "2.7 MB", rows: "98,120", when: "12 days ago" },
          ].map((d) => (
            <div key={d.name} className="flex flex-wrap items-center justify-between gap-2 py-3">
              <span className="font-medium">{d.name}</span>
              <span className="text-muted-foreground">
                {d.rows} rows · {d.size} · {d.when}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
