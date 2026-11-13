// measured off the reference: the dissolve crosses the text in ~0.35s and the grain is gone ~0.2s later
export const SWEEP_MS = 360
export const LIFE_MS = 380
// with reduced motion the text just fades out, no grain
export const FADE_MS = 160

// a pixel counts as ink above this alpha (0-255)
export const INK_ALPHA = 90
// grain drift in css px per 60fps frame
export const DRIFT_X: readonly [number, number] = [-0.15, 0.55]
export const DRIFT_Y = 0.55
export const JITTER = 0.6
// the sweep starts a little past the last glyph so the first one dissolves too
export const SWEEP_PAD = 12
