import {
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FINAL_SESSION, WEEKS } from "@/lib/event";

const WEEK_ICONS: LucideIcon[] = [Sparkles, BookOpen, GraduationCap];

/** Weekly learning journey rendered as a connected vertical timeline. */
export function CurriculumTimeline() {
  return (
    <div className="relative">
      {/* Progress spine */}
      <span
        aria-hidden
        className="absolute top-4 bottom-4 left-[19px] w-px bg-gradient-to-b from-primary via-gold to-primary/30 sm:left-[23px]"
      />

      <ol className="space-y-10">
        {WEEKS.map((week, index) => {
          const Icon = WEEK_ICONS[index] ?? BookOpen;
          const isFinalWeek = index === WEEKS.length - 1;

          return (
            <li key={week.week} className="relative pl-14 sm:pl-16">
              <span className="absolute top-0 left-0 grid size-10 place-items-center rounded-full gradient-royal shadow-soft sm:size-12">
                <Icon className="size-5 text-primary-foreground" aria-hidden />
              </span>

              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-display text-2xl font-semibold sm:text-3xl">{week.label}</h3>
                <Badge variant="secondary" className="rounded-full">
                  {week.dates}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{week.theme}</p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {week.classes.map((item) => (
                  <Card
                    key={item.number}
                    className="rounded-2xl border-border/70 transition-shadow duration-300 hover:shadow-elegant"
                  >
                    <CardHeader className="gap-1 pb-3">
                      <span className="text-[11px] font-semibold tracking-[0.16em] text-primary uppercase">
                        {item.number}
                      </span>
                      <CardTitle className="font-display text-xl leading-snug">
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-xl bg-secondary/30 px-4 py-3">
  <p className="text-sm font-medium text-primary">
    {item.number}: {item.title}
  </p>
</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Assessment milestone */}
              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-gold/50 bg-gold-soft p-4">
                <ClipboardCheck className="mt-0.5 size-5 shrink-0 text-gold-foreground" aria-hidden />
                <div>
                  <p className="font-semibold text-gold-foreground">
                    {isFinalWeek ? "Final IMC Examination" : `${week.label} Assessment`}
                  </p>
                  <p className="text-sm text-gold-foreground/80">
                    {isFinalWeek
                      ? "A comprehensive examination covering all classes taught throughout the three-week programme, held immediately after the final Saturday class."
                      : "A short assessment on everything taught during the week, conducted immediately after the final Saturday class."}
                  </p>
                </div>
              </div>
            </li>
          );
        })}

        {/* Graduation milestone */}
        <li className="relative pl-14 sm:pl-16">
          <span className="absolute top-0 left-0 grid size-10 place-items-center rounded-full gradient-gold shadow-soft sm:size-12">
            <GraduationCap className="size-5 text-gold-foreground" aria-hidden />
          </span>
          <Card className="rounded-2xl border-primary/25 bg-primary-soft">
            <CardHeader className="pb-3">
              <CardTitle className="font-display text-2xl">{FINAL_SESSION.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-foreground">{FINAL_SESSION.description}</p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {FINAL_SESSION.points.map((point) => (
                  <li key={point} className="flex gap-2 text-sm text-secondary-foreground">
                    <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </li>
      </ol>
    </div>
  );
}
