/** On-screen morph — animate table ease-in-out (AOD `io4` / closest to `io2`). */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const EASE_OUT = [0.23, 1, 0.32, 1] as const

/** AOD scales the outgoing page to this, then the incoming page back from it. */
export const PAGE_SCALE = 0.8166

/** Scale-down duration in the source timeline (0.8s). Slide is 1.25× this. */
export const DEFAULT_DURATION = 0.8
export const REDUCED_FADE_S = 0.2
export const DEFAULT_BRAND = 'THE ART OF DOCUMENTARY'
export const STAGE = '#121212'

/** Progress 0…1 of the whole timeline (scale 0.8s + overlapping 1s slide). */
export const SCALE_OUT_END = 0.444
export const SLIDE_START = 0.178
export const SLIDE_END = 0.733
export const SCALE_IN_START = 0.567

/** Total run is ~2.25× the scale duration (0.8s → ~1.8s). */
export const TOTAL_RATIO = 2.25
