/** Rubber balls one pin pops into. */
export const BALL_COUNT = 14
/** Ball radius as a share of the pin radius, before the per-ball jitter. */
export const BALL_RADIUS_SHARE = 0.42
export const BALL_RADIUS_MIN = 4.5

/** Burst speed in px/s. */
export const BURST_SPEED_MIN = 140
export const BURST_SPEED_MAX = 340
/** Extra upward kick in px/s so the balls pop before they fall. */
export const BURST_LIFT_MIN = 130
export const BURST_LIFT_MAX = 220
/** Balls start this share of the pin radius out from its centre. */
export const BURST_START = 0.56

/** px/s²; tuned for balls a few px wide, not for real-world metres. */
export const GRAVITY = 760
/** Exponential speed loss per second. */
export const AIR_DRAG = 0.5
/** Bounciness of the floor and of ball against ball; walls give a touch less. */
export const RESTITUTION = 0.82
export const WALL_RESTITUTION = 0.78
/** Share of sideways speed that survives a floor hit. */
export const FLOOR_GRIP = 0.92
/** Below this impact speed (px/s) a ball stops bouncing and rolls. */
export const REST_SPEED = 28

/** Squash on impact: stretch along the contact axis, thin across it. */
export const SQUASH_FLOOR = 0.42
export const SQUASH_BALL = 0.24
export const SQUASH_SPEED_FLOOR = 950
export const SQUASH_SPEED_BALL = 1400
/** Per second; how fast a squashed ball springs back to round. */
export const SQUASH_RECOVERY = 16

/** A ball starts fading after this many bounces, or after two once it is nearly still. */
export const FADE_BOUNCES = 6
export const FADE_SETTLED_BOUNCES = 2
export const FADE_SETTLED_SPEED = 32
/** Seconds to fade out. */
export const FADE_S = 0.75
/** A ball that never settles still fades after this many seconds. */
export const MAX_LIFE_S = 5

/** Fixed physics step, so a slow frame never tunnels a ball through the floor. */
export const STEP_S = 1 / 120
export const MAX_FRAME_S = 0.05

/** Pin diameter used when the caller gives none. */
export const DEFAULT_PIN_SIZE = 36
/** On touch the pin rides above the finger so the learner can see where it lands. */
export const TOUCH_LIFT_PX = 36
