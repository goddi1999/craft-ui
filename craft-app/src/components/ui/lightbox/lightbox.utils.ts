import { animate } from 'motion/react'

import type { LightboxHandle, LightboxHandleController, Point } from './lightbox.types'

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

const lerp = (from: number, to: number, progress: number) =>
  from + (to - from) * progress

/** Spring used by every settle: slide changes, zoom, and cancelled pulls. */
export const SETTLE_SPRING = { type: 'spring', stiffness: 300, damping: 34 } as const

/** Matches the open/close morph: a long ease-out, so the end is gentle. */
export const MORPH_DURATION = 0.36
const MORPH_EASE = [0.16, 1, 0.3, 1] as const

/** Swipe and pull thresholds (px, px/s). */
export const SWIPE_DISTANCE = 50
export const SWIPE_VELOCITY = 500
export const DISMISS_DISTANCE = 100
export const DISMISS_VELOCITY = 400
export const DRAG_THRESHOLD = 10
export const DOUBLE_TAP_DELAY = 300
export const DOUBLE_TAP_DISTANCE = 50
export const KEYBOARD_PAN = 50

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Past the first/last slide a swipe resists, like a rubber band. */
export const rubberBand = (offset: number, blocked: boolean) =>
  blocked ? offset * 0.3 : offset

export const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

/** Two frames: motion values flush their styles on the first. */
export const settleFrames = async () => {
  await nextFrame()
  await nextFrame()
}

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y)

export function createLightboxHandle(): LightboxHandle {
  let bound: LightboxHandleController | null = null
  return {
    open: (index = 0) => bound?.open(index),
    close: () => bound?.close(),
    bind: (controller) => {
      bound = controller
      return () => {
        if (bound === controller) bound = null
      }
    },
  }
}

export const isRenderable = (rect: DOMRect) =>
  rect.width > 0 &&
  rect.height > 0 &&
  rect.bottom > 0 &&
  rect.right > 0 &&
  rect.top < window.innerHeight &&
  rect.left < window.innerWidth

type MorphOptions = {
  media: HTMLElement
  thumb: HTMLElement
  /** `in` grows out of the thumbnail; `out` shrinks back into it. */
  direction: 'in' | 'out'
}

/**
 * Shared-image transition between a thumbnail and the open slide. The slide's
 * media is scaled to cover the thumbnail's box and clipped to its aspect, then
 * eased to its natural size, so a cropped `object-cover` thumbnail unfolds
 * into the uncropped photo without squashing it.
 */
export async function morphMedia({ media, thumb, direction }: MorphOptions) {
  const from = thumb.getBoundingClientRect()
  const to = media.getBoundingClientRect()
  if (!isRenderable(from) || to.width === 0 || to.height === 0) return false

  const coverScale = Math.max(from.width / to.width, from.height / to.height)
  const offsetX = from.left + from.width / 2 - (to.left + to.width / 2)
  const offsetY = from.top + from.height / 2 - (to.top + to.height / 2)
  const visibleWidth = from.width / coverScale
  const visibleHeight = from.height / coverScale
  const fromRadius = parseFloat(getComputedStyle(thumb).borderTopLeftRadius) || 0
  const toRadius = parseFloat(getComputedStyle(media).borderTopLeftRadius) || 0

  const thumbVisibility = thumb.style.visibility
  const placeholder = thumb instanceof HTMLImageElement ? thumb.currentSrc : ''

  const apply = (progress: number) => {
    const scale = lerp(coverScale, 1, progress)
    const clipX = (to.width - lerp(visibleWidth, to.width, progress)) / 2
    const clipY = (to.height - lerp(visibleHeight, to.height, progress)) / 2
    const radius = lerp(fromRadius / coverScale, toRadius, progress)
    media.style.transform = `translate(${offsetX * (1 - progress)}px, ${offsetY * (1 - progress)}px) scale(${scale})`
    media.style.clipPath = `inset(${clipY}px ${clipX}px round ${radius}px)`
  }

  // The full-size photo may still be loading; show the thumbnail underneath.
  if (placeholder) {
    media.style.backgroundImage = `url("${placeholder}")`
    media.style.backgroundSize = 'cover'
  }
  thumb.style.visibility = 'hidden'
  const [start, end] = direction === 'in' ? [0, 1] : [1, 0]
  apply(start)
  media.style.opacity = ''

  await animate(start, end, {
    duration: MORPH_DURATION,
    ease: MORPH_EASE,
    onUpdate: apply,
  })

  thumb.style.visibility = thumbVisibility
  media.style.transform = ''
  media.style.clipPath = ''
  // Closing: stay hidden until the lightbox unmounts, or the photo flashes at full size.
  if (direction === 'out') media.style.opacity = '0'
  media.style.backgroundImage = ''
  media.style.backgroundSize = ''
  return true
}

/** Fallback when there is no thumbnail to morph from or to. */
export async function fadeMedia(media: HTMLElement, direction: 'in' | 'out') {
  const [start, end] = direction === 'in' ? [0, 1] : [1, 0]
  media.style.opacity = String(start)
  await animate(start, end, {
    duration: MORPH_DURATION * 0.8,
    ease: 'easeOut',
    onUpdate: (value) => {
      media.style.opacity = String(value)
    },
  })
  if (direction === 'in') media.style.opacity = ''
}
