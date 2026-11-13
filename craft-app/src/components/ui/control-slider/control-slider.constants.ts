// the release: a quick spring with a little give, like the iOS tiles
export const SNAP_BACK = { type: 'spring', stiffness: 520, damping: 30, mass: 0.9 } as const
// fill eases on key presses and toggles; a drag moves it directly
export const FILL_MS = 200
export const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

// a press that moves less than this is a tap
export const TAP_SLOP = 4
// iOS rubber-band constant: lower feels stiffer
export const RUBBER = 0.55
// how much the tile narrows per px of stretch, each side
export const PINCH = 0.06
export const PAGE_STEP = 0.25

export const TRACK = 'bg-zinc-200 dark:bg-white/[0.14]'
// light mode mirrors the dark tile: a darker fill on a light track, so it reads on a white page
export const FILL = 'bg-zinc-400 dark:bg-white/[0.58]'
