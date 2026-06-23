"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Edit, Plus, Trash2, X } from "lucide-react";

import {
  createCategoryAction,
  deleteCategoryAction,
  toggleCategoryActiveAction,
  updateCategoryAction,
  type CategoryActionResult,
} from "@/app/admin/categories/actions";
import { Button } from "@/components/ui/button";
import type { AdminCategoryRow } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type AdminCategoriesClientProps = {
  categories: AdminCategoryRow[];
  error?: string;
};

function CategoryForm({
  category,
  pending,
  onCancel,
  onSubmit,
}: {
  category?: AdminCategoryRow | null;
  pending: boolean;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
}) {
  return (
    <form
      action={onSubmit}
      className="rounded-3xl border border-bimola-gold/20 bg-bimola-cream/[0.07] p-4 shadow-gold sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-bimola-cream">
            {category ? "Kategori Düzenle" : "Yeni Kategori"}
          </h2>
          <p className="mt-1 text-sm text-bimola-cream/55">
            Slug kategori adından otomatik üretilecek.
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_160px]">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Kategori adı
          </span>
          <input
            name="name"
            defaultValue={category?.name}
            className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
            required
          />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Sıralama
          </span>
          <input
            name="sortOrder"
            type="number"
            defaultValue={category?.sortOrder ?? 0}
            className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Açıklama
          </span>
          <textarea
            name="description"
            defaultValue={category?.description}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 py-3 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
          />
        </label>
      </div>

      <label className="mt-4 flex items-center gap-2 rounded-2xl border border-bimola-cream/10 bg-bimola-dark/35 px-3 py-2 text-sm text-bimola-cream/75">
        <input
          name="isActive"
          type="checkbox"
          defaultChecked={category?.isActive ?? true}
          className="accent-bimola-gold"
        />
        Aktif mi?
      </label>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button type="submit" disabled={pending}>
          {pending
            ? "Kaydediliyor..."
            : category
              ? "Kategoriyi Güncelle"
              : "Kategori Ekle"}
        </Button>
      </div>
    </form>
  );
}

export function AdminCategoriesClient({
  categories,
  error,
}: AdminCategoriesClientProps) {
  const router = useRouter();
  const [editingCategory, setEditingCategory] =
    useState<AdminCategoryRow | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState<CategoryActionResult | null>(
    error ? { ok: false, message: error } : null
  );
  const [isPending, startTransition] = useTransition();

  const runAction = (action: () => Promise<CategoryActionResult>) => {
    startTransition(async () => {
      const result = await action().catch(() => ({
        ok: false,
        message: "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
      }));
      setMessage(result);

      if (result.ok) {
        setEditingCategory(null);
        setIsFormOpen(false);
        router.refresh();
      }
    });
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={cn(
            "rounded-2xl border px-4 py-3 text-sm",
            message.ok
              ? "border-bimola-success/25 bg-bimola-success/15 text-[#bce0b6]"
              : "border-[#c45c4a]/25 bg-[#c45c4a]/12 text-[#f1b4aa]"
          )}
        >
          {message.message}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          onClick={() => {
            setEditingCategory(null);
            setIsFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          Kategori Ekle
        </Button>
      </div>

      {isFormOpen && (
        <CategoryForm
          category={editingCategory}
          pending={isPending}
          onCancel={() => {
            setEditingCategory(null);
            setIsFormOpen(false);
          }}
          onSubmit={(formData) =>
            runAction(() =>
              editingCategory
                ? updateCategoryAction(editingCategory.id, formData)
                : createCategoryAction(formData)
            )
          }
        />
      )}

      {categories.length > 0 ? (
        <div className="grid gap-3">
          {categories.map((category) => (
            <article
              key={category.id}
              className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-4 shadow-soft sm:p-5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-heading text-2xl font-semibold text-bimola-cream">
                      {category.name}
                    </h2>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                        category.isActive
                          ? "bg-bimola-success/20 text-[#bce0b6]"
                          : "bg-[#c45c4a]/18 text-[#f1b4aa]"
                      )}
                    >
                      {category.isActive ? "Aktif" : "Pasif"}
                    </span>
                  </div>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-bimola-cream/55">
                    {category.description || "Açıklama eklenmemiş."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="rounded-full border border-bimola-cream/10 bg-bimola-dark/35 px-3 py-1.5 text-xs font-semibold text-bimola-cream/65">
                    {category.productCount} ürün
                  </span>
                  <span className="rounded-full border border-bimola-cream/10 bg-bimola-dark/35 px-3 py-1.5 text-xs font-semibold text-bimola-cream/65">
                    Sıra {category.sortOrder}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      runAction(() =>
                        toggleCategoryActiveAction(
                          category.id,
                          !category.isActive
                        )
                      )
                    }
                  >
                    {category.isActive ? "Pasif Yap" : "Aktif Yap"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setIsFormOpen(true);
                    }}
                  >
                    <Edit className="size-4" />
                    Düzenle
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`${category.name} silinsin mi?`)) {
                        runAction(() => deleteCategoryAction(category.id));
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                    Sil
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-bimola-cream/15 bg-bimola-cream/[0.04] p-8 text-center">
          <p className="font-heading text-2xl font-semibold text-bimola-cream">
            Kategori bulunamadı
          </p>
          <p className="mt-2 text-sm text-bimola-cream/55">
            İlk kategoriyi ekleyerek menü yönetimine başlayın.
          </p>
        </div>
      )}
    </div>
  );
}
