import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, PlayCircle } from "lucide-react";

import { ClassArchiveCard } from "@/components/archive/ClassArchiveCard";
import { Button } from "@/components/ui/button";
import { ARCHIVE_CLASSES } from "@/lib/archive/classes";

export const Route = createFileRoute("/archive/")({
  component: ArchivePage,
});

function ArchivePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            IMC Class Archive
          </span>

          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Learn Even If You Missed the Live Class
          </h1>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Access recorded classes and study materials from The Influencers
            Nations Membership Class. Select a class below to continue your
            learning.
          </p>
        </div>

        {/* Quick information */}
        <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <PlayCircle className="size-4" aria-hidden />
            Class recordings
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm text-muted-foreground">
            <BookOpen className="size-4" aria-hidden />
            Class ebooks
          </div>
        </div>

        {/* Archive cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ARCHIVE_CLASSES.map((archiveClass) => (
            <ClassArchiveCard
              key={archiveClass.slug}
              slug={archiveClass.slug}
              number={archiveClass.number}
              title={archiveClass.title}
              date={archiveClass.date}
              time={archiveClass.time}
              timezone={archiveClass.timezone}
              videoUrl={archiveClass.videoUrl}
              ebookUrl={archiveClass.ebookUrl}
              ebookTitle={archiveClass.ebookTitle}
              testUrl={archiveClass.testUrl}
              testTitle={archiveClass.testTitle}
            />
          ))}
        </div>

        {/* Back to curriculum */}
        <div className="mt-12 text-center">
          <Button asChild variant="outline" className="rounded-full">
            <Link to="/curriculum">Back to Curriculum</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}