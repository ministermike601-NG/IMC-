import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { CurriculumTimeline } from "@/components/curriculum-timeline";
import { Button } from "@/components/ui/button";
import { OUTCOMES } from "@/lib/event";

const title = "Three-Week Membership Class Curriculum | IMC";
const description =
  "Nine classes across three weeks: New Creation, the Holy Spirit, Christian Doctrines, Evangelism, Embassy Ministries, Character & Prosperity, Local Assembly, Mobile Technology and IMC Excellence.";

export const Route = createFileRoute("/curriculum")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  }),
  component: CurriculumPage,
});

function CurriculumPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14">
      <header className="max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          Learning journey
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
          Three-Week Membership Class Curriculum
        </h1>
        <p className="mt-4 text-muted-foreground">
          Every registered participant will go through a comprehensive three-week training programme
          designed to build a strong biblical foundation, develop spiritual maturity, introduce the
          vision and culture of The Influencers Nation, and equip believers to influence their world
          through ministry, leadership, evangelism and technology.
        </p>
      </header>

      <div className="mt-12">
        <CurriculumTimeline />
      </div>

      <section className="mt-14 rounded-3xl border border-border bg-secondary/40 p-6 sm:p-10">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl gradient-gold">
            <GraduationCap className="size-5 text-gold-foreground" aria-hidden />
          </span>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            A premium discipleship experience
          </h2>
        </div>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {OUTCOMES.map((outcome) => (
            <li key={outcome} className="flex gap-2 text-sm">
              <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Button asChild size="lg" className="h-13 rounded-full px-8 text-base">
            <Link to="/register">Register for the programme</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
