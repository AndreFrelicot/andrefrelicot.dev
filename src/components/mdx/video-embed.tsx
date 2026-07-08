type VideoEmbedProps = {
  src: string;
  title: string;
  caption?: string;
  poster?: string;
  vertical?: boolean;
};

export function VideoEmbed({
  src,
  title,
  caption,
  poster,
  vertical = false,
}: VideoEmbedProps) {
  return (
    <figure
      className={`not-prose mx-auto my-10 w-full ${
        vertical ? "max-w-xs" : "max-w-3xl"
      }`}
    >
      <div
        className={`${
          vertical ? "aspect-[9/16]" : "aspect-video"
        } overflow-hidden rounded-lg bg-black`}
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
