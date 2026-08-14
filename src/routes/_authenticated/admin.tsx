import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  CheckCircle2,
  Download,
  Eye,
  Loader2,
  LogOut,
  Printer,
  Search,
  ShieldAlert,
  Trash2,
  Users,
  X,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ATTENDANCE_OPTIONS, MEMBERSHIP_STATUSES } from "@/lib/event";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Registrations dashboard | IMC" },
      {
        name: "description",
        content:
          "Manage IMC registrations, assessments, check-ins and exports.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Registrations dashboard | IMC" },
      {
        property: "og:description",
        content: "Organiser dashboard for the IMC programme.",
      },
    ],
  }),
  component: AdminPage,
});

type Registration = {
  id: string;
  created_at: string;
  full_name: string;
  phone: string;
  whatsapp: string | null;
  email: string | null;
  gender: string | null;
  age_range: string | null;
  occupation: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  membership_status: string | null;
  attendance_day: string | null;
  church_name: string | null;
  attendance_status: string;
  checked_in_at: string | null;
};

const EXPORT_COLUMNS: (keyof Registration)[] = [
  "created_at",
  "full_name",
  "phone",
  "whatsapp",
  "email",
  "gender",
  "age_range",
  "occupation",
  "country",
  "state",
  "city",
  "membership_status",
  "attendance_day",
  "church_name",
  "attendance_status",
  "checked_in_at",
];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [dayFilter, setDayFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const rolesQuery = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("role", "admin");

      if (error) throw error;
      return (data?.length ?? 0) > 0;
    },
  });

  const registrationsQuery = useQuery({
    queryKey: ["registrations"],
    enabled: rolesQuery.data === true,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("registrations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data ?? []) as Registration[];
    },
  });

  const claimAdmin = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("claim_first_admin");
      if (error) throw error;
      return data as boolean;
    },
    onSuccess: (granted) => {
      if (granted) {
        toast.success("You are now the organiser for this event.");
        queryClient.invalidateQueries();
      } else {
        toast.error(
          "An organiser already exists. Ask them to grant you access.",
        );
      }
    },
    onError: () => toast.error("Could not complete setup."),
  });

  const toggleCheckIn = useMutation({
    mutationFn: async (row: Registration) => {
      const present = row.attendance_status !== "present";

      const { error } = await supabase
        .from("registrations")
        .update({
          attendance_status: present ? "present" : "registered",
          checked_in_at: present ? new Date().toISOString() : null,
        })
        .eq("id", row.id);

      if (error) throw error;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["registrations"] }),
    onError: () => toast.error("Could not update check-in."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("registrations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Registration deleted");
      queryClient.invalidateQueries({ queryKey: ["registrations"] });
    },
    onError: () => toast.error("Could not delete the registration."),
  });

  const rows = registrationsQuery.data ?? [];

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();

    return rows.filter((row) => {
      const matchesTerm =
        !term ||
        [row.full_name, row.phone, row.email, row.church_name, row.city]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(term));

      const matchesDay =
        dayFilter === "all" || row.attendance_day === dayFilter;

      const matchesStatus =
        statusFilter === "all" || row.membership_status === statusFilter;

      return matchesTerm && matchesDay && matchesStatus;
    });
  }, [rows, search, dayFilter, statusFilter]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();

    return rows.filter(
      (row) => new Date(row.created_at).toDateString() === today,
    ).length;
  }, [rows]);

  const presentCount = rows.filter(
    (row) => row.attendance_status === "present",
  ).length;

  const exportCsv = () => {
    const escape = (value: unknown) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
      EXPORT_COLUMNS.join(","),
      ...filtered.map((row) =>
        EXPORT_COLUMNS.map((key) => escape(row[key])).join(","),
      ),
    ].join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `imc-registrations-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  if (rolesQuery.isLoading) {
    return (
      <p className="p-16 text-center text-muted-foreground">
        Loading dashboard…
      </p>
    );
  }

  if (rolesQuery.error) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto size-10 text-gold" aria-hidden />
        <h1 className="mt-4 font-display text-3xl font-bold">
          Unable to verify organiser access
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Please refresh the page or sign in again.
        </p>
        <Button variant="ghost" className="mt-6" onClick={signOut}>
          Sign out
        </Button>
      </div>
    );
  }

  if (rolesQuery.data === false) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto size-10 text-gold" aria-hidden />

        <h1 className="mt-4 font-display text-3xl font-bold">
          Organiser access required
        </h1>

        <p className="mt-3 text-sm text-muted-foreground">
          If you are setting up this event for the first time, claim organiser
          access below. Otherwise ask an existing organiser to grant you
          access.
        </p>

        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="h-12 rounded-full"
            disabled={claimAdmin.isPending}
            onClick={() => claimAdmin.mutate()}
          >
            {claimAdmin.isPending ? "Setting up…" : "Claim organiser access"}
          </Button>

          <Button variant="ghost" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 print:py-0">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate font-display text-3xl font-bold sm:text-4xl">
            Registrations & Assessments
          </h1>

          <p className="text-sm text-muted-foreground">
            Influencers Nations Membership Class
          </p>
        </div>

        <Button
          variant="outline"
          className="rounded-full print:hidden"
          onClick={signOut}
        >
          <LogOut className="mr-2 size-4" aria-hidden />
          Sign out
        </Button>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 print:hidden">
        <StatCard
          icon={Users}
          label="Total registrations"
          value={rows.length}
        />
        <StatCard
          icon={CalendarCheck}
          label="Registered today"
          value={todayCount}
        />
        <StatCard
          icon={CheckCircle2}
          label="Checked in"
          value={presentCount}
        />
      </div>

      <div className="mt-6 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_auto_auto] print:hidden">
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email, church…"
            className="h-12 rounded-full pl-9"
            aria-label="Search registrations"
          />
        </div>

        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger
            className="h-12 min-w-52 rounded-full"
            aria-label="Filter by attendance"
          >
            <SelectValue placeholder="Attendance" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All attendance</SelectItem>

            {ATTENDANCE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger
            className="h-12 min-w-44 rounded-full"
            aria-label="Filter by membership"
          >
            <SelectValue placeholder="Membership" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All members</SelectItem>

            {MEMBERSHIP_STATUSES.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-full"
            onClick={exportCsv}
          >
            <Download className="mr-2 size-4" aria-hidden />
            Export
          </Button>

          <Button
            variant="outline"
            className="h-12 flex-1 rounded-full"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 size-4" aria-hidden />
            Print
          </Button>
        </div>
      </div>

      <Card className="mt-6 overflow-hidden rounded-2xl border-border/70 py-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="hidden md:table-cell">
                  Email
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Attendance
                </TableHead>
                <TableHead className="hidden lg:table-cell">
                  Membership
                </TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right print:hidden">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {registrationsQuery.isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    Loading registrations…
                  </TableCell>
                </TableRow>
              )}

              {!registrationsQuery.isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-10 text-center text-muted-foreground"
                  >
                    No registrations match your filters yet.
                  </TableCell>
                </TableRow>
              )}

              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">
                    {row.full_name}
                  </TableCell>

                  <TableCell>{row.phone}</TableCell>

                  <TableCell className="hidden md:table-cell">
                    {row.email ?? "—"}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {row.attendance_day ?? "—"}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell">
                    {row.membership_status ?? "—"}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant={
                        row.attendance_status === "present"
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full"
                    >
                      {row.attendance_status === "present"
                        ? "Present"
                        : "Registered"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-right print:hidden">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full"
                        onClick={() => toggleCheckIn.mutate(row)}
                      >
                        <CheckCircle2
                          className="mr-1 size-4"
                          aria-hidden
                        />
                        {row.attendance_status === "present"
                          ? "Undo"
                          : "Check in"}
                      </Button>

                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${row.full_name}`}
                        onClick={() => {
                          if (
                            confirm(
                              `Delete the registration for ${row.full_name}?`,
                            )
                          ) {
                            remove.mutate(row.id);
                          }
                        }}
                      >
                        <Trash2
                          className="size-4 text-destructive"
                          aria-hidden
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <AssessmentSubmissions />
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: number;
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
        <p className="font-display text-4xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

type Submission = {
  id: string;
  status: string;
  submitted_at: string;
  total_score: number | null;
  max_score: number | null;
  percentage: number | null;
  grade: string | null;
  feedback: string | null;
  marker_name: string | null;
  registration: {
    full_name: string;
    phone: string;
  } | null;
  test: {
    class_number: number;
    title: string;
    max_score: number | null;
  } | null;
};

type SubmissionPage = {
  id: string;
  submission_id: string;
  page_number: number;
  storage_path: string;
  original_file_name: string | null;
};

function AssessmentSubmissions() {
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const submissionsQuery = useQuery({
    queryKey: ["admin-assessment-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("imc_test_submissions")
        .select(`
          id,
          status,
          submitted_at,
          total_score,
          max_score,
          percentage,
          grade,
          feedback,
          marker_name,
          registration:registrations (
            full_name,
            phone
          ),
          test:imc_tests (
            class_number,
            title,
            max_score
          )
        `)
        .order("submitted_at", { ascending: false });

      if (error) throw error;

      return (data ?? []) as unknown as Submission[];
    },
  });

  const submissions = submissionsQuery.data ?? [];
  const pending = submissions.filter(
    (submission) => submission.status === "submitted",
  );
  const marked = submissions.filter(
    (submission) => submission.status === "marked",
  );

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="font-display text-3xl font-bold">
          Assessment submissions
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review uploaded answer pages and publish each student's result.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Total submissions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">
              {submissions.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Awaiting marking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">
              {pending.length}
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">
              Marked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-4xl font-bold">
              {marked.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden rounded-2xl">
        <CardHeader>
          <CardTitle>Test submissions</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          {submissionsQuery.isLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin" />
            </div>
          )}

          {submissionsQuery.error && (
            <div className="p-6 text-sm text-destructive">
              Unable to load test submissions.
            </div>
          )}

          {!submissionsQuery.isLoading &&
            !submissionsQuery.error &&
            submissions.length === 0 && (
              <p className="p-8 text-center text-muted-foreground">
                No test submissions yet.
              </p>
            )}

          <div className="divide-y">
            {submissions.map((submission) => {
              const student = submission.registration;
              const test = submission.test;

              return (
                <div
                  key={submission.id}
                  className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold">
                      {student?.full_name ?? "Unknown student"}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {student?.phone ?? "No phone"}
                    </p>

                    <p className="mt-1 text-sm">
                      Class {test?.class_number ?? "—"}{" "}
                      {test?.title ? `— ${test.title}` : ""}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Submitted{" "}
                      {new Date(
                        submission.submitted_at,
                      ).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge
                      variant={
                        submission.status === "marked"
                          ? "default"
                          : "secondary"
                      }
                      className="rounded-full"
                    >
                      {submission.status === "marked"
                        ? "Marked"
                        : "Awaiting marking"}
                    </Badge>

                    <Button
                      className="rounded-full"
                      onClick={() => setSelectedSubmission(submission)}
                    >
                      <Eye className="mr-2 size-4" />
                      {submission.status === "marked"
                        ? "View result"
                        : "Mark test"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <SubmissionDialog
        submission={selectedSubmission}
        open={selectedSubmission !== null}
        onClose={() => setSelectedSubmission(null)}
        onSaved={() => {
          queryClient.invalidateQueries({
            queryKey: ["admin-assessment-submissions"],
          });
          setSelectedSubmission(null);
        }}
      />
    </section>
  );
}

function SubmissionDialog({
  submission,
  open,
  onClose,
  onSaved,
}: {
  submission: Submission | null;
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [markerName, setMarkerName] = useState("");

  useEffect(() => {
    if (!submission) {
      setScore("");
      setFeedback("");
      setMarkerName("");
      return;
    }

    setScore(
      submission.total_score !== null
        ? String(submission.total_score)
        : "",
    );
    setFeedback(submission.feedback ?? "");
    setMarkerName(submission.marker_name ?? "");
  }, [submission]);

  const pagesQuery = useQuery({
    queryKey: ["submission-pages", submission?.id],
    enabled: open && !!submission?.id,
    queryFn: async () => {
      if (!submission) return [];

      const { data, error } = await supabase
        .from("imc_submission_pages")
        .select(`
          id,
          submission_id,
          page_number,
          storage_path,
          original_file_name
        `)
        .eq("submission_id", submission.id)
        .order("page_number", { ascending: true });

      if (error) throw error;

      return (data ?? []) as SubmissionPage[];
    },
  });

  const markMutation = useMutation({
    mutationFn: async () => {
      if (!submission) {
        throw new Error("No submission selected.");
      }

      const numericScore = Number(score);

      if (!Number.isFinite(numericScore) || numericScore < 0) {
        throw new Error("Please enter a valid score.");
      }

      const maxScore =
        submission.test?.max_score ??
        submission.max_score ??
        100;

      if (numericScore > maxScore) {
        throw new Error(
          `Score cannot be greater than ${maxScore}.`,
        );
      }

      const percentage = (numericScore / maxScore) * 100;

      let grade = "F";

      if (percentage >= 70) {
        grade = "A";
      } else if (percentage >= 60) {
        grade = "B";
      } else if (percentage >= 50) {
        grade = "C";
      } else if (percentage >= 45) {
        grade = "D";
      } else if (percentage >= 40) {
        grade = "E";
      }

      const { error } = await supabase
        .from("imc_test_submissions")
        .update({
          total_score: numericScore,
          max_score: maxScore,
          percentage,
          grade,
          feedback: feedback.trim() || null,
          marker_name: markerName.trim() || null,
          marked_at: new Date().toISOString(),
          status: "marked",
        })
        .eq("id", submission.id);

      if (error) throw error;
    },

    onSuccess: () => {
      toast.success("Test marked successfully.");
      onSaved();
    },

    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save the result.",
      );
    },
  });

  if (!submission) return null;

  const maxScore =
    submission.test?.max_score ??
    submission.max_score ??
    100;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !value && onClose()}
    >
      <DialogContent className="max-h-[95vh] max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {submission.registration?.full_name ?? "Student"} — Class{" "}
            {submission.test?.class_number ?? "—"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="rounded-xl border p-4">
            <p className="font-semibold">
              {submission.test?.title ?? "Assessment"}
            </p>

            <p className="text-sm text-muted-foreground">
              {submission.registration?.phone}
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">
              Submitted answer pages
            </h3>

            {pagesQuery.isLoading && (
              <div className="flex justify-center py-10">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}

            {pagesQuery.error && (
              <div className="rounded-xl border border-destructive/30 p-5 text-sm text-destructive">
                Unable to load the submitted pages.
              </div>
            )}

            <div className="space-y-6">
              {pagesQuery.data?.map((page) => (
                <SubmissionImage key={page.id} page={page} />
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="mb-4 text-lg font-semibold">
              Mark assessment
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Score
                </label>

                <Input
                  type="number"
                  min="0"
                  max={maxScore}
                  value={score}
                  onChange={(event) =>
                    setScore(event.target.value)
                  }
                  placeholder={`Maximum ${maxScore}`}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Marker name
                </label>

                <Input
                  value={markerName}
                  onChange={(event) =>
                    setMarkerName(event.target.value)
                  }
                  placeholder="Your name"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium">
                Feedback
              </label>

              <Textarea
                value={feedback}
                onChange={(event) =>
                  setFeedback(event.target.value)
                }
                placeholder="Enter feedback for the student..."
                rows={5}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={onClose}
              >
                <X className="mr-2 size-4" />
                Cancel
              </Button>

              <Button
                className="rounded-full"
                disabled={markMutation.isPending}
                onClick={() => markMutation.mutate()}
              >
                {markMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 size-4" />
                    Save result
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SubmissionImage({ page }: { page: SubmissionPage }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadImage = async () => {
      setLoading(true);

      const { data, error } = await supabase.storage
        .from("imc-test-submissions")
        .createSignedUrl(page.storage_path, 60 * 10);

      if (cancelled) return;

      if (error) {
        console.error(error);
        setImageUrl(null);
      } else {
        setImageUrl(data.signedUrl);
      }

      setLoading(false);
    };

    void loadImage();

    return () => {
      cancelled = true;
    };
  }, [page.storage_path]);

  return (
    <div className="overflow-hidden rounded-xl border bg-muted/20">
      <div className="border-b px-4 py-3">
        <p className="font-medium">Page {page.page_number}</p>

        {page.original_file_name && (
          <p className="text-xs text-muted-foreground">
            {page.original_file_name}
          </p>
        )}
      </div>

      <div className="flex min-h-40 items-center justify-center p-4">
        {loading && (
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        )}

        {!loading && imageUrl && (
          <img
            src={imageUrl}
            alt={`Answer page ${page.page_number}`}
            className="max-h-[900px] w-auto max-w-full object-contain"
          />
        )}

        {!loading && !imageUrl && (
          <p className="text-sm text-destructive">
            Unable to load this answer page.
          </p>
        )}
      </div>
    </div>
  );
}