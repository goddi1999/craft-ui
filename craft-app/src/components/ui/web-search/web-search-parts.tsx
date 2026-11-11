import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  type AnimationPlaybackControls,
} from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  CARD_SHELL,
  CREEP,
  CREEP_SECONDS,
  INSTANT,
  OPEN,
  POP,
  RAISED,
  RING,
  RING_CIRCLE,
  RING_HOLD,
  SHIMMER,
  SPREAD,
  SPREAD_DELAY,
  STACK,
  STROKE,
  SURFACE,
  SWAP,
} from './web-search.constants'
import { useHoverIntent, useSize } from './web-search-hooks'
import type { WebSource } from './web-search.types'
import { hash, linkTo, siteName } from './web-search.utils'

export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      width={14}
      height={14}
      {...STROKE}
      strokeWidth={2.6}
      className={cn('block', className)}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export function Collapse({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const [ref, height] = useSize<HTMLDivElement>('height')

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      // height auto only animates on mount, so the measured height carries every later change
      animate={{ height: height ?? 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={reduced ? INSTANT : { height: OPEN, opacity: { duration: 0.25 } }}
      className="-mx-1 overflow-hidden"
    >
      {/* the inset gives the hover lift and focus rings room before the clip */}
      <div ref={ref} className="px-1 pb-1">
        {children}
      </div>
    </motion.div>
  )
}

export function SourceCard({
  source,
  index,
  linked,
}: {
  source: WebSource
  index: number
  linked: boolean
}) {
  return (
    <a
      data-slot="web-search-source"
      {...linkTo(source.url, linked)}
      title={source.title}
      className={cn(CARD_SHELL, 'group justify-between', !linked && 'cursor-default')}
    >
      <span className="line-clamp-2 text-[12.5px] leading-[17px] font-semibold text-foreground/85 transition-colors group-hover:text-foreground">
        {source.title}
      </span>
      <span className="flex items-center gap-1.5">
        <Favicon source={source} size={16} />
        <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-muted-foreground">
          {siteName(source.url)}
        </span>
        <span className="text-[11px] font-semibold text-muted-foreground/70 tabular-nums">
          {index}
        </span>
      </span>
    </a>
  )
}

export function MoreCard({
  sources,
  onClick,
  reduced,
}: {
  sources: WebSource[]
  onClick: () => void
  reduced: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Show ${sources.length} more sources`}
      className={cn(CARD_SHELL, 'group justify-between')}
    >
      <FaviconStack sources={sources} reduced={reduced} />
      <span className="flex items-center gap-1 text-[12.5px] leading-[17px] font-semibold whitespace-nowrap text-foreground/85 transition-colors group-hover:text-foreground">
        <span className="relative inline-grid overflow-hidden tabular-nums">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={sources.length}
              initial={{ y: '100%', opacity: 0, filter: 'blur(2px)' }}
              animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-100%', opacity: 0, filter: 'blur(2px)' }}
              transition={reduced ? INSTANT : SWAP}
            >
              {sources.length}
            </motion.span>
          </AnimatePresence>
        </span>
        more {sources.length === 1 ? 'source' : 'sources'}
      </span>
    </button>
  )
}

export function LessCard({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        CARD_SHELL,
        'group flex-row items-center justify-center gap-1.5 bg-transparent text-[12.5px] font-semibold text-muted-foreground shadow-[inset_0_0_0_1px_var(--border)] group-hover/card:translate-y-0 hover:bg-muted hover:text-foreground hover:shadow-none dark:hover:bg-muted',
      )}
    >
      <Chevron className="-ml-0.5 rotate-180 transition-transform duration-200 group-hover:-translate-y-px" />
      Show less
    </button>
  )
}

export function SkeletonCard({ reduced, delay }: { reduced: boolean; delay: number }) {
  const bar = 'rounded-full bg-foreground/[0.06]'
  return (
    <div
      className={cn(
        'relative flex h-[84px] flex-col justify-between overflow-hidden rounded-[14px] p-2.5',
        SURFACE,
      )}
    >
      <span className="flex flex-col gap-1.5 pt-0.5">
        <span className={cn(bar, 'h-2.5 w-[88%]')} />
        <span className={cn(bar, 'h-2.5 w-[60%]')} />
      </span>
      <span className="flex items-center gap-1.5">
        <span className={cn(bar, 'size-3.5')} />
        <span className={cn(bar, 'h-2 w-12')} />
      </span>
      {!reduced && (
        <motion.span
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent dark:via-white/[0.06]"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.3, ease: 'easeInOut', repeat: Infinity, delay }}
        />
      )}
    </div>
  )
}

export function FaviconStack({
  sources,
  reduced,
  size = 20,
}: {
  sources: WebSource[]
  reduced: boolean
  size?: number
}) {
  // only the icons themselves spread on hover, not the pill or card around them
  const { active: spread, hover } = useHoverIntent(SPREAD_DELAY)
  const shown = sources.slice(0, STACK)
  // the 2px plate around each icon counts in the layout, so the overlap makes room for it
  const overlap = Math.round(size * 0.3) + 4
  // icons slide on transforms, which move in subpixels, and one padding change makes room for them
  const shift = spread ? overlap - 2 : 0

  return (
    <motion.span
      data-slot="web-search-stack"
      {...hover}
      className="flex w-fit shrink-0 items-center"
      initial={false}
      animate={{ paddingRight: shift * Math.max(0, shown.length - 1) }}
      transition={reduced ? INSTANT : SPREAD}
    >
      <AnimatePresence initial={false}>
        {shown.map((source, i) => (
          <motion.span
            key={source.id}
            // the separator is a plate in the surface color, so the icon's soft edge blends into it instead of leaving a seam
            className="relative rounded-full bg-muted p-[2px] transition-colors group-hover:bg-background dark:group-hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_6%)]"
            style={{ zIndex: STACK - i, marginLeft: i === 0 ? 0 : -overlap }}
            initial={{ scale: 0, opacity: 0, x: shift * i }}
            animate={{ scale: 1, opacity: 1, x: shift * i }}
            exit={{ scale: 0, opacity: 0 }}
            transition={reduced ? INSTANT : { default: POP, x: SPREAD }}
          >
            <Favicon source={source} size={size} />
          </motion.span>
        ))}
      </AnimatePresence>
    </motion.span>
  )
}

export function Favicon({ source, size }: { source: WebSource; size: number }) {
  const [broken, setBroken] = useState(false)
  const name = siteName(source.url)
  const hue = hash(name) % 360
  const image = source.favicon && !broken

  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center overflow-hidden rounded-full leading-none font-bold text-white uppercase"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.5,
        background: image
          ? undefined
          : `linear-gradient(135deg, oklch(0.72 0.15 ${hue}), oklch(0.58 0.17 ${(hue + 30) % 360}))`,
      }}
    >
      {image ? (
        <img
          src={source.favicon}
          alt=""
          draggable={false}
          onError={() => setBroken(true)}
          className="size-full object-cover"
        />
      ) : (
        name.charAt(0)
      )}
    </span>
  )
}

export function GlobeTile({
  searching,
  progress,
  reduced,
}: {
  searching: boolean
  progress: number
  reduced: boolean
}) {
  const fill = useMotionValue(searching ? 0 : 1)

  useEffect(() => {
    const target = searching ? progress : 1
    if (reduced) {
      fill.jump(target)
      return
    }
    let creep: AnimationPlaybackControls | undefined
    const settle = animate(fill, target, RING)
    // between results the ring keeps edging toward the next step, so it never looks stuck
    if (searching) {
      settle.then(() => {
        creep = animate(fill, target + (1 - target) * CREEP, {
          duration: CREEP_SECONDS,
          ease: 'easeOut',
        })
      })
    }
    return () => {
      settle.stop()
      creep?.stop()
    }
  }, [searching, progress, reduced, fill])

  return (
    <span
      className={cn(
        'relative flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06)] transition-colors group-hover:text-foreground',
        RAISED,
      )}
    >
      <svg aria-hidden viewBox="0 0 24 24" width={15} height={15} {...STROKE} strokeWidth={2}>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
      </svg>
      <motion.svg
        aria-hidden
        viewBox="0 0 28 28"
        className="absolute inset-0 size-full -rotate-90 text-foreground"
        initial={false}
        animate={{ opacity: searching ? 1 : 0 }}
        // a finished search holds the full ring for a beat before it fades
        transition={reduced ? INSTANT : { duration: 0.3, delay: searching ? 0 : RING_HOLD }}
      >
        <circle {...RING_CIRCLE} className="opacity-[0.12]" />
        <motion.circle {...RING_CIRCLE} style={{ pathLength: fill }} />
      </motion.svg>
    </span>
  )
}

export function Shimmer({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  if (reduced) return <span className="text-muted-foreground">{children}</span>
  return (
    <motion.span
      className="bg-clip-text text-transparent [--web-search-ink:var(--muted-foreground)] [--web-search-shine:var(--foreground)]"
      style={{ backgroundImage: SHIMMER, backgroundSize: '250% 100%' }}
      initial={{ backgroundPosition: '100% 0' }}
      animate={{ backgroundPosition: '0% 0' }}
      transition={{ duration: 1.6, ease: 'linear', repeat: Infinity }}
    >
      {children}
    </motion.span>
  )
}

export function Caret({ reduced }: { reduced: boolean }) {
  return (
    <motion.span
      aria-hidden
      className="ml-0.5 inline-block size-[0.55em] rounded-full bg-current align-[-0.02em]"
      animate={reduced ? undefined : { opacity: [1, 0.4, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}

/** The pill's chevron, turning to say whether the cards are open. */
export function OpenChevron({ open, reduced }: { open: boolean; reduced: boolean }) {
  return (
    <motion.span
      className="-ml-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
      initial={false}
      animate={{ rotate: open ? 180 : 0 }}
      transition={reduced ? INSTANT : OPEN}
    >
      <Chevron />
    </motion.span>
  )
}
