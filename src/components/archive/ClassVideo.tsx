import { BookOpen, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ClassVideoProps = {
  videoUrl?: string;
  title: string;
  ebookUrl?: string;
  ebookTitle?: string;
};

function getYouTubeEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtu.be")) {
      const videoId = parsedUrl.pathname.slice(1).split("/")[0];

      return videoId
        ? `https://www.youtube.com/embed/${videoId}`
        : null;
    }

    if (parsedUrl.hostname.includes("youtube.com")) {
      const videoId = parsedUrl.searchParams.get("v");

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (parsedUrl.pathname.startsWith("/embed/")) {
        return url;
      }
    }

    return null;
  } catch {
    return null;
  }
}

export function ClassVideo({
  videoUrl,
  title,
  ebookUrl,
  ebookTitle,
}: ClassVideoProps) {
  const embedUrl = videoUrl ? getYouTubeEmbedUrl(videoUrl) : null;

  return (
    <div className="space-y-6">
      <div className="aspect-video overflow-hidden rounded-2xl bg-black">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={`${title} — Class Recording`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <PlayCircle className="size-12 opacity-60" aria-hidden />

            <h2 className="mt-4 font-display text-xl font-semibold">
              Recording not available yet
            </h2>

            <p className="mt-2 max-w-md text-sm text-white/70">
              The recording for {title} will be available here once it has
              been uploaded.
            </p>
          </div>
        )}
      </div>

      {ebookUrl ? (
        <div className="rounded-2xl border border-border/70 bg-secondary/40 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-gold/15">
                <BookOpen
                  className="size-5 text-gold-foreground"
                  aria-hidden
                />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold">
                  Class Materials
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {ebookTitle ?? `${title} — Class Materials`}
                </p>
              </div>
            </div>

            <Button asChild className="rounded-full">
              <a
                href={ebookUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <BookOpen className="mr-2 size-4" aria-hidden />
                Open Ebook
              </a>
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}