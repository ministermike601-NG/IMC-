import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenCheck,
  CalendarDays,
  Clock,
  ClipboardCheck,
  GraduationCap,
  Heart,
  Mail,
  MessageCircle,
  Phone,
  Sparkles,
  Users,
} from "lucide-react";
import Logo from "@/assets/logo.png";
import heroImage from "@/assets/hero.jpg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT, OUTCOMES, WEEKS } from "@/lib/event";

const title = "Influencers Nations Membership Class — 3-Week Training";
const description =
  "Register for the three-week Influencers Nations Membership Class. Classes hold every Friday and Saturday from 31 July to 15 August (GMT+1).";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: Home,
});

const WHY_ATTEND = [
  {
    icon: BookOpenCheck,
    title: "Strong biblical foundation",
    body: "Nine structured classes covering salvation, the Holy Spirit, doctrine, evangelism and Kingdom culture.",
  },
  {
    icon: Users,
    title: "Belong to a community",
    body: "Understand the vision, culture and leadership structure of The Influencers Nation and find your place.",
  },
  {
    icon: Sparkles,
    title: "Technology for the Gospel",
    body: "Learn practical mobile and digital tools for evangelism, online discipleship and church growth.",
  },
  {
    icon: GraduationCap,
    title: "Recognised graduation",
    body: "Weekly assessments and a final IMC examination lead to official recognition and commissioning.",
  },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Members gathered in worship at an Influencers Nations service"
            width={1600}
            height={1008}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 gradient-royal opacity-90" />
        </div>

         {/* IMC Logo */}
          <div className="rise-in mb-8 flex justify-center">
            <img
              src={Logo}
              alt="Influencers Nations Membership Class"
              className="h-28 w-auto drop-shadow-2xl sm:h-36 lg:h-44"
            />
          </div>

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-28">
          <Badge className="rise-in rounded-full border-0 bg-gold px-4 py-1.5 text-xs font-semibold tracking-[0.14em] text-gold-foreground uppercase">
            Three-week training programme
          </Badge>
          <h1 className="rise-in mt-6 font-display text-4xl leading-tight font-bold text-primary-foreground sm:text-6xl">
            {EVENT.name}
          </h1>
          <p className="rise-in mx-auto mt-5 max-w-2xl text-base text-primary-foreground/90 sm:text-lg">
            {EVENT.tagline}
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3 text-sm text-primary-foreground/90">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur">
              <CalendarDays className="size-4" aria-hidden /> 31 July – 15 August
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 backdrop-blur">
              <Clock className="size-4" aria-hidden /> Fridays &amp; Saturdays · {EVENT.timezone}
            </span>
          </div>

          <div className="mt-9">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-gold px-9 text-base font-semibold text-gold-foreground shadow-elegant hover:bg-gold/90"
            >
              <Link to="/register">
                Register Now <ArrowRight className="ml-1 size-5" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Welcome */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h2 className="font-display text-3xl font-semibold sm:text-4xl">You are welcome home</h2>
        <p className="mt-4 text-muted-foreground">
          Every registered participant goes through a comprehensive three-week training programme
          designed to build a strong biblical foundation, develop spiritual maturity, introduce the
          vision and culture of The Influencers Nation, and equip believers to influence their world
          through ministry, leadership, evangelism and technology.
        </p>
      </section>

      {/* Why attend */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">Why attend</h2>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_ATTEND.map((item) => (
            <Card
              key={item.title}
              className="rounded-2xl border-border/70 transition-shadow duration-300 hover:shadow-elegant"
            >
              <CardHeader className="gap-3 pb-2">
                <span className="grid size-11 place-items-center rounded-xl bg-primary-soft">
                  <item.icon className="size-5 text-primary" aria-hidden />
                </span>
                <CardTitle className="font-display text-xl">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Three-week journey */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-semibold sm:text-4xl">The Three-Week Journey</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            Classes hold every Friday and Saturday ({EVENT.timezone}). Each week closes with an
            assessment, and the programme culminates in the final IMC examination and graduation.
          </p>
        </div>

        {/* Progress timeline */}
        <ol className="mt-10 grid gap-6 lg:grid-cols-3">
          {WEEKS.map((week, index) => (
            <li key={week.week} className="relative">
              {index < WEEKS.length - 1 && (
                <span
                  aria-hidden
                  className="absolute top-8 -right-3 hidden h-px w-6 bg-gold lg:block"
                />
              )}
              <Card className="h-full rounded-2xl border-border/70 transition-shadow duration-300 hover:shadow-elegant">
                <CardHeader className="gap-2 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="grid size-11 shrink-0 place-items-center rounded-full gradient-royal font-display text-lg font-semibold text-primary-foreground">
                      {week.week}
                    </span>
                    <div className="min-w-0">
                      <CardTitle className="font-display text-2xl">{week.label}</CardTitle>
                      <p className="truncate text-xs text-muted-foreground">{week.theme}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="w-fit rounded-full">
                    {week.dates}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <ul className="space-y-3 text-sm">
  {week.classes.map((item) => (
    <li
      key={item.number}
      className="rounded-lg border border-border/50 bg-secondary/20 px-3 py-2"
    >
      <p className="font-medium">
        {item.number}: {item.title}
      </p>
    </li>
  ))}
</ul>
                  <p className="flex items-center gap-2 rounded-xl bg-gold-soft px-3 py-2 text-xs font-semibold text-gold-foreground">
                    <ClipboardCheck className="size-4 shrink-0" aria-hidden />
                    {week.assessment}
                  </p>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="outline" size="lg" className="h-12 rounded-full">
            <Link to="/curriculum">View full curriculum</Link>
          </Button>
          <Button asChild size="lg" className="h-12 rounded-full">
            <Link to="/schedule">See class schedule</Link>
          </Button>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">
            What participants gain
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {OUTCOMES.map((outcome) => (
              <li
                key={outcome}
                className="flex items-start gap-3 rounded-2xl bg-background p-4 shadow-soft"
              >
                <Heart className="mt-0.5 size-5 shrink-0 text-gold" aria-hidden />
                <span className="text-sm">{outcome}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contact + CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="rounded-3xl border-0 gradient-royal text-primary-foreground shadow-elegant">
            <CardHeader>
              <CardTitle className="font-display text-3xl">Secure your place</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-primary-foreground/90">
                Registration takes about two minutes. Scan the event QR code or register online
                before the first class on Friday, 31 July.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="h-13 rounded-full bg-gold px-8 text-base font-semibold text-gold-foreground hover:bg-gold/90"
                >
                  <Link to="/register">Register Now</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="h-13 rounded-full px-8 text-base"
                >
                  <Link to="/qr">Get QR code</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-border/70">
            <CardHeader>
              <CardTitle className="font-display text-2xl">Contact us</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <a
                href={`mailto:${EVENT.email}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
              >
                <Mail className="size-5 shrink-0 text-primary" aria-hidden />
                <span className="break-all">{EVENT.email}</span>
              </a>
              <a
                href={`tel:${EVENT.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-secondary"
              >
                <Phone className="size-5 shrink-0 text-primary" aria-hidden />
                <span>{EVENT.phone}</span>
              </a>
              <p className="flex items-center gap-3 rounded-xl p-2">
                <MessageCircle className="size-5 shrink-0 text-primary" aria-hidden />
                <span>WhatsApp {EVENT.whatsapp}</span>
              </p>
              <p className="flex items-center gap-3 rounded-xl p-2 text-muted-foreground">
                <CalendarDays className="size-5 shrink-0 text-primary" aria-hidden />
                <span>All classes hold in {EVENT.timezone}</span>
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
