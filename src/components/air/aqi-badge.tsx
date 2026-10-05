import { categoryStyles, type AqiCategory } from "@/lib/air-data";

export function AqiBadge({ category, className = "" }: { category: AqiCategory; className?: string }) {
  const s = categoryStyles[category];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ring-1 ${s.bg} ${s.text} ${s.ring} ${className}`}
    >
      <span className={`size-2 rounded-full ${s.dot}`} />
      {category}
    </span>
  );
}
