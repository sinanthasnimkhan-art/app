import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/air/logo";
import { ParticleField } from "@/components/air/particles";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — AirPredict" },
      { name: "description", content: "Access your AirPredict PM2.5 forecasting dashboard and early-warning alerts." },
      { property: "og:title", content: "Log in — AirPredict" },
      { property: "og:description", content: "Access your AirPredict PM2.5 forecasting dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center gradient-hero px-4 py-12">
      <ParticleField />
      <div className="glass relative w-full max-w-md rounded-4xl p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Log in to view live forecasts and alerts.</p>

        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Signed in to the AirPredict demo");
            navigate({ to: "/app/dashboard" });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" required defaultValue="demo@airpredict.ai" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" required defaultValue="airpredict" className="pl-9" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-muted-foreground">
              <Checkbox defaultChecked /> Remember me
            </label>
            <button
              type="button"
              className="font-medium text-primary hover:underline"
              onClick={() => toast("Password reset link sent to your email")}
            >
              Forgot password?
            </button>
          </div>
          <Button type="submit" className="w-full rounded-full" size="lg">
            Log in
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          className="w-full rounded-full bg-card/70"
          onClick={() => {
            toast.success("Signed in with Google (demo)");
            navigate({ to: "/app/dashboard" });
          }}
        >
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-medium text-primary hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
