"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

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
    selectedIndex === null ? null : images[selectedIndex] ?? null;

  useEffect(() => {
    if (selectedIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedIndex]);

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
      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-6"
        >
          <button
            type="button"
            aria-label="Close image"
            onClick={() => setSelectedIndex(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/70 text-xl font-semibold leading-none text-white transition hover:bg-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span aria-hidden="true">x</span>
          </button>
          <div
            className="flex max-h-full max-w-full flex-col items-center gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={selectedImage.width ?? 720}
              height={selectedImage.height ?? 1485}
              sizes="100vw"
              unoptimized
              className="max-h-[calc(100vh-5rem)] w-auto max-w-full rounded-md object-contain"
            />
            <p className="max-w-3xl px-2 text-center text-sm text-white/75">
              {selectedImage.alt}
            </p>
          </div>
        </div>
      )}
    </figure>
  );
}
