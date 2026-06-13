type YouTubeEmbedProps = {
  videoId: string;
  title: string;
  caption?: string;
};

export function YouTubeEmbed({ videoId, title, caption }: YouTubeEmbedProps) {
  return (
    <figure className="not-prose mx-auto my-10 w-full max-w-3xl">
      <div className="aspect-video overflow-hidden rounded-lg bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}`}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
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
