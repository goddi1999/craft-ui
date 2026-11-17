import type { ComponentType } from "react";

import type { DECK_COLOR_IDS } from "./deck-card.constants";
import type { DeckShape } from "./deck-card.variants";

export type DeckColorId = (typeof DECK_COLOR_IDS)[number];

/** A game a deck can start; each one needs its own kind of content in the deck. */
export type DeckGame = "conjutsu" | "sukima";

export type DeckCardData = {
  id: string;
  name: string;
  /** Shown under the name; falls back to the word count. */
  description?: string | null;
  colorId: DeckColorId;
  pinned?: boolean;
  wordCount: number;
  /** Words due for review right now. */
  dueCount: number;
  /** ISO date of the next word coming due, or null when nothing is scheduled. */
  nextDueAt: string | null;
  /** Verbs with a conjugation table; 0 disables Conjutsu. */
  conjugationCount?: number;
  /** Gap sentences; 0 disables Sukima. */
  sentenceCount?: number;
};

export type DeckDueStatus = {
  label: string;
  tone: "due" | "soon" | "idle";
};

export type DeckCardActions = {
  onOpen: (deck: DeckCardData) => void;
  onLearn?: (deck: DeckCardData) => void;
  /** Start Conjutsu or Sukima on this deck. */
  onPlay?: (deck: DeckCardData, game: DeckGame) => void;
  onTogglePin?: (deck: DeckCardData) => void;
  onRename?: (deck: DeckCardData) => void;
  onExport?: (deck: DeckCardData) => void;
  onDelete?: (deck: DeckCardData) => void;
  onColorChange?: (deck: DeckCardData, colorId: DeckColorId) => void;
};

/** Any lucide-style icon component. */
export type DeckIcon = ComponentType<{
  className?: string;
  strokeWidth?: number;
}>;

/** Display options; every part is shown by default. */
export type DeckCardAppearance = {
  /** Icon in the colored tile; `null` hides the tile. Defaults to a file icon. */
  icon?: DeckIcon | null;
  /** Shape of the icon tile and the color swatches. */
  shape?: DeckShape;
  /** Line between the summary and the due status. */
  showSeparator?: boolean;
  /** The "• 12 due now" line. */
  showDueStatus?: boolean;
  /** The dot before the due label. */
  showDueDot?: boolean;
};

export type DeckCardProps = DeckCardActions &
  DeckCardAppearance & {
    deck: DeckCardData;
    /** Shows "Starting…" on this deck's Learn row and disables Learn on every card. */
    learning?: boolean;
    learningThis?: boolean;
    selectionMode?: boolean;
    selected?: boolean;
    onToggleSelect?: (deck: DeckCardData) => void;
    className?: string;
  };

export type DeckGridProps = DeckCardActions &
  DeckCardAppearance & {
    decks: DeckCardData[];
    /** Id of the deck whose Learn session is starting. */
    learningDeckId?: string | null;
    selectionMode?: boolean;
    selectedIds?: ReadonlySet<string>;
    onToggleSelect?: (deck: DeckCardData) => void;
    className?: string;
  };
