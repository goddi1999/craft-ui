import type { ComponentProps } from 'react'

import type { BOT_COLORS, BOT_FACES, SHAPE_RECIPES } from './agent-computer-icon.constants'

export type BotShape = keyof typeof SHAPE_RECIPES
export type BotFace = keyof typeof BOT_FACES
export type BotColor = keyof typeof BOT_COLORS

/** The studio's Move states. `idle` is the resting bot; the others play once and settle back. */
export type BotMotion =
  | 'idle'
  | 'thinking'
  | 'wink'
  | 'wide'
  | 'alert'
  | 'notify'
  | 'exclaim'
  | 'sleep'
  | 'egg'
  | 'hexagon'
  | 'play'
  | 'orbit'
  | 'swirl'
  | 'burst'
  | 'comet'

export type Point = { x: number; y: number }

/** Where the face points, in degrees. Eyes sit on a sphere, so yaw and pitch slide them around it. */
export type Gaze = { yaw: number; pitch: number; roll: number }

/** One eye: a pill `w` wide and `h` tall (1 = the body radius), tilted in degrees, `open` from 0 to 1. */
export type BotEye = { w: number; h: number; tilt: number; open: number }

export type FacePose = { gaze: Gaze; split: number; eyes: readonly [BotEye, BotEye] }

/** How 64 radii around the centre are built. Circles are `[x, y, r]`, waves `[harmonic, amplitude, phase]`. */
export type ShapeRecipe =
  | { kind: 'circle' }
  | { kind: 'waves'; waves: readonly (readonly [number, number, number])[]; peak: number }
  | { kind: 'superellipse'; exponent: number; peak: number }
  | {
      kind: 'hull'
      from: readonly [number, number, number]
      to: readonly [number, number, number]
      peak?: number
    }
  | { kind: 'polygon'; sides: number; radius: number; corner: number; rotate: number }
  | { kind: 'circles'; circles: readonly (readonly [number, number, number])[]; peak: number }

/** The body outline: 64 radii, turned by `rot`, moved by `cx`/`cy` and stretched by `sx`/`sy`. */
export type Silhouette = {
  radii: readonly number[]
  rot: number
  cx: number
  cy: number
  sx: number
  sy: number
}

/** A ring drawn round the bot as an ellipse in perspective, stroked with a three-stop hue gradient. */
export type ArcSeed = {
  a: number
  k: number
  tilt: number
  speed: number
  phase: number
  sweep: number
  hue: number
  hueSpan: number
  width: number
  cx: number
  cy: number
}

export type PoseArc = { id: string; seed: ArcSeed; t: number; opacity: number }

/** A loose dot in body units: a circle, or the path `d` turned by `rot` degrees. `depth` fades it into the page. */
export type PoseDot = {
  x: number
  y: number
  r: number
  opacity: number
  d?: string
  rot?: number
  depth?: number
}

export type PoseNotif = { x: number; y: number; r: number; notch: number }

/** Everything a Move state decides about one moment. */
export type Pose = FacePose & {
  sil: Silhouette
  offX: number
  offY: number
  eyeAlpha: number
  bodyAlpha: number
  /** 1 while the body is the chosen shape, 0 while a state has replaced it; scales the status dot. */
  badge: number
  dots: PoseDot[]
  arcs: PoseArc[]
  notif: PoseNotif | null
  dotsBehind: boolean
}

export type MotionDef = {
  /** Seconds of one play-through. */
  duration: number
  /** Seconds before it may settle back, when longer than `duration`'s natural end. */
  minDuration?: number
  /** Seconds to ease in from the previous state. */
  morph: number
  /** The chosen shape stays the body. */
  baseBody: boolean
  /** The chosen face stays on. */
  baseFace: boolean
  /** It opens with a blink. */
  blinkIn: boolean
  pose: (t: number) => Pose
}

/** Where the eyes are looking instead of the face's own gaze; `mix` hands over from one to the other. */
export type Look = { yaw: number; pitch: number; mix: number; wander: number }

export type Morph<T> = { from: T; to: T; at: number; duration: number }

export type BotState = {
  shape: Morph<readonly number[]> & { key: BotShape; fromKey: BotShape }
  face: Morph<FacePose> & { key: BotFace; fromKey: BotFace }
  look: Morph<Look>
  motion: {
    current: BotMotion
    previous: BotMotion | null
    at: number
    previousAt: number
    /** The blended pose a state was interrupted at, eased out of instead of the previous state. */
    frozen: Pose | null
  }
  blinkAt: number
  /** Seconds added to the idle clock, so bots side by side do not blink in step. */
  phase: number
}

export type EyeFrame = { d: string; transform: string; opacity: number }

export type ArcFrame = {
  id: string
  front: string
  back: string
  width: number
  opacity: number
  gradient: { x1: number; y1: number; x2: number; y2: number; stops: readonly string[] }
}

export type DotFrame = { x: number; y: number; r: number; opacity: number; d?: string; rot?: number }

export type BotEffects = {
  arcs: ArcFrame[]
  dots: DotFrame[]
  dotsBehind: boolean
  notif: PoseNotif | null
}

export type BotFrame = {
  body: string
  bodyAlpha: number
  eyes: readonly (EyeFrame | null)[]
  /** The status dot's centre and how much of it shows. */
  badge: Point & { scale: number }
  effects: BotEffects
}

export type AgentComputerIconProps = Omit<ComponentProps<'svg'>, 'color' | 'children'> & {
  /** Body silhouette. Changing it morphs the outline. @default 'circle' */
  shape?: BotShape
  /** Expression. Changing it morphs the eyes. @default 'neutral' */
  face?: BotFace
  /** A palette colour or any CSS colour, as one flat fill. @default 'blue' */
  color?: BotColor | (string & {})
  /** Width and height in px. @default 48 */
  size?: number
  /** A green status dot at the bottom right, cut out of the body. @default false */
  online?: boolean
  /** Idle life: the gaze wanders, the body breathes, the eyes blink. @default true */
  animated?: boolean
  /** The eyes follow the pointer. @default false */
  lookAtCursor?: boolean
  /** A Move state to play. A new value plays once, then the bot settles back to idle. @default 'idle' */
  motion?: BotMotion
  /** Change it to play the same `motion` again. */
  motionKey?: string | number
  /** Called when a Move state has played and the bot is idle again. */
  onMotionEnd?: (motion: BotMotion) => void
  /** One still frame: no idle life, instant changes, and `motion` held at its most telling pose. Good for thumbnails. @default false */
  paused?: boolean
  /** Accessible name. Without it the bot is decorative and hidden from screen readers. */
  label?: string
}
