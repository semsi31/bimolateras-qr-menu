import type { LucideIcon } from "lucide-react";

type AdminStatCardProps = {
  title: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
};

export function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
}: AdminStatCardProps) {
  return (
    <div className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-5 shadow-soft backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-bimola-cream/10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-bimola-cream/58">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-bimola-cream">
            {value}
          </p>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-bimola-gold/15 text-bimola-gold-light">
          <Icon className="size-5" />
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-bimola-cream/48">
        {description}
      </p>
    </div>
  );
}
