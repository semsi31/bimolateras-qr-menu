import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";

import { slugify } from "@/lib/slug";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"] as const;
const maxUploadSize = 3 * 1024 * 1024;
const maxLogoUploadSize = 2 * 1024 * 1024;

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

export type ProductImageUploadResult = {
  url: string;
  key: string;
};

export type LogoUploadResult = {
  url: string;
  key: string;
};

function getR2Config(): R2Config {
  const {
    R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME,
    R2_PUBLIC_BASE_URL,
  } = process.env;

  const missing = [
    ["R2_ACCOUNT_ID", R2_ACCOUNT_ID],
    ["R2_ACCESS_KEY_ID", R2_ACCESS_KEY_ID],
    ["R2_SECRET_ACCESS_KEY", R2_SECRET_ACCESS_KEY],
    ["R2_BUCKET_NAME", R2_BUCKET_NAME],
    ["R2_PUBLIC_BASE_URL", R2_PUBLIC_BASE_URL],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`R2 env eksik: ${missing.join(", ")}`);
  }

  return {
    accountId: R2_ACCOUNT_ID!,
    accessKeyId: R2_ACCESS_KEY_ID!,
    secretAccessKey: R2_SECRET_ACCESS_KEY!,
    bucketName: R2_BUCKET_NAME!,
    publicBaseUrl: R2_PUBLIC_BASE_URL!.replace(/\/+$/, ""),
  };
}

function getS3Client(config: R2Config) {
  return new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    forcePathStyle: true,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });
}

export function validateProductImageFile(file: File) {
  if (!file || file.size === 0) {
    return "Boş dosya yüklenemez. Lütfen geçerli bir görsel seçin.";
  }

  if (file.size > maxUploadSize) {
    return "Görsel en fazla 3 MB olabilir. Lütfen daha küçük bir görsel seçin.";
  }

  if (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number])) {
    return "Sadece JPG, PNG veya WEBP görsel yükleyebilirsiniz.";
  }

  return null;
}

export function validateLogoImageFile(file: File) {
  if (!file || file.size === 0) {
    return "Boş dosya yüklenemez. Lütfen geçerli bir görsel seçin.";
  }

  if (file.size > maxLogoUploadSize) {
    return "Logo en fazla 2 MB olabilir. Lütfen daha küçük bir görsel seçin.";
  }

  if (!allowedImageTypes.includes(file.type as (typeof allowedImageTypes)[number])) {
    return "Sadece JPG, PNG veya WEBP görsel yükleyebilirsiniz.";
  }

  return null;
}

async function getFileInputBuffer(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const source = new Uint8Array(arrayBuffer);
  const inputBuffer = Buffer.alloc(source.byteLength);

  inputBuffer.set(source);

  return inputBuffer;
}

async function optimizeImage(file: File) {
  const inputBuffer = await getFileInputBuffer(file);

  try {
    const outputBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 1200,
        withoutEnlargement: true,
      })
      .webp({
        quality: 80,
      })
      .toBuffer();

    return {
      buffer: outputBuffer,
      contentType: "image/webp",
      extension: "webp",
    };
  } catch {
    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    return {
      buffer: inputBuffer,
      contentType: file.type,
      extension: extensionByType[file.type] ?? "bin",
    };
  }
}

async function optimizeLogo(file: File) {
  const inputBuffer = await getFileInputBuffer(file);

  try {
    const outputBuffer = await sharp(inputBuffer)
      .rotate()
      .resize({
        width: 800,
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
      })
      .toBuffer();

    return {
      buffer: outputBuffer,
      contentType: "image/webp",
      extension: "webp",
    };
  } catch {
    const extensionByType: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
    };

    return {
      buffer: inputBuffer,
      contentType: file.type,
      extension: extensionByType[file.type] ?? "bin",
    };
  }
}

export async function uploadProductImageToR2(
  file: File,
  suggestedName?: string
): Promise<ProductImageUploadResult> {
  const validationError = validateProductImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const config = getR2Config();
  const s3Client = getS3Client(config);
  const optimizedImage = await optimizeImage(file);
  const baseName = slugify(
    suggestedName || file.name.replace(/\.[^.]+$/, "") || "urun-gorseli"
  );
  const key = `products/${baseName}-${Date.now()}.${optimizedImage.extension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: optimizedImage.buffer,
      ContentType: optimizedImage.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: `${config.publicBaseUrl}/${key}`,
  };
}

export async function uploadLogoToR2(file: File): Promise<LogoUploadResult> {
  const validationError = validateLogoImageFile(file);

  if (validationError) {
    throw new Error(validationError);
  }

  const config = getR2Config();
  const s3Client = getS3Client(config);
  const optimizedLogo = await optimizeLogo(file);
  const key = `logo/bimola-logo-${Date.now()}.${optimizedLogo.extension}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: optimizedLogo.buffer,
      ContentType: optimizedLogo.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: `${config.publicBaseUrl}/${key}`,
  };
}
