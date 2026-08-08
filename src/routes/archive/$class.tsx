import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CalendarDays, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ClassVideo } from "@/components/archive/ClassVideo";
import { getArchiveClass } from "@/lib/archive/classes";

export const Route = createFileRoute("/archive/$class")({
  component: ArchiveClassPage,
});

function ArchiveClassPage() {
  const { class: classSlug } = Route.useParams();
  const archiveClass = getArchiveClass(classSlug);

  if (!archiveClass) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto max-w-4xl px-4 py-20 text-center">
          <h1 className="font-display text-3xl font-bold">
            Class not found
          </h1>

          <p className="mt-3 text-muted-foreground">
            The class you are looking for does not exist.
          </p>

          <Button asChild className="mt-6 rounded-full">
            <Link to="/curriculum">Back to Curriculum</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
        <Button
          asChild
          variant="ghost"
          className="mb-8 rounded-full"
        >
          <Link to="/curriculum">
            <ArrowLeft className="mr-2 size-4" aria-hidden />
            Back to Curriculum
          </Link>
        </Button>

        <div className="mb-8">
          <span className="text-xs font-semibold tracking-[0.16em] text-primary uppercase">
            {archiveClass.number}
          </span>

          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            {archiveClass.title}
          </h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            Missed the live session? Watch the recorded class below and
            continue your IMC learning.
          </p>
        </div>

        <Card className="overflow-hidden rounded-3xl border-border/70 shadow-soft">
          <CardContent className="p-3 sm:p-5">
            <ClassVideo
              videoUrl={archiveClass.videoUrl}
              title={archiveClass.title}
              ebookUrl={archiveClass.ebookUrl}
              ebookTitle={archiveClass.ebookTitle}
            />

            <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                <CalendarDays className="size-4" aria-hidden />
                {archiveClass.date}
              </span>

              <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
                <Clock className="size-4" aria-hidden />
                {archiveClass.time} · {archiveClass.timezone}
              </span>
            </div>

            <div className="mt-6 border-t pt-6">
              <h2 className="font-display text-xl font-semibold">
                About this class
              </h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {archiveClass.description}
              </p>
            </div>

            <div className="mt-6 rounded-2xl bg-secondary/50 p-5">
              <h2 className="font-display text-lg font-semibold">
                Class Test
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {archiveClass.testTitle
                  ? `${archiveClass.testTitle} will be made available after the scheduled Saturday sessions.`
                  : "Test questions will be made available after the scheduled Saturday sessions."}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}