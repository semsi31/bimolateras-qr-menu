"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  createProductAction,
  deleteProductAction,
  toggleProductFieldAction,
  uploadProductImageAction,
  updateProductAction,
  type AdminActionResult,
} from "@/app/admin/products/actions";
import { Button } from "@/components/ui/button";
import type { AdminCategoryRow, AdminProductRow } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "active" | "inactive" | "unavailable";
type MessageState = AdminActionResult | null;

const allowedProductImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxProductImageSize = 3 * 1024 * 1024;

type AdminProductsClientProps = {
  products: AdminProductRow[];
  categories: AdminCategoryRow[];
  error?: string;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(price);

const statusOptions: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Tümü" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Pasif" },
  { value: "unavailable", label: "Stokta Yok" },
];

function ProductBadges({ product }: { product: AdminProductRow }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      <span
        className={cn(
          "rounded-full px-2 py-1 text-[11px] font-semibold",
          product.isActive ?? true
            ? "bg-bimola-success/20 text-[#bce0b6]"
            : "bg-[#c45c4a]/18 text-[#f1b4aa]"
        )}
      >
        {product.isActive ?? true ? "Aktif" : "Pasif"}
      </span>
      {!product.isAvailable && (
        <span className="rounded-full bg-[#c45c4a]/18 px-2 py-1 text-[11px] font-semibold text-[#f1b4aa]">
          Stokta Yok
        </span>
      )}
      {product.isPopular && (
        <span className="rounded-full bg-bimola-gold/18 px-2 py-1 text-[11px] font-semibold text-bimola-gold-light">
          Popüler
        </span>
      )}
      {product.isNew && (
        <span className="rounded-full bg-bimola-cream/10 px-2 py-1 text-[11px] font-semibold text-bimola-cream/80">
          Yeni
        </span>
      )}
    </div>
  );
}

function ProductForm({
  categories,
  product,
  onCancel,
  onSubmit,
  pending,
}: {
  categories: AdminCategoryRow[];
  product?: AdminProductRow | null;
  onCancel: () => void;
  onSubmit: (formData: FormData) => void;
  pending: boolean;
}) {
  const [imageUrl, setImageUrl] = useState(product?.imageUrl ?? "");
  const [localSelectedFilePreview, setLocalSelectedFilePreview] = useState("");
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const [uploadMessage, setUploadMessage] = useState<MessageState>(null);
  const [hasPreviewError, setHasPreviewError] = useState(false);
  const [isUploadPending, startUploadTransition] = useTransition();
  const imageUrlRef = useRef(imageUrl);
  const previewUrl = localSelectedFilePreview || uploadedPreviewUrl || imageUrl;

  useEffect(() => {
    const nextImageUrl = product?.imageUrl ?? "";

    setImageUrl(nextImageUrl);
    imageUrlRef.current = nextImageUrl;
    setUploadedPreviewUrl("");
    setLocalSelectedFilePreview("");
    setSelectedFileName("");
    setUploadMessage(null);
    setHasPreviewError(false);
  }, [product?.id]);

  useEffect(() => {
    imageUrlRef.current = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    setHasPreviewError(false);
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (localSelectedFilePreview) {
        URL.revokeObjectURL(localSelectedFilePreview);
      }
    };
  }, [localSelectedFilePreview]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    setUploadMessage(null);
    setUploadedPreviewUrl("");
    setHasPreviewError(false);

    if (!file) {
      setSelectedFileName("");
      setLocalSelectedFilePreview("");
      return;
    }

    if (file.size > maxProductImageSize) {
      event.target.value = "";
      setSelectedFileName("");
      setUploadMessage({
        ok: false,
        message:
          "Görsel en fazla 3 MB olabilir. Lütfen daha küçük bir görsel seçin.",
      });
      return;
    }

    if (!allowedProductImageTypes.includes(file.type)) {
      event.target.value = "";
      setSelectedFileName("");
      setUploadMessage({
        ok: false,
        message: "Sadece JPG, PNG veya WEBP görsel yükleyebilirsiniz.",
      });
      return;
    }

    setSelectedFileName(file.name);
    setLocalSelectedFilePreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.set("file", file);
    formData.set("productName", product?.name ?? "urun-gorseli");

    startUploadTransition(async () => {
      const result = await uploadProductImageAction(formData).catch(() => ({
        ok: false,
        message: "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
      }));

      setUploadMessage(result);

      if (result.ok && "url" in result) {
        setImageUrl(result.url);
        imageUrlRef.current = result.url;
        setUploadedPreviewUrl(`${result.url}?preview=${Date.now()}`);
        setHasPreviewError(false);
      }
    });
  };

  return (
    <form
      action={(formData) => {
        if (isUploadPending) {
          setUploadMessage({
            ok: false,
            message: "Görsel yükleniyor. Lütfen tamamlanmasını bekleyin.",
          });
          return;
        }

        const safeImageUrl =
          imageUrlRef.current.trim() ||
          imageUrl.trim() ||
          product?.imageUrl ||
          "";

        formData.set("imageUrl", safeImageUrl);

        onSubmit(formData);
      }}
      className="rounded-3xl border border-bimola-gold/20 bg-bimola-cream/[0.07] p-4 shadow-gold sm:p-5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-bimola-cream">
            {product ? "Ürünü Düzenle" : "Yeni Ürün"}
          </h2>
          <p className="mt-1 text-sm text-bimola-cream/55">
            Ürün bilgilerini düzenleyin, görsel seçip yükleyin.
          </p>
        </div>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
          <X className="size-4" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Ürün adı
          </span>
          <input
            name="name"
            defaultValue={product?.name}
            className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Kategori
          </span>
          <select
            name="categoryId"
            defaultValue={product?.categoryId ?? categories[0]?.id ?? ""}
            className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Açıklama
          </span>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={3}
            className="mt-2 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 py-3 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
          />
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Fiyat
          </span>
          <input
            name="price"
            type="number"
            min="0"
            step="0.01"
            defaultValue={product?.price}
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
            defaultValue={product?.sortOrder ?? 0}
            className="mt-2 h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-4 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
          />
        </label>

        <div className="md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
            Görsel bağlantısı
          </span>
          <p className="mt-1 text-xs text-bimola-cream/40">
            Dosya seçtiğinizde otomatik oluşur. Gerekirse manuel bağlantı girebilirsiniz.
          </p>
          <input
            type="url"
            placeholder="https://images.bimolateras.com/products/latte.webp"
            value={imageUrl}
            onChange={(event) => {
              setImageUrl(event.target.value);
              setUploadedPreviewUrl("");
              setHasPreviewError(false);
            }}
            className="mt-2 h-10 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/30 px-4 text-xs text-bimola-cream/75 placeholder:text-bimola-cream/30 focus:border-bimola-gold focus:outline-none"
          />
          <input
            type="hidden"
            name="imageUrl"
            value={imageUrl.trim() || product?.imageUrl || ""}
          />
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-bimola-cream/10 bg-bimola-dark/30 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
          Ürün Görseli
        </p>
        <div className="mt-3 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div>
            <div className="rounded-2xl border border-dashed border-bimola-cream/15 bg-bimola-dark/40 p-4">
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-bimola-cream/70 file:mr-3 file:rounded-full file:border-0 file:bg-bimola-gold file:px-4 file:py-2 file:text-sm file:font-semibold file:text-bimola-cream hover:file:bg-bimola-gold-light"
                />
                {selectedFileName && (
                  <p className="text-xs text-bimola-cream/55">
                    Seçilen görsel: {selectedFileName}
                  </p>
                )}
                {isUploadPending && (
                  <p className="text-xs font-semibold text-bimola-gold-light">
                    Görsel yükleniyor...
                  </p>
                )}
              </div>
              <p className="mt-3 text-xs leading-5 text-bimola-cream/45">
                JPG, PNG veya WEBP yükleyebilirsiniz. Maksimum 3 MB.
              </p>
            </div>
            {uploadMessage && (
              <p
                className={cn(
                  "mt-3 rounded-2xl border px-3 py-2 text-xs",
                  uploadMessage.ok
                    ? "border-bimola-success/25 bg-bimola-success/15 text-[#bce0b6]"
                    : "border-[#c45c4a]/25 bg-[#c45c4a]/12 text-[#f1b4aa]"
                )}
              >
                {uploadMessage.message}
              </p>
            )}
          </div>

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-bimola-cream/45">
              Önizleme
            </p>
            {previewUrl && !hasPreviewError ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={previewUrl}
                src={previewUrl}
                alt="Ürün görsel önizlemesi"
                className="h-36 w-full rounded-2xl border border-bimola-cream/10 object-cover shadow-soft"
                loading="lazy"
                onError={() => setHasPreviewError(true)}
              />
            ) : (
              <div className="flex h-36 items-center justify-center rounded-2xl border border-dashed border-bimola-cream/15 bg-bimola-dark/35 text-sm text-bimola-cream/40">
                {previewUrl ? "Görsel önizlenemiyor" : "Görsel yok"}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["isActive", "Aktif mi?", product?.isActive ?? true],
          ["isAvailable", "Stokta var mı?", product?.isAvailable ?? true],
          ["isPopular", "Popüler mi?", product?.isPopular ?? false],
          ["isNew", "Yeni mi?", product?.isNew ?? false],
        ].map(([name, label, checked]) => (
          <label
            key={String(name)}
            className="flex items-center gap-2 rounded-2xl border border-bimola-cream/10 bg-bimola-dark/35 px-3 py-2 text-sm text-bimola-cream/75"
          >
            <input
              name={String(name)}
              type="checkbox"
              defaultChecked={Boolean(checked)}
              className="accent-bimola-gold"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Vazgeç
        </Button>
        <Button
          type="submit"
          disabled={pending || isUploadPending || categories.length === 0}
        >
          {pending ? "Kaydediliyor..." : product ? "Güncelle" : "Ürün Ekle"}
        </Button>
      </div>
    </form>
  );
}

export function AdminProductsClient({
  products,
  categories,
  error,
}: AdminProductsClientProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState("all");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [editingProduct, setEditingProduct] = useState<AdminProductRow | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [message, setMessage] = useState<MessageState>(
    error ? { ok: false, message: error } : null
  );
  const [productRows, setProductRows] = useState(products);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setProductRows(products);
  }, [products]);

  function openEditProduct(productId: string) {
    const latestProduct = productRows.find(
      (product) => product.id === productId
    );

    if (!latestProduct) {
      return;
    }

    setEditingProduct(latestProduct);
    setIsFormOpen(true);
  }

  const runAction = (action: () => Promise<AdminActionResult>) => {
    startTransition(async () => {
      const result: AdminActionResult = await action().catch(() => ({
        ok: false,
        message: "İşlem tamamlanamadı. Lütfen tekrar deneyin.",
      }));
      setMessage(result);

      if (result.ok) {
        if (result.product) {
          const updatedProduct = result.product;

          setProductRows((currentProducts) => {
            const exists = currentProducts.some(
              (product) => product.id === updatedProduct.id
            );

            const nextProducts = exists
              ? currentProducts.map((product) =>
                  product.id === updatedProduct.id ? updatedProduct : product
                )
              : [updatedProduct, ...currentProducts];

            return nextProducts;
          });
        }

        router.refresh();
        setEditingProduct(null);
        setIsFormOpen(false);
      }
    });
  };

  const filteredProducts = useMemo(() => {
    return productRows.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        categoryId === "all" || product.categoryId === categoryId;
      const matchesStatus =
        status === "all" ||
        (status === "active" && (product.isActive ?? true)) ||
        (status === "inactive" && !(product.isActive ?? true)) ||
        (status === "unavailable" && !product.isAvailable);

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [categoryId, productRows, query, status]);

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

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-bimola-dark/70 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Formu kapat"
            className="absolute inset-0 cursor-default"
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(false);
            }}
          />
          <div className="relative h-dvh w-full max-w-2xl overflow-y-auto border-l border-bimola-cream/10 bg-bimola-dark p-4 shadow-card sm:p-6">
            <ProductForm
              key={editingProduct?.id ?? "new-product"}
              categories={categories}
              product={editingProduct}
              pending={isPending}
              onCancel={() => {
                setEditingProduct(null);
                setIsFormOpen(false);
              }}
              onSubmit={(formData) =>
                runAction(() =>
                  editingProduct
                    ? updateProductAction(editingProduct.id, formData)
                    : createProductAction(formData)
                )
              }
            />
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-bimola-cream/40" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ürün ara..."
              className="h-11 w-full rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 pl-10 pr-4 text-sm text-bimola-cream placeholder:text-bimola-cream/35 focus:border-bimola-gold focus:outline-none"
            />
          </label>

          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="h-11 rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-3 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
          >
            <option value="all">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as StatusFilter)}
            className="h-11 rounded-2xl border border-bimola-cream/10 bg-bimola-dark/45 px-3 text-sm text-bimola-cream focus:border-bimola-gold focus:outline-none"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <Button
            type="button"
            className="h-11"
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
          >
            <Plus className="size-4" />
            Ürün Ekle
          </Button>
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid gap-3 xl:hidden">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] p-4 shadow-soft"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-base font-semibold text-bimola-cream">
                    {product.name}
                  </h2>
                  <p className="mt-1 text-xs text-bimola-cream/48">
                    {product.categoryName}
                  </p>
                </div>
                <p className="shrink-0 rounded-full bg-bimola-gold/15 px-3 py-1 text-sm font-bold text-bimola-gold-light">
                  {formatPrice(product.price)}
                </p>
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-bimola-cream/55">
                {product.description}
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <ProductBadges product={product} />
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditProduct(product.id)}
                  >
                    <Edit className="size-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm(`${product.name} silinsin mi?`)) {
                        runAction(() => deleteProductAction(product.id));
                      }
                    }}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {[
                  ["isActive", product.isActive ? "Pasif" : "Aktif", !product.isActive],
                  [
                    "isAvailable",
                    product.isAvailable ? "Stok yok" : "Stok var",
                    !product.isAvailable,
                  ],
                  [
                    "isPopular",
                    product.isPopular ? "Popüler -" : "Popüler +",
                    !product.isPopular,
                  ],
                  ["isNew", product.isNew ? "Yeni -" : "Yeni +", !product.isNew],
                ].map(([field, label, value]) => (
                  <button
                    key={String(field)}
                    type="button"
                    onClick={() =>
                      runAction(() =>
                        toggleProductFieldAction(
                          product.id,
                          field as
                            | "isActive"
                            | "isAvailable"
                            | "isPopular"
                            | "isNew",
                          Boolean(value)
                        )
                      )
                    }
                    className="rounded-full border border-bimola-cream/10 px-2 py-1 text-[11px] text-bimola-cream/58"
                  >
                    {String(label)}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-bimola-cream/15 bg-bimola-cream/[0.04] p-8 text-center">
          <p className="font-heading text-2xl font-semibold text-bimola-cream">
            Ürün bulunamadı
          </p>
          <p className="mt-2 text-sm text-bimola-cream/55">
            Arama veya filtreleri değiştirerek tekrar deneyin.
          </p>
        </div>
      )}

      {filteredProducts.length > 0 && (
        <div className="hidden overflow-hidden rounded-3xl border border-bimola-cream/10 bg-bimola-cream/[0.06] shadow-soft xl:block">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-bimola-cream/10 bg-bimola-dark/35 text-xs uppercase tracking-[0.18em] text-bimola-cream/45">
              <tr>
                <th className="px-5 py-4 font-semibold">Ürün</th>
                <th className="px-5 py-4 font-semibold">Kategori</th>
                <th className="px-5 py-4 font-semibold">Fiyat</th>
                <th className="px-5 py-4 font-semibold">Durum</th>
                <th className="px-5 py-4 text-right font-semibold">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bimola-cream/10">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="text-bimola-cream/75">
                  <td className="px-5 py-4">
                    <p className="font-semibold text-bimola-cream">
                      {product.name}
                    </p>
                    <p className="mt-1 line-clamp-1 text-xs text-bimola-cream/45">
                      {product.description}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    {product.categoryName}
                  </td>
                  <td className="px-5 py-4 font-bold text-bimola-gold-light">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-5 py-4">
                    <ProductBadges product={product} />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        ["isActive", product.isActive ? "Pasif yap" : "Aktif yap", !product.isActive],
                        [
                          "isAvailable",
                          product.isAvailable ? "Stokta yok" : "Stokta var",
                          !product.isAvailable,
                        ],
                        [
                          "isPopular",
                          product.isPopular ? "Popüler kaldır" : "Popüler yap",
                          !product.isPopular,
                        ],
                        ["isNew", product.isNew ? "Yeni kaldır" : "Yeni yap", !product.isNew],
                      ].map(([field, label, value]) => (
                        <button
                          key={String(field)}
                          type="button"
                          onClick={() =>
                            runAction(() =>
                              toggleProductFieldAction(
                                product.id,
                                field as
                                  | "isActive"
                                  | "isAvailable"
                                  | "isPopular"
                                  | "isNew",
                                Boolean(value)
                              )
                            )
                          }
                          className="rounded-full border border-bimola-cream/10 px-2 py-1 text-[11px] text-bimola-cream/58 hover:border-bimola-gold/40 hover:text-bimola-cream"
                        >
                          {String(label)}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditProduct(product.id)}
                      >
                        <Edit className="size-4" />
                        Düzenle
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm(`${product.name} silinsin mi?`)) {
                            runAction(() => deleteProductAction(product.id));
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                        Sil
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
