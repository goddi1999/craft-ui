import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useReducedMotion } from 'motion/react'
import { Sparkles } from 'lucide-react'

import { cn } from '@/lib/utils'

/** Palette tokens defined in src/index.css as `--oklch-*` triplets. */
export type MagicTransformColor =
  | 'violet'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'lime'
  | 'orange'
  | 'pink'

function colorCss(color: MagicTransformColor): string {
  return `oklch(var(--oklch-${color}))`
}

export type MagicTransformItem = {
  id: string
  label: string
  color?: string
  icon?: ReactNode
}

export type MagicTransformProps = {
  items?: readonly MagicTransformItem[]
  outputItems?: readonly MagicTransformItem[]
  /** Burst length in seconds. The document conveyor stays an 8s linear loop. */
  duration?: number
  /** Delay between chips leaving the portal, in seconds. */
  stagger?: number
  autoPlay?: boolean
  loop?: boolean
  /** Divides every duration. Values below 0 are ignored. */
  speed?: number
  portalColor?: MagicTransformColor
  /** Content of the portal tile. Defaults to a sparkles icon. */
  mark?: ReactNode
  particleCount?: number
  particleSize?: number
  /** One CSS colour for every particle; defaults to the multicolour chip palette. */
  particleColor?: string
  /** 0–1. Strength of the portal bloom. */
  glowIntensity?: number
  perspective?: number
  /** Easing for the chip burst. The conveyor is linear, matching a constant slide. */
  ease?: string
  onTransformStart?: () => void
  onTransformComplete?: () => void
  className?: string
  style?: CSSProperties
  /** When true, park on a still of the burst. Also follows prefers-reduced-motion. */
  reducedMotion?: boolean
}

const EASE_OUT = 'cubic-bezier(0.22, 1, 0.36, 1)'
const TRAVEL_SECONDS = 8
/** Right edge of a card meets the portal at this fraction of the travel. */
const CONTACT = 0.6585
const PORTAL = 54
const CARD_WIDTH = 28
/** Width, in % of the stage, of the band left of the beam where cards break into pixels. */
const SHRED = 10
const CHIP_COLORS = (
  ['lime', 'pink', 'blue', 'orange', 'violet', 'cyan'] as const satisfies readonly MagicTransformColor[]
).map(colorCss)

const CHIP_POSES: readonly { x: string; y: string; r: string }[] = [
  { x: '7cqw', y: '-17cqw', r: '-12deg' },
  { x: '20cqw', y: '-8cqw', r: '9deg' },
  { x: '11cqw', y: '1cqw', r: '-4deg' },
  { x: '26cqw', y: '8cqw', r: '17deg' },
  { x: '4cqw', y: '14cqw', r: '-16deg' },
  { x: '18cqw', y: '18cqw', r: '7deg' },
  { x: '28cqw', y: '-2cqw', r: '-8deg' },
  { x: '14cqw', y: '-16cqw', r: '13deg' },
]

function resolveEase(ease: string): string {
  if (ease === 'linear') return 'linear'
  if (ease.startsWith('cubic-bezier') || ease.startsWith('var(--ease-')) return ease
  return EASE_OUT
}

function cleanLabel(label: string): string {
  return label.replace(/\s+/g, ' ').trim()
}

function middleTruncate(value: string, max: number): string {
  if (value.length <= max) return value
  const keep = max - 1
  const head = Math.ceil(keep / 2)
  const tail = Math.floor(keep / 2)
  return `${value.slice(0, head)}…${value.slice(value.length - tail)}`
}

function chipText(label: string): string {
  const clean = cleanLabel(label)
  if (!clean) return ''
  if (clean.includes('@') || /\.[a-z0-9]{2,4}$/i.test(clean)) return middleTruncate(clean, 22)
  return clean
}

function unit(index: number): number {
  const value = Math.sin(index * 127.1 + 311.7) * 43758.5453
  return value - Math.floor(value)
}

function noiseMask(seed: number, cols: number, rows: number, density: number): string {
  const cell = 6
  const size = 4.5
  let rects = ''
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      if (unit(seed + row * 131 + col * 17) < density) {
        rects += `<rect x='${col * cell}' y='${row * cell}' width='${size}' height='${size}'/>`
      }
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${cols * cell}' height='${rows * cell}'>${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
}

const BLOCK_NOISE = noiseMask(7, 28, 20, 0.56)
const SHRED_NOISE = noiseMask(41, 16, 24, 0.5)

function maskStyle(mask: string): CSSProperties {
  return {
    maskImage: mask,
    WebkitMaskImage: mask,
    maskRepeat: 'repeat',
    WebkitMaskRepeat: 'repeat',
  }
}

function fadeMask(stops: string): CSSProperties {
  const mask = `linear-gradient(to right, ${stops})`
  return { maskImage: mask, WebkitMaskImage: mask }
}

function poseFor(index: number): { x: string; y: string; r: string } {
  const preset = CHIP_POSES[index]
  if (preset) return preset
  const along = unit(index)
  const spread = unit(index + 9)
  return {
    x: `${(12 + along * 14).toFixed(1)}cqw`,
    y: `${((spread - 0.5) * 22).toFixed(1)}cqw`,
    r: `${((along - 0.5) * 30).toFixed(1)}deg`,
  }
}

function motionCss(scope: string, arrive: number, gone: number, ease: string): string {
  const at = arrive.toFixed(2)
  const fade = gone.toFixed(2)
  return `
.${scope} { container-type: inline-size; }
.${scope} .mt-mover {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 72%;
  animation: ${scope}-travel var(--mt-travel) linear infinite both;
  animation-iteration-count: var(--mt-iterations);
  animation-play-state: var(--mt-play, running);
}
.${scope} .mt-solid { animation-delay: calc(var(--mt-travel) * -${CONTACT}); }
.${scope} .mt-pixel { animation-delay: calc(var(--mt-travel) * -${(CONTACT + 0.5).toFixed(4)}); }
@keyframes ${scope}-travel {
  from { transform: translate3d(-${CARD_WIDTH}%, -50%, 0); }
  to { transform: translate3d(${PORTAL}%, -50%, 0); }
}
.${scope} .mt-chip, .${scope} .mt-particle {
  animation: ${scope}-burst var(--mt-period) linear infinite both;
  animation-iteration-count: var(--mt-iterations);
  animation-play-state: var(--mt-play, running);
}
@keyframes ${scope}-burst {
  0% {
    opacity: 0;
    transform: translate3d(0, -50%, 0) rotate(0deg) scale(0.96);
    animation-timing-function: ${ease};
  }
  ${at}% {
    opacity: 1;
    transform: translate3d(var(--x), calc(-50% + var(--y)), 0) rotate(var(--r)) scale(1);
    animation-timing-function: linear;
  }
  ${fade}% {
    opacity: 0;
    transform: translate3d(calc(var(--x) + 2cqw), calc(-50% + var(--y)), 0) rotate(var(--r)) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate3d(calc(var(--x) + 2cqw), calc(-50% + var(--y)), 0) rotate(var(--r)) scale(1);
  }
}
.${scope} .mt-clock {
  animation: ${scope}-clock var(--mt-period) linear infinite;
  animation-iteration-count: var(--mt-iterations);
  animation-play-state: var(--mt-play, running);
}
@keyframes ${scope}-clock { from { opacity: 0.99; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) {
  .${scope} .mt-mover,
  .${scope} .mt-chip,
  .${scope} .mt-particle,
  .${scope} .mt-clock { animation: none !important; }
  .${scope} .mt-solid { transform: translate3d(26%, -50%, 0); }
  .${scope} .mt-pixel { transform: translate3d(-2%, -50%, 0); }
  .${scope} .mt-chip, .${scope} .mt-particle {
    opacity: 1;
    transform: translate3d(var(--x), calc(-50% + var(--y)), 0) rotate(var(--r)) scale(1);
  }
}
.${scope}[data-reduced='true'] .mt-mover,
.${scope}[data-reduced='true'] .mt-chip,
.${scope}[data-reduced='true'] .mt-particle,
.${scope}[data-reduced='true'] .mt-clock { animation: none !important; }
.${scope}[data-reduced='true'] .mt-solid { transform: translate3d(26%, -50%, 0); }
.${scope}[data-reduced='true'] .mt-pixel { transform: translate3d(-2%, -50%, 0); }
.${scope}[data-reduced='true'] .mt-chip,
.${scope}[data-reduced='true'] .mt-particle {
  opacity: 1;
  transform: translate3d(var(--x), calc(-50% + var(--y)), 0) rotate(var(--r)) scale(1);
}
.${scope}:dir(rtl) { transform: scaleX(-1); }
.${scope}:dir(rtl) .mt-label { transform: scaleX(-1); }
`
}

function TextLines({ widths }: { widths: readonly string[] }) {
  return (
    <div className="space-y-1.5">
      {widths.map((width, index) => (
        <span
          key={index}
          className="block h-1 rounded-full bg-foreground/10"
          style={{ width }}
        />
      ))}
    </div>
  )
}

function DocumentTitle({ item }: { item: MagicTransformItem }) {
  const label = cleanLabel(item.label)
  return (
    <div className="flex h-5 min-w-0 shrink-0 items-center gap-1.5">
      {item.icon ? <span className="shrink-0 text-muted-foreground">{item.icon}</span> : null}
      {label ? (
        <p
          dir="auto"
          title={label}
          className="mt-label min-w-0 truncate text-[11px] leading-5 font-medium text-muted-foreground"
        >
          {label}
        </p>
      ) : (
        <span className="h-1.5 w-1/3 rounded-full bg-foreground/15" />
      )}
    </div>
  )
}

/** Wireframe page: paragraphs, an input row, more copy, a button row. */
function WireframeFace({ item }: { item: MagicTransformItem }) {
  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <DocumentTitle item={item} />
      <TextLines widths={['100%', '94%', '100%', '72%']} />
      <div className="flex gap-2">
        <span className="h-3 w-[44%] shrink-0 rounded-[4px] border border-foreground/15" />
        <span className="h-3 w-[22%] shrink-0 rounded-[4px] border border-foreground/15" />
      </div>
      <TextLines widths={['100%', '88%', '96%']} />
      <div className="flex gap-2">
        <span className="h-3 w-[36%] shrink-0 rounded-[4px] border border-foreground/15" />
        <span className="h-3 w-[26%] shrink-0 rounded-[4px] bg-foreground/10" />
      </div>
      <TextLines widths={['100%', '82%']} />
    </div>
  )
}

/** Scanned page: an unreadable pixel block over a few lines of copy. */
function PixelFace({ item }: { item: MagicTransformItem }) {
  return (
    <div className="flex h-full w-full min-w-0 flex-col gap-3 overflow-hidden rounded-2xl border border-border bg-card px-4 py-4 shadow-sm">
      <DocumentTitle item={item} />
      <span
        className="block min-h-0 flex-[0_0_44%] bg-foreground/85"
        style={maskStyle(BLOCK_NOISE)}
      />
      <TextLines widths={['100%', '92%', '100%', '84%', '96%', '70%']} />
    </div>
  )
}

/** What the band left of the beam paints over a card: the page breaking into pixels. */
function ShredFace({ portal }: { portal: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border bg-card">
      <span
        className="absolute inset-0"
        style={{
          ...maskStyle(SHRED_NOISE),
          backgroundColor: `color-mix(in oklab, ${portal} 55%, var(--foreground))`,
        }}
      />
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to right, transparent, color-mix(in srgb, ${portal} 35%, transparent))`,
        }}
      />
    </div>
  )
}

function DocumentFace({ item, pixel }: { item: MagicTransformItem; pixel: boolean }) {
  return pixel ? <PixelFace item={item} /> : <WireframeFace item={item} />
}

function OutputChip({ item }: { item: MagicTransformItem }) {
  const full = cleanLabel(item.label)
  const shown = chipText(item.label)
  return (
    <div
      title={full || undefined}
      className="w-[4.75rem] max-w-[22cqw] min-w-0 rounded-lg border border-border bg-card px-2 py-1.5 shadow-md"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        {item.icon ? <span className="shrink-0 text-foreground/80">{item.icon}</span> : null}
        <span
          className="h-1.5 w-7 shrink-0 rounded-full"
          style={{ backgroundColor: item.color ?? CHIP_COLORS[0] }}
        />
      </div>
      {shown ? (
        <span
          dir="auto"
          className="mt-label mt-1 block min-w-0 truncate text-[10px] leading-4 text-muted-foreground"
        >
          {shown}
        </span>
      ) : null}
      <span className="mt-1.5 block h-1 rounded-full bg-foreground/10" />
      <span className="mt-1 block h-1 w-2/3 rounded-full bg-foreground/10" />
    </div>
  )
}

export function MagicTransform({
  items = [],
  outputItems = [],
  duration = 0.8,
  stagger = 0.1,
  autoPlay = true,
  loop = true,
  speed = 1,
  portalColor = 'indigo',
  mark,
  particleCount = 24,
  particleSize = 4,
  particleColor,
  glowIntensity = 0.8,
  perspective = 1000,
  ease = 'ease-out',
  onTransformStart,
  onTransformComplete,
  className,
  style,
  reducedMotion = false,
}: MagicTransformProps) {
  const portal = colorCss(portalColor)
  const rawId = useId()
  const scope = `mt${rawId.replace(/[^a-zA-Z0-9]/g, '')}`
  const systemReduced = useReducedMotion()
  const reduced = reducedMotion || systemReduced === true
  const safeSpeed = speed > 0 ? speed : 1
  const burst = Math.min(2.4, Math.max(0.2, duration))
  const period = TRAVEL_SECONDS / 2 / safeSpeed
  const share = Math.min(0.42, burst / (TRAVEL_SECONDS / 2))
  const arrive = share * 100
  const gone = Math.min(88, arrive + 40)
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const playing = autoPlay && !reduced && visible
  const glow = Math.min(1, Math.max(0, glowIntensity))
  const dots = Math.min(64, Math.max(0, Math.round(particleCount)))
  const dotSize = Math.min(16, Math.max(2, particleSize))

  const [solidStep, setSolidStep] = useState(0)
  const [pixelStep, setPixelStep] = useState(0)
  const startRef = useRef(onTransformStart)
  const completeRef = useRef(onTransformComplete)
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    startRef.current = onTransformStart
    completeRef.current = onTransformComplete
  }, [onTransformStart, onTransformComplete])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    const node = rootRef.current
    if (!node || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!reduced) return
    startRef.current?.()
    completeRef.current?.()
  }, [reduced])

  const scheduleComplete = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(
      () => {
        completeRef.current?.()
      },
      (burst / safeSpeed) * 1000,
    )
  }

  const handleCycle = () => {
    if (!playing) return
    startRef.current?.()
    scheduleComplete()
  }

  const solidItem = items.length ? items[(solidStep * 2) % items.length] : undefined
  const pixelItem = items.length ? items[(1 + pixelStep * 2) % items.length] : undefined
  const caption =
    items.length === 0
      ? 'Nothing to transform'
      : `Transforming ${items.map((item) => cleanLabel(item.label) || 'untitled').join(', ')}`

  const cssVars = {
    '--mt-travel': `${TRAVEL_SECONDS / safeSpeed}s`,
    '--mt-period': `${period}s`,
    '--mt-iterations': loop ? 'infinite' : '1',
    '--mt-play': playing ? 'running' : 'paused',
    '--mt-glow': String(glow),
    '--mt-portal': portal,
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={cn(
        scope,
        'relative h-full min-h-80 w-full overflow-hidden bg-background text-foreground',
        className,
      )}
      style={{ ...style, ...cssVars }}
      data-reduced={reduced ? 'true' : 'false'}
      role="img"
      aria-label={caption}
    >
      <style>{motionCss(scope, arrive, gone, resolveEase(ease))}</style>

      <div
        className="pointer-events-none absolute top-[18%] left-[54%] h-[64%] w-16 -translate-x-1/2 blur-2xl"
        style={{
          background: `linear-gradient(to bottom, transparent, ${portal}, transparent)`,
          opacity: glow,
        }}
      />
      <div
        className="pointer-events-none absolute top-[12%] left-[54%] h-[76%] w-0.5 -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, ${portal}, color-mix(in srgb, ${portal} 45%, white), ${portal}, transparent)`,
          boxShadow: `0 0 18px ${portal}`,
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - PORTAL}% 0 0)`,
          ...fadeMask(`#000 ${PORTAL - SHRED}%, transparent ${PORTAL - SHRED * 0.25}%`),
        }}
      >
        {solidItem ? (
          <div
            className="mt-mover mt-solid"
            onAnimationIteration={() => setSolidStep((step) => step + 1)}
          >
            <div className="h-full w-[28%]">
              <DocumentFace
                item={solidItem}
                pixel={false}
              />
            </div>
          </div>
        ) : null}
        {pixelItem ? (
          <div
            className="mt-mover mt-pixel"
            onAnimationIteration={() => setPixelStep((step) => step + 1)}
          >
            <div className="h-full w-[28%]">
              <DocumentFace
                item={pixelItem}
                pixel
              />
            </div>
          </div>
        ) : null}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          clipPath: `inset(0 ${100 - PORTAL}% 0 ${PORTAL - SHRED}%)`,
          ...fadeMask(`transparent ${PORTAL - SHRED}%, #000 ${PORTAL - SHRED * 0.45}%`),
        }}
      >
        {solidItem ? (
          <div className="mt-mover mt-solid">
            <div className="h-full w-[28%]">
              <ShredFace portal={portal} />
            </div>
          </div>
        ) : null}
        {pixelItem ? (
          <div className="mt-mover mt-pixel">
            <div className="h-full w-[28%]">
              <ShredFace portal={portal} />
            </div>
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{ perspective: `${perspective}px` }}
      >
        {outputItems.map((item, index) => {
          const pose = poseFor(index)
          return (
            <div
              key={item.id}
              aria-hidden
              className="mt-chip absolute top-1/2 left-[54%] z-10"
              style={
                {
                  '--x': pose.x,
                  '--y': pose.y,
                  '--r': pose.r,
                  animationDelay: `${(index * Math.max(0, stagger)) / safeSpeed}s`,
                } as CSSProperties
              }
            >
              <OutputChip item={item} />
            </div>
          )
        })}
        {Array.from({ length: dots }, (_, index) => {
          const along = unit(index + 3)
          const spread = unit(index + 19)
          const angle = (spread - 0.5) * 1.15
          const distance = 10 + along * 24
          return (
            <span
              key={index}
              aria-hidden
              className="mt-particle absolute top-1/2 left-[54%] z-[5] rounded-[2px]"
              style={
                {
                  width: dotSize,
                  height: dotSize,
                  backgroundColor: particleColor ?? CHIP_COLORS[index % CHIP_COLORS.length],
                  '--x': `${(Math.cos(angle) * distance).toFixed(2)}cqw`,
                  '--y': `${(Math.sin(angle) * distance * 0.72).toFixed(2)}cqw`,
                  '--r': `${((unit(index + 5) - 0.5) * 50).toFixed(1)}deg`,
                  animationDelay: `${((index % 8) * Math.max(0, stagger)) / 2 / safeSpeed}s`,
                } as CSSProperties
              }
            />
          )
        })}
      </div>

      <div
        className="absolute top-1/2 left-[54%] z-20 flex size-12 shrink-0 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-border bg-card"
        style={{
          boxShadow: `0 0 28px color-mix(in srgb, ${portal} ${Math.round(glow * 55)}%, transparent)`,
        }}
      >
        {mark ?? (
          <Sparkles
            aria-hidden
            className="size-6"
            style={{ color: portal }}
          />
        )}
      </div>

      <span
        className="mt-clock pointer-events-none absolute size-px overflow-hidden opacity-0"
        onAnimationStart={handleCycle}
        onAnimationIteration={handleCycle}
      />

      {items.length === 0 ? (
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
          <span className="mt-label">Nothing to transform</span>
        </p>
      ) : null}
    </div>
  )
}
