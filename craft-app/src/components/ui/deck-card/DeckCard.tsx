import {
  BookText,
  Download,
  File,
  FolderOpen,
  GraduationCap,
  Pin,
  PinOff,
  Space,
  Swords,
  Trash2,
} from "lucide-react";

import { BlurredScrollArea } from "@/components/ui/blurred-scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import {
  DEFAULT_DECK_COLOR,
  MENU_ITEM_CLASS_NAME,
} from "./deck-card.constants";
import type { DeckCardProps, DeckGridProps } from "./deck-card.types";
import { deckIconBadgeVariants } from "./deck-card.variants";
import {
  deckColorBackgroundStyle,
  deckDueStatus,
  deckSummary,
  isDeckColorId,
} from "./deck-card.utils";
import { DeckCardMenu } from "./deck-card-menu";
import { DeckColorSwatches } from "./deck-color-swatches";

/**
 * A deck tile: color dot, name, summary and a "when to learn" line, with a "…" popup of
 * deck actions (learn, games, pin, rename, export, delete) and a color picker row.
 * In selection mode the tile toggles a checkbox instead of opening.
 */
export function DeckCard({
  deck,
  learning = false,
  learningThis = false,
  selectionMode = false,
  selected = false,
  onToggleSelect,
  onOpen,
  onLearn,
  onPlay,
  onTogglePin,
  onRename,
  onExport,
  onDelete,
  onColorChange,
  icon: Icon = File,
  shape = "square",
  showSeparator = true,
  showDueStatus = true,
  showDueDot = true,
  className,
}: DeckCardProps) {
  const colorId = isDeckColorId(deck.colorId)
    ? deck.colorId
    : DEFAULT_DECK_COLOR;
  const pinned = Boolean(deck.pinned);
  const dueStatus = deckDueStatus(deck);
  const showDot = showDueDot && dueStatus.tone !== "idle";

  function activate() {
    if (selectionMode) {
      onToggleSelect?.(deck);
      return;
    }
    onOpen(deck);
  }

  return (
    <article
      role="button"
      tabIndex={0}
      aria-label={
        selectionMode
          ? `${selected ? "Deselect" : "Select"} ${deck.name}`
          : `Open ${deck.name}`
      }
      aria-pressed={selectionMode ? selected : undefined}
      className={cn(
        "flex h-[150px] cursor-pointer touch-manipulation flex-col rounded-3xl bg-muted/60 p-4 select-none",
        "transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-muted active:scale-[0.98]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selectionMode && selected && "ring-2 ring-primary",
        className,
      )}
      onClick={activate}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          activate();
        }
      }}
    >
      <div className="flex items-start justify-between gap-2">
        {selectionMode ? (
          <div className="pt-0.5" onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={selected}
              onCheckedChange={() => onToggleSelect?.(deck)}
              aria-label={`Select ${deck.name}`}
            />
          </div>
        ) : (
          <p className="flex items-center gap-1 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            {pinned ? (
              <>
                <Pin className="size-3 fill-current" aria-hidden />
                Pinned
              </>
            ) : (
              "Deck"
            )}
          </p>
        )}
        <div
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <DeckCardMenu ariaLabel={`Actions for ${deck.name}`}>
            <button
              type="button"
              className={MENU_ITEM_CLASS_NAME}
              onClick={() => onOpen(deck)}
            >
              <FolderOpen />
              Open
            </button>
            {onLearn ? (
              <button
                type="button"
                className={MENU_ITEM_CLASS_NAME}
                disabled={learning}
                onClick={() => onLearn(deck)}
              >
                <GraduationCap />
                {learningThis ? "Starting…" : "Learn"}
              </button>
            ) : null}
            {onPlay ? (
              <>
                <button
                  type="button"
                  className={MENU_ITEM_CLASS_NAME}
                  disabled={(deck.conjugationCount ?? 0) === 0}
                  onClick={() => onPlay(deck, "conjutsu")}
                >
                  <Swords />
                  Conjutsu
                </button>
                <button
                  type="button"
                  className={MENU_ITEM_CLASS_NAME}
                  disabled={(deck.sentenceCount ?? 0) === 0}
                  onClick={() => onPlay(deck, "sukima")}
                >
                  <BookText />
                  Sukima
                </button>
              </>
            ) : null}
            {onTogglePin ? (
              <button
                type="button"
                className={MENU_ITEM_CLASS_NAME}
                onClick={() => onTogglePin(deck)}
              >
                {pinned ? <PinOff /> : <Pin />}
                {pinned ? "Unpin" : "Pin to top"}
              </button>
            ) : null}
            {onRename ? (
              <button
                type="button"
                className={MENU_ITEM_CLASS_NAME}
                onClick={() => onRename(deck)}
              >
                <Space />
                Rename
              </button>
            ) : null}
            {onExport ? (
              <button
                type="button"
                className={MENU_ITEM_CLASS_NAME}
                onClick={() => onExport(deck)}
              >
                <Download />
                Export JSON
              </button>
            ) : null}
            {onDelete ? (
              <button
                type="button"
                className={cn(
                  MENU_ITEM_CLASS_NAME,
                  "text-destructive [&_svg]:text-destructive",
                )}
                onClick={() => onDelete(deck)}
              >
                <Trash2 />
                Delete
              </button>
            ) : null}

            {onColorChange ? (
              <>
                <Separator className="my-1.5" />
                <div className="px-1 pb-1">
                  <p className="mb-2 px-1 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                    Color
                  </p>
                  <BlurredScrollArea
                    orientation="horizontal"
                    hideScrollBar
                    shadowSize={16}
                    className="h-8 w-full"
                  >
                    <DeckColorSwatches
                      value={colorId}
                      layout="row"
                      size="sm"
                      shape={shape}
                      onChange={(next) => onColorChange(deck, next)}
                    />
                  </BlurredScrollArea>
                </div>
              </>
            ) : null}
          </DeckCardMenu>
        </div>
      </div>

      <div className="mt-1.5 flex min-h-0 flex-1 items-start gap-2.5">
        {Icon ? (
          <div
            className={deckIconBadgeVariants({ shape })}
            style={deckColorBackgroundStyle(colorId)}
            aria-hidden
          >
            <Icon className="size-4 text-white" strokeWidth={1.5} />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-foreground">
            {deck.name}
          </h2>
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {deckSummary(deck)}
          </p>
        </div>
      </div>

      {showDueStatus && showSeparator ? <Separator className="my-2" /> : null}

      {showDueStatus ? (
        <p
          className={cn(
            "flex items-center gap-1.5 truncate text-xs",
            dueStatus.tone === "due"
              ? "font-medium text-foreground"
              : "text-muted-foreground",
          )}
        >
          {showDot ? (
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                dueStatus.tone === "due"
                  ? "bg-primary"
                  : "bg-muted-foreground/40",
              )}
              aria-hidden
            />
          ) : null}
          {dueStatus.label}
        </p>
      ) : null}
    </article>
  );
}

/** Deck cards in a 2 / 3 / 4 column grid. */
export function DeckGrid({
  decks,
  learningDeckId = null,
  selectionMode = false,
  selectedIds,
  className,
  ...actions
}: DeckGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {decks.map((deck) => (
        <DeckCard
          key={deck.id}
          deck={deck}
          learning={learningDeckId !== null}
          learningThis={learningDeckId === deck.id}
          selectionMode={selectionMode}
          selected={selectedIds?.has(deck.id) ?? false}
          {...actions}
        />
      ))}
    </div>
  );
}
