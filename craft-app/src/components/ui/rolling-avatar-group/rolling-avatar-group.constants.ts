import type { Variants } from 'motion/react'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const DURATION = { instant: 0.12, fast: 0.16, standard: 0.24 } as const
// presses, toggles and small indicators; settles fast and never overshoots
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
// width changes that follow new content, without overshoot
export const SPRING_MORPH = { type: 'spring', visualDuration: 0.42, bounce: 0 } as const
export const BLUR_SUBTLE = 2
export const INSTANT = { duration: 0 } as const

// the group and every slot are as tall as one avatar
export const SIZES = {
  sm: { box: 'h-7', avatar: 'size-7 text-[10px]', dot: 'size-2 border-[1.5px]' },
  md: { box: 'h-9', avatar: 'size-9 text-xs', dot: 'size-2.5 border-2' },
  lg: { box: 'h-12', avatar: 'size-12 text-sm', dot: 'size-3 border-2' },
} as const

// success has no shadcn token, so online uses the Tailwind palette
export const STATUS = {
  online: 'bg-emerald-500 dark:bg-emerald-400',
  offline: 'bg-muted-foreground',
} as const

// a card-coloured border cuts each avatar out of the one behind it; only the ring answers hover
export const RING =
  'border-2 border-card ring-1 ring-border transition-shadow duration-160 ease-[cubic-bezier(.22,1,.36,1)] pointer-fine:group-hover/slot:ring-foreground/25'

// the name floats above the stack, outside the layout, so showing it never moves anything
export const TIP =
  'pointer-events-none absolute bottom-[calc(100%+8px)] left-1/2 z-2 -translate-x-1/2 translate-y-[3px] rounded-full bg-foreground px-2 py-1 text-xs leading-[1.4] font-medium whitespace-nowrap text-background opacity-0 transition-[opacity,translate] duration-160 ease-[cubic-bezier(.22,1,.36,1)] pointer-fine:group-hover/slot:translate-y-0 pointer-fine:group-hover/slot:opacity-100 pointer-fine:group-hover/slot:delay-60 motion-reduce:translate-y-0 motion-reduce:transition-none'

// a person joining or leaving opens or closes their slot, so the rest of the stack slides
export const SLOT = {
  initial: { width: 0, opacity: 0, scale: 0.9 },
  animate: { width: 'auto', opacity: 1, scale: 1 },
  exit: { width: 0, opacity: 0, scale: 0.9 },
}

// the overflow count rolls the way it moved: more people rise in from below, fewer drop in from above
export const RISE: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    y: `${0.4 * direction}em`,
    filter: `blur(${BLUR_SUBTLE}px)`,
  }),
  shown: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: DURATION.standard, ease: EASE_ENTER },
  },
  gone: (direction: number) => ({
    opacity: 0,
    y: `${-0.4 * direction}em`,
    filter: `blur(${BLUR_SUBTLE}px)`,
    transition: { duration: DURATION.fast, ease: EASE_STANDARD },
  }),
}

// same keys as RISE, so the settled style matches whichever one renders
export const FADE: Variants = {
  hidden: { opacity: 0, y: '0em', filter: 'blur(0px)' },
  shown: {
    opacity: 1,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: DURATION.instant },
  },
  gone: {
    opacity: 0,
    y: '0em',
    filter: 'blur(0px)',
    transition: { duration: DURATION.instant },
  },
}
