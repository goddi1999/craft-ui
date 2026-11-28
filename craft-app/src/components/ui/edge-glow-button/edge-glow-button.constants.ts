/** Spring frequency in Hz: how quickly the light chases the pointer. */
export const SPRING_FREQUENCY = 3.4
/** Damping ratio below 1, so the light overshoots a little before it settles. */
export const SPRING_DAMPING = 0.78
/** Exponent on the edge glow: below 1 makes it brighten early as the light leaves centre. */
export const GLOW_RISE = 0.5
export const EDGE_SATURATION = 0.55
export const EDGE_BRIGHTNESS = 0.12
export const HUE_SHIFT_DEG = -5
/** How far past the button edge (px) the light may travel. */
export const EDGE_OVERSHOOT = 12
/** Longest frame step (s), so a background tab doesn't fling the light on return. */
export const MAX_FRAME_STEP = 0.032
/** Below these the spring counts as settled and the loop stops. */
export const REST_DISTANCE = 0.15
export const REST_VELOCITY = 0.6
