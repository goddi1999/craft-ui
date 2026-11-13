export const SCENE_FADE = { duration: 0.4, ease: [0.23, 1, 0.32, 1] } as const
export const PAUSE_FADE = { duration: 0.15 } as const

// a background tab can hand rAF a huge gap; never jump further than this in one frame
export const MAX_STEP = 0.1
// arrow keys on the scrubber, in seconds
export const KEY_STEP = 1
export const KEY_STEP_LARGE = 5
// px between ruler ticks
export const TICK_GAP = 7

// accents come from the theme: `data-accent` turns `--primary` into that colour, so the
// current chapter is a plain default Button; the stepper takes the same name as its colour
export const CHAPTER_COLORS = ['blue', 'violet', 'green', 'orange', 'neutral'] as const
export const STEPPER_COLORS = {
  blue: 'blue',
  violet: 'violet',
  green: 'green',
  orange: 'orange',
  neutral: 'default',
} as const
