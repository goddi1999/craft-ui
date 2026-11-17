import * as React from "react";
import { Ellipsis as EllipsisIcon } from "lucide-react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { Popover as PopoverPrimitive } from "radix-ui";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useSpringPreset } from "./use-spring-preset";
import "./deck-card.css";

const ROW_SELECTOR = 'button:not(:disabled), [role="menuitem"], a[href]';

/**
 * A soft pill behind the row under the finger, pointer or keyboard focus. The edge facing
 * the move is stiff and the other trails, so it stretches between rows. Rows get no hover
 * background of their own.
 */
function MenuHighlight({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  const spring = useSpringPreset();
  const top = useMotionValue(0);
  const bottom = useMotionValue(0);
  const opacity = useMotionValue(0);
  const height = useTransform([top, bottom], ([t, b]) =>
    Math.max(0, (b as number) - (t as number)),
  );
  const current = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    function moveTo(row: HTMLElement) {
      const nextTop = row.offsetTop;
      const nextBottom = nextTop + row.offsetHeight;
      if (!current.current || opacity.get() < 0.05) {
        top.jump(nextTop);
        bottom.jump(nextBottom);
      } else {
        const down = nextTop > top.get();
        animate(top, nextTop, down ? spring(200, 20) : spring(620, 36));
        animate(bottom, nextBottom, down ? spring(620, 36) : spring(200, 20));
      }
      current.current = row;
      animate(opacity, 1, spring(400, 32));
    }

    function rowFrom(target: EventTarget | null) {
      if (!(target instanceof Element)) return null;
      const row = target.closest<HTMLElement>(ROW_SELECTOR);
      // Only rows of this menu's list, not swatches or controls nested deeper.
      return row && row.parentElement?.parentElement === content ? row : null;
    }

    const onOver = (event: Event) => {
      const row = rowFrom(event.target);
      if (row && row !== current.current) moveTo(row);
    };
    const onLeave = () => {
      current.current = null;
      animate(opacity, 0, spring(400, 32));
    };

    content.addEventListener("pointerover", onOver);
    content.addEventListener("focusin", onOver);
    content.addEventListener("pointerleave", onLeave);
    return () => {
      content.removeEventListener("pointerover", onOver);
      content.removeEventListener("focusin", onOver);
      content.removeEventListener("pointerleave", onLeave);
    };
    // spring() is rebuilt each render; listeners only need the element.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentRef]);

  return (
    <motion.span
      aria-hidden
      style={{ y: top, height, opacity }}
      className="pointer-events-none absolute inset-x-1.5 top-0 rounded-xl bg-foreground/[0.07]"
    />
  );
}

function isSelectableControl(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(
    target.closest('button, [role="menuitem"], [role="radio"], a[href]'),
  );
}

type DeckCardMenuProps = {
  children: React.ReactNode;
  ariaLabel?: string;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  triggerClassName?: string;
  contentClassName?: string;
};

/** "…" button that opens a spring popover of action rows; picking a row closes it. */
export function DeckCardMenu({
  children,
  ariaLabel = "More options",
  align = "end",
  side = "bottom",
  triggerClassName,
  contentClassName,
}: DeckCardMenuProps) {
  const [open, setOpen] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  function handleContentClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!isSelectableControl(event.target)) return;
    setOpen(false);
  }

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn("size-7 shrink-0", triggerClassName)}
          aria-label={ariaLabel}
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisIcon className="size-4" />
        </Button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          ref={contentRef}
          data-slot="deck-card-menu"
          align={align}
          side={side}
          sideOffset={6}
          collisionPadding={12}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "relative z-50 w-56 origin-(--radix-popover-content-transform-origin) rounded-[18px] bg-popover p-1.5 text-popover-foreground shadow-lg ring-1 ring-foreground/10 outline-hidden",
            // Never taller than the room left on screen: the color row scrolls inside.
            "max-h-(--radix-popover-content-available-height) overflow-y-auto overscroll-contain",
            "[&>div>*]:relative [&>div>*]:z-[1]",
            // Rows: 44px, 12px corners, 15px text; the highlight replaces their own hover fill.
            "[&>div>button]:min-h-11 [&>div>button]:rounded-xl [&>div>button]:px-3 [&>div>button]:text-[15px] [&>div>button]:touch-manipulation [&>div>button]:select-none",
            "[&>div>button:hover]:bg-transparent [&>div>button:focus-visible]:bg-transparent",
            contentClassName,
          )}
        >
          <MenuHighlight contentRef={contentRef} />
          <div className="flex flex-col gap-1" onClick={handleContentClick}>
            {children}
          </div>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
