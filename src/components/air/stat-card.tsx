import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  footer,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  unit?: string;
  footer?: ReactNode;
  tone?: "primary" | "accent" | "warn";
}) {
  const toneMap = {
    primary: "bg-primary/12 text-primary",
    accent: "bg-accent/15 text-accent",
    warn: "bg-aqi-unhealthy/15 text-aqi-unhealthy",
  } as const;

  return (
    <div className="glass rounded-3xl p-5 transition-transform duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold">
            {value}
            {unit ? <span className="ml-1 text-base font-medium text-muted-foreground">{unit}</span> : null}
          </p>
        </div>
        <span className={`grid size-11 place-items-center rounded-2xl ${toneMap[tone]}`}>
          <Icon className="size-5" />
        </span>
      </div>
      {footer ? <div className="mt-4 text-sm text-muted-foreground">{footer}</div> : null}
    </div>
  );
}
