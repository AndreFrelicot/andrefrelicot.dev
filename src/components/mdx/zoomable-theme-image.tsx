"use client";

import clsx from "clsx";
import Image from "next/image";
import type { ComponentProps, CSSProperties } from "react";
import { useState } from "react";
import { ImageLightbox } from "./image-lightbox";

type NextImageProps = ComponentProps<typeof Image>;
type ZoomableThemeImageProps = Omit<
  NextImageProps,
  "src" | "alt" | "className" | "width" | "height" | "fill"
> & {
  src?: NextImageProps["src"];
  lightSrc?: NextImageProps["src"];
  darkSrc?: NextImageProps["src"];
  alt: string;
  className?: string;
  imageClassName?: string;
  containerStyle?: CSSProperties;
  aspectRatio?: number | string;
  width?: NextImageProps["width"];
  height?: NextImageProps["height"];
  fill?: NextImageProps["fill"];
};

export function ZoomableThemeImage({
  src,
  lightSrc,
  darkSrc,
  alt,
  className,
  imageClassName,
  containerStyle,
  aspectRatio,
  width,
  height,
  fill,
  unoptimized = true,
  priority = false,
  sizes,
  style,
  ...rest
}: ZoomableThemeImageProps) {
  const [open, setOpen] = useState(false);

  const resolvedLightSrc = lightSrc ?? src ?? darkSrc;
  if (!resolvedLightSrc) {
    throw new Error("ZoomableThemeImage requires a `src` or `lightSrc` value.");
  }
  const resolvedDarkSrc = darkSrc ?? src ?? resolvedLightSrc;

  const hasExplicitDimensions =
    typeof width !== "undefined" && typeof height !== "undefined";
  const shouldFill = fill ?? !hasExplicitDimensions;

  if (!shouldFill && !hasExplicitDimensions) {
    throw new Error(
      "ZoomableThemeImage requires both `width` and `height` when `fill` is disabled.",
    );
  }

  const resolvedSizes = sizes ?? (shouldFill ? "100vw" : undefined);
  const wrapperClassName = clsx(
    shouldFill
      ? "relative mx-auto w-full max-w-3xl overflow-hidden"
      : "mx-auto flex justify-center overflow-hidden",
    "rounded-lg transition hover:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50",
    className,
  );
  const wrapperStyle: CSSProperties | undefined = shouldFill
    ? { aspectRatio: aspectRatio ?? "16 / 9", ...containerStyle }
    : containerStyle;

  const sharedImageProps: Omit<NextImageProps, "src" | "className" | "alt"> = {
    ...rest,
    unoptimized,
    priority,
    sizes: resolvedSizes,
    style,
  };

  const dimensionProps = shouldFill
    ? ({ fill: true } as const)
    : ({ width, height } as const);
  const modalWidth = width ?? 1600;
  const modalHeight = height ?? 900;

  return (
    <figure className="mx-auto my-10 w-full max-w-3xl">
      <button
        type="button"
        aria-label={`Open image: ${alt}`}
        onClick={() => setOpen(true)}
        className={wrapperClassName}
        style={wrapperStyle}
      >
        <Image
          {...sharedImageProps}
          {...dimensionProps}
          src={resolvedLightSrc}
          alt={alt}
          className={clsx(
            "block cursor-zoom-in rounded-lg dark:hidden",
            imageClassName,
          )}
        />
        <Image
          {...sharedImageProps}
          {...dimensionProps}
          src={resolvedDarkSrc}
          alt={alt}
          className={clsx(
            "hidden cursor-zoom-in rounded-lg dark:block",
            imageClassName,
          )}
        />
      </button>
      {alt && (
        <figcaption className="mt-2 px-2 text-center text-sm text-foreground/60">
          {alt}
        </figcaption>
      )}
      <ImageLightbox
        active={open}
        onClose={() => setOpen(false)}
        caption={alt}
        ariaLabel={alt}
      >
        <Image
          src={resolvedLightSrc}
          alt={alt}
          width={modalWidth}
          height={modalHeight}
          sizes="100vw"
          unoptimized
          draggable={false}
          className="max-h-[calc(100vh-5rem)] w-auto max-w-full rounded-md object-contain dark:hidden"
        />
        <Image
          src={resolvedDarkSrc}
          alt={alt}
          width={modalWidth}
          height={modalHeight}
          sizes="100vw"
          unoptimized
          draggable={false}
          className="hidden max-h-[calc(100vh-5rem)] w-auto max-w-full rounded-md object-contain dark:block"
        />
      </ImageLightbox>
    </figure>
  );
}

export default ZoomableThemeImage;
