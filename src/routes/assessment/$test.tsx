import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CheckCircle2,
  ClipboardPenLine,
  Loader2,
} from "lucide-react";
import { useState } from "react";

import { AnswerUpload } from "@/components/assessment/AnswerUpload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getArchiveClass } from "@/lib/archive/classes";
import {
  cancelAssessmentSubmission,
  finalizeAssessmentSubmission,
  prepareAssessmentSubmission,
} from "@/lib/assessment/submit";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/assessment/$test")({
  component: AssessmentSubmissionPage,
});

function AssessmentSubmissionPage() {
  const { test: testSlug } = Route.useParams();

  const archiveClass = getArchiveClass(testSlug);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  if (!archiveClass) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-display text-3xl font-bold">
            Assessment not found
          </h1>

          <p className="mt-3 text-muted-foreground">
            The assessment you are looking for does not exist.
          </p>

          <Button asChild className="mt-6 rounded-full">
            <Link to="/archive">Back to Class Archive</Link>
          </Button>
        </section>
      </main>
    );
  }

  // Keep a non-optional reference for nested callbacks such as handleSubmit.
  const currentArchiveClass = archiveClass;

  const testAvailable = Boolean(
    currentArchiveClass.testUrl && currentArchiveClass.testUrl.trim(),
  );

  if (!testAvailable) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {currentArchiveClass.number}
          </span>

          <h1 className="mt-5 font-display text-3xl font-bold">
            Test Not Available
          </h1>

          <p className="mt-3 text-muted-foreground">
            This test has not been released yet.
          </p>

          <Button asChild className="mt-6 rounded-full">
            <Link to="/archive">Back to Class Archive</Link>
          </Button>
        </section>
      </main>
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!fullName.trim() || !phone.trim()) {
      setError("Please enter your full name and phone number.");
      return;
    }

    if (files.length === 0) {
      setError("Please upload at least one answer page.");
      return;
    }

    if (files.length > 20) {
      setError("You can upload a maximum of 20 answer pages.");
      return;
    }

    let submissionId: string | null = null;
    const uploadedStoragePaths: string[] = [];

    try {
      setSubmitting(true);

      // Verify registration and create the submission first.
      const preparation = await prepareAssessmentSubmission({
        data: {
          testSlug: currentArchiveClass.slug,
          fullName,
          phone,
          files: files.map((file) => ({
            name: file.name,
            type: file.type,
          })),
        },
      });

      submissionId = preparation.submissionId;

      if (!submissionId) {
        throw new Error("Unable to create an assessment submission.");
      }

      const uploadedPages: {
        pageNumber: number;
        storagePath: string;
        originalFileName: string;
      }[] = [];

      // Upload each image directly to Supabase Storage.
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const uploadInfo = preparation.uploadUrls[index];

        if (!uploadInfo) {
          throw new Error(
            `Upload information for page ${index + 1} is missing.`,
          );
        }

        const { error: uploadError } = await supabase.storage
          .from("imc-test-submissions")
          .uploadToSignedUrl(
            uploadInfo.storagePath,
            uploadInfo.token,
            file,
          );

        if (uploadError) {
          console.error(
            `Page ${index + 1} upload failed:`,
            uploadError,
          );

          throw new Error(
            `Unable to upload answer page ${index + 1}.`,
          );
        }

        uploadedStoragePaths.push(uploadInfo.storagePath);

        uploadedPages.push({
          pageNumber: uploadInfo.pageNumber,
          storagePath: uploadInfo.storagePath,
          originalFileName: uploadInfo.originalFileName,
        });
      }

      // Save the storage paths after every image has uploaded successfully.
      await finalizeAssessmentSubmission({
        data: {
          submissionId,
          files: uploadedPages,
        },
      });

      setSubmitted(true);
    } catch (submissionError) {
      console.error(
        "Assessment submission failed:",
        submissionError,
      );

      if (submissionId) {
        try {
          await cancelAssessmentSubmission({
            data: {
              submissionId,
              storagePaths: uploadedStoragePaths,
            },
          });
        } catch (cleanupError) {
          console.error(
            "Submission cleanup failed:",
            cleanupError,
          );
        }
      }

      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while submitting your test.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen">
        <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
          <Card className="overflow-hidden rounded-3xl border-border/70 shadow-soft">
            <CardContent className="p-8 text-center sm:p-12">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/10">
                <CheckCircle2
                  className="size-8 text-primary"
                  aria-hidden
                />
              </div>

              <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {currentArchiveClass.number}
              </span>

              <h1 className="mt-3 font-display text-3xl font-bold">
                Test Submitted Successfully
              </h1>

              <p className="mx-auto mt-4 max-w-lg leading-7 text-muted-foreground">
                Thank you, {fullName}. Your handwritten answers for{" "}
                <strong className="text-foreground">
                  {currentArchiveClass.title}
                </strong>{" "}
                have been received and are now awaiting marking.
              </p>

              <div className="mt-8 rounded-2xl bg-secondary/60 p-5 text-left">
                <p className="text-sm font-semibold">What happens next?</p>

                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                  <li>• Your answer pages will be reviewed.</li>
                  <li>• Your answers will be marked and scored.</li>
                  <li>• Your result will be recorded with your registration.</li>
                </ul>
              </div>

              <Button asChild className="mt-8 rounded-full">
                <Link to="/archive">Back to Class Archive</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <Link
          to="/archive/$class"
          params={{ class: currentArchiveClass.slug }}
          className="inline-flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="mr-2 size-4" aria-hidden />
          Back to Class
        </Link>

        <div className="mt-8">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            {currentArchiveClass.number}
          </span>

          <h1 className="mt-2 font-display text-4xl font-bold sm:text-5xl">
            Submit Your Answers
          </h1>

          <p className="mt-4 text-muted-foreground">
            {currentArchiveClass.title} — Test Submission
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Card className="rounded-3xl border-border/70 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Verify Your Registration
              </CardTitle>

              <p className="text-sm leading-6 text-muted-foreground">
                Enter the same name and phone number you used when registering
                for the Influencers Nations Membership Class.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <label
                  htmlFor="full-name"
                  className="text-sm font-medium"
                >
                  Full Name
                </label>

                <input
                  id="full-name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Enter your registered full name"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                  disabled={submitting}
                />
              </div>

              <div>
                <label htmlFor="phone" className="text-sm font-medium">
                  Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="Enter your registered phone number"
                  className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                  required
                  disabled={submitting}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Your Answer Pages
              </CardTitle>

              <p className="text-sm leading-6 text-muted-foreground">
                Upload clear photographs of all pages containing your
                handwritten answers.
              </p>
            </CardHeader>

            <CardContent>
              <AnswerUpload onFilesChange={setFiles} />
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70 bg-secondary/40">
            <CardContent className="p-5 sm:p-6">
              <h2 className="font-semibold">Before you submit</h2>

              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted-foreground">
                <li>• Make sure every answer page is included.</li>
                <li>• Make sure every photograph is clear and readable.</li>
                <li>• Make sure your registered information is correct.</li>
                <li>• Do not submit another person's answers.</li>
              </ul>
            </CardContent>
          </Card>

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              {error}
            </div>
          ) : null}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full sm:w-auto"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2
                  className="mr-2 size-5 animate-spin"
                  aria-hidden
                />
                Uploading Answers...
              </>
            ) : (
              <>
                <ClipboardPenLine
                  className="mr-2 size-5"
                  aria-hidden
                />
                Submit Test
              </>
            )}
          </Button>
        </form>
      </section>
    </main>
  );
}