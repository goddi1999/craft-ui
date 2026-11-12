import {
  BOT_FACES,
  DOT,
  EYE_FADE_DEPTH,
  EYE_HIDE_DEPTH,
  EYE_MIN_OPEN,
  HOVER_BLINK,
  MORPH,
  REST_LOOK,
  SCALE,
} from './agent-computer-icon.constants'
import { BOT_MOTION_DEFS } from './agent-computer-icon.poses'
import type {
  BotFace,
  BotFrame,
  BotMotion,
  BotShape,
  BotState,
  EyeFrame,
  FacePose,
  Look,
  Morph,
  Point,
  Pose,
} from './agent-computer-icon.types'
import {
  clamp,
  easeOutQuint,
  eyeMatrix,
  idleMotion,
  lerp,
  outline,
  pillPath,
  projectEyes,
  radians,
  radiusAt,
  renderArc,
  round,
  SHAPE_RADII,
  smoothPath,
  solveOffset,
  TAU,
} from './agent-computer-icon.utils'

/* The bot's moving parts. Every change eases from wherever the bot is right now, so nothing jumps. */

const progress = (morph: Morph<unknown>, t: number) =>
  morph.duration <= 0 ? 1 : easeOutQuint(clamp((t - morph.at) / morph.duration))

const settled = <T>(to: T, at: number): Morph<T> => ({ from: to, to, at, duration: 0 })
const mixPoint = (a: Point, b: Point, k: number) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k) })

function mixFace<T extends FacePose>(from: T, to: T, k: number): FacePose {
  const eye = (side: 0 | 1) => ({
    w: lerp(from.eyes[side].w, to.eyes[side].w, k),
    h: lerp(from.eyes[side].h, to.eyes[side].h, k),
    tilt: lerp(from.eyes[side].tilt, to.eyes[side].tilt, k),
    open: lerp(from.eyes[side].open, to.eyes[side].open, k),
  })
  return {
    gaze: {
      yaw: lerp(from.gaze.yaw, to.gaze.yaw, k),
      pitch: lerp(from.gaze.pitch, to.gaze.pitch, k),
      roll: lerp(from.gaze.roll, to.gaze.roll, k),
    },
    split: lerp(from.split, to.split, k),
    eyes: [eye(0), eye(1)],
  }
}

/** Blend two poses: shapes and numbers ease across, extras crossfade, rotation takes the short way. */
function mixPose(from: Pose, to: Pose, k: number): Pose {
  let spin = to.sil.rot - from.sil.rot
  while (spin > Math.PI) spin -= TAU
  while (spin < -Math.PI) spin += TAU
  return {
    ...mixFace(from, to, k),
    sil: {
      radii: to.sil.radii.map((radius, index) => lerp(from.sil.radii[index] ?? 1, radius, k)),
      rot: from.sil.rot + spin * k,
      cx: lerp(from.sil.cx, to.sil.cx, k),
      cy: lerp(from.sil.cy, to.sil.cy, k),
      sx: lerp(from.sil.sx, to.sil.sx, k),
      sy: lerp(from.sil.sy, to.sil.sy, k),
    },
    offX: lerp(from.offX, to.offX, k),
    offY: lerp(from.offY, to.offY, k),
    eyeAlpha: lerp(from.eyeAlpha, to.eyeAlpha, k),
    bodyAlpha: lerp(from.bodyAlpha, to.bodyAlpha, k),
    badge: lerp(from.badge, to.badge, k),
    dots: [
      ...from.dots.map((dot) => ({ ...dot, opacity: dot.opacity * (1 - k) })),
      ...to.dots.map((dot) => ({ ...dot, opacity: dot.opacity * k })),
    ],
    arcs: [
      ...from.arcs.map((arc) => ({ ...arc, id: `a${arc.id}`, opacity: arc.opacity * (1 - k) })),
      ...to.arcs.map((arc) => ({ ...arc, id: `b${arc.id}`, opacity: arc.opacity * k })),
    ],
    notif: k < 0.5 ? from.notif : to.notif,
    dotsBehind: k < 0.5 ? from.dotsBehind : to.dotsBehind,
  }
}

/* Eye offsets: solved once per shape and face (or per shape and Move state) and cached. */

const offsets = new Map<string, Point>()
const ORIGIN = { x: 0, y: 0 }

function offsetFor(shape: BotShape, face: BotFace, motion: BotMotion) {
  const def = BOT_MOTION_DEFS[motion]
  if (!def.baseBody) return ORIGIN
  const key = def.baseFace ? `${shape}|${face}` : `${shape}|${motion}`
  let offset = offsets.get(key)
  if (!offset) {
    offset = solveOffset(SHAPE_RADII[shape], def.baseFace ? BOT_FACES[face] : def.pose(0))
    offsets.set(key, offset)
  }
  return offset
}

/** The eye offset for a state, eased across a shape or face change the way the outline is. */
function offsetAt(state: BotState, t: number, motion: BotMotion) {
  const faceK = progress(state.face, t)
  const forShape = (shape: BotShape) =>
    mixPoint(offsetFor(shape, state.face.fromKey, motion), offsetFor(shape, state.face.key, motion), faceK)
  return mixPoint(forShape(state.shape.fromKey), forShape(state.shape.key), progress(state.shape, t))
}

function radiiAt(state: BotState, t: number) {
  const { from, to } = state.shape
  const k = progress(state.shape, t)
  return k >= 1 ? to : to.map((radius, index) => lerp(from[index] ?? radius, radius, k))
}

function faceAt(state: BotState, t: number): FacePose {
  const k = progress(state.face, t)
  return k >= 1 ? state.face.to : mixFace(state.face.from, state.face.to, k)
}

export function lookAt(state: BotState, t: number): Look {
  const { from, to } = state.look
  const k = progress(state.look, t)
  return {
    yaw: lerp(from.yaw, to.yaw, k),
    pitch: lerp(from.pitch, to.pitch, k),
    mix: lerp(from.mix, to.mix, k),
    wander: lerp(from.wander, to.wander, k),
  }
}

/** A state's pose, with the chosen shape and face put back where the state keeps them. */
function posed(motion: BotMotion, local: number, radii: readonly number[], face: FacePose): Pose {
  const def = BOT_MOTION_DEFS[motion]
  let pose = def.pose(Math.max(0, local))
  if (def.baseBody) pose = { ...pose, sil: { ...pose.sil, radii } }
  else pose = { ...pose, badge: 0 }
  if (def.baseFace) pose = { ...pose, gaze: face.gaze, split: face.split, eyes: face.eyes }
  return pose
}

/** The pose the bot is easing in from, while a new state is still morphing in. */
function origin(state: BotState, t: number, radii: readonly number[], face: FacePose) {
  const { frozen, previous, previousAt } = state.motion
  if (frozen) return frozen
  return previous ? posed(previous, t - previousAt, radii, face) : null
}

function composed(state: BotState, t: number, radii: readonly number[], face: FacePose) {
  const { current, at } = state.motion
  const def = BOT_MOTION_DEFS[current]
  let pose = posed(current, t - at, radii, face)
  let offset = offsetAt(state, t, current)
  if (t - at < def.morph) {
    const from = origin(state, t, radii, face)
    if (from) {
      const k = easeOutQuint(clamp((t - at) / def.morph))
      pose = mixPose(from, pose, k)
      if (state.motion.previous) offset = mixPoint(offsetAt(state, t, state.motion.previous), offset, k)
    }
  }
  return { pose, offset }
}

export function createBotState(
  shape: BotShape,
  face: BotFace,
  t: number,
  phase: number,
  motion: BotMotion = 'idle',
): BotState {
  return {
    shape: { ...settled(SHAPE_RADII[shape], t), key: shape, fromKey: shape },
    face: { ...settled<FacePose>(BOT_FACES[face], t), key: face, fromKey: face },
    look: settled(REST_LOOK, t),
    motion: { current: motion, previous: null, at: t, previousAt: t, frozen: null },
    blinkAt: -Infinity,
    phase,
  }
}

export function setShape(state: BotState, shape: BotShape, t: number, duration = MORPH) {
  if (shape === state.shape.key) return
  const from = radiiAt(state, t)
  state.shape = { from, to: SHAPE_RADII[shape], at: t, duration, key: shape, fromKey: state.shape.key }
}

export function setFace(state: BotState, face: BotFace, t: number, duration = MORPH) {
  if (face === state.face.key) return
  const from = faceAt(state, t)
  state.face = { from, to: BOT_FACES[face], at: t, duration, key: face, fromKey: state.face.key }
}

export function setLook(state: BotState, look: Look | null, t: number, duration: number) {
  state.look = { from: lookAt(state, t), to: look ?? REST_LOOK, at: t, duration }
}

/** Start a Move state. `instant` skips the ease in, for reduced motion and still frames. */
export function setMotion(state: BotState, motion: BotMotion, t: number, instant = false) {
  const { current, at } = state.motion
  if (instant) {
    state.motion = { current: motion, previous: null, at: t, previousAt: t, frozen: null }
    return
  }
  // switching mid-morph eases out of the blend on screen, not the state it was leaving
  const midMorph = state.motion.previous !== null && t - at < BOT_MOTION_DEFS[current].morph
  const frozen = midMorph ? composed(state, t, radiiAt(state, t), faceAt(state, t)).pose : null
  state.motion = { current: motion, previous: current, at: t, previousAt: at, frozen }
  if (BOT_MOTION_DEFS[motion].blinkIn) state.blinkAt = t
}

/** True while the outline, eyes or state are still easing towards their targets. */
export const isMorphing = (state: BotState, t: number) =>
  progress(state.shape, t) < 1 ||
  progress(state.face, t) < 1 ||
  t - state.motion.at < BOT_MOTION_DEFS[state.motion.current].morph

export const isLooking = (state: BotState, t: number) => progress(state.look, t) < 1

/** Everything one frame needs: the body path, both eyes, the status dot and any Move extras. */
export function sampleBot(state: BotState, t: number, idle: boolean): BotFrame {
  const radii = radiiAt(state, t)
  const face = faceAt(state, t)
  const { pose, offset } = composed(state, t, radii, face)
  const look = lookAt(state, t)
  const eyesOn = pose.eyeAlpha > 0.01
  const life = idleMotion(t + state.phase, {
    wander: idle && eyesOn ? look.wander : 0,
    blink: idle && eyesOn,
    float: idle,
  })

  const gaze = {
    yaw: lerp(pose.gaze.yaw, look.yaw, look.mix) + life.yaw,
    pitch: lerp(pose.gaze.pitch, look.pitch, look.mix) + life.pitch,
    roll: pose.gaze.roll + life.roll,
  }
  const hover = clamp((t - state.blinkAt) / HOVER_BLINK)
  const lid = Math.min(life.lid, hover < 1 ? Math.abs(2 * hover - 1) : 1)
  const shiftX = pose.offX + life.driftX
  const shiftY = pose.offY + life.driftY
  const sil = { ...pose.sil, cx: pose.sil.cx + shiftX, cy: pose.sil.cy + shiftY, sy: pose.sil.sy * life.breath }
  const edge = (x: number, y: number) => radiusAt(pose.sil.radii, Math.atan2(y, x) - pose.sil.rot)

  const eyes = eyesOn
    ? projectEyes(gaze, pose.split).map((p, side): EyeFrame | null => {
        if (p.depth <= EYE_HIDE_DEPTH) return null
        const eye = pose.eyes[side]
        const k = edge(p.x, p.y)
        const [a, b, c, d] = eyeMatrix(p, eye.tilt)
        const open = EYE_MIN_OPEN + (1 - EYE_MIN_OPEN) * clamp(Math.min(lid, eye.open))
        return {
          d: pillPath(eye.w * SCALE, eye.h * SCALE),
          transform: `matrix(${round(a)},${round(b * open)},${round(c)},${round(d * open)},${round(p.x * k + (shiftX + offset.x) * SCALE)},${round(p.y * k + (shiftY + offset.y) * SCALE)})`,
          opacity: round(pose.eyeAlpha * clamp(p.depth / EYE_FADE_DEPTH)),
        }
      })
    : [null, null]

  const badgeAngle = radians(DOT.angle)
  const badgeEdge = edge(Math.cos(badgeAngle), Math.sin(badgeAngle)) * DOT.distance
  const notifEdge = pose.notif ? edge(pose.notif.x, pose.notif.y) : 1

  return {
    body: smoothPath(outline(sil)),
    bodyAlpha: round(pose.bodyAlpha),
    eyes,
    badge: {
      x: round((Math.cos(badgeAngle) * badgeEdge + pose.sil.cx + shiftX) * SCALE),
      y: round((Math.sin(badgeAngle) * badgeEdge + pose.sil.cy + shiftY) * SCALE),
      scale: round(pose.badge),
    },
    effects: {
      arcs: pose.arcs
        .filter((arc) => arc.opacity > 0.01)
        .map((arc) => renderArc(arc.seed, arc.t, arc.id, arc.opacity)),
      dots: pose.dots
        .filter((dot) => dot.opacity > 0.01 && dot.r > 5e-4)
        .map((dot) => ({
          x: round((dot.x + shiftX) * SCALE),
          y: round((dot.y + shiftY) * SCALE),
          r: round(dot.r * SCALE),
          // sparks far out sink into the page; the studio mixes them towards the background colour
          opacity: round(dot.opacity * (dot.depth ?? 1)),
          d: dot.d,
          rot: dot.rot,
        })),
      dotsBehind: pose.dotsBehind,
      notif: pose.notif
        ? {
            x: round((pose.notif.x * notifEdge + shiftX) * SCALE),
            y: round((pose.notif.y * notifEdge + shiftY) * SCALE),
            r: round(pose.notif.r * SCALE),
            notch: round(pose.notif.notch * SCALE),
          }
        : null,
    },
  }
}
