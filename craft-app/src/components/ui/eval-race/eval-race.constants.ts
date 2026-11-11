// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
/** Height of one standings row, in px; rows are positioned absolutely. */
const ROW = 40

/** Bounce-free spring that re-orders the standings rows. */
const spring = { type: 'spring', duration: 0.3, bounce: 0 } as const

/** Strong ease-out for the lap bars, as a CSS curve. */
const CSS_EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

// Narrow cards fold the lap bars under the model name.
const COLS = {
  race: 'grid-cols-[1.5rem_minmax(0,1fr)_3.5rem_3.25rem] @sm:grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,1fr)_3.75rem_3.5rem]',
  standings:
    'grid-cols-[1.5rem_minmax(0,1fr)_3.5rem_3.25rem] @md:grid-cols-[1.75rem_minmax(0,1fr)_minmax(0,0.9fr)_3.75rem_3.5rem_3.5rem]',
}
const WIDE = { race: 'hidden @sm:flex', standings: 'hidden @md:flex' }
const NARROW = { race: '@sm:hidden', standings: '@md:hidden' }

export { COLS, CSS_EASE_OUT, NARROW, ROW, WIDE, spring }
