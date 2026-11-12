import type { Transition } from 'motion/react'

import type { ColorFormat, ContrastGrade, Hsva } from './color-picker.types'

type Bezier = [number, number, number, number]

// uiarc motion tokens, inlined so the folder copies on its own
export const EASE_ENTER: Bezier = [0.16, 1, 0.3, 1]
export const EASE_STANDARD: Bezier = [0.22, 1, 0.36, 1]
export const DURATION = { instant: 0.12, fast: 0.16, exit: 0.18, standard: 0.24 } as const
export const SNAPPY_SPRING = { type: 'spring', visualDuration: 0.26, bounce: 0 } as const
export const SMOOTH_SPRING = { type: 'spring', visualDuration: 0.4, bounce: 0 } as const
export const MORPH_SPRING = { type: 'spring', visualDuration: 0.42, bounce: 0 } as const
export const BLUR_SUBTLE = 2
export const BLUR_SOFT = 4
export const STAGGER_CHAR = 0.016

// a spring from how long it should look and how much it bounces, with a tight rest
// so a thumb never creeps the last fraction of a pixel
function physicalSpring(visualDuration: number, bounce: number): Transition {
  const root = (2 * Math.PI) / (visualDuration * 1.2)
  return {
    type: 'spring',
    stiffness: root * root,
    damping: 2 * (1 - bounce) * root,
    mass: 1,
    restDelta: 0.0005,
    restSpeed: 0.005,
  }
}

// a click lands with a soft settle
export const THUMB_SPRING = physicalSpring(0.26, 0)
// under a drag the thumb stays glued to the pointer
export const DRAG_SPRING = physicalSpring(0.1, 0)
export const OPEN_SPRING = physicalSpring(MORPH_SPRING.visualDuration, 0.1)
export const CLOSE_SPRING = physicalSpring(0.3, 0)
export const INSTANT: Transition = { duration: 0 }

// the swatch is the panel's top left corner; the clip grows from its box and rounds a little more
export const CLOSED_RADIUS = 22
export const OPEN_RADIUS_GROWTH = 4
// panel content fades in behind the leading edge and drops this far into place
export const CONTENT_RISE = -10

// how long the morphing format text covers the live field
export const MORPH_SETTLE_MS = 620
export const SHAKE = [0, -5, 4, -2, 0]
export const SHAKE_DURATION = 0.32
// lets leaving letters start to clear before the first new letter sharpens in
export const TEXT_MORPH_HANDOFF = 0.05

export const DEFAULT_COLOR = '#2F6BFF'
export const FALLBACK_HSVA: Hsva = { h: 220, s: 0.8, v: 1, a: 1 }

export const FORMATS: readonly ColorFormat[] = ['hex', 'rgb', 'hsl', 'oklch']
export const FORMAT_NAMES: Record<ColorFormat, string> = {
  hex: 'Hex',
  rgb: 'RGB',
  hsl: 'HSL',
  oklch: 'OKLCH',
}
export const INVALID_MESSAGE = 'Enter a hex, RGB, HSL, or OKLCH color'

// a checkerboard behind every chip and the opacity track, so opacity reads as opacity
export const CHECKER =
  '[--checker:repeating-conic-gradient(oklch(88%_0_0)_0_25%,oklch(100%_0_0)_0_50%)_0_0/10px_10px] dark:[--checker:repeating-conic-gradient(oklch(42%_0_0)_0_25%,oklch(30%_0_0)_0_50%)_0_0/10px_10px]'

// saturation runs left to right and brightness bottom to top, over the pure hue
export const AREA_SHADE =
  'linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)'

// the stops sit at the thumb's travel ends, so the colour under the thumb is the value it reports
export const HUE_TRACK =
  'linear-gradient(to right, #f00 11px, #ff0 calc(11px + (100% - 22px) * .1666), #0f0 calc(11px + (100% - 22px) * .3333), #0ff 50%, #00f calc(11px + (100% - 22px) * .6666), #f0f calc(11px + (100% - 22px) * .8333), #f00 calc(100% - 11px))'

export const THUMB =
  'absolute size-[22px] -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-full shadow-[0_0_0_3px_#fff,0_2px_8px_oklch(0%_0_0/0.3),inset_0_0_0_1px_oklch(0%_0_0/0.12)] outline-none transition-[scale] duration-[580ms] ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-ring motion-reduce:transition-none'

export const ICON_BUTTON =
  'grid size-8 place-items-center rounded-xl text-muted-foreground outline-none transition-[background-color,color,transform] duration-160 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.94] motion-reduce:transition-none'

// success and warning have no shadcn token, so they use the Tailwind palette
export const GRADE_STYLES: Record<ContrastGrade, string> = {
  AAA: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  AA: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400',
  'AA large': 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
  Fails: 'bg-destructive/12 text-destructive',
}
