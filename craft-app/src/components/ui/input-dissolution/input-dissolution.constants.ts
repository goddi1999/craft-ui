/** The theme's accent tokens (`--oklch-*` in index.css) the caret can take by name. */
export const ACCENT_TOKENS = [
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'orange',
  'pink',
  'darkblue',
] as const

export const DEFAULT_ACCENT = '#ff1e1e'

// the same feedback as Blank Text: a quick lift with an elastic settle, or a small shake
export const LIFT = { duration: 0.14, ease: [0.23, 1, 0.32, 1] } as const
export const LIFT_Y = -10
export const SETTLE = { type: 'spring', stiffness: 600, damping: 9 } as const
export const SHAKE_X = [0, -6, 6, -4, 4, -2, 0]
export const SHAKE = { duration: 0.4, ease: 'easeInOut' } as const
