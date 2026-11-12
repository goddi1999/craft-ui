import type { Transition, Variants } from 'motion/react'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const DURATION = {
  instant: 0.12,
  fast: 0.16,
  exit: 0.18,
  standard: 0.24,
  considered: 0.48,
} as const
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const SPRING_SMOOTH = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const
export const BLUR_SUBTLE = 2
export const BLUR_SOFT = 4
export const STAGGER_WORD = 0.04

// the quick look's radius in rem; motion only scale-corrects pixel radii, so it is read back in px
export const PANEL_RADIUS_REM = 2.125

// one critically damped spring carries the surface both ways, so it never overshoots and can
// reverse mid-flight; closing is a touch quicker
export const GROW: Transition = { ...SPRING_SMOOTH, visualDuration: 0.3 }
export const SETTLE: Transition = { ...SPRING_SMOOTH, visualDuration: 0.26 }
export const RETURN_MS = 300
export const FADE: Transition = { duration: DURATION.instant }

// the photo drifts in slowly while the card is pointed at, and eases back a little faster
export const ZOOM = 1.04
export const ZOOM_IN: Transition = { duration: DURATION.considered * 2, ease: EASE_STANDARD }
export const ZOOM_OUT: Transition = { duration: DURATION.considered, ease: EASE_STANDARD }

// quick look extras arrive once the surface has mostly grown, so they never ride the stretch
export const REVEAL: Transition = {
  delay: DURATION.instant,
  duration: DURATION.standard,
  ease: EASE_ENTER,
}
export const CLOSE_IN: Transition = {
  delay: DURATION.instant,
  duration: DURATION.fast,
  ease: EASE_ENTER,
}
export const OVERLAY_IN: Transition = { duration: DURATION.standard, ease: EASE_ENTER }
export const OVERLAY_OUT: Transition = { duration: DURATION.exit, ease: EASE_STANDARD }

// a new status replaces the whole line: the old one lifts away quickly while the new words rise in
export const LINE_MOTION: Variants = {
  enter: {},
  center: {},
  exit: {
    opacity: 0,
    y: '-.3em',
    filter: `blur(${BLUR_SUBTLE}px)`,
    transition: { duration: DURATION.fast, ease: EASE_STANDARD },
  },
}
export const WORD_MOTION: Variants = {
  enter: { opacity: 0, y: '.3em', filter: `blur(${BLUR_SOFT}px)` },
  center: (order: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DURATION.standard, ease: EASE_ENTER, delay: order * STAGGER_WORD },
  }),
}

const SHADOW_RAISED =
  'data-hover:shadow-[0_6px_18px_oklch(0%_0_0/0.065),0_1px_3px_oklch(0%_0_0/0.035)] dark:data-hover:shadow-[0_8px_22px_oklch(0%_0_0/0.22)]'
const SHADOW_FLOATING =
  'shadow-[0_20px_48px_oklch(0%_0_0/0.105),0_3px_10px_oklch(0%_0_0/0.045)] dark:shadow-[0_22px_55px_oklch(0%_0_0/0.34)]'

// isolation keeps the rounded clip on the media while the card lifts on its own layer (safari)
export const CARD = `relative isolate min-w-0 overflow-hidden rounded-[1.625rem] border border-border bg-card text-foreground [transition:border-color_160ms_cubic-bezier(.22,1,.36,1),box-shadow_240ms_cubic-bezier(.22,1,.36,1)] data-hover:border-foreground/25 ${SHADOW_RAISED} has-[[data-card-trigger]:focus-visible]:border-foreground/25 has-[[data-card-trigger]:focus-visible]:ring-2 has-[[data-card-trigger]:focus-visible]:ring-ring motion-reduce:[transition-duration:120ms]`

// centered with auto margins, so transform stays free for the morph; while returning it takes the
// card's box and look, so it lands exactly where the card sits
export const PANEL = `group/panel fixed inset-0 z-[51] m-auto h-fit max-h-[calc(100dvh-2rem)] w-[min(calc(100vw-2rem),30rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-[2.125rem] border border-border bg-popover text-foreground outline-none ${SHADOW_FLOATING} [transition:background-color_240ms_cubic-bezier(.22,1,.36,1),box-shadow_240ms_cubic-bezier(.22,1,.36,1)] data-returning:pointer-events-none data-returning:inset-auto data-returning:top-[var(--landing-top)] data-returning:left-[var(--landing-left)] data-returning:m-0 data-returning:h-[var(--landing-height)] data-returning:max-h-none data-returning:w-[var(--landing-width)] data-returning:overflow-hidden data-returning:bg-card data-returning:shadow-none`

export const OVERLAY = 'fixed inset-0 z-50 bg-[oklch(10%_0_0/0.46)] backdrop-blur-[7px]'

export const CLOSE =
  'grid size-8 cursor-pointer place-items-center rounded-full border border-border/70 bg-popover/75 text-foreground outline-none backdrop-blur-md transition-colors duration-160 ease-[cubic-bezier(.22,1,.36,1)] [-webkit-tap-highlight-color:transparent] hover:bg-popover focus-visible:ring-2 focus-visible:ring-ring motion-reduce:duration-120'

// fit-content keeps the title's box the shape of its text, so it scales evenly into the quick look
export const TITLE =
  'm-0 w-fit max-w-full text-lg leading-[1.3] font-medium tracking-[-0.01em] text-balance'
export const DESCRIPTION =
  'mt-2 max-w-[34ch] text-sm leading-[1.4] text-pretty text-muted-foreground'
