// strong ease-out; the reference settles in ~0.5s with most of the travel in the first half
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'
export const SLIDE_MS = 480
// letters of the toggle label swap in ~0.2s
export const MORPH = { duration: 0.22, ease: [0.23, 1, 0.32, 1] } as const

// column widths: the open list, and the closed column that only holds the toggle
export const OPEN_WIDTH = '13.5rem'
export const CLOSED_WIDTH = '8.5rem'

// a heading counts as current once it crosses the top 30% of the scroll area
export const SPY_MARGIN = '0px 0px -70% 0px'

// matches the @3xl container breakpoint closely enough for the first render
export const WIDE_QUERY = '(min-width: 48rem)'

export const DEFAULT_LABELS = { hide: 'Hide menu', show: 'Open menu' }
