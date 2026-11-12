import type { ThemeSwitchVariant } from './theme-switch.types'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const DURATION = { instant: 0.12, fast: 0.16 } as const
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const SPRING_SNAPPY = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const BLUR_SUBTLE = 2

// rotation and scale ride the spring; opacity and blur tween so the blur never overshoots below zero
export const ICON_SPRING = {
  ...SPRING_SNAPPY,
  opacity: { duration: DURATION.fast, ease: EASE_ENTER },
  filter: { duration: DURATION.fast, ease: EASE_ENTER },
}
export const ICON_EXIT = { duration: DURATION.fast, ease: EASE_STANDARD }
export const ICON_BLUR = `blur(${BLUR_SUBTLE}px)`
// both icons turn the same way, clockwise into dark and back out of it
export const ICON_ANGLE = 30
export const ICON_SCALE = 0.7

// icon buttons press a little deeper than labelled ones, so both read as the same push
export const PRESS_SCALE = { icon: 0.96, label: 0.97 } as const
export const PRESS = { duration: DURATION.instant, ease: EASE_STANDARD }

// the css side of uiarc's --ease-spring over 580ms, for the nudge
export const SPRING_EASE =
  'linear(0, 0.0213, 0.0739, 0.1443, 0.2235, 0.305, 0.3849, 0.4606, 0.5305, 0.594, 0.6508, 0.7011, 0.7452, 0.7836, 0.8168, 0.8454, 0.8699, 0.8907, 0.9084, 0.9234, 0.9361, 0.9467, 0.9557, 0.9632, 0.9694, 0.9747, 0.979, 0.9826, 0.9857, 0.9882, 0.9902, 0.992, 0.9934, 0.9946, 0.9955, 0.9963, 1)'

// in dark mode the icon leans the way its page transition travels
export const NUDGE: Record<ThemeSwitchVariant, string> = {
  reveal: 'scale-[1.08]',
  eclipse: '-translate-x-0.5',
  split: 'translate-x-px',
  rise: '-translate-y-0.5',
}

export const BUTTON =
  'relative inline-flex min-h-9 cursor-pointer items-center justify-center gap-2 rounded-[1.125rem] border border-border bg-card text-sm leading-[1.4] font-medium whitespace-nowrap text-foreground outline-none [-webkit-tap-highlight-color:transparent] transition-[color,background-color,border-color,box-shadow] duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:border-foreground/25 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:bg-muted motion-reduce:transition-none'

export const LABELLED =
  'px-3 hover:shadow-[0_1px_2px_oklch(0%_0_0/.035)] dark:hover:shadow-[0_1px_2px_oklch(0%_0_0/.18)]'

export const ICON_ONLY = 'size-[38px] min-h-[38px] min-w-[38px] rounded-xl p-0'
