import { FileText, GitBranch, MapPin, MessageCircleQuestion } from 'lucide-react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  MagicTransform,
  type MagicTransformColor,
  type MagicTransformItem,
} from '@/components/ui/magic-transform'

const PORTAL_COLORS = ['blue', 'indigo', 'violet', 'teal', 'orange', 'pink'] as const satisfies readonly MagicTransformColor[]
type PortalColor = (typeof PORTAL_COLORS)[number]

const INPUT_FILES: readonly MagicTransformItem[] = [
  { id: 'script', label: 'Skript.pdf', icon: <FileText className="size-3.5" /> },
  { id: 'guideline', label: 'Leitlinie.pdf', icon: <FileText className="size-3.5" /> },
]

const OUTPUT_ITEMS: readonly MagicTransformItem[] = [
  { id: 'question', label: 'Open Question', icon: <MessageCircleQuestion className="size-3.5" /> },
  { id: 'pin', label: 'Image Pin', icon: <MapPin className="size-3.5" /> },
  { id: 'branch', label: 'If / Else', icon: <GitBranch className="size-3.5" /> },
]

const DEFAULTS = {
  portalColor: 'blue' as PortalColor,
  speed: 1,
  particleCount: 16,
  glowIntensity: 0.5,
}

const PROPS: DemoPropDoc[] = [
  { name: 'items', type: 'MagicTransformItem[]', default: '[]', description: 'Documents that slide into the portal. Two alternate on the conveyor.' },
  { name: 'outputItems', type: 'MagicTransformItem[]', default: '[]', description: 'Chips that burst out of the portal.' },
  { name: 'portalColor', type: 'MagicTransformColor', default: "'indigo'", description: 'Palette token for the beam, glow and shredding pixels.' },
  { name: 'mark', type: 'ReactNode', default: '<Sparkles />', description: 'Content of the portal tile.' },
  { name: 'duration', type: 'number', default: '0.8', description: 'Burst length in seconds (0.2–2.4).' },
  { name: 'stagger', type: 'number', default: '0.1', description: 'Delay between chips leaving the portal, in seconds.' },
  { name: 'speed', type: 'number', default: '1', description: 'Divides every duration.' },
  { name: 'particleCount', type: 'number', default: '24', description: 'Pixels in the burst (0–64).' },
  { name: 'particleColor', type: 'string', description: 'One CSS colour for every particle; defaults to a multicolour palette.' },
  { name: 'glowIntensity', type: 'number', default: '0.8', description: 'Strength of the portal bloom, 0–1.' },
  { name: 'autoPlay', type: 'boolean', default: 'true', description: 'Pauses when false. Also pauses offscreen.' },
  { name: 'loop', type: 'boolean', default: 'true', description: 'Run once when false.' },
  { name: 'reducedMotion', type: 'boolean', default: 'false', description: 'Park on a still of the burst. Also follows prefers-reduced-motion.' },
]

export function MagicTransformPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { portalColor, speed, particleCount, glowIntensity } = settings.values

  const usage = toUsageSnippet({
    component: 'MagicTransform',
    from: '@/components/ui/magic-transform',
    props: { portalColor, speed, particleCount, glowIntensity },
    defaults: DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / magic-transform"
      title="Magic Transform"
      description="Documents slide into a glowing portal, shred into pixels at the beam, and burst out the other side as tidy chips. Pure CSS keyframes, paused offscreen, and a still frame under reduced motion."
      previewClassName="bg-muted/50"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Portal"
            options={PORTAL_COLORS}
            value={portalColor}
            onChange={(next) => settings.set('portalColor', next)}
            format={(option) => (
              <span className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2.5 rounded-full ring-1 ring-foreground/10"
                  style={{ backgroundColor: `oklch(var(--oklch-${option}))` }}
                />
                <span className="capitalize">{option}</span>
              </span>
            )}
          />
          <DemoSlider label="Speed" value={speed} onValueChange={(next) => settings.set('speed', next)} min={0.25} max={2} step={0.25} unit="×" />
          <DemoSlider label="Particles" value={particleCount} onValueChange={(next) => settings.set('particleCount', next)} min={0} max={64} step={4} />
          <DemoSlider label="Glow" value={glowIntensity} onValueChange={(next) => settings.set('glowIntensity', next)} min={0} max={1} step={0.1} />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/magic-transform/'], usage, props: PROPS }}
    >
      <MagicTransform
        items={INPUT_FILES}
        outputItems={OUTPUT_ITEMS}
        portalColor={portalColor}
        particleColor={`oklch(var(--oklch-${portalColor}))`}
        speed={speed}
        particleCount={particleCount}
        glowIntensity={glowIntensity}
        className="aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-3xl border border-border/60 bg-card/40 sm:aspect-[16/7]"
      />
    </DemoPage>
  )
}
