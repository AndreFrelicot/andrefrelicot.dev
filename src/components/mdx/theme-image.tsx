import clsx from "clsx";
import Image from "next/image";
import type { ComponentProps, CSSProperties } from "react";

type NextImageProps = ComponentProps<typeof Image>;
type ThemeImageProps = Omit<
  NextImageProps,
  "src" | "alt" | "className" | "width" | "height" | "fill"
> & {
  /**
   * Optional single source used for both themes when specific theme assets aren't provided.
   */
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

export function ThemeImage({
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
}: ThemeImageProps) {
  const resolvedLightSrc = lightSrc ?? src ?? darkSrc;
  if (!resolvedLightSrc) {
    throw new Error("ThemeImage requires a `src` or `lightSrc` value.");
  }
  const resolvedDarkSrc = darkSrc ?? src ?? resolvedLightSrc;

  const hasExplicitDimensions =
    typeof width !== "undefined" && typeof height !== "undefined";
  const shouldFill = fill ?? !hasExplicitDimensions;

  if (!shouldFill && !hasExplicitDimensions) {
    throw new Error(
      "ThemeImage requires both `width` and `height` when `fill` is disabled.",
    );
  }

  const resolvedSizes = sizes ?? (shouldFill ? "100vw" : undefined);
  const wrapperClassName = clsx(
    shouldFill
      ? "relative mx-auto w-full max-w-3xl overflow-hidden"
      : "mx-auto flex justify-center overflow-hidden",
    "rounded-lg",
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

  return (
    <figure className="mx-auto w-full max-w-3xl">
      <div className={wrapperClassName} style={wrapperStyle}>
        <Image
          {...sharedImageProps}
          {...dimensionProps}
          src={resolvedLightSrc}
          alt={alt}
          className={clsx("block rounded-lg dark:hidden", imageClassName)}
        />
        <Image
          {...sharedImageProps}
          {...dimensionProps}
          src={resolvedDarkSrc}
          alt={alt}
          className={clsx("hidden rounded-lg dark:block", imageClassName)}
        />
      </div>
      {alt && (
        <figcaption className="mt-2 px-2 text-center text-sm text-foreground/60">
          {alt}
        </figcaption>
      )}
    </figure>
  );
}

export default ThemeImage;
