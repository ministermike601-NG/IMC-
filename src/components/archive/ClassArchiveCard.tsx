import { BookOpen, CalendarDays, Clock, PlayCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ClassArchiveCardProps = {
  slug: string;
  number: string;
  title: string;
  date: string;
  time: string;
  timezone: string;
  videoUrl?: string;
  ebookUrl?: string;
  ebookTitle?: string;
  testUrl?: string;
  testTitle?: string;
};

export function ClassArchiveCard({
  slug,
  number,
  title,
  date,
  time,
  timezone,
  videoUrl,
  ebookUrl,
  ebookTitle,
  testUrl,
  testTitle,
}: ClassArchiveCardProps) {
  const hasRecording = Boolean(videoUrl);
  const hasMaterials = Boolean(ebookUrl);
  const hasTest = Boolean(testUrl);

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-3xl border-border/70 shadow-soft">
      <CardHeader>
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {number}
          </span>

          {hasRecording ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold-foreground">
              <PlayCircle className="size-3.5" aria-hidden />
              Recording available
            </span>
          ) : (
            <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground">
              Coming soon
            </span>
          )}
        </div>

        <CardTitle className="font-display text-xl leading-snug">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
            <CalendarDays className="size-3.5" aria-hidden />
            {date}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5">
            <Clock className="size-3.5" aria-hidden />
            {time} · {timezone}
          </span>
        </div>

        <div className="mt-5 space-y-2">
          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
              hasRecording
                ? "bg-primary/5 text-foreground"
                : "bg-secondary/60 text-muted-foreground"
            }`}
          >
            <PlayCircle className="size-4 shrink-0" aria-hidden />
            <span>
              {hasRecording
                ? "Class recording available"
                : "Class recording coming soon"}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
              hasMaterials
                ? "bg-primary/5 text-foreground"
                : "bg-secondary/60 text-muted-foreground"
            }`}
          >
            <BookOpen className="size-4 shrink-0" aria-hidden />
            <span>
              {hasMaterials
                ? ebookTitle ?? "Class ebook available"
                : "Class ebook coming soon"}
            </span>
          </div>

          <div
            className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm ${
              hasTest
                ? "bg-primary/5 text-foreground"
                : "bg-secondary/60 text-muted-foreground"
            }`}
          >
            <span className="text-base" aria-hidden>
              📝
            </span>

            <span>
              {hasTest
                ? testTitle ?? "Class test available"
                : testTitle
                  ? `${testTitle} — available later`
                  : "Class test available later"}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild className="flex-1 rounded-full">
          <Link
            to="/archive/$class"
            params={{ class: slug }}
          >
            <PlayCircle className="mr-2 size-4" aria-hidden />
            View Class
          </Link>
        </Button>

        {ebookUrl ? (
          <Button asChild variant="outline" className="rounded-full">
            <a
              href={ebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${ebookTitle ?? title} ebook`}
            >
              <BookOpen className="size-4" aria-hidden />
            </a>
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  );
}