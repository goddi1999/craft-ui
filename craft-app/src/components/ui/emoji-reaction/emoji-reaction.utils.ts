import {
  BURST_COUNT,
  CLIMB_SPREAD,
  EDGE,
  GAP,
  LAUNCH_SPREAD,
  RISE,
} from './emoji-reaction.constants'
import type { EmojiReactionAlign, Particle, Placement } from './emoji-reaction.types'

const rand = (min: number, max: number) => min + Math.random() * (max - min)

export const toLabel = (name: string) => name.replaceAll('-', ' ')

export function getPlacement(
  trigger: DOMRect,
  width: number,
  height: number,
  align: EmojiReactionAlign,
): Placement {
  const anchored =
    align === 'left'
      ? trigger.left
      : align === 'right'
        ? trigger.right - width
        : trigger.left + trigger.width / 2 - width / 2

  const overhangLeft = EDGE - anchored
  const overhangRight = anchored + width - (window.innerWidth - EDGE)
  const shift = overhangLeft > 0 ? overhangLeft : overhangRight > 0 ? -overhangRight : 0

  return {
    side: trigger.top - height - GAP < EDGE ? 'bottom' : 'top',
    shift,
    // keeps the tail over the trigger whatever the alignment and shift are
    tailX: trigger.left + trigger.width / 2 - (anchored + shift),
  }
}

export function makeParticles(name: string, seed: number, from: DOMRect, bar: DOMRect): Particle[] {
  const originX = from.left + from.width / 2 - bar.left
  const originY = from.top + from.height / 2 - bar.top

  return Array.from({ length: BURST_COUNT }, (_, i) => {
    const lane = rand(-1, 1)
    const dir = lane < 0 ? -1 : 1
    return {
      id: seed + i,
      name,
      originX,
      originY,
      x: lane * LAUNCH_SPREAD,
      drift: lane * CLIMB_SPREAD,
      tilt: rand(1, 4) * dir,
      travel: RISE * rand(0.86, 1),
      scale: rand(0.78, 1.05),
      blurRatio: rand(0.18, 0.3),
      fadeAt: rand(0.55, 0.88),
      duration: rand(1.4, 1.8),
      delay: i * 0.25,
    }
  })
}
