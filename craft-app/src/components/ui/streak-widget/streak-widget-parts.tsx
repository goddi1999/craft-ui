import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

import { BAR_MS, EASE_OUT } from "./streak-widget.constants";
import { clamp01, pluralDays } from "./streak-widget.utils";

const TILE = "rounded-[22px] bg-muted";

/** A two-tipped flame in the accent with a light core. */
function FlameGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className}>
      <path
        fill="var(--streak)"
        d="M12 1.8c.7 2.4 2.1 3.8 3.6 5 .5-1 .8-2.1.7-3.3 2.7 2 4.7 5.2 4.7 8.9A9 9 0 0 1 3 12.6c0-3.7 2-6.9 4.8-8.8.2 1.5.8 2.7 1.7 3.5C10.6 5.8 11.4 4 12 1.8Z"
      />
      <path
        fill="white"
        d="M12.3 11.4c2 1.5 3.3 3.1 3.3 4.9a3.6 3.6 0 0 1-7.2 0c0-1.1.4-2.1 1.2-2.9.3.7.8 1.1 1.4 1.4.1-1.3.5-2.4 1.3-3.4Z"
      />
    </svg>
  );
}

/** The flame, the day count and its label. */
export function StreakTile({
  days,
  label,
  className,
}: {
  days: number;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        TILE,
        "flex flex-col items-center justify-center gap-1 px-6 py-5 text-center",
        className,
      )}
    >
      <FlameGlyph className="mb-2 size-20 drop-shadow-[0_0_14px_var(--streak-glow)]" />
      <p className="text-3xl leading-none font-medium tracking-tight tabular-nums">
        {pluralDays(days)}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}

/** Today's count over the goal, and a glowing bar that fills toward it. */
export function GoalBar({ value, goal }: { value: number; goal: number }) {
  const progress = goal > 0 ? clamp01(value / goal) : 0;
  return (
    <div className="flex flex-col gap-3">
      <p className="flex items-baseline gap-1.5 tabular-nums">
        <span className="text-4xl leading-none font-medium tracking-tight">
          {value}
        </span>
        <span className="text-xl text-muted-foreground">/ {goal}</span>
      </p>
      <div
        role="progressbar"
        aria-label="Today's progress"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={value}
        className="relative h-7 rounded-full bg-muted"
      >
        {/* the glow sits on a wrapper so the clip that shapes the fill doesn't cut it off */}
        <div
          aria-hidden
          className="absolute inset-0 drop-shadow-[0_0_10px_rgb(255_255_255/0.45)] dark:drop-shadow-[0_0_14px_rgb(255_255_255/0.55)]"
        >
          <div
            className="size-full rounded-full bg-linear-to-b from-foreground/90 to-foreground motion-reduce:transition-none"
            style={{
              clipPath: `inset(0 ${(1 - progress) * 100}% 0 0 round 999px)`,
              transition: `clip-path ${BAR_MS}ms ${EASE_OUT}`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

/** The week's days, each a filled check once its goal was met. */
export function WeekRow({
  week,
  weekdays,
}: {
  week: boolean[];
  weekdays: readonly string[];
}) {
  return (
    <ol className={cn(TILE, "grid grid-cols-7 gap-1.5 px-3 py-4 sm:px-5")}>
      {weekdays.map((day, index) => {
        const done = week[index] === true;
        return (
          <li key={day} className="flex min-w-0 flex-col items-center gap-2">
            <span
              data-done={done || undefined}
              className="grid aspect-square w-full max-w-9 place-items-center rounded-full bg-foreground/[0.07] text-white transition-colors duration-200 data-done:bg-(--streak)"
            >
              {done && <Check aria-hidden className="size-4" strokeWidth={3} />}
            </span>
            <span className="w-full truncate text-center text-sm">{day}</span>
            <span className="sr-only">{done ? "goal met" : "not yet"}</span>
          </li>
        );
      })}
    </ol>
  );
}
