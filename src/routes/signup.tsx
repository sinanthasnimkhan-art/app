import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Lock, Mail, User } from "lucide-react";
import { toast } from "sonner";

import { Logo } from "@/components/air/logo";
import { ParticleField } from "@/components/air/particles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — AirPredict" },
      { name: "description", content: "Create an AirPredict account for AI PM2.5 forecasts and early pollution warnings." },
      { property: "og:title", content: "Create account — AirPredict" },
      { property: "og:description", content: "Sign up for AI PM2.5 forecasts and early pollution warnings." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen items-center justify-center gradient-hero px-4 py-12">
      <ParticleField />
      <div className="glass relative w-full max-w-md rounded-4xl p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-semibold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start forecasting air quality in minutes.</p>

        <form
          className="mt-7 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Account created — welcome to AirPredict");
            navigate({ to: "/app/dashboard" });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="name" required placeholder="Aanu Khan" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" required placeholder="you@example.com" className="pl-9" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" required placeholder="••••••••" className="pl-9" />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-full" size="lg">
            Create account
          </Button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
        </div>

        <Button
          variant="outline"
          className="w-full rounded-full bg-card/70"
          onClick={() => {
            toast.success("Signed up with Google (demo)");
            navigate({ to: "/app/dashboard" });
          }}
        >
          Continue with Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already registered?{" "}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
