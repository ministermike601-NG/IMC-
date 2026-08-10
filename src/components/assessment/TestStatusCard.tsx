import { BookOpen, CheckCircle2, ClipboardPenLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TestStatusCardProps = {
  testTitle: string;
  isAvailable: boolean;
  questionPdfPath?: string | null;
  onSubmit?: () => void;
};

export function TestStatusCard({
  testTitle,
  isAvailable,
  questionPdfPath,
  onSubmit,
}: TestStatusCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/70 shadow-soft">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10">
            <ClipboardPenLine
              className="size-5 text-primary"
              aria-hidden
            />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Class Assessment
            </p>

            <CardTitle className="mt-1 font-display text-xl">
              {testTitle}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isAvailable && questionPdfPath ? (
          <>
            <div className="flex items-center gap-2 rounded-2xl bg-primary/5 p-4 text-sm">
              <CheckCircle2
                className="size-5 shrink-0 text-primary"
                aria-hidden
              />

              <div>
                <p className="font-semibold text-foreground">
                  Test is available
                </p>

                <p className="mt-0.5 text-muted-foreground">
                  Download the questions, write your answers by hand, then
                  submit clear photos of your completed answers.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="rounded-full">
                <a
                  href={questionPdfPath}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BookOpen className="mr-2 size-4" aria-hidden />
                  Open Test Questions
                </a>
              </Button>

              <Button
                type="button"
                className="rounded-full"
                onClick={onSubmit}
              >
                <ClipboardPenLine className="mr-2 size-4" aria-hidden />
                Submit Your Answers
              </Button>
            </div>
          </>
        ) : (
          <div className="rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
            This assessment has not been released yet. Check back after the
            scheduled class session.
          </div>
        )}
      </CardContent>
    </Card>
  );
}