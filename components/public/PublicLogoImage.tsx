"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { LOGO_PATH } from "@/lib/constants";

type PublicLogoImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function PublicLogoImage({
  src,
  alt,
  sizes,
  priority = false,
}: PublicLogoImageProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setShowPlaceholder(false);
  }, [src]);

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
          className="object-cover"
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
          className="flex size-full items-center justify-center bg-bimola-cream"
        >
          <span className="font-heading text-lg font-semibold leading-none text-bimola-coffee">
            B
          </span>
        </div>
      )}
    </>
  );
}

