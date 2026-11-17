import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { cn } from "@/lib/utils";
import {
  WHEEL_ITEM_HEIGHT as ITEM_HEIGHT,
  WHEEL_SETTLE_DELAY_MS as SETTLE_DELAY_MS,
  WHEEL_VISIBLE_ITEMS as VISIBLE_ITEMS,
} from "./conjugation-table.constants";
import type { WheelPickerProps } from "./conjugation-table.types";

/** Space above the first and below the last option so both can reach the center. */
const EDGE_PADDING = ((VISIBLE_ITEMS - 1) / 2) * ITEM_HEIGHT;

function clampIndex(index: number, length: number) {
  return Math.min(Math.max(index, 0), length - 1);
}

function centeredIndex(scroller: HTMLElement, length: number) {
  return clampIndex(Math.round(scroller.scrollTop / ITEM_HEIGHT), length);
}

type Latest = Pick<WheelPickerProps, "options" | "value" | "onValueChange">;

/** Reports the option sitting in the middle, if it differs from the current value. */
function commitCentered(
  scroller: HTMLElement,
  { options, value, onValueChange }: Latest,
) {
  const next = options[centeredIndex(scroller, options.length)];
  if (next !== undefined && next !== value) onValueChange(next);
}

/**
 * An always-open, scroll-snapping wheel (like the iOS picker). Scroll or tap an option;
 * the one that settles in the middle becomes the value.
 */
export function WheelPicker({
  options,
  value,
  onValueChange,
  "aria-label": ariaLabel,
  className,
}: WheelPickerProps) {
  const listId = useId();
  const scrollerRef = useRef<HTMLUListElement>(null);
  const valueIndex = Math.max(options.indexOf(value), 0);
  // A new array each render is fine; only a real change in the list should move the wheel.
  const optionsKey = options.join("\n");
  const [activeIndex, setActiveIndex] = useState(valueIndex);
  const latest = useRef<Latest>({ options, value, onValueChange });
  const settleTimer = useRef(0);
  const frame = useRef(0);

  useEffect(() => {
    latest.current = { options, value, onValueChange };
  }, [options, value, onValueChange]);

  // Follow the value when it changes from outside (tab switch, search, first render).
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setActiveIndex(valueIndex);
    if (Math.round(scroller.scrollTop) !== valueIndex * ITEM_HEIGHT) {
      scroller.scrollTo({ top: valueIndex * ITEM_HEIGHT });
    }
  }, [valueIndex, optionsKey]);

  function handleScroll() {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() =>
      setActiveIndex(centeredIndex(scroller, latest.current.options.length)),
    );
    window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(
      () => commitCentered(scroller, latest.current),
      SETTLE_DELAY_MS,
    );
  }

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    // `scrollend` fires once snapping finishes; the timer in handleScroll covers older browsers.
    const handleScrollEnd = () => {
      window.clearTimeout(settleTimer.current);
      commitCentered(scroller, latest.current);
    };
    scroller.addEventListener("scrollend", handleScrollEnd);
    return () => {
      scroller.removeEventListener("scrollend", handleScrollEnd);
      window.clearTimeout(settleTimer.current);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  function scrollToIndex(index: number) {
    scrollerRef.current?.scrollTo({
      top: clampIndex(index, options.length) * ITEM_HEIGHT,
      behavior: "smooth",
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const step = {
      ArrowDown: 1,
      ArrowUp: -1,
      PageDown: VISIBLE_ITEMS,
      PageUp: -VISIBLE_ITEMS,
    }[event.key];
    if (step === undefined) return;
    event.preventDefault();
    scrollToIndex(activeIndex + step);
  }

  return (
    <div
      className={cn("relative w-full select-none", className)}
      style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}
    >
      {/* Selection band behind the middle row. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 rounded-2xl bg-muted"
        style={{ top: EDGE_PADDING, height: ITEM_HEIGHT }}
      />
      <ul
        ref={scrollerRef}
        id={listId}
        role="listbox"
        tabIndex={0}
        aria-label={ariaLabel}
        aria-activedescendant={`${listId}-${activeIndex}`}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative h-full snap-y snap-mandatory overflow-y-auto overscroll-contain",
          "touch-pan-y [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          "rounded-2xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          "[mask-image:linear-gradient(transparent,#000_30%,#000_70%,transparent)]",
        )}
        style={{ paddingBlock: EDGE_PADDING }}
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - activeIndex);
          return (
            <li
              key={option}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={index === activeIndex}
              onClick={() => scrollToIndex(index)}
              className={cn(
                "flex snap-center items-center justify-center px-4 text-center",
                "cursor-pointer truncate transition-[opacity,transform] duration-150",
                distance === 0 && "text-xl font-semibold",
                distance === 1 && "text-lg opacity-60",
                distance >= 2 && "scale-95 text-base opacity-30",
              )}
              style={{ height: ITEM_HEIGHT }}
            >
              {option}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
