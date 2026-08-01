import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, ClipboardCheck, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT, WEEKS } from "@/lib/event";

const title = "Class Schedule — Fridays & Saturdays | IMC";
const description =
  "Three weeks of classes: 31 July & 1 August, 7 & 8 August, 14 & 15 August (GMT+1). Each week ends with an assessment; the programme ends with the final IMC examination.";

export const Route = createFileRoute("/schedule")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: SchedulePage,
});

function SchedulePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <header className="max-w-2xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Programme schedule
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">Class Schedule</h1>
        <p className="mt-4 text-muted-foreground">
          The Influencers Nations Membership Class is a three-week intensive discipleship and
          leadership training programme. Classes hold every Friday and Saturday.
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-sm">
          <Badge variant="secondary" className="rounded-full px-3 py-1.5">
            <CalendarDays className="mr-1.5 size-4" aria-hidden /> 31 July – 15 August
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1.5">
            <Clock className="mr-1.5 size-4" aria-hidden /> Time zone {EVENT.timezone}
          </Badge>
        </div>
      </header>

      <div className="mt-10 space-y-6">
        {WEEKS.map((week) => (
          <Card key={week.week} className="rounded-2xl border-border/70">
            <CardHeader className="gap-1 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="font-display text-2xl">{week.label}</CardTitle>
                <Badge variant="secondary" className="rounded-full">
                  {week.dates}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{week.theme}</p>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {week.days.map((day) => (
                <div key={day.date} className="rounded-2xl border border-border/70 p-4">
                  <p className="font-semibold">
                    {day.day}, {day.date}
                  </p>
                  <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                    {day.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {day.assessment && (
                    <p className="mt-3 flex items-start gap-2 rounded-xl bg-gold-soft px-3 py-2 text-xs font-semibold text-gold-foreground">
                      <ClipboardCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
                      <span>{day.assessment}</span>
                    </p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Button asChild size="lg" className="h-13 rounded-full px-8 text-base">
          <Link to="/register">Register Now</Link>
        </Button>
      </div>
    </div>
  );
}
