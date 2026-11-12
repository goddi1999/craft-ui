// submit.js springs, one per moving part (no tokens in the source)
// width: pill -> circle -> pill, with a little overshoot each way
export const WIDTH_SPRING = { type: 'spring', stiffness: 300, damping: 22, mass: 1 } as const
// the label dropping away and coming back
export const LABEL_SPRING = { type: 'spring', stiffness: 400, damping: 30, mass: 1 } as const
// the spinner growing in and out
export const SPINNER_SPRING = { type: 'spring', stiffness: 300, damping: 28, mass: 1 } as const
// the check + success label rising in
export const DONE_SPRING = { type: 'spring', stiffness: 220, damping: 20, mass: 1 } as const
// the green washing over the pill
export const TINT_SPRING = { type: 'spring', stiffness: 200, damping: 30, mass: 1 } as const
// the check drawing itself, slow and almost without overshoot
export const TICK_SPRING = { type: 'spring', stiffness: 120, damping: 20, mass: 1 } as const

// the check starts drawing once the pill has begun to open
export const TICK_DELAY_MS = 150
// the label comes back once the success content has started to leave
export const LABEL_DELAY_MS = 120
// how long success stays before going back to idle (3.6s - 1.6s in the source)
export const SUCCESS_MS = 2000
// 360deg * 1.4 per second
export const SPIN_MS = 714

export const HEIGHT = 56
export const IDLE_WIDTH = 168
export const LOADING_WIDTH = HEIGHT
export const SUCCESS_WIDTH = 140
// side padding when a longer label needs more than the widths above
export const PAD_X = 28

// px the label drops while it fades, px the success content rises from
export const LABEL_DROP = 14
export const DONE_RISE = 12
// the spinner grows from 60% to full size
export const SPINNER_MIN_SCALE = 0.6
// dash length of the check path
export const TICK_LENGTH = 22

// source --green / --on-green: status colours with no theme token, the same in both themes
export const SUCCESS_FILL = 'bg-[#34D17A]'
export const SUCCESS_TEXT = 'text-[#04140A]'

export const SPINNER_STYLE = {
  background:
    'conic-gradient(from 0deg, transparent 0 10%, currentColor 85%, transparent 85%)',
  mask: 'radial-gradient(circle closest-side, transparent 68%, #000 72%)',
  WebkitMask: 'radial-gradient(circle closest-side, transparent 68%, #000 72%)',
  animationDuration: `${SPIN_MS}ms`,
} as const
