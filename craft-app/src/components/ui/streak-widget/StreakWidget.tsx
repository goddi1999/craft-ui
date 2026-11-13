import type { CSSProperties } from "react";

import { cn } from "@/lib/utils";

import { DEFAULT_WEEKDAYS } from "./streak-widget.constants";
import type { StreakWidgetProps } from "./streak-widget.types";
import { GoalBar, StreakTile, WeekRow } from "./streak-widget-parts";

/**
 * A streak widget. `compact` is the flame tile with the day count; `week` sets it beside
 * today's progress toward the goal and the seven days of the week.
 */
export function StreakWidget({
  days,
  label = "Steps streak",
  variant = "week",
  value = 0,
  goal = 0,
  week = [],
  weekdays = DEFAULT_WEEKDAYS,
  color = "pink",
  className,
  style,
  ...props
}: StreakWidgetProps) {
  const accent = {
    "--streak": `oklch(var(--oklch-${color}))`,
    "--streak-glow": `oklch(var(--oklch-${color}) / 0.55)`,
    ...style,
  } as CSSProperties;

  if (variant === "compact") {
    return (
      <section
        aria-label={label}
        data-slot="streak-widget"
        data-variant="compact"
        className={cn(
          "inline-flex rounded-[30px] border bg-card p-2.5 text-card-foreground",
          className,
        )}
        style={accent}
        {...props}
      >
        <StreakTile days={days} label={label} className="min-w-44" />
      </section>
    );
  }

  return (
    <section
      aria-label={label}
      data-slot="streak-widget"
      data-variant="week"
      className={cn(
        "@container w-full max-w-3xl rounded-[36px] border bg-card p-3 text-card-foreground",
        className,
      )}
      style={accent}
      {...props}
    >
      {/* side by side from a medium container up; stacked on phones */}
      <div className="grid gap-4 @xl:grid-cols-[minmax(12rem,15rem)_1fr] @xl:gap-6">
        <StreakTile days={days} label={label} />
        <div className="flex min-w-0 flex-col justify-between gap-5 p-1 @xl:py-2">
          <GoalBar value={value} goal={goal} />
          <WeekRow week={week} weekdays={weekdays} />
        </div>
      </div>
    </section>
  );
}
