import type {
  BotColor,
  BotEye,
  BotFace,
  BotMotion,
  BotShape,
  FacePose,
  Look,
  ShapeRecipe,
} from './agent-computer-icon.types'

// the grokbots.ai studio palette first, then twelve more in the same flat, soft-saturated style
export const BOT_COLORS = {
  ink: '#0a0a0c',
  brown: '#8b5e3c',
  red: '#e8483f',
  orange: '#f08a24',
  amber: '#f0b429',
  green: '#3ecf8e',
  turquoise: '#2fbfa0',
  blue: '#3b93f0',
  purple: '#8b5cf6',
  pink: '#e152b0',
  grey: '#a3a3a3',
  cream: '#f1efe9',
  coral: '#f47560',
  rose: '#ec4f7a',
  orchid: '#c25ed8',
  indigo: '#5a5cf0',
  navy: '#27408b',
  cyan: '#1fb5d4',
  lime: '#9ccc3c',
  moss: '#6b8e3a',
  pine: '#2f7d5b',
  plum: '#7c3a73',
  slate: '#5d6b7e',
  sand: '#d6b88a',
} as const

// every body is 64 radii around its centre, 1 being the circle
export const SHAPE_RECIPES = {
  circle: { kind: 'circle' },
  pebble: {
    kind: 'waves',
    waves: [
      [2, 0.075, 0.5],
      [3, 0.035, 2.1],
    ],
    peak: 1.02,
  },
  squircle: { kind: 'superellipse', exponent: 4.2, peak: 1.15 },
  capsule: { kind: 'hull', from: [-0.42, 0, 0.62], to: [0.42, 0, 0.62] },
  triangle: { kind: 'polygon', sides: 3, radius: 1.12, corner: 0.34, rotate: -90 },
  hexagon: { kind: 'polygon', sides: 6, radius: 1.04, corner: 0.26, rotate: 0 },
  cloud: {
    kind: 'circles',
    circles: [
      [-0.44, 0.2, 0.54],
      [0.46, 0.2, 0.5],
      [0.02, 0.3, 0.6],
      [-0.24, -0.3, 0.48],
      [0.3, -0.24, 0.44],
    ],
    peak: 1.02,
  },
  droplet: { kind: 'hull', from: [0, 0.28, 0.66], to: [0, -0.96, 0.05], peak: 1.04 },
} as const satisfies Record<string, ShapeRecipe>

const eye = (w: number, h: number, tilt = 0, open = 1): BotEye => ({ w, h, tilt, open })
// the right eye mirrors the left one's tilt
const pair = (w: number, h: number, tilt = 0, open = 1) =>
  [eye(w, h, tilt, open), eye(w, h, -tilt, open)] as const

export const BOT_FACES = {
  neutral: { gaze: { yaw: 28.49, pitch: 28.62, roll: -13 }, split: 15.46, eyes: pair(0.186, 0.412) },
  attentive: { gaze: { yaw: 4, pitch: 5, roll: -4 }, split: 16, eyes: pair(0.21, 0.44) },
  surprised: { gaze: { yaw: 3, pitch: -3, roll: 0 }, split: 19, eyes: pair(0.45, 0.47) },
  excited: { gaze: { yaw: 6, pitch: -14, roll: 0 }, split: 19.5, eyes: pair(0.4, 0.56, -10) },
  happy: { gaze: { yaw: 5, pitch: 9, roll: 0 }, split: 17, eyes: pair(0.27, 0.17, 14) },
  laughing: { gaze: { yaw: 4, pitch: 14, roll: 0 }, split: 18, eyes: pair(0.34, 0.13, 20) },
  angry: { gaze: { yaw: 3, pitch: 7, roll: 0 }, split: 17, eyes: pair(0.34, 0.15, 30) },
  sad: { gaze: { yaw: 3, pitch: -13, roll: 0 }, split: 16, eyes: pair(0.22, 0.4, -28) },
  scared: { gaze: { yaw: 2, pitch: -20, roll: 0 }, split: 20.5, eyes: pair(0.4, 0.6) },
  suspicious: {
    gaze: { yaw: 12, pitch: 6, roll: -6 },
    split: 16,
    eyes: [eye(0.21, 0.4), eye(0.22, 0.15)],
  },
  confused: {
    gaze: { yaw: -14, pitch: 3, roll: 8 },
    split: 16.5,
    eyes: [eye(0.2, 0.44, -18), eye(0.28, 0.17, 14)],
  },
  curious: {
    gaze: { yaw: 16, pitch: -9, roll: -15 },
    split: 16.5,
    eyes: [eye(0.24, 0.46, -8), eye(0.2, 0.38, -8)],
  },
  proud: { gaze: { yaw: 5, pitch: 17, roll: 0 }, split: 17, eyes: pair(0.3, 0.15, 18) },
  shy: { gaze: { yaw: -19, pitch: -14, roll: -7 }, split: 14, eyes: pair(0.17, 0.3) },
  unimpressed: { gaze: { yaw: -22, pitch: 2, roll: 0 }, split: 16, eyes: pair(0.3, 0.12) },
  sleepy: { gaze: { yaw: 6, pitch: -9, roll: -3 }, split: 16, eyes: pair(0.2, 0.42, 0, 0.42) },
} satisfies Record<string, FacePose>

export const BOT_SHAPES = Object.keys(SHAPE_RECIPES) as BotShape[]
export const BOT_FACE_NAMES = Object.keys(BOT_FACES) as BotFace[]
export const BOT_COLOR_NAMES = Object.keys(BOT_COLORS) as BotColor[]
export const BOT_MOTIONS: readonly BotMotion[] = [
  'idle',
  'thinking',
  'wink',
  'wide',
  'alert',
  'notify',
  'exclaim',
  'sleep',
  'egg',
  'hexagon',
  'play',
  'orbit',
  'swirl',
  'burst',
  'comet',
]

// body radius 1 in viewBox units; the viewBox runs -VIEW..VIEW so the squircle's 1.15 corners fit
export const SCALE = 100
export const VIEW = 120
export const RADII = 64

// the idle clock starts here, so the first frame is mid-wander rather than dead centre
export const START_TIME = 0.35
// seconds for a shape or face change, easeOutQuint from wherever it was
export const MORPH = 0.45
// seconds for each step of the gaze towards the cursor
export const LOOK_MORPH = 0.24
// seconds for the gaze to hand over from the face to the cursor
export const FOLLOW_RAMP = 0.85
// degrees of yaw and pitch at half a viewport away
export const LOOK_YAW = 16
export const LOOK_PITCH = 13
export const REST_LOOK: Look = { yaw: 0, pitch: 0, mix: 0, wander: 1 }

// a dropped frame never jumps the clock more than this
export const MAX_STEP = 0.05
// when nothing is morphing, blinking or being pointed at, ~20fps is plenty for the drift
export const IDLE_FRAME_MS = 48
export const POINTER_BUSY_MS = 600

// idle wander: [amplitude, period in s, phase] per wave, summed
export const WANDER = {
  yaw: [
    [5.5, 11.3, 0.4],
    [1.6, 3.7, 2.1],
  ],
  pitch: [
    [4.2, 9.1, 1.3],
    [1.3, 4.3, 0.7],
  ],
  roll: [[2.2, 13.7, 3.2]],
  driftX: [0.006, 7.9, 1.9],
  driftY: [0.007, 5.3, 0.3],
  breath: [0.005, 3.4],
} as const

// blinks land 1.9–4.6s apart, 18% of them doubled 0.24s later; the schedule repeats every 900s
export const BLINK = { seed: 24301, first: 1.4, gap: 1.9, spread: 2.7, double: 0.18, doubleGap: 0.24 }
export const BLINK_LOOP = 900
export const BLINK_LENGTH = 0.18
// share of a blink spent closing; opening takes the rest
export const BLINK_CLOSE = 0.45
// a hover blink: closed at the midpoint, open again after 0.2s
export const HOVER_BLINK = 0.2
// a shut eye keeps a sliver so it never vanishes
export const EYE_MIN_OPEN = 0.06
// eyes fade as they turn towards the edge of the sphere, and drop out behind it
export const EYE_FADE_DEPTH = 0.12
export const EYE_HIDE_DEPTH = 0.02

// status dot at the lower right of the outline, with a ring cut out of the body around it
export const DOT = { angle: 42, distance: 1.003, radius: 0.15, gap: 0.054, color: '#34c759' }

/* Move states, from the grokbots.ai studio. */

// the "notify" badge: upper right, pops 14% past its size as it lands
export const NOTIFY = {
  angle: -42,
  distance: 1.003,
  radius: 0.15,
  gap: 0.054,
  pop: 1.14,
  color: '#2496e8',
}
// "thinking": the body shrinks into the middle of three typing dots
export const THINKING = { radius: 0.165, grow: 1.25, xs: [-0.557, -0.013, 0.532] as const, cycle: 1.5 }
// "comet": how small the body shrinks while the tails swing round
export const COMET_CORE = 0.129
// arc rings are ellipses drawn as 65-point polylines, split into the part in front and behind
export const ARC_POINTS = 64
// a Move state's thumbnail and its reduced-motion pose: its most telling moment, in seconds
export const MOTION_STILLS: Record<BotMotion, number> = {
  idle: 0,
  thinking: 0.75,
  wink: 0.8,
  wide: 0.8,
  alert: 2,
  notify: 0.9,
  exclaim: 1,
  sleep: 0.15,
  egg: 0.9,
  hexagon: 0.9,
  play: 0.9,
  orbit: 1.1,
  swirl: 0.55,
  burst: 0.5,
  comet: 1.1,
}

// radii the studio stores for poses that are not one of the eight shapes
export const POSE_RADII = {
  egg: [
    0.8369, 0.8424, 0.8497, 0.8585, 0.8674, 0.8775, 0.8878, 0.8983, 0.9089, 0.9185, 0.9288,
    0.9374, 0.9445, 0.9504, 0.9543, 0.9559, 0.9555, 0.9519, 0.9466, 0.9389, 0.9302, 0.9193,
    0.9085, 0.8969, 0.8852, 0.8734, 0.8625, 0.8513, 0.8411, 0.8325, 0.8243, 0.8179, 0.8137,
    0.8112, 0.8102, 0.8128, 0.8178, 0.8262, 0.8374, 0.8518, 0.8702, 0.8922, 0.9169, 0.9446,
    0.9741, 1.0023, 1.0267, 1.0433, 1.0481, 1.0393, 1.0216, 0.997, 0.9697, 0.9418, 0.9169,
    0.8949, 0.876, 0.8604, 0.849, 0.8394, 0.8337, 0.8314, 0.8305, 0.8326,
  ],
  hexagon: [
    0.921, 0.9282, 0.9441, 0.9706, 0.9984, 1.0059, 0.9896, 0.9562, 0.929, 0.9124, 0.9047, 0.9058,
    0.9157, 0.9349, 0.9642, 0.9873, 0.9882, 0.9665, 0.9336, 0.9105, 0.8968, 0.8918, 0.8955,
    0.908, 0.9293, 0.9611, 0.982, 0.9812, 0.959, 0.9282, 0.9089, 0.8978, 0.8964, 0.9026, 0.9189,
    0.9439, 0.9778, 0.999, 0.9964, 0.9713, 0.9439, 0.9274, 0.9196, 0.9206, 0.9308, 0.9502,
    0.9799, 1.0121, 1.0226, 1.0071, 0.9752, 0.951, 0.9366, 0.9316, 0.9351, 0.9485, 0.9711,
    1.0026, 1.0213, 1.0155, 0.9863, 0.9547, 0.9347, 0.9232,
  ],
  triangle: [
    0.7819, 0.8211, 0.8747, 0.944, 1.0223, 1.096, 1.1401, 1.134, 1.0808, 1.0047, 0.9265, 0.8603,
    0.8104, 0.773, 0.745, 0.7273, 0.7151, 0.7118, 0.7148, 0.7245, 0.7427, 0.768, 0.8037, 0.8518,
    0.9148, 0.9876, 1.0583, 1.1073, 1.1109, 1.0667, 0.994, 0.9164, 0.8482, 0.7948, 0.7555,
    0.7261, 0.7056, 0.6925, 0.6859, 0.6869, 0.6938, 0.7084, 0.7305, 0.7615, 0.804, 0.8595,
    0.9311, 1.0092, 1.0791, 1.1171, 1.1054, 1.0501, 0.9779, 0.905, 0.845, 0.799, 0.7656, 0.7413,
    0.7258, 0.716, 0.7146, 0.7204, 0.733, 0.7528,
  ],
} as const

// eye placement search: wiggle the gaze, then nudge the eyes until they clear the outline
export const FIT = {
  jitterYaw: 7.1,
  jitterPitch: 5.5,
  margin: 100 * Math.hypot(0.006, 0.007),
  minReach: 35,
  reach: 1.25,
  directions: 12,
  steps: 8,
  probes: [0.3, 0.6, 1],
}
