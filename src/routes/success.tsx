import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, CalendarDays, Clock, Mail, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

const title = "Registration Successful — Influencers Nations Membership Class";

const description =
  "Thank you for registering for The Influencers Nations Membership Class.";

export const Route = createFileRoute("/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    name: typeof search.name === "string" ? search.name : "",
  }),

  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),

  component: SuccessPage,
});

function SuccessPage() {
  const { name } = Route.useSearch();

  return (
    <div className="container mx-auto flex min-h-screen max-w-3xl items-center justify-center px-4 py-12">
      <div className="w-full rounded-3xl border border-border bg-card p-8 shadow-xl">

        <div className="flex justify-center">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-14 w-14 text-green-600" />
          </div>
        </div>

        <h1 className="mt-8 text-center font-display text-4xl font-bold text-green-700 sm:text-5xl">
          🎉 Registration Successful!
        </h1>

        {name && (
          <p className="mt-4 text-center text-2xl font-semibold text-primary">
            Congratulations, {name}!
          </p>
        )}

        <p className="mt-6 text-center text-muted-foreground">
          Thank you for registering for
        </p>

        <h2 className="mt-2 text-center font-display text-3xl font-bold">
          The Influencers Nations Membership Class
        </h2>

        <p className="mt-5 text-center text-muted-foreground">
          Your registration has been received successfully.
          We look forward to welcoming you to this three-week discipleship
          and leadership programme.
        </p>

        <div className="mt-10 rounded-2xl bg-secondary/30 p-6">

          <div className="flex items-start gap-3">
            <CalendarDays className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Programme Dates</p>
              <p className="text-muted-foreground">
                7 August – 22 August
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3">
            <Clock className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Class Schedule</p>
              <p className="text-muted-foreground">
                Every Friday & Saturday (GMT+1)
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Support Email</p>
              <p className="text-muted-foreground">
                influencersnation01@gmail.com
              </p>
            </div>
          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-amber-300 bg-amber-50 p-5">

          <h3 className="font-semibold text-amber-800">
            Important Information
          </h3>

          <ul className="mt-3 space-y-3 text-sm text-amber-700">
            <li>
              • Please arrive at least <strong>30 minutes before</strong> each class.
            </li>

            <li>
              • A short assessment will be conducted immediately after the final
              Saturday class every week.
            </li>

            <li>
              • The final Saturday includes the comprehensive IMC Final Examination.
            </li>

            <li>
              • Please attend all scheduled classes to complete the programme successfully.
            </li>
          </ul>

        </div>

        <p className="mt-10 text-center text-lg font-medium">
          We look forward to seeing you.
        </p>

        <p className="text-center font-display text-3xl text-gold-foreground">
          God bless you.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">

          <Button
            asChild
            size="lg"
            className="h-13 rounded-full px-8 text-base"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-13 rounded-full px-8 text-base"
          >
            <Link to="/schedule">
              View Schedule
            </Link>
          </Button>

        </div>

      </div>
    </div>
  );
}