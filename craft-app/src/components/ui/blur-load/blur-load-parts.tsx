import type { CSSProperties, ReactNode } from 'react'

import { Segmented } from '@/components/ui/segmented-control'
import { cn } from '@/lib/utils'

import type {
  BlurLoadImage,
  BlurLoadLayerId,
  BlurLoadLayerView,
} from './blur-load.types'

type PanelChromeProps = {
  title: string
  status: string
  tone: 'rose' | 'amber' | 'emerald' | 'sky'
  children: ReactNode
  footer?: ReactNode
  className?: string
}

const TONE: Record<PanelChromeProps['tone'], string> = {
  rose: 'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60',
  amber:
    'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60',
  emerald:
    'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60',
  sky: 'bg-sky-50 text-sky-700 border-sky-200/70 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/60',
}

const DOT: Record<PanelChromeProps['tone'], string> = {
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  emerald: 'bg-emerald-500',
  sky: 'bg-sky-500',
}

export function BlurLoadPanel({
  title,
  status,
  tone,
  children,
  footer,
  className,
}: PanelChromeProps) {
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span aria-hidden className={cn('size-2.5 rounded-full', DOT[tone])} />
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium',
            TONE[tone],
          )}
        >
          {status}
        </span>
      </div>
      {children}
      {footer ? (
        <p className="text-xs leading-relaxed text-muted-foreground">{footer}</p>
      ) : null}
    </article>
  )
}

type StandardSlowLoadProps = {
  image: BlurLoadImage
  /** 0..1 download progress; drives top-to-bottom clip reveal. */
  progress: number
  className?: string
}

export function StandardSlowLoad({
  image,
  progress,
  className,
}: StandardSlowLoadProps) {
  const hiddenBottom = (1 - progress) * 100
  const revealStyle = {
    clipPath: `inset(0 0 ${hiddenBottom}% 0)`,
  } as CSSProperties

  return (
    <div
      data-slot="blur-load-standard"
      className={cn(
        'relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-border bg-background shadow-inner',
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-0 flex flex-col items-center justify-center select-none text-muted-foreground/40"
      >
        <svg
          className="mb-1 size-8 opacity-50"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
          />
        </svg>
        <span className="text-xs font-medium">Empty White Box</span>
      </div>
      <div data-slot="blur-load-standard-reveal" style={revealStyle}>
        <img src={image.src} alt={image.alt} decoding="async" />
      </div>
    </div>
  )
}

const VIEW_OPTIONS: { value: BlurLoadLayerView; label: string }[] = [
  { value: 'exploded', label: '3D Layer Stack' },
  { value: 'flat', label: 'Flat Composite' },
]

const LAYER_TOGGLES: { id: BlurLoadLayerId; label: string; dot: string }[] = [
  { id: 3, label: 'High-res', dot: 'bg-emerald-400' },
  { id: 2, label: 'Pulse', dot: 'bg-sky-400' },
  { id: 1, label: 'Blur', dot: 'bg-amber-400' },
]

type LayerStackProps = {
  image: BlurLoadImage
  /** 0..1 download progress — drives the pulse and the layer-3 fade. */
  progress: number
  view: BlurLoadLayerView
  onViewChange: (view: BlurLoadLayerView) => void
  visible: Record<BlurLoadLayerId, boolean>
  onVisibleChange: (layer: BlurLoadLayerId, next: boolean) => void
  /** Placeholder blur in px. */
  blur: number
  className?: string
}

/**
 * The three blur-load layers, either fanned out in 3D or stacked flat. The
 * viewer picks the view (tabs, or a click on the stage) and can hide any layer.
 */
export function BlurLoadLayerStack({
  image,
  progress,
  view,
  onViewChange,
  visible,
  onVisibleChange,
  blur,
  className,
}: LayerStackProps) {
  const loaded = progress >= 1
  const nextView = view === 'exploded' ? 'flat' : 'exploded'

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Segmented
        label="Layer view"
        options={VIEW_OPTIONS}
        value={view}
        onValueChange={onViewChange}
        className="self-start"
      />

      <button
        type="button"
        data-slot="blur-load-layers"
        data-loaded={loaded}
        aria-label={`Show ${nextView === 'flat' ? 'flat composite' : '3D layer stack'}`}
        onClick={() => onViewChange(nextView)}
        className="relative aspect-[16/10] w-full min-h-[220px] cursor-pointer rounded-xl border border-border outline-none focus-visible:ring-2 focus-visible:ring-ring"
        style={{ '--blur-load-amount': `${blur}px` } as CSSProperties}
      >
        <span data-slot="blur-load-layer-stage" data-view={view}>
          <span data-slot="blur-load-layer" data-layer="1" data-hidden={!visible[1]}>
            <img
              data-slot="blur-load-layer-blur"
              src={image.placeholderSrc}
              alt=""
              decoding="async"
              draggable={false}
            />
            <span data-slot="blur-load-layer-label">
              Layer 1: blurred placeholder
            </span>
          </span>
          <span data-slot="blur-load-layer" data-layer="2" data-hidden={!visible[2]}>
            <span data-slot="blur-load-layer-label">Layer 2: ::before pulse</span>
          </span>
          <span
            data-slot="blur-load-layer"
            data-layer="3"
            data-hidden={!visible[3]}
            style={{ '--layer-progress': progress } as CSSProperties}
          >
            <img src={image.src} alt="" decoding="async" draggable={false} />
            <span data-slot="blur-load-layer-label">
              Layer 3: &lt;img loading=&quot;lazy&quot;&gt;
            </span>
          </span>
        </span>
      </button>

      <div role="group" aria-label="Visible layers" className="flex flex-wrap gap-1.5">
        {LAYER_TOGGLES.map((layer) => (
          <button
            key={layer.id}
            type="button"
            aria-pressed={visible[layer.id]}
            onClick={() => onVisibleChange(layer.id, !visible[layer.id])}
            className={cn(
              'inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium transition-[color,background-color,border-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97]',
              visible[layer.id]
                ? 'border-border bg-background text-foreground'
                : 'border-transparent bg-foreground/[0.05] text-muted-foreground line-through',
            )}
          >
            <span
              aria-hidden
              className={cn(
                'size-2 rounded-full transition-opacity duration-150',
                layer.dot,
                !visible[layer.id] && 'opacity-30',
              )}
            />
            {layer.id} · {layer.label}
          </button>
        ))}
      </div>
    </div>
  )
}

type ScenePickerProps = {
  images: readonly BlurLoadImage[]
  value: number
  onValueChange: (index: number) => void
}

/** Thumbnail strip built from the placeholders, so it costs almost nothing to paint. */
export function BlurLoadScenePicker({ images, value, onValueChange }: ScenePickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="Scene"
      className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1"
    >
      {images.map((image, index) => {
        const active = index === value
        return (
          <button
            key={image.src}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={image.alt}
            onClick={() => onValueChange(index)}
            className={cn(
              'relative h-11 w-[4.5rem] shrink-0 overflow-hidden rounded-lg outline-none transition-[scale,box-shadow,opacity] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.96]',
              active
                ? 'ring-2 ring-foreground ring-offset-2 ring-offset-background'
                : 'opacity-70 hover:opacity-100',
            )}
          >
            <img
              src={image.placeholderSrc}
              alt=""
              decoding="async"
              draggable={false}
              className="size-full object-cover"
            />
          </button>
        )
      })}
    </div>
  )
}
