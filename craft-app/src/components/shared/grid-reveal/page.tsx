import { useEffect, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GridReveal } from '@/components/ui/grid-reveal'
import { cn } from '@/lib/utils'

// served from public/ on the same origin, so the canvas may read its pixels
const IMAGE = '/grid-reveal/sunset-clouds.webp'
const SETTLE_MS = 900
const TICK_MS = 240

const PACINGS = ['self-paced', 'progress'] as const
type Pacing = (typeof PACINGS)[number]

const ASPECTS = ['1:1', '4:3', '3:4', '16:9'] as const
type Aspect = (typeof ASPECTS)[number]
const RATIOS: Record<Aspect, number> = { '1:1': 1, '4:3': 4 / 3, '3:4': 3 / 4, '16:9': 16 / 9 }
const WIDTHS: Record<Aspect, string> = {
  '1:1': 'w-[260px]',
  '4:3': 'w-[300px]',
  '3:4': 'w-[220px]',
  '16:9': 'w-[340px]',
}
const ASPECT_SOURCE: Record<Exclude<Aspect, '1:1'>, string> = {
  '4:3': '4 / 3',
  '3:4': '3 / 4',
  '16:9': '16 / 9',
}

const DEFAULTS = {
  seconds: 3.6,
  pacing: 'self-paced' as Pacing,
  aspect: '1:1' as Aspect,
  caption: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'src',
    type: 'string | null',
    description:
      'Image to reveal. Keep it null while generating — the grid only runs while it is empty, and an already-loaded src makes the run flash by. Needs CORS for the colour pass.',
  },
  {
    name: 'alt',
    type: 'string',
    description: 'Describes the finished image. The frame is hidden from assistive tech without it.',
  },
  {
    name: 'progress',
    type: 'number',
    description:
      'Wait position 0–1 driving how far the grid has split. Holds at 0.72 until the image decodes; the image landing is what finishes the reveal. Omit to self-pace.',
  },
  {
    name: 'aspect',
    type: 'number',
    default: '1',
    description: "Width ÷ height. The frame fills its parent's width, so size the parent.",
  },
  {
    name: 'caption',
    type: 'string',
    description: 'Status text in a frosted, shimmering pill. Changing it crossfades the lines.',
  },
  {
    name: 'estimatedDuration',
    type: 'number',
    default: '6000',
    description: 'Roughly how long the work takes in ms, pacing the grid when no progress is passed.',
  },
  { name: 'onRevealComplete', type: '() => void', description: 'Fires once the image has fully resolved.' },
  {
    name: 'onError',
    type: '() => void',
    description: 'Fires when the image fails to load; without it a broken src leaves the grid waiting.',
  },
]

type GridRevealStageProps = {
  durationMs: number
  pacing: Pacing
  aspect: Aspect
  showCaption: boolean
  onGenerate: () => void
}

/** One simulated generation run; remounted for every replay so its timers start fresh. */
function GridRevealStage({ durationMs, pacing, aspect, showCaption, onGenerate }: GridRevealStageProps) {
  const [src, setSrc] = useState<string | null>(null)
  const [warm, setWarm] = useState(false)
  const [busy, setBusy] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const settle = setTimeout(() => setWarm(true), SETTLE_MS)

    if (pacing === 'self-paced') {
      const arrive = setTimeout(() => setSrc(IMAGE), durationMs)
      return () => {
        clearTimeout(settle)
        clearTimeout(arrive)
      }
    }

    // uneven steps, like a real job reporting progress in bursts
    let reported = 0
    const step = TICK_MS / durationMs
    const ticker = setInterval(() => {
      reported = Math.min(1, reported + step * (0.4 + Math.random() * 1.2))
      setProgress(reported)
      if (reported >= 1) {
        clearInterval(ticker)
        setSrc(IMAGE)
      }
    }, TICK_MS)
    return () => {
      clearTimeout(settle)
      clearInterval(ticker)
    }
  }, [durationMs, pacing])

  const handleGenerate = () => {
    if (!busy) onGenerate()
  }

  const caption = src ? 'Adding detail' : warm ? 'Creating image' : 'Starting to generate'
  const label = 'col-start-1 row-start-1 transition-opacity duration-200'

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className={WIDTHS[aspect]}>
        <GridReveal
          src={src}
          alt="A sky of soft clouds at sunset"
          aspect={RATIOS[aspect]}
          caption={showCaption ? caption : undefined}
          estimatedDuration={durationMs}
          progress={pacing === 'progress' ? progress : undefined}
          onRevealComplete={() => setBusy(false)}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleGenerate}
          aria-disabled={busy}
          aria-label={busy ? 'Generating' : 'Generate'}
          className="grid rounded-full bg-muted px-4 py-2 text-sm font-medium text-muted-foreground transition-transform outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-95 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 aria-disabled:active:scale-100"
        >
          <span aria-hidden className={cn(label, busy ? 'opacity-0' : 'opacity-100')}>
            Generate
          </span>
          <span aria-hidden className={cn(label, busy ? 'opacity-100' : 'opacity-0')}>
            Generating
          </span>
        </button>
        {pacing === 'progress' ? (
          <span className="w-10 font-mono text-xs text-muted-foreground tabular-nums">
            {Math.round(progress * 100)}%
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function GridRevealPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { seconds, pacing, aspect, caption } = settings.values
  const [run, setRun] = useState(0)
  const durationMs = Math.round(seconds * 1000)

  const handleReplay = () => setRun((n) => n + 1)

  const usage = toUsageSnippet({
    component: 'GridReveal',
    from: '@/components/ui/grid-reveal',
    props: {
      src: { expression: 'src' },
      alt: 'Generated image',
      // expressions compare by identity, so the default aspect is left out by hand
      aspect: aspect === '1:1' ? undefined : { expression: ASPECT_SOURCE[aspect] },
      caption: caption ? 'Creating image' : undefined,
      estimatedDuration: pacing === 'self-paced' ? durationMs : undefined,
      progress: pacing === 'progress' ? { expression: 'job.progress' } : undefined,
    },
    defaults: { estimatedDuration: 6000 },
  })

  return (
    <DemoPage
      eyebrow="ui / grid-reveal"
      title="Grid Reveal"
      description="A loading state for AI images. The frame opens as four cells and keeps splitting the biggest one in two; when the image lands, the cells take its colours, busy regions sharpen first, and the photo fades in."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Generation time"
            value={seconds}
            onValueChange={(next) => settings.set('seconds', next)}
            min={1.5}
            max={10}
            step={0.1}
            unit="s"
          />
          <DemoControlGroup
            title="Pacing"
            options={PACINGS}
            value={pacing}
            onChange={(next) => settings.set('pacing', next)}
            format={(option) => (option === 'self-paced' ? 'Self-paced' : 'Simulated progress')}
          />
          <DemoControlGroup
            title="Aspect"
            options={ASPECTS}
            value={aspect}
            onChange={(next) => settings.set('aspect', next)}
          />
          <DemoSwitch
            label="Caption"
            checked={caption}
            onCheckedChange={(next) => settings.set('caption', next)}
          />
          <DemoAction onClick={handleReplay}>Replay</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/grid-reveal/'], usage, props: PROPS }}
    >
      <GridRevealStage
        key={`${run}-${durationMs}-${pacing}-${aspect}`}
        durationMs={durationMs}
        pacing={pacing}
        aspect={aspect}
        showCaption={caption}
        onGenerate={handleReplay}
      />
    </DemoPage>
  )
}
