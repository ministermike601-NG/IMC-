import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  CalendarCheck,
  CheckCircle2,
  Download,
  LogOut,
  Printer,
  Search,
  ShieldAlert,
  Trash2,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
      { name: "description", content: "Manage IMC registrations, check-ins and exports." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Registrations dashboard | IMC" },
      { property: "og:description", content: "Organiser dashboard for the IMC programme." },
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
      const { data } = await supabase.from("user_roles").select("role").eq("role", "admin");
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
        toast.error("An organiser already exists. Ask them to grant you access.");
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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["registrations"] }),
    onError: () => toast.error("Could not update check-in."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("registrations").delete().eq("id", id);
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
      const matchesDay = dayFilter === "all" || row.attendance_day === dayFilter;
      const matchesStatus = statusFilter === "all" || row.membership_status === statusFilter;
      return matchesTerm && matchesDay && matchesStatus;
    });
  }, [rows, search, dayFilter, statusFilter]);

  const todayCount = useMemo(() => {
    const today = new Date().toDateString();
    return rows.filter((row) => new Date(row.created_at).toDateString() === today).length;
  }, [rows]);

  const presentCount = rows.filter((row) => row.attendance_status === "present").length;

  const exportCsv = () => {
    const escape = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [
      EXPORT_COLUMNS.join(","),
      ...filtered.map((row) => EXPORT_COLUMNS.map((key) => escape(row[key])).join(",")),
    ].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `imc-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  if (rolesQuery.isLoading) {
    return <p className="p-16 text-center text-muted-foreground">Loading dashboard…</p>;
  }

  if (rolesQuery.data === false) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <ShieldAlert className="mx-auto size-10 text-gold" aria-hidden />
        <h1 className="mt-4 font-display text-3xl font-bold">Organiser access required</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          If you are setting up this event for the first time, claim organiser access below.
          Otherwise ask an existing organiser to grant you access.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button
            size="lg"
            className="h-12 rounded-full"
            disabled={claimAdmin.isPending}
            onClick={() => claimAdmin.mutate()}
          >
            Claim organiser access
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
          <h1 className="truncate font-display text-3xl font-bold sm:text-4xl">Registrations</h1>
          <p className="text-sm text-muted-foreground">Influencers Nations Membership Class</p>
        </div>
        <Button variant="outline" className="rounded-full print:hidden" onClick={signOut}>
          <LogOut className="mr-2 size-4" aria-hidden /> Sign out
        </Button>
      </header>

      <div className="mt-6 grid gap-4 sm:grid-cols-3 print:hidden">
        <StatCard icon={Users} label="Total registrations" value={rows.length} />
        <StatCard icon={CalendarCheck} label="Registered today" value={todayCount} />
        <StatCard icon={CheckCircle2} label="Checked in" value={presentCount} />
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
          <SelectTrigger className="h-12 min-w-52 rounded-full" aria-label="Filter by attendance">
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
          <SelectTrigger className="h-12 min-w-44 rounded-full" aria-label="Filter by membership">
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
          <Button variant="outline" className="h-12 flex-1 rounded-full" onClick={exportCsv}>
            <Download className="mr-2 size-4" aria-hidden /> Export
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-full"
            onClick={() => window.print()}
          >
            <Printer className="mr-2 size-4" aria-hidden /> Print
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
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead className="hidden lg:table-cell">Attendance</TableHead>
                <TableHead className="hidden lg:table-cell">Membership</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right print:hidden">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {registrationsQuery.isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    Loading registrations…
                  </TableCell>
                </TableRow>
              )}
              {!registrationsQuery.isLoading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No registrations match your filters yet.
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="font-medium">{row.full_name}</TableCell>
                  <TableCell>{row.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{row.email ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">{row.attendance_day ?? "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {row.membership_status ?? "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={row.attendance_status === "present" ? "default" : "secondary"}
                      className="rounded-full"
                    >
                      {row.attendance_status === "present" ? "Present" : "Registered"}
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
                        <CheckCircle2 className="mr-1 size-4" aria-hidden />
                        {row.attendance_status === "present" ? "Undo" : "Check in"}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Delete ${row.full_name}`}
                        onClick={() => {
                          if (confirm(`Delete the registration for ${row.full_name}?`)) {
                            remove.mutate(row.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4 text-destructive" aria-hidden />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
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
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <Icon className="size-5 text-primary" aria-hidden />
      </CardHeader>
      <CardContent>
        <p className="font-display text-4xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}
