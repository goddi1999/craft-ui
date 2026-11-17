import { cn } from "@/lib/utils";

import { DECK_COLORS, DECK_COLOR_IDS } from "./deck-card.constants";
import type { DeckColorId } from "./deck-card.types";
import { deckSwatchVariants, type DeckShape } from "./deck-card.variants";

type DeckColorSwatchesProps = {
  value: DeckColorId;
  onChange: (colorId: DeckColorId) => void;
  disabled?: boolean;
  className?: string;
  /** Accessible name for the radiogroup. */
  ariaLabel?: string;
  /** `grid` for settings cards; `row` for compact one-line pickers. */
  layout?: "grid" | "row";
  size?: "sm" | "md";
  shape?: DeckShape;
};

export function DeckColorSwatches({
  value,
  onChange,
  disabled = false,
  className,
  ariaLabel = "Deck color",
  layout = "grid",
  size = "md",
  shape = "square",
}: DeckColorSwatchesProps) {
  return (
    <div
      role="radiogroup"
      aria-label={ariaLabel}
      className={cn(
        layout === "row"
          ? "inline-flex flex-nowrap items-center gap-1.5 px-1 py-1"
          : "grid grid-cols-5 gap-3",
        className,
      )}
    >
      {DECK_COLOR_IDS.map((colorId) => {
        const selected = value === colorId;
        return (
          <button
            key={colorId}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={DECK_COLORS[colorId].label}
            disabled={disabled}
            title={DECK_COLORS[colorId].label}
            className={cn(
              deckSwatchVariants({ shape, size }),
              layout === "grid" && "mx-auto",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              "disabled:opacity-50",
              selected
                ? "ring-2 ring-border ring-offset-2 ring-offset-background"
                : "ring-1 ring-border/70",
            )}
            style={{ backgroundColor: `oklch(${DECK_COLORS[colorId].value})` }}
            onClick={() => onChange(colorId)}
          />
        );
      })}
    </div>
  );
}
