/**
 * The burst without the board: no image-pin imports, so other components (the
 * image-pin board) can pop a pin without pulling in `PinShatter` itself.
 */
export { usePinShatter } from './use-pin-shatter'
export { resolveCssColor } from './pin-shatter.utils'
export { SHATTER_FADE_COLOR } from './pin-shatter.constants'
