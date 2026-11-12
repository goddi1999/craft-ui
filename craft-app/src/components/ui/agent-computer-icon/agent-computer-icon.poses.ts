import { BOT_FACES, COMET_CORE, NOTIFY, POSE_RADII, THINKING } from './agent-computer-icon.constants'
import type {
  ArcSeed,
  BotEye,
  BotMotion,
  MotionDef,
  Pose,
  PoseDot,
} from './agent-computer-icon.types'
import {
  castRadii,
  clamp,
  easeInOutCubic,
  easeOutCubic,
  easeOutQuint,
  hull,
  polygonPath,
  radians,
  seeded,
  silhouette,
  TAU,
} from './agent-computer-icon.utils'

/* The studio's Move states. Each pose is a pure function of seconds since the state began. */

const { neutral } = BOT_FACES

const eyes = (w: number, h: number, open = 1): [BotEye, BotEye] => [
  { w, h, tilt: 0, open },
  { w, h, tilt: 0, open },
]

/** The resting pose: a unit circle with the neutral face, no extras. */
export const restPose = (overrides: Partial<Pose> = {}): Pose => ({
  sil: silhouette(1),
  offX: 0,
  offY: 0,
  gaze: { ...neutral.gaze },
  split: neutral.split,
  eyes: [...neutral.eyes],
  eyeAlpha: 1,
  bodyAlpha: 1,
  badge: 1,
  dots: [],
  arcs: [],
  notif: null,
  dotsBehind: false,
  ...overrides,
})

// orbit: six tilted rings that spin round the body
const orbitRandom = seeded(659918)
const ORBIT_RINGS: ArcSeed[] = Array.from({ length: 6 }, (_, index) => {
  const a = 1.3 + 0.1 * orbitRandom()
  const k = 0.05 + 0.4 * orbitRandom()
  const tilt = (index / 6) * Math.PI + 0.5 * orbitRandom()
  const speed = 3 + 0.7 * orbitRandom()
  const phase = orbitRandom() * TAU
  const sweep = 0.6 + 0.25 * orbitRandom()
  const start = (360 * index) / 6 + 30 * orbitRandom()
  return {
    a,
    k,
    tilt,
    speed,
    phase,
    sweep,
    hue: start,
    hueSpan: 60 + 60 * orbitRandom(),
    width: 0.05 + 0.012 * orbitRandom(),
    cx: 0,
    cy: 0.1,
  }
})

// play: four swooshes that slide past
const PLAY_SWOOSHES: ArcSeed[] = Array.from({ length: 4 }, (_, index) => ({
  a: 0.78 + 0.2 * index,
  k: 0.05 + 0.02 * index,
  tilt: -0.62 + 0.05 * index,
  speed: 0.3,
  phase: 0.06 * index,
  sweep: 0.4,
  hue: 95 + 62 * index,
  hueSpan: 100,
  width: 0.05,
  cx: 0,
  cy: -0.12,
}))

// burst: five sparks that spiral in
const burstRandom = seeded(48879)
const SPARKS = Array.from({ length: 5 }, (_, index) => ({
  birth: 0.2 * index,
  angle: burstRandom() * TAU,
  rho: 0.58 + 0.18 * burstRandom(),
}))

// comet: four fat tails that swing round together
const cometRandom = seeded(49383)
const COMET_TAILS: ArcSeed[] = Array.from({ length: 4 }, (_, index) => {
  const spread = index - 1.5
  const phase = -(0.045 * index) + 0.012 * cometRandom()
  return {
    a: 0.85 * (1 + 0.03 * spread),
    k: (0.15 / 0.85) * (1 + 0.16 * spread),
    tilt: radians(34) + 0.035 * spread,
    speed: 210 / 360,
    phase,
    sweep: 0.34,
    hue: 85 * index + 20 * cometRandom(),
    hueSpan: 80,
    width: 0.095,
    cx: 0,
    cy: 0,
  }
})

function sparks(t: number): PoseDot[] {
  const dots: PoseDot[] = []
  for (const spark of SPARKS) {
    const age = t - spark.birth
    if (age < 0 || age > 0.62) continue
    const distance = spark.rho * 0.75 ** (10 * age)
    const angle = spark.angle + radians(100 * age)
    dots.push({
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      r: 0.04 + 0.028 * clamp(age / 0.55),
      depth: clamp(1 - distance / 0.8),
      opacity: clamp(age / 0.06) * clamp((0.62 - age) / 0.08),
    })
  }
  return dots
}

// the triangle the play and orbit states spin, pivoting about its own centre
const spunTriangle = (angle: number) =>
  silhouette(POSE_RADII.triangle, { rot: angle, cx: -0.213 * Math.sin(angle), cy: 0.213 * Math.cos(angle) })

// thinking: 0 → 1 → 0 once every 1.5s, each dot half a beat behind the one before
const pulse = (t: number, index: number) => {
  const k = ((((t - 0.5 * index) / THINKING.cycle) % 1) + 1) % 1
  return clamp(2 * (k < 0.5 ? 0.5 - 0.5 * Math.cos(k * TAU) : 0))
}

const ALERT_BAR = castRadii(hull([0, -0.2535, 0.1345], [0, 0.2535, 0.1345]))
const ALERT_DOT = polygonPath(hull([0, 0, 0.118], [0, 0.172, 0.012]))
const ALERT_TILT = radians(17.7)
const EXCLAIM_BAR = castRadii(hull([0, -0.505, 0.132], [0, 0.13, 0.075]), 0, -0.1875)

export const BOT_MOTION_DEFS: Record<BotMotion, MotionDef> = {
  idle: {
    duration: 2.4,
    morph: 0.45,
    baseBody: true,
    baseFace: true,
    blinkIn: false,
    pose: () => restPose(),
  },
  thinking: {
    duration: 2.6,
    morph: 0.4,
    baseBody: false,
    baseFace: false,
    blinkIn: true,
    pose: (t) => {
      const spread = 0.3 + 0.7 * easeOutCubic(clamp(t / 0.3))
      return restPose({
        sil: silhouette(THINKING.radius * (1 + (THINKING.grow - 1) * pulse(t, 1)), {
          cx: THINKING.xs[1],
        }),
        eyeAlpha: 0,
        dots: [0, 2].map((index) => {
          const k = pulse(t, index)
          return {
            x: THINKING.xs[index] * spread,
            y: 0,
            r: THINKING.radius * (1 + (THINKING.grow - 1) * k),
            opacity: 0.55 + 0.45 * k,
          }
        }),
      })
    },
  },
  wink: {
    duration: 1.6,
    morph: 0.3,
    baseBody: true,
    baseFace: false,
    blinkIn: true,
    pose: () =>
      restPose({
        gaze: { yaw: -5.37, pitch: 4.55, roll: 6.7 },
        split: 16.25,
        eyes: [
          { w: 0.236, h: 0.464, tilt: 0, open: 1 },
          { w: 0.447, h: 0.089, tilt: 0, open: 1 },
        ],
      }),
  },
  wide: {
    duration: 1.8,
    morph: 0.55,
    baseBody: true,
    baseFace: false,
    blinkIn: true,
    pose: () =>
      restPose({ gaze: { yaw: 6.92, pitch: -21.96, roll: 11.6 }, split: 18.43, eyes: eyes(0.356, 0.875) }),
  },
  alert: {
    duration: 2.4,
    minDuration: 2,
    morph: 0.45,
    baseBody: false,
    baseFace: false,
    blinkIn: false,
    pose: (t) => {
      // slides in, then eases back to just right of centre
      const slide = 0.82 * easeInOutCubic(clamp(t / 1.5)) - 0.087
      const settle = t > 1.6 ? clamp((t - 1.6) / 0.4) : 0
      const x = slide * (1 - settle) + 0.1 * settle
      const bob = 0.005 * Math.sin(2.5 * t * TAU)
      return restPose({
        sil: silhouette(ALERT_BAR, { rot: ALERT_TILT, cx: x, cy: -0.325 - bob }),
        eyeAlpha: 0,
        dots: [
          {
            x: x - 0.58 * Math.sin(ALERT_TILT),
            y: -0.325 + 0.58 * Math.cos(ALERT_TILT) + 2.8 * bob,
            r: 0.118,
            d: ALERT_DOT,
            rot: (180 * ALERT_TILT) / Math.PI,
            opacity: 1,
          },
        ],
      })
    },
  },
  notify: {
    duration: 2.2,
    morph: 0.5,
    baseBody: true,
    baseFace: false,
    blinkIn: true,
    pose: (t) => {
      const k = clamp(t / 0.45)
      const pop = 1 + (NOTIFY.pop - 1) * Math.sin(k * Math.PI) * (1 - 0.35 * k)
      const r = NOTIFY.radius * (k < 1 ? pop : 1)
      const angle = radians(NOTIFY.angle)
      return restPose({
        gaze: { yaw: -21.94, pitch: -5.82, roll: -12.2 },
        split: 18.89,
        eyes: eyes(0.505, 0.498),
        notif: {
          x: Math.cos(angle) * NOTIFY.distance,
          y: Math.sin(angle) * NOTIFY.distance,
          r,
          notch: r + NOTIFY.gap,
        },
      })
    },
  },
  exclaim: {
    duration: 2,
    morph: 0.45,
    baseBody: false,
    baseFace: false,
    blinkIn: false,
    pose: () =>
      restPose({
        sil: silhouette(EXCLAIM_BAR, { cy: -0.1875 }),
        eyeAlpha: 0,
        dots: [{ x: -0.012, y: 0.526, r: 0.113, opacity: 1 }],
      }),
  },
  sleep: {
    duration: 2.4,
    morph: 0.5,
    baseBody: false,
    baseFace: false,
    blinkIn: false,
    pose: (t) =>
      restPose({ sil: silhouette(0.1585, { cy: 0.11 + 0.19 * Math.sin(t * (TAU / 0.6)) }), eyeAlpha: 0 }),
  },
  egg: {
    duration: 1.8,
    morph: 0.4,
    baseBody: false,
    baseFace: false,
    blinkIn: true,
    pose: () =>
      restPose({
        sil: silhouette(POSE_RADII.egg),
        gaze: { yaw: 19.97, pitch: 26.01, roll: -17.1 },
        split: 11.07,
        eyes: eyes(0.164, 0.385),
      }),
  },
  hexagon: {
    duration: 1.6,
    morph: 0.4,
    baseBody: false,
    baseFace: false,
    blinkIn: true,
    pose: () =>
      restPose({
        sil: silhouette(POSE_RADII.hexagon),
        gaze: { yaw: 23.11, pitch: 24.42, roll: -13.3 },
        split: 13.37,
        eyes: eyes(0.177, 0.411),
      }),
  },
  play: {
    duration: 2,
    morph: 0.5,
    baseBody: false,
    baseFace: false,
    blinkIn: true,
    pose: (t) => {
      const opacity = clamp(t / 0.35) * clamp((2.2 - t) / 0.5)
      return restPose({
        sil: spunTriangle(0),
        gaze: { yaw: 12, pitch: -8, roll: -6 },
        split: 15,
        eyes: eyes(0.18, 0.34),
        arcs: PLAY_SWOOSHES.map((seed, index) => ({
          id: `sw${index}`,
          seed: { ...seed, cx: 0.45 - 0.42 * t },
          t,
          opacity,
        })),
      })
    },
  },
  orbit: {
    duration: 3.4,
    minDuration: 2.5,
    morph: 0.6,
    baseBody: false,
    baseFace: false,
    blinkIn: false,
    pose: (t) => {
      // a triangle spins up, then rounds into a circle as the rings fly round it
      const spin = -(1.25 * TAU) * t * easeInOutCubic(clamp(t / 0.35))
      const round = easeInOutCubic(clamp((t - 1.6) / 0.9))
      const triangle = spunTriangle(spin)
      const rings = clamp(t / 0.8) * clamp((3.6 - t) / 0.9)
      return restPose({
        sil: silhouette(
          triangle.radii.map((radius) => radius + (1 - radius) * round),
          { rot: spin, cx: triangle.cx * (1 - round), cy: triangle.cy * (1 - round) },
        ),
        gaze: {
          yaw: neutral.gaze.yaw + 65 * Math.sin(6.5 * t) * (1 - round),
          pitch: -4 + 32 * round,
          roll: -13,
        },
        eyes: eyes(0.18, 0.34 + 0.07 * round),
        arcs: ORBIT_RINGS.map((seed, index) => ({
          id: `rg${index}`,
          seed,
          t,
          opacity: rings * clamp((t - 0.13 * index) / 0.3),
        })),
      })
    },
  },
  swirl: {
    duration: 1.3,
    minDuration: 1.3,
    morph: 0.3,
    baseBody: true,
    baseFace: true,
    blinkIn: true,
    pose: (t) =>
      restPose({
        arcs: ORBIT_RINGS.slice(0, 3).map((seed, index) => ({
          id: `sw${index}`,
          seed,
          t,
          opacity: clamp((t - 0.06 * index) / 0.14) * clamp((1.22 - t) / 0.34),
        })),
      }),
  },
  burst: {
    duration: 2.6,
    minDuration: 2.4,
    morph: 0.4,
    baseBody: false,
    baseFace: false,
    blinkIn: false,
    pose: (t) => {
      // the body collapses to a point, sparks spiral into it, then it springs back open
      const shrink = 1 - 0.834 * easeOutQuint(clamp(t / 0.7))
      const regrow = easeOutQuint(clamp((t - 1.7) / 0.7))
      return restPose({
        sil: silhouette(shrink + (1 - shrink) * regrow),
        eyeAlpha: clamp((t - 1.85) / 0.4),
        dots: sparks(t),
        dotsBehind: true,
      })
    },
  },
  comet: {
    duration: 2.4,
    minDuration: 2.4,
    morph: 0.45,
    baseBody: false,
    baseFace: false,
    blinkIn: false,
    pose: (t) => {
      const shrink = 1 - (1 - COMET_CORE) * easeOutQuint(clamp(t / 0.55))
      const regrow = easeOutQuint(clamp((t - 1.85) / 0.6))
      const tails = clamp((t - 0.15) / 0.25) * clamp((1.95 - t) / 0.3)
      return restPose({
        sil: silhouette(shrink + (1 - shrink) * regrow, {
          cy: 0.035 * Math.sin(clamp(t / 1.7) * Math.PI),
        }),
        eyeAlpha: clamp((t - 2) / 0.35),
        arcs: COMET_TAILS.map((seed, index) => ({ id: `cm${index}`, seed, t, opacity: tails })),
      })
    },
  },
}

const LONGEST_MORPH = Math.max(...Object.values(BOT_MOTION_DEFS).map((def) => def.morph))

/** Seconds a state plays before the bot settles back to idle. */
export const playLength = (motion: BotMotion) => {
  const def = BOT_MOTION_DEFS[motion]
  return Math.max(LONGEST_MORPH, def.minDuration ?? def.duration)
}
