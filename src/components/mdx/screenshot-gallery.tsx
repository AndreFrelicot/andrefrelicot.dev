import Image from "next/image";

type Screenshot = {
  src: string;
  alt: string;
};

type ScreenshotGalleryProps = {
  images: Screenshot[];
  caption?: string;
};

export function ScreenshotGallery({ images, caption }: ScreenshotGalleryProps) {
  return (
    <figure className="not-prose mx-auto my-10 w-full max-w-4xl">
      <div className="grid gap-4 sm:grid-cols-2">
        {images.map((image) => (
          <div
            key={image.src}
            className="overflow-hidden rounded-lg border border-foreground/10 bg-foreground/[0.03]"
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={720}
              height={1485}
              sizes="(min-width: 768px) 360px, 92vw"
              unoptimized
              className="block h-auto w-full"
            />
          </div>
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 px-2 text-center text-sm text-foreground/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
