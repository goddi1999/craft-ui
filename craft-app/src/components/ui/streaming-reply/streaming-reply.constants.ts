// stream.js meS / aiS: each bubble rising in, one small overshoot
export const ENTER_SPRING = { type: 'spring', stiffness: 300, damping: 22, mass: 1 } as const
// stream.js W / Hh: the reply bubble opening wide and growing a line at a time
export const SIZE_SPRING = { type: 'spring', stiffness: 260, damping: 26, mass: 1 } as const
// stream.js T: the "Thinking" label fading out
export const THINKING_SPRING = { type: 'spring', stiffness: 300, damping: 30, mass: 1 } as const
// stream.js word s: each word rising and sharpening
export const WORD_SPRING = { type: 'spring', stiffness: 340, damping: 26, mass: 1 } as const
// stream.js all: the whole thread fading before the next question
export const CLEAR_SPRING = { type: 'spring', stiffness: 260, damping: 30, mass: 1 } as const

export const QUESTION_MS = 150
export const REPLY_MS = 750
export const STREAM_MS = 2100
export const WORD_STEP_MS = 70
// after the last word starts: hold, then clear, then the next turn
export const HOLD_MS = 2800
export const NEXT_MS = 3400
export const SHIMMER_S = 1.4

// px; matches px-3.5 / py-[9px] and leading-[22px] on the bubbles
export const PAD_X = 14
export const PAD_Y = 9
export const LINE = 22
// the reply opens to this share of the thread's width
export const REPLY_WIDTH = 0.9

// px the bubbles rise, and the question's starting scale
export const RISE = 14
export const QUESTION_SCALE = 0.92
// px each word rises, and its starting blur
export const WORD_RISE = 6
export const WORD_BLUR = 4
// past this a word is sharp enough to drop the filter
export const SHARP = 0.98
