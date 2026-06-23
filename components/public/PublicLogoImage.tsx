"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { LOGO_PATH } from "@/lib/constants";
import { withImageVersion } from "@/lib/image-version";

type PublicLogoImageProps = {
  src?: string | null;
  updatedAt?: string | Date | null;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function PublicLogoImage({
  src,
  updatedAt,
  alt,
  sizes,
  priority = false,
}: PublicLogoImageProps) {
  const logoSrc = withImageVersion(src || LOGO_PATH, updatedAt) ?? LOGO_PATH;
  const [imageSrc, setImageSrc] = useState(logoSrc);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    setImageSrc(logoSrc);
    setShowPlaceholder(false);
  }, [logoSrc]);

  return (
    <>
      {!showPlaceholder ? (
        <Image
          key={imageSrc}
          src={imageSrc}
          alt={alt}
          fill
          unoptimized
          priority={priority}
          sizes={sizes}
          className="p-0.5 object-contain"
          onError={() => {
            if (imageSrc !== LOGO_PATH) {
              setImageSrc(LOGO_PATH);
              return;
            }

            setShowPlaceholder(true);
          }}
        />
      ) : (
        <div
          aria-hidden
          className="flex size-full items-center justify-center p-3"
        >
          <span className="font-heading text-lg font-semibold leading-none text-bimola-coffee">
            B
          </span>
        </div>
      )}
    </>
  );
}

