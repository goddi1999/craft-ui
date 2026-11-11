import { KeyRound } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  useDemoSettings,
} from "@/components/shared/demo-controls";
import {
  toUsageSnippet,
  type DemoPropDoc,
} from "@/components/shared/demo-docs";
import { DemoPage } from "@/components/shared/demo-page";
import { BlastRadius, type BlastNode } from "@/components/ui/blast-radius";
import { StatusPill } from "@/components/ui/status-pill";

import {
  KEY_KINDS,
  LEAKED,
  NARROW_AFFECTED,
  READ_ONLY_AFFECTED,
  TOOLS,
  TOOL_KINDS,
} from "./blast-radius.data";

const SCENARIOS = ["leaked key", "tool permissions"] as const;
const AFFECTED_SETS = ["full", "narrowed"] as const;
const SCAN_STEPS_MS = [900, 700];

const DEFAULTS = {
  scenario: "leaked key" as (typeof SCENARIOS)[number],
  affectedSet: "full" as (typeof AFFECTED_SETS)[number],
};

const PROPS: DemoPropDoc[] = [
  {
    name: "center",
    type: "{ label: string; initials?: string; icon?: LucideIcon }",
    description:
      "The entity everything is measured from. Shows the icon, else the initials, else the first two letters of the label.",
  },
  {
    name: "nodes",
    type: "BlastNode[]",
    description:
      "Everything it can reach: id, label, kind, and optional parent, affected, indirect and note. Hop depth comes from the parent chain; the first hop is spaced evenly by angle and later hops fan around their parent.",
  },
  {
    name: "kinds",
    type: "Record<string, BlastKind>",
    description:
      "Label and colour per kind, in legend order. Kinds left out get the categorical palette.",
  },
  { name: "title", type: "string", description: "Header title." },
  {
    name: "subtitle",
    type: "string",
    description: "Secondary line under the title.",
  },
  {
    name: "aside",
    type: "React.ReactNode",
    description: "Right side of the header, e.g. a status pill with the count.",
  },
  {
    name: "onSelect",
    type: "(node: BlastNode) => void",
    description:
      "Called when a node is hovered or reached with the arrow keys.",
  },
  {
    name: "className",
    type: "string",
    description: "Extra classes for the root element.",
  },
];

export function BlastRadiusPage() {
  const settings = useDemoSettings(DEFAULTS);
  const { scenario, affectedSet } = settings.values;
  const [scanned, setScanned] = useState(2);
  const [selected, setSelected] = useState<string | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // The scan flags the first hop, then follows the grants one hop further.
  const scan = () => {
    timers.current.forEach(clearTimeout);
    setScanned(0);
    let at = 0;
    timers.current = SCAN_STEPS_MS.map((ms, i) => {
      at += ms;
      return setTimeout(() => setScanned(i + 1), at);
    });
  };

  const nodes = useMemo<BlastNode[]>(() => {
    if (scenario === "tool permissions") {
      return TOOLS.map((t) => ({
        ...t,
        affected:
          t.affected &&
          (affectedSet === "full" || READ_ONLY_AFFECTED.has(t.id)),
      }));
    }
    return LEAKED.map(({ hop, ...node }) => ({
      ...node,
      affected:
        node.affected &&
        (hop ?? 0) <= scanned &&
        (affectedSet === "full" || NARROW_AFFECTED.has(node.id)),
    }));
  }, [scenario, affectedSet, scanned]);
  const count = nodes.filter((n) => n.affected).length;

  const usage = toUsageSnippet({
    component: "BlastRadius",
    from: "@/components/ui/blast-radius",
    props: {
      title: scenario === "leaked key" ? "Blast radius" : "Tool permissions",
      center: { expression: "{ label: 'sk-live-…7f2a', icon: KeyRound }" },
      nodes: { expression: "grants.map(toNode)" },
      kinds: { expression: "kinds" },
      onSelect: { expression: "(node) => openResource(node.id)" },
    },
    defaults: {},
  });

  return (
    <DemoPage
      eyebrow="ui / blast-radius"
      title="Blast Radius"
      description={
        <>
          What one entity can reach, drawn as rings of hops around it. The
          affected set is traced back to the centre, so the size of a leak or a
          risky tool grant shows at a glance. Hover a node, or use arrow keys,
          Home, End and Escape. Adapted from{" "}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{" "}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Scenario"
            options={SCENARIOS}
            value={scenario}
            onChange={(next) => settings.set("scenario", next)}
          />
          <DemoControlGroup
            title="Affected set"
            options={AFFECTED_SETS}
            value={affectedSet}
            onChange={(next) => settings.set("affectedSet", next)}
          />
          <DemoAction onClick={scan} disabled={scenario !== "leaked key"}>
            Replay scan
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          "src/components/ui/blast-radius/",
          "src/components/ui/surface/",
        ],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-md flex-col items-center gap-4">
        {scenario === "tool permissions" ? (
          <BlastRadius
            title="Tool permissions"
            subtitle="support-agent · 6 MCP tools"
            center={{ label: "support-agent", initials: "SA" }}
            nodes={nodes}
            kinds={TOOL_KINDS}
            aside={
              <StatusPill tone={count ? "negative" : "neutral"}>
                {count} at risk
              </StatusPill>
            }
            onSelect={(node) => setSelected(node.label)}
          />
        ) : (
          <BlastRadius
            title="Blast radius"
            subtitle="sk-live-…7f2a · issued 14 min ago"
            center={{ label: "sk-live-…7f2a", icon: KeyRound }}
            nodes={nodes}
            kinds={KEY_KINDS}
            aside={
              <StatusPill tone={count ? "negative" : "neutral"}>
                {count ? `${count} exposed` : "Scanning"}
              </StatusPill>
            }
            onSelect={(node) => setSelected(node.label)}
          />
        )}
        <p
          role="status"
          aria-live="polite"
          className="min-h-5 font-mono text-xs text-muted-foreground"
        >
          {selected ? `Selected ${selected}` : "Hover a node to trace its path"}
        </p>
      </div>
    </DemoPage>
  );
}
