import type { Transition } from 'motion/react'

import type {
  AvatarOrbitBubbleSide,
  AvatarOrbitBubbleTone,
  AvatarOrbitMember,
} from './avatar-orbit.types'

export type Placement = {
  /** Offset from the stage centre, as percentages of the stage width. */
  x: number
  y: number
  side: AvatarOrbitBubbleSide
}

/** Even spacing from `startAngle`, with per-member `angle` / `radius` winning. */
export function place(
  member: AvatarOrbitMember,
  index: number,
  count: number,
  radius: number,
  startAngle: number,
): Placement {
  const degrees = member.angle ?? startAngle + (360 / count) * index
  const distance = member.radius ?? radius
  const x = Math.cos((degrees * Math.PI) / 180) * distance
  const y = Math.sin((degrees * Math.PI) / 180) * distance
  return { x, y, side: member.bubbleSide ?? (x < 0 ? 'left' : 'right') }
}

export const BUBBLE_TONES: Record<AvatarOrbitBubbleTone, string> = {
  blue: '[--bubble-bg:var(--avatar-orbit-bubble,oklch(0.62_0.19_255))] [--bubble-fg:white]',
  neutral: '[--bubble-bg:var(--muted)] [--bubble-fg:var(--foreground)]',
  primary: '[--bubble-bg:var(--primary)] [--bubble-fg:var(--primary-foreground)]',
}

export const SPAWN_STAGGER = 0.06
export const BUBBLE_LAG = 0.3

export const spawnSpring: Transition = { type: 'spring', stiffness: 170, damping: 15 }
export const popSpring: Transition = { type: 'spring', stiffness: 420, damping: 16 }
export const hoverSpring: Transition = { type: 'spring', stiffness: 380, damping: 18 }

/** Desynced drift: each member gets its own period and reach. */
export function drift(index: number, spawnDelay: number): Transition {
  return {
    duration: 3.6 + (index % 4) * 0.7,
    delay: spawnDelay + 1,
    repeat: Infinity,
    ease: 'easeInOut',
  }
}
