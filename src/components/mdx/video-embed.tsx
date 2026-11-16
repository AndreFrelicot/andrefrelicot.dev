type VideoEmbedProps = {
  src: string;
  title: string;
  caption?: string;
  poster?: string;
  vertical?: boolean;
  // Aspect ratio of the video, e.g. "21/9" or "4/3"; 16:9 (or 9:16 when vertical) by default.
  aspect?: string;
  // Use the full width of the article column instead of the narrower default.
  wide?: boolean;
};

export function VideoEmbed({
  src,
  title,
  caption,
  poster,
  vertical = false,
  aspect,
  wide = false,
}: VideoEmbedProps) {
  return (
    <figure
      className={`not-prose mx-auto my-10 w-full ${
        vertical ? "max-w-xs" : wide ? "max-w-5xl" : "max-w-3xl"
      }`}
    >
      <div
        className={`${
          aspect ? "" : vertical ? "aspect-[9/16]" : "aspect-video"
        } overflow-hidden rounded-lg bg-black`}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        <video
          src={src}
          title={title}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          controls
          preload="metadata"
          className="h-full w-full border-0"
        />
      </div>
      {caption && (
        <figcaption className="mt-3 px-2 text-center text-sm text-foreground/60">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
