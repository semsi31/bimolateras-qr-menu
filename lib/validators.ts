type ValidationResult<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      message: string;
    };

export type ProductFormData = {
  name: string;
  categoryId: string;
  description: string;
  price: number;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
};

export type CategoryFormData = {
  name: string;
  description: string;
  sortOrder: number;
  isActive: boolean;
};

function readString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function readOptionalString(formData: FormData, key: string) {
  const value = readString(formData, key);
  return value.length > 0 ? value : null;
}

function stripImageQuery(value: string) {
  try {
    const url = new URL(value);

    url.searchParams.delete("preview");
    url.searchParams.delete("v");

    return url.toString();
  } catch {
    const [path, query = ""] = value.split("?");

    if (!query) return value;

    const params = new URLSearchParams(query);
    params.delete("preview");
    params.delete("v");
    const nextQuery = params.toString();

    return nextQuery ? `${path}?${nextQuery}` : path;
  }
}

function readImageUrl(formData: FormData) {
  const imageUrl = readOptionalString(formData, "imageUrl");

  return imageUrl ? stripImageQuery(imageUrl) : null;
}

function readNumber(formData: FormData, key: string, fallback = 0) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

function readBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on" || formData.get(key) === "true";
}

export function validateProductForm(
  formData: FormData
): ValidationResult<ProductFormData> {
  const name = readString(formData, "name");
  const categoryId = readString(formData, "categoryId");
  const price = readNumber(formData, "price", Number.NaN);
  const sortOrder = readNumber(formData, "sortOrder", 0);

  if (!name) {
    return { ok: false, message: "Ürün adı zorunludur." };
  }

  if (!categoryId) {
    return { ok: false, message: "Kategori seçimi zorunludur." };
  }

  if (!Number.isFinite(price) || price <= 0) {
    return { ok: false, message: "Fiyat 0'dan büyük olmalıdır." };
  }

  const imageUrl = readImageUrl(formData);

  if (imageUrl?.startsWith("blob:") || imageUrl?.startsWith("data:")) {
    return {
      ok: false,
      message: "Görsel bağlantısı kaydedilemedi. Lütfen görseli tekrar yükleyin.",
    };
  }

  if (
    imageUrl &&
    !imageUrl.startsWith("/") &&
    !imageUrl.startsWith("http://") &&
    !imageUrl.startsWith("https://")
  ) {
    return { ok: false, message: "Geçersiz görsel bağlantısı." };
  }

  return {
    ok: true,
    data: {
      name,
      categoryId,
      description: readString(formData, "description"),
      price,
      imageUrl,
      sortOrder,
      isActive: readBoolean(formData, "isActive"),
      isAvailable: readBoolean(formData, "isAvailable"),
      isPopular: readBoolean(formData, "isPopular"),
      isNew: readBoolean(formData, "isNew"),
    },
  };
}

export function validateCategoryForm(
  formData: FormData
): ValidationResult<CategoryFormData> {
  const name = readString(formData, "name");
  const sortOrder = readNumber(formData, "sortOrder", 0);

  if (!name) {
    return { ok: false, message: "Kategori adı zorunludur." };
  }

  return {
    ok: true,
    data: {
      name,
      description: readString(formData, "description"),
      sortOrder,
      isActive: readBoolean(formData, "isActive"),
    },
  };
}
