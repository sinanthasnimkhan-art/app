import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  Brain,
  Database,
  History,
  LayoutDashboard,
  Map,
  Menu,
  Moon,
  Settings,
  Shield,
  Sun,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/air/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/app")({
  component: AppLayout,
});

const nav = [
  { to: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/predict", label: "AI Prediction", icon: Brain },
  { to: "/app/data", label: "Data Input", icon: Database },
  { to: "/app/map", label: "Pollution Map", icon: Map },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/history", label: "History", icon: History },
  { to: "/app/admin", label: "Admin Panel", icon: Shield },
  { to: "/app/settings", label: "Settings", icon: Settings },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          activeProps={{ className: "bg-primary/12 text-primary hover:bg-primary/12 hover:text-primary" }}
        >
          <item.icon className="size-4.5" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function AppLayout() {
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="min-h-screen gradient-hero">
      <div className="flex min-h-screen">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col justify-between border-r border-border/60 bg-card/60 p-5 backdrop-blur-xl lg:flex">
          <div className="space-y-8">
            <Logo />
            <NavLinks />
          </div>
          <div className="glass rounded-3xl p-4">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Activity className="size-4 text-accent" /> Model: LSTM v4.2
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Accuracy 94.8% · updated 12 min ago</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border/60 bg-background/70 px-4 py-3 backdrop-blur-xl sm:px-6">
            <div className="flex items-center gap-3">
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                    <Menu className="size-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-5">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <div className="space-y-8">
                    <Logo />
                    <NavLinks onNavigate={() => setOpen(false)} />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="lg:hidden">
                <Logo />
              </div>
              <p className="hidden text-sm text-muted-foreground lg:block">
                Monitoring station · Central Business District
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark((d) => !d)}>
                {dark ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>
              <Button variant="ghost" size="icon" asChild aria-label="Log out">
                <Link to="/login">
                  <LogOut className="size-5" />
                </Link>
              </Button>
              <span className="grid size-9 place-items-center rounded-full gradient-brand text-sm font-semibold text-primary-foreground">
                AK
              </span>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
