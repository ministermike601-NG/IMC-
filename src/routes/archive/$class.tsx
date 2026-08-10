
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Download,
  FileText,
  PenLine,
} from "lucide-react";

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
        <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <h1 className="font-display text-3xl font-bold">
            Class not found
          </h1>

          <p className="mt-3 text-muted-foreground">
            The class you are looking for does not exist.
          </p>

          <Button asChild className="mt-6 rounded-full">
            <Link to="/archive">Back to Class Archive</Link>
          </Button>
        </section>
      </main>
    );
  }

  const testAvailable = Boolean(
    archiveClass.testUrl && archiveClass.testUrl.trim(),
  );

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Link
          to="/archive"
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden />
          Back to Class Archive
        </Link>

        <div className="mb-8 mt-8">
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

            {/* CLASS ASSESSMENT */}
            <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
              <div className="flex flex-col gap-6">
                <div className="flex gap-4">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <FileText className="size-5" aria-hidden />
                  </div>

                  <div>
                    <h2 className="font-display text-xl font-semibold">
                      Class Assessment
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {testAvailable
                        ? "Your assessment is available. Download the test questions, complete the test, and then submit your handwritten answers."
                        : "The assessment for this class has not been released yet."}
                    </p>
                  </div>
                </div>

                {testAvailable ? (
                  <div className="rounded-2xl bg-background p-4 sm:p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">
                          Assessment
                        </p>

                        <p className="mt-1 font-semibold">
                          {archiveClass.testTitle ||
                            `${archiveClass.number} Test Questions`}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Button
                          asChild
                          variant="outline"
                          className="rounded-full"
                        >
                          <a
                            href={archiveClass.testUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Download
                              className="mr-2 size-4"
                              aria-hidden
                            />
                            Download Questions
                          </a>
                        </Button>

                        <Button asChild className="rounded-full">
                          <Link
                            to="/assessment/$test"
                            params={{ test: archiveClass.slug }}
                          >
                            <PenLine
                              className="mr-2 size-4"
                              aria-hidden
                            />
                            Submit Your Answers
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-background/70 p-4 sm:p-5">
                    <p className="font-semibold">
                      {archiveClass.testTitle || "Assessment Coming Soon"}
                    </p>

                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      The test questions will appear here once they have
                      been released.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
