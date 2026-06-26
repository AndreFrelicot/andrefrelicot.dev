"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageLightbox } from "./image-lightbox";

type Screenshot = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

type ScreenshotGalleryProps = {
  images: Screenshot[];
  caption?: string;
};

export function ScreenshotGallery({ images, caption }: ScreenshotGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const selectedImage =
    selectedIndex === null ? null : (images[selectedIndex] ?? null);

  return (
    <figure className="not-prose mx-auto my-10 w-full max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            aria-label={`Open image: ${image.alt}`}
            onClick={() => setSelectedIndex(index)}
            className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03] text-left transition hover:border-foreground/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width ?? 720}
              height={image.height ?? 1485}
              sizes="(min-width: 768px) 360px, 92vw"
              unoptimized
              className="block h-auto w-full cursor-zoom-in transition duration-200 hover:scale-[1.01]"
            />
          </button>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 px-2 text-center text-sm text-foreground/60">
          {caption}
        </figcaption>
      )}
      <ImageLightbox
        active={selectedImage !== null}
        onClose={() => setSelectedIndex(null)}
        caption={selectedImage?.alt}
        ariaLabel={selectedImage?.alt}
      >
        {selectedImage && (
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            width={selectedImage.width ?? 720}
            height={selectedImage.height ?? 1485}
            sizes="100vw"
            unoptimized
            draggable={false}
            className="max-h-[calc(100vh-5rem)] w-auto max-w-full rounded-md object-contain"
          />
        )}
      </ImageLightbox>
    </figure>
  );
}

export default ScreenshotGallery;
