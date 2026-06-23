import { Coffee } from "lucide-react";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export function EmptyState({
  title = "Bu kategoride henüz ürün bulunmuyor.",
  description = "Yakında yeni lezzetler eklenecek.",
}: EmptyStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-bimola-border bg-bimola-card/70 px-6 py-10 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-bimola-cream-dark">
        <Coffee className="size-7 text-bimola-gold" />
      </div>
      <h3 className="font-heading text-xl font-semibold text-bimola-coffee">
        {title}
      </h3>
      <p className="mt-2 text-sm text-bimola-coffee-muted">{description}</p>
    </div>
  );
}
