"use client";

import { useState, type ComponentProps, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const COLUMNS = 22;
const TOTAL_DOTS = 365;

export type YearInDotsProps = Omit<ComponentProps<"button">, "children"> & {
  year: number;
  comments: number;
  maxComments: number;
  totalComments?: number;
  totalDots?: number;
  selected?: boolean;
  elapsedColor?: string;
  remainingColor?: string;
};

export function relativeFilled(
  comments: number,
  maxComments: number,
  totalDots = TOTAL_DOTS,
) {
  if (comments <= 0 || maxComments <= 0) return 0;
  return Math.min(
    totalDots,
    Math.max(1, Math.round((comments / maxComments) * totalDots)),
  );
}

export default function YearInDots({
  year,
  comments,
  maxComments,
  totalComments = 0,
  totalDots = TOTAL_DOTS,
  selected = false,
  elapsedColor = "#FF0000",
  remainingColor = "#303033",
  className,
  onClick,
  style,
  ...props
}: YearInDotsProps) {
  const [replayKey, setReplayKey] = useState(0);
  const filled = relativeFilled(comments, maxComments, totalDots);
  const share =
    totalComments > 0 ? (comments / totalComments) * 100 : 0;
  const shareLabel =
    share > 0 && share < 0.1 ? "<0.1%" : `${share.toFixed(1)}%`;

  const label = `${year}: ${comments.toLocaleString()} comments (${shareLabel} of all dated comments). ${filled} of ${totalDots} dots filled relative to the busiest year.`;

  const handleClick: ComponentProps<"button">["onClick"] = (event) => {
    setReplayKey((key) => key + 1);
    onClick?.(event);
  };

  return (
    <button
      type="button"
      data-slot="year-in-dots"
      data-selected={selected}
      aria-label={label}
      aria-pressed={selected}
      onClick={handleClick}
      style={style}
      className={cn(
        "group relative aspect-[634/660] w-full cursor-pointer overflow-hidden border-0 bg-[radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.025),transparent_38%),linear-gradient(150deg,#070707_0%,#000_52%,#050505_100%)] font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_8px_20px_rgba(0,0,0,0.08)] outline-none transition-[transform,box-shadow] duration-500 ease-out [border-radius:clamp(24px,4vw,40px)]",
        "animate-in fade-in slide-in-from-bottom-6 zoom-in-95 fill-mode-both duration-700",
        "hover:-translate-y-1 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.045),0_20px_42px_rgba(0,0,0,0.14)]",
        "active:-translate-y-0.5 active:scale-[0.995]",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
        "motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-in fade-in duration-1000 bg-[linear-gradient(115deg,transparent_22%,rgba(255,255,255,0.018)_44%,transparent_65%)] motion-reduce:animate-none"
      />

      <span
        key={replayKey}
        aria-hidden="true"
        className="absolute top-[19%] left-[11.5%] z-2 grid w-[77%] grid-cols-[repeat(22,minmax(0,1fr))] gap-1 sm:top-[19.5%] sm:left-[12%] sm:w-[76%] sm:gap-[clamp(3px,0.9vw,7px)]"
      >
        {Array.from({ length: totalDots }, (_, index) => {
          const row = Math.floor(index / COLUMNS);
          const column = index % COLUMNS;
          const delay = 180 + row * 28 + column * 6;
          const elapsed = index < filled;
          const boundary = filled > 0 && index === filled - 1;

          return (
            <span
              key={index}
              className={cn(
                "aspect-square w-full rounded-full fill-mode-both motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none",
                elapsed
                  ? "shadow-[inset_0_1px_1px_rgba(255,255,255,0.025)] group-hover:brightness-110"
                  : "shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_0_3px_rgba(255,255,255,0.08)] group-hover:scale-[1.035]",
                "animate-in fade-in zoom-in-50 duration-500",
                boundary && "animate-pulse",
              )}
              style={
                {
                  animationDelay: `${delay}ms`,
                  backgroundColor: elapsed ? elapsedColor : remainingColor,
                } as CSSProperties
              }
            />
          );
        })}
      </span>

      <span className="absolute right-[8%] bottom-[6%] left-[8%] z-3 flex items-end justify-between tracking-[-0.025em]">
        <span className="animate-in fade-in slide-in-from-bottom-2 fill-mode-both text-[clamp(12px,2vw,18px)] text-[#FAFAFA] duration-500 delay-700 motion-reduce:animate-none">
          {year}
        </span>
        <span
          aria-live="polite"
          className="flex flex-col items-end gap-0.5 animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 delay-800 motion-reduce:animate-none"
        >
          <span className="text-[clamp(10px,1.6vw,13px)] text-muted-foreground">
            {comments.toLocaleString()}
          </span>
          <span className="text-[clamp(10px,1.5vw,12px)] text-muted-foreground">
            {shareLabel}
          </span>
        </span>
      </span>
    </button>
  );
}
