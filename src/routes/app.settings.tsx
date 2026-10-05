import { createFileRoute, Link } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AirPredict" },
      { name: "description", content: "Manage your AirPredict profile, theme, language and air quality alert preferences." },
      { property: "og:title", content: "Settings — AirPredict" },
      { property: "og:description", content: "Manage profile, theme, language and alert preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SettingsPage,
});

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold sm:text-3xl">Settings</h1>
        <p className="text-sm text-muted-foreground">Preferences for alerts, appearance and your profile</p>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-base font-semibold">Profile</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="pname">Full name</Label>
            <Input id="pname" defaultValue="Aanu Khan" className="bg-card/70" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pmail">Email</Label>
            <Input id="pmail" type="email" defaultValue="demo@airpredict.ai" className="bg-card/70" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pphone">Phone (SMS alerts)</Label>
            <Input id="pphone" defaultValue="+91 98765 43210" className="bg-card/70" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plang">Language</Label>
            <select id="plang" className="h-9 w-full rounded-md border border-input bg-card/70 px-3 text-sm">
              <option>English</option>
              <option>हिन्दी</option>
              <option>বাংলা</option>
              <option>தமிழ்</option>
            </select>
          </div>
        </div>
        <Button className="mt-5 rounded-full" onClick={() => toast.success("Profile updated")}>Save changes</Button>
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="text-base font-semibold">Appearance &amp; notifications</h2>
        <div className="mt-2 divide-y divide-border/70">
          <Row label="Dark mode" hint="Switch between light and dark themes">
            <Switch
              checked={dark}
              onCheckedChange={(v) => {
                setDark(v);
                document.documentElement.classList.toggle("dark", v);
              }}
            />
          </Row>
          <Row label="Push notifications" hint="Alerts when AQI category worsens">
            <Switch defaultChecked />
          </Row>
          <Row label="Email alerts" hint="Daily forecast digest at 07:00">
            <Switch defaultChecked />
          </Row>
          <Row label="SMS alerts" hint="Only for Very Unhealthy and above">
            <Switch />
          </Row>
          <Row label="Voice assistant" hint="Read the forecast aloud on the dashboard">
            <Switch />
          </Row>
        </div>
      </div>

      <div className="glass flex flex-wrap items-center justify-between gap-3 rounded-3xl p-6">
        <div>
          <p className="text-sm font-medium">Log out of AirPredict</p>
          <p className="text-xs text-muted-foreground">You can sign back in anytime</p>
        </div>
        <Button variant="outline" asChild className="rounded-full bg-card/70">
          <Link to="/login">
            <LogOut className="mr-1 size-4" /> Log out
          </Link>
        </Button>
      </div>
    </div>
  );
}
