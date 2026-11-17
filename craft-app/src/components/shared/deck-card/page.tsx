import { useState } from "react";
import { BookOpen, File, Languages } from "lucide-react";

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from "@/components/shared/demo-controls";
import {
  toUsageSnippet,
  type DemoPropDoc,
} from "@/components/shared/demo-docs";
import { DemoPage } from "@/components/shared/demo-page";
import {
  DeckGrid,
  type DeckCardData,
  type DeckIcon,
  type DeckShape,
} from "@/components/ui/deck-card";

const HOUR = 60 * 60 * 1000;

function initialDecks(now = Date.now()): DeckCardData[] {
  return [
    {
      id: "greetings",
      name: "Greetings",
      description: "Hola, buenos días and friends",
      colorId: "orange",
      pinned: true,
      wordCount: 24,
      dueCount: 12,
      nextDueAt: new Date(now - HOUR).toISOString(),
      conjugationCount: 3,
      sentenceCount: 8,
    },
    {
      id: "week-days",
      name: "Week Days",
      colorId: "violet",
      wordCount: 7,
      dueCount: 0,
      nextDueAt: new Date(now + 3 * HOUR).toISOString(),
      conjugationCount: 0,
      sentenceCount: 4,
    },
    {
      id: "food",
      name: "Food & Drink",
      description: "Comer, beber, la cuenta por favor",
      colorId: "green",
      wordCount: 41,
      dueCount: 0,
      nextDueAt: new Date(now + 3 * 24 * HOUR).toISOString(),
      conjugationCount: 6,
      sentenceCount: 0,
    },
    {
      id: "travel",
      name: "Travel",
      colorId: "blue",
      wordCount: 0,
      dueCount: 0,
      nextDueAt: null,
    },
  ];
}

const ICONS = {
  file: { component: File, expression: "File" },
  book: { component: BookOpen, expression: "BookOpen" },
  languages: { component: Languages, expression: "Languages" },
  none: { component: null, expression: "null" },
} satisfies Record<string, { component: DeckIcon | null; expression: string }>;

type IconChoice = keyof typeof ICONS;

const ICON_CHOICES = Object.keys(ICONS) as IconChoice[];
const SHAPES: DeckShape[] = ["square", "round"];

const DEFAULTS = {
  selectionMode: false,
  shape: "square" as DeckShape,
  icon: "file" as IconChoice,
  showSeparator: true,
  showDueStatus: true,
  showDueDot: true,
};

const PROPS: DemoPropDoc[] = [
  {
    name: "decks",
    type: "DeckCardData[]",
    description:
      "Decks to show; each card reads name, color, counts and next due date.",
  },
  {
    name: "onOpen",
    type: "(deck) => void",
    description: "Card tap, Enter/Space, or the Open row.",
  },
  {
    name: "onLearn",
    type: "(deck) => void",
    description: "Learn row; hidden when omitted.",
  },
  {
    name: "onPlay",
    type: "(deck, game: 'conjutsu' | 'sukima') => void",
    description:
      "Game rows; each is disabled when the deck has nothing for it.",
  },
  {
    name: "onTogglePin / onRename / onExport / onDelete",
    type: "(deck) => void",
    description: "Menu rows; each row is hidden when its handler is omitted.",
  },
  {
    name: "onColorChange",
    type: "(deck, colorId) => void",
    description: "Color swatch row at the bottom of the popup.",
  },
  {
    name: "icon",
    type: "ComponentType | null",
    default: "File",
    description: "Icon in the colored tile; null hides the tile.",
  },
  {
    name: "shape",
    type: "'square' | 'round'",
    default: "'square'",
    description: "Shape of the icon tile and the menu color swatches.",
  },
  {
    name: "showSeparator",
    type: "boolean",
    default: "true",
    description: "Line above the due status.",
  },
  {
    name: "showDueStatus",
    type: "boolean",
    default: "true",
    description: 'The "12 due now" / "Next tomorrow" line.',
  },
  {
    name: "showDueDot",
    type: "boolean",
    default: "true",
    description: "The dot before the due label.",
  },
  {
    name: "learningDeckId",
    type: "string | null",
    default: "null",
    description:
      'Shows "Starting…" on that deck and disables Learn everywhere.',
  },
  {
    name: "selectionMode",
    type: "boolean",
    default: "false",
    description: "Cards toggle a checkbox instead of opening.",
  },
  {
    name: "selectedIds",
    type: "ReadonlySet<string>",
    description: "Selected deck ids in selection mode.",
  },
];

export function DeckCardPage() {
  const settings = useDemoSettings(DEFAULTS);
  const {
    selectionMode,
    shape,
    icon,
    showSeparator,
    showDueStatus,
    showDueDot,
  } = settings.values;
  const [decks, setDecks] = useState(initialDecks);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [lastAction, setLastAction] = useState("Tap a card or open its … menu");

  const update = (id: string, patch: Partial<DeckCardData>) =>
    setDecks((current) =>
      current.map((deck) => (deck.id === id ? { ...deck, ...patch } : deck)),
    );

  const usage = toUsageSnippet({
    component: "DeckGrid",
    from: "@/components/ui/deck-card",
    props: {
      decks: { expression: "decks" },
      onOpen: { expression: "openDeck" },
      onLearn: { expression: "learnDeck" },
      onPlay: { expression: "playDeck" },
      onColorChange: { expression: "setDeckColor" },
      ...(icon === "file"
        ? {}
        : { icon: { expression: ICONS[icon].expression } }),
      shape,
      showSeparator,
      showDueStatus,
      showDueDot,
      selectionMode,
    },
    defaults: {
      selectionMode: false,
      shape: "square",
      showSeparator: true,
      showDueStatus: true,
      showDueDot: true,
    },
  });

  return (
    <DemoPage
      eyebrow="ui / deck-card"
      title="Deck Card"
      description="A flashcard deck tile with a color dot, summary and a due line. Its … button springs open a menu whose rows drop in one by one and share a stretchy highlight pill, with a color row at the bottom."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Select"
            checked={selectionMode}
            onCheckedChange={(next) => settings.set("selectionMode", next)}
          />
          <DemoControlGroup
            title="Shape"
            options={SHAPES}
            value={shape}
            onChange={(next) => settings.set("shape", next)}
          />
          <DemoControlGroup
            title="Icon"
            options={ICON_CHOICES}
            value={icon}
            onChange={(next) => settings.set("icon", next)}
          />
          <DemoSwitch
            label="Due status"
            checked={showDueStatus}
            onCheckedChange={(next) => settings.set("showDueStatus", next)}
          />
          <DemoSwitch
            label="Separator"
            checked={showSeparator}
            onCheckedChange={(next) => settings.set("showSeparator", next)}
          />
          <DemoSwitch
            label="Due dot"
            checked={showDueDot}
            onCheckedChange={(next) => settings.set("showDueDot", next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ["src/components/ui/deck-card/"], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-3xl flex-col gap-4">
        <DeckGrid
          decks={decks}
          className="lg:grid-cols-2 xl:grid-cols-2"
          icon={ICONS[icon].component}
          shape={shape}
          showSeparator={showSeparator}
          showDueStatus={showDueStatus}
          showDueDot={showDueDot}
          selectionMode={selectionMode}
          selectedIds={selectedIds}
          onToggleSelect={(deck) =>
            setSelectedIds((current) => {
              const next = new Set(current);
              if (next.has(deck.id)) next.delete(deck.id);
              else next.add(deck.id);
              return next;
            })
          }
          onOpen={(deck) => setLastAction(`Open ${deck.name}`)}
          onLearn={(deck) => setLastAction(`Learn ${deck.name}`)}
          onPlay={(deck, game) => setLastAction(`Play ${game} on ${deck.name}`)}
          onTogglePin={(deck) => update(deck.id, { pinned: !deck.pinned })}
          onRename={(deck) => setLastAction(`Rename ${deck.name}`)}
          onExport={(deck) => setLastAction(`Export ${deck.name}`)}
          onDelete={(deck) =>
            setDecks((current) => current.filter((row) => row.id !== deck.id))
          }
          onColorChange={(deck, colorId) => update(deck.id, { colorId })}
        />
        <p
          className="text-center text-xs text-muted-foreground"
          aria-live="polite"
        >
          {lastAction}
        </p>
      </div>
    </DemoPage>
  );
}
