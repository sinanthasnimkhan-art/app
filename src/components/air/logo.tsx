import { Link } from "@tanstack/react-router";
import { Wind } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-soft">
        <Wind className="size-5" />
      </span>
      <span className="text-lg font-semibold tracking-tight">
        Air<span className="text-gradient-brand">Predict</span>
      </span>
    </Link>
  );
}
