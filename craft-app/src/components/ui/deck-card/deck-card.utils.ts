import type { CSSProperties } from "react";

import {
  DECK_COLORS,
  DECK_COLOR_IDS,
  DEFAULT_DECK_COLOR,
} from "./deck-card.constants";
import type {
  DeckCardData,
  DeckColorId,
  DeckDueStatus,
} from "./deck-card.types";

export function isDeckColorId(value: unknown): value is DeckColorId {
  return (
    typeof value === "string" &&
    (DECK_COLOR_IDS as readonly string[]).includes(value)
  );
}

export function deckColor(colorId: string): string {
  const id = isDeckColorId(colorId) ? colorId : DEFAULT_DECK_COLOR;
  return `oklch(${DECK_COLORS[id].value})`;
}

export function deckColorBackgroundStyle(colorId: string): CSSProperties {
  return { backgroundColor: deckColor(colorId) };
}

/** The description when there is one, otherwise "12 words". */
export function deckSummary(deck: DeckCardData): string {
  const description = deck.description?.trim();
  if (description) return description;
  const count = deck.wordCount;
  return `${count} word${count === 1 ? "" : "s"}`;
}

const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/** Short "when to learn" label for a deck card, e.g. "12 due now" or "Next tomorrow". */
export function deckDueStatus(
  deck: Pick<DeckCardData, "wordCount" | "dueCount" | "nextDueAt">,
  now = Date.now(),
): DeckDueStatus {
  if (deck.wordCount === 0 || !deck.nextDueAt)
    return { label: "No words yet", tone: "idle" };
  if (deck.dueCount > 0)
    return { label: `${deck.dueCount} due now`, tone: "due" };

  const minutes = Math.max(
    1,
    Math.round((new Date(deck.nextDueAt).getTime() - now) / 60_000),
  );
  if (minutes < 60)
    return {
      label: `Next ${relativeTime.format(minutes, "minute")}`,
      tone: "soon",
    };
  const hours = Math.round(minutes / 60);
  if (hours < 24)
    return {
      label: `Next ${relativeTime.format(hours, "hour")}`,
      tone: "soon",
    };
  const days = Math.round(hours / 24);
  return {
    label: `Next ${relativeTime.format(days, "day")}`,
    tone: days <= 1 ? "soon" : "idle",
  };
}
