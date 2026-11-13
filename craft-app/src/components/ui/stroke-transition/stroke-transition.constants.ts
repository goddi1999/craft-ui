// the stroke is drawn in a 16:10 box and stretched to the stage
export const VIEW_W = 1600
export const VIEW_H = 1000

// a spiral that enters off the top-left, rings the edges, curls into the middle and leaves
// bottom-right; at this width each ring overlaps the last so the stage is fully covered
export const STROKE_PATH =
  'M -260 140 C 300 -90 1380 -110 1560 260 C 1720 620 1380 1010 820 1000 C 180 1030 -110 840 70 470 C 190 150 760 120 1130 250 C 1470 380 1450 740 1060 800 C 700 860 380 760 420 560 C 460 360 900 360 1020 520 C 1150 700 1500 980 1900 1260'
export const STROKE_WIDTH = 450

// each half (cover, then reveal) — the reference takes ~0.85s per half
export const HALF_S = 0.85
// strong ease-in-out: the stroke is moving across the screen, not entering it
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const REDUCED_FADE_S = 0.2

export const DEFAULT_STROKE = 'text-[#C9AEFF]'
