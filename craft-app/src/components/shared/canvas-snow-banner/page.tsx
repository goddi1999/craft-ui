import {
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from "@/components/shared/demo-controls";
import {
  toUsageSnippet,
  type DemoPropDoc,
} from "@/components/shared/demo-docs";
import { DemoPage } from "@/components/shared/demo-page";
import { CanvasSnowBanner } from "@/components/ui/canvas-snow-banner";

const DEFAULTS = {
  height: 120,
  amount: 200,
  sway: 200,
  framerate: 60,
};

const PROPS: DemoPropDoc[] = [
  {
    name: "height",
    type: "number",
    default: "120",
    description: "Banner height in CSS pixels.",
  },
  {
    name: "amount",
    type: "number",
    default: "200",
    description: "Number of snowflakes.",
  },
  {
    name: "sway",
    type: "number",
    default: "200",
    description: "Horizontal wind drift in pixels; negative values blow left.",
  },
  {
    name: "framerate",
    type: "number",
    default: "60",
    description: "Target GSAP ticker framerate.",
  },
  {
    name: "className",
    type: "string",
    description: "Extra classes on the root, usually to position the banner.",
  },
];

export function CanvasSnowBannerPage() {
  const settings = useDemoSettings(DEFAULTS);
  const { height, amount, sway, framerate } = settings.values;

  const usage = toUsageSnippet({
    component: "CanvasSnowBanner",
    from: "@/components/ui/canvas-snow-banner",
    props: {
      height,
      amount,
      sway,
      framerate,
      className: "absolute inset-x-0 top-0",
    },
    defaults: DEFAULTS,
  });

  return (
    <DemoPage
      eyebrow="ui / canvas-snow-banner"
      title="Canvas Snow Banner"
      description="A fading canvas strip of asterisk snowflakes, driven by the GSAP ticker with wind sway and density controls."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Height"
            unit="px"
            min={80}
            max={300}
            value={height}
            onValueChange={(next) => settings.set("height", next)}
          />
          <DemoSlider
            label="Amount"
            min={10}
            max={500}
            value={amount}
            onValueChange={(next) => settings.set("amount", next)}
          />
          <DemoSlider
            label="Wind"
            min={-500}
            max={500}
            value={sway}
            onValueChange={(next) => settings.set("sway", next)}
          />
          <DemoSlider
            label="Framerate"
            unit="fps"
            min={15}
            max={120}
            value={framerate}
            onValueChange={(next) => settings.set("framerate", next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ["src/components/ui/canvas-snow-banner/"],
        usage,
        props: PROPS,
      }}
    >
      <div className="relative h-72 w-full max-w-3xl overflow-hidden rounded-2xl border bg-zinc-950">
        <CanvasSnowBanner
          height={height}
          amount={amount}
          sway={sway}
          framerate={framerate}
          className="absolute inset-x-0 top-0"
        />
        <div className="flex h-full items-end justify-center p-8">
          <p className="text-sm text-zinc-400">
            Snow falls across the top edge
          </p>
        </div>
      </div>
    </DemoPage>
  );
}
