import type { LucideIcon } from "lucide-react";

type AdminPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
};

export function AdminPageHeader({
  eyebrow = "Bİ'MOLA TERAS",
  title,
  description,
  icon: Icon,
  action,
}: AdminPageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bimola-gold">
          {eyebrow}
        </p>
        <div className="mt-2 flex items-center gap-3">
          {Icon && (
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-bimola-gold/25 bg-bimola-gold/10 text-bimola-gold-light shadow-soft">
              <Icon className="size-5" />
            </div>
          )}
          <h1 className="font-heading text-3xl font-semibold leading-tight text-bimola-cream sm:text-4xl">
            {title}
          </h1>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-bimola-cream/62">
          {description}
        </p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
