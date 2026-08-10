
import { createFileRoute, Link } from "@tanstack/react-router";
import { Archive, GraduationCap } from "lucide-react";

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
    <main>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page introduction */}
        <section className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Learning journey
          </span>

          <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">
            Three-Week Membership Class Curriculum
          </h1>

          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            Every registered participant will go through a comprehensive
            three-week training programme designed to build a strong biblical
            foundation, develop spiritual maturity, introduce the vision and
            culture of The Influencers Nation, and equip believers to influence
            their world through ministry, leadership, evangelism and technology.
          </p>
        </section>

        {/* Curriculum timeline */}
        <div className="mt-12">
          <CurriculumTimeline />
        </div>

        {/* Class archive connection */}
        <section className="mt-14 overflow-hidden rounded-3xl border border-border bg-secondary/40 p-6 sm:p-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Archive className="size-5" aria-hidden />
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
                    Class resources
                  </p>

                  <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                    Continue your learning
                  </h2>
                </div>
              </div>

              <p className="mt-5 text-sm leading-6 text-muted-foreground sm:text-base">
                Missed a class or need to review what was taught? Visit the
                class archive to access available recordings, study materials,
                test questions and answer submission.
              </p>
            </div>

            <div className="shrink-0">
              <Button
                asChild
                size="lg"
                className="h-13 w-full rounded-full px-8 text-base md:w-auto"
              >
                <Link to="/archive">
                  <Archive className="mr-2 size-5" aria-hidden />
                  View Class Archive
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Programme outcomes */}
        <section className="mt-14 rounded-3xl border border-border bg-secondary/40 p-6 sm:p-10">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-xl gradient-gold">
              <GraduationCap
                className="size-5 text-gold-foreground"
                aria-hidden
              />
            </span>

            <h2 className="font-display text-2xl font-semibold sm:text-3xl">
              A premium discipleship experience
            </h2>
          </div>

          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {OUTCOMES.map((outcome) => (
              <li key={outcome} className="flex gap-2 text-sm">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-primary"
                />

                <span>{outcome}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              size="lg"
              className="h-13 rounded-full px-8 text-base"
            >
              <Link to="/register">Register for the programme</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-13 rounded-full px-8 text-base"
            >
              <Link to="/archive">Explore Class Archive</Link>
            </Button>
          </div>
        </section>
      </div>
    </main>
  );
}

