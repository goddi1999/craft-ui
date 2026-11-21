export const DEFAULT_DURATION = 0.5
export const DEFAULT_BOUNCE = 0.2
export const DEFAULT_MAX_WIDTH = 320
export const DEFAULT_AVATAR_SIZE = 48

// the text leaves faster than it arrives, so the new message is never fighting the old one
export const EXIT_RATIO = 0.4
export const TEXT_BLUR = 'blur(4px)'
export const TEXT_SHIFT = 6

// the bubble is drawn at this size until the first measurement lands
export const FALLBACK_SIZE = { width: 0, height: 0 }

// pinned to the bottom and exactly one text line tall (py-4 + text-xl at 1.05 = 53px),
// so it lines up with a one-line bubble and stays at the last line when the text wraps
export const STEPPER = 'flex h-[53px] shrink-0 flex-col justify-between self-end'

export const STEP_BUTTON =
  'grid size-6 place-items-center rounded-full text-muted-foreground outline-none transition-[background-color,color,transform] duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.94] disabled:pointer-events-none disabled:opacity-35 motion-reduce:active:scale-100'
