import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Award,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  LogOut,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard | Influencers Nations Membership Class" },
      {
        name: "description",
        content:
          "View your Influencers Nations Membership Class progress, assessment results, grades and feedback.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: StudentDashboard,
});

type Registration = {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  membership_status: string | null;
  checked_in: boolean | null;
  attendance_day: string | null;
  created_at: string;
};

type Test = {
  id: string;
  class_number: number;
  title: string;
  max_score: number | null;
};

type Submission = {
  id: string;
  test_id: string;
  registration_id: string;
  status: string;
  submitted_at: string;
  total_score: number | null;
  max_score: number | null;
  percentage: number | null;
  grade: string | null;
  feedback: string | null;
  marker_name: string | null;
  test: Test | null;
};

function StudentDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const studentQuery = useQuery({
    queryKey: ["student-dashboard"],
    queryFn: async () => {
      // --------------------------------------------------
      // 1. Get currently signed-in user
      // --------------------------------------------------
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;

      if (!user) {
        throw new Error("You are not signed in.");
      }

      const metadata = user.user_metadata ?? {};

      const fullName =
        typeof metadata.full_name === "string"
          ? metadata.full_name.trim()
          : "";

      const phone =
        typeof metadata.phone === "string"
          ? metadata.phone.trim()
          : "";

      // --------------------------------------------------
      // 2. Find registration
      //
      // We ONLY use columns that actually exist.
      // --------------------------------------------------
      let registration: Registration | null = null;

      // First: exact auth_user_id match.
      // This is the safest connection between auth and registration.
      const { data: authRegistration, error: authRegistrationError } =
        await supabase
          .from("registrations")
          .select(
            "id, full_name, phone, email, membership_status, checked_in, attendance_day, created_at",
          )
          .eq("auth_user_id", user.id)
          .limit(1)
          .maybeSingle();

      if (authRegistrationError) {
        throw authRegistrationError;
      }

      registration = authRegistration as Registration | null;

      // Second: email fallback for older registrations
      if (!registration && user.email) {
        const { data: emailRegistration, error: emailError } =
          await supabase
            .from("registrations")
            .select(
              "id, full_name, phone, email, membership_status, checked_in, attendance_day, created_at",
            )
            .eq("email", user.email)
            .limit(1)
            .maybeSingle();

        if (emailError) {
          throw emailError;
        }

        registration = emailRegistration as Registration | null;
      }

      // Third: phone fallback
      if (!registration && phone) {
        const { data: phoneRegistration, error: phoneError } =
          await supabase
            .from("registrations")
            .select(
              "id, full_name, phone, email, membership_status, checked_in, attendance_day, created_at",
            )
            .eq("phone", phone)
            .limit(1)
            .maybeSingle();

        if (phoneError) {
          throw phoneError;
        }

        registration = phoneRegistration as Registration | null;
      }

      // --------------------------------------------------
      // 3. No registration found
      // --------------------------------------------------
      if (!registration) {
        return {
          user: {
            email: user.email ?? "",
            fullName,
            phone,
          },
          registration: null,
          submissions: [] as Submission[],
        };
      }

      // --------------------------------------------------
      // 4. Get submissions
      //
      // IMPORTANT:
      // No nested imc_tests relationship here.
      // Every requested column exists in the database.
      // --------------------------------------------------
      const { data: rawSubmissions, error: submissionsError } =
        await supabase
          .from("imc_test_submissions")
          .select(
            "id, test_id, registration_id, status, submitted_at, total_score, max_score, percentage, grade, feedback, marker_name",
          )
          .eq("registration_id", registration.id)
          .order("submitted_at", { ascending: true });

      if (submissionsError) {
        throw submissionsError;
      }

      const submissionsRows = rawSubmissions ?? [];

      // --------------------------------------------------
      // 5. Get the tests separately
      // --------------------------------------------------
      const testIds = [
        ...new Set(
          submissionsRows
            .map((submission) => submission.test_id)
            .filter(Boolean),
        ),
      ];

      let tests: Test[] = [];

      if (testIds.length > 0) {
        const { data: testsData, error: testsError } = await supabase
          .from("imc_tests")
          .select("id, class_number, title, max_score")
          .in("id", testIds);

        if (testsError) {
          throw testsError;
        }

        tests = (testsData ?? []) as Test[];
      }

      // --------------------------------------------------
      // 6. Attach each test to its submission
      // --------------------------------------------------
      const submissions: Submission[] = submissionsRows.map((submission) => {
        const test =
          tests.find((item) => item.id === submission.test_id) ?? null;

        return {
          id: submission.id,
          test_id: submission.test_id,
          registration_id: submission.registration_id,
          status: submission.status,
          submitted_at: submission.submitted_at,
          total_score: submission.total_score,
          max_score: submission.max_score,
          percentage: submission.percentage,
          grade: submission.grade,
          feedback: submission.feedback,
          marker_name: submission.marker_name,
          test,
        };
      });

      return {
        user: {
          email: user.email ?? "",
          fullName: fullName || registration.full_name,
          phone: phone || registration.phone,
        },
        registration,
        submissions,
      };
    },
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    toast.success("Signed out.");
    await navigate({ to: "/auth" });
  };

  if (studentQuery.isLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center px-4">
        <Clock3 className="size-6 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (studentQuery.error) {
    console.error("Dashboard error:", studentQuery.error);

    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <Card className="rounded-3xl">
          <CardContent className="p-8 text-center">
            <h1 className="font-display text-3xl font-bold">
              Unable to load your dashboard
            </h1>

            <p className="mt-3 text-sm text-muted-foreground">
              Please refresh the page or sign in again.
            </p>

            <Button
              className="mt-6 rounded-full"
              onClick={() => navigate({ to: "/auth" })}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  const data = studentQuery.data!;
  const registration = data.registration;
  const submissions = data.submissions;

  const marked = submissions.filter(
    (submission) => submission.status === "marked",
  );

  const pending = submissions.filter(
    (submission) => submission.status === "submitted",
  );

  const averagePercentage =
    marked.length > 0
      ? marked.reduce(
          (total, submission) => total + (submission.percentage ?? 0),
          0,
        ) / marked.length
      : null;

  const passedCount = marked.filter(
    (submission) => (submission.percentage ?? 0) >= 40,
  ).length;

  const overallGrade =
    averagePercentage === null
      ? "—"
      : averagePercentage >= 70
        ? "A"
        : averagePercentage >= 60
          ? "B"
          : averagePercentage >= 50
            ? "C"
            : averagePercentage >= 45
              ? "D"
              : averagePercentage >= 40
                ? "E"
                : "F";

  const firstName =
    data.user.fullName.trim().split(/\s+/)[0] || "Student";

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              My Membership Dashboard
            </p>

            <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
              Welcome, {firstName}
            </h1>

            <p className="mt-2 text-muted-foreground">
              Track your membership journey, assessments and results.
            </p>
          </div>

          <Button
            variant="outline"
            className="rounded-full"
            onClick={signOut}
          >
            <LogOut className="mr-2 size-4" aria-hidden />
            Sign out
          </Button>
        </div>

        {!registration ? (
          <Card className="mt-8 rounded-3xl border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-500/10">
                  <User className="size-5 text-amber-600" aria-hidden />
                </div>

                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    Account created successfully
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your login account is active, but it has not yet been
                    linked to an IMC registration. An organiser can connect
                    your account to your existing registration so your
                    assessments and performance appear here.
                  </p>

                  <div className="mt-4 grid gap-2 text-sm">
                    <span className="flex items-center gap-2">
                      <Mail className="size-4 text-primary" aria-hidden />
                      {data.user.email}
                    </span>

                    {data.user.phone && (
                      <span className="flex items-center gap-2">
                        <Phone className="size-4 text-primary" aria-hidden />
                        {data.user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <PerformanceCard
                icon={ClipboardCheck}
                label="Assessments submitted"
                value={submissions.length}
              />

              <PerformanceCard
                icon={CheckCircle2}
                label="Assessments marked"
                value={marked.length}
              />

              <PerformanceCard
                icon={Award}
                label="Average score"
                value={
                  averagePercentage === null
                    ? "—"
                    : `${averagePercentage.toFixed(0)}%`
                }
              />

              <PerformanceCard
                icon={CalendarCheck}
                label="Attendance"
                value={
                  registration.checked_in
                    ? "Present"
                    : registration.attendance_day ?? "Registered"
                }
              />
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
              <Card className="rounded-3xl border-border/70">
                <CardHeader>
                  <CardTitle className="font-display text-2xl">
                    My assessment results
                  </CardTitle>

                  <p className="text-sm text-muted-foreground">
                    Your results appear here after a marker reviews your
                    submission.
                  </p>
                </CardHeader>

                <CardContent>
                  {submissions.length === 0 ? (
                    <div className="rounded-2xl bg-secondary/40 p-6 text-center text-sm text-muted-foreground">
                      You have not submitted an assessment yet.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submissions.map((submission) => {
                        const test = submission.test;
                        const isMarked = submission.status === "marked";

                        return (
                          <div
                            key={submission.id}
                            className="rounded-2xl border border-border/70 p-5"
                          >
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                                  Class {test?.class_number ?? "—"}
                                </p>

                                <h3 className="mt-1 font-display text-xl font-semibold">
                                  {test?.title ?? "Assessment"}
                                </h3>

                                <p className="mt-1 text-xs text-muted-foreground">
                                  Submitted{" "}
                                  {new Date(
                                    submission.submitted_at,
                                  ).toLocaleDateString()}
                                </p>
                              </div>

                              <Badge
                                variant={isMarked ? "default" : "secondary"}
                                className="w-fit rounded-full"
                              >
                                {isMarked ? "Marked" : "Awaiting marking"}
                              </Badge>
                            </div>

                            {isMarked ? (
                              <div className="mt-5 grid gap-3 sm:grid-cols-4">
                                <ResultMetric
                                  label="Score"
                                  value={`${submission.total_score ?? 0} / ${
                                    submission.max_score ??
                                    test?.max_score ??
                                    100
                                  }`}
                                />

                                <ResultMetric
                                  label="Percentage"
                                  value={`${(
                                    submission.percentage ?? 0
                                  ).toFixed(0)}%`}
                                />

                                <ResultMetric
                                  label="Grade"
                                  value={submission.grade ?? "—"}
                                />

                                <ResultMetric
                                  label="Marker"
                                  value={submission.marker_name ?? "—"}
                                />
                              </div>
                            ) : (
                              <p className="mt-4 rounded-xl bg-secondary/40 p-3 text-sm text-muted-foreground">
                                Your answer pages have been received and are
                                currently awaiting marking.
                              </p>
                            )}

                            {isMarked && submission.feedback && (
                              <div className="mt-4 rounded-xl bg-primary/5 p-4">
                                <p className="text-sm font-semibold">
                                  Marker feedback
                                </p>

                                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                  {submission.feedback}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="space-y-6">
                <Card className="rounded-3xl border-border/70">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">
                      Overall performance
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="grid place-items-center rounded-3xl bg-secondary/40 p-8 text-center">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                        Average
                      </p>

                      <p className="mt-2 font-display text-6xl font-bold text-primary">
                        {averagePercentage === null
                          ? "—"
                          : `${averagePercentage.toFixed(0)}%`}
                      </p>

                      <p className="mt-2 text-lg font-semibold">
                        Grade {overallGrade}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {passedCount} of {marked.length} marked assessments
                        passed
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-3xl border-border/70">
                  <CardHeader>
                    <CardTitle className="font-display text-2xl">
                      My details
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 text-sm">
                    <DetailRow
                      icon={User}
                      label="Full name"
                      value={registration.full_name}
                    />

                    <DetailRow
                      icon={Phone}
                      label="Phone"
                      value={registration.phone}
                    />

                    <DetailRow
                      icon={Mail}
                      label="Email"
                      value={registration.email ?? data.user.email}
                    />

                    <DetailRow
                      icon={CalendarCheck}
                      label="Attendance"
                      value={
                        registration.checked_in
                          ? "Present"
                          : registration.attendance_day ?? "Registered"
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            </div>

            {pending.length > 0 && (
              <Card className="mt-6 rounded-3xl border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <p className="font-semibold">Assessment processing</p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    You have {pending.length} assessment
                    {pending.length === 1 ? "" : "s"} waiting to be marked.
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>
    </main>
  );
}

function PerformanceCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ClipboardCheck;
  label: string;
  value: string | number;
}) {
  return (
    <Card className="rounded-2xl border-border/70">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>

        <Icon className="size-5 text-primary" aria-hidden />
      </CardHeader>

      <CardContent>
        <p className="font-display text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function ResultMetric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-secondary/40 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </div>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="break-words font-medium">{value}</p>
      </div>
    </div>
  );
}