import type { MotionValue } from 'motion/react'
import type { ComponentProps, MutableRefObject, ReactNode } from 'react'

/** Imperative open/close for a lightbox rendered elsewhere in the tree. */
export type LightboxHandle = {
  open: (index?: number) => void
  close: () => void
  /** Used by `<Lightbox handle>`; not part of the public surface. */
  bind: (controller: LightboxHandleController) => () => void
}

export type LightboxHandleController = {
  open: (index: number) => void
  close: () => void
}

export type LightboxProps = {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  index?: number
  defaultIndex?: number
  onIndexChange?: (index: number) => void
  handle?: LightboxHandle
  children?: ReactNode
}

export type LightboxTriggerProps = Omit<ComponentProps<'button'>, 'children'> & {
  /** Slide to open on. */
  index?: number
  /**
   * Pass `imageRef` to the thumbnail `<img>` so the lightbox can grow out of
   * (and shrink back into) it.
   */
  children?: ReactNode | ((state: { imageRef: (element: HTMLElement | null) => void }) => ReactNode)
}

export type LightboxZoomConfig = {
  minZoom: number
  maxZoom: number
  zoomStep: number
  scrollToZoom: boolean
  wheelSensitivity: number
}

export type LightboxZoomProps = ComponentProps<'div'> &
  Partial<LightboxZoomConfig>

export type LightboxMediaProps = ComponentProps<'div'> & {
  /** Intrinsic size; only the ratio matters. */
  width: number
  height: number
}

export type LightboxCounterProps = Omit<ComponentProps<'span'>, 'children'> & {
  children?: ReactNode | ((state: { current: number; total: number }) => ReactNode)
}

export type LightboxItemProps = ComponentProps<'div'> & {
  index: number
  caption?: string
}

export type LightboxThumbnailProps = ComponentProps<'button'> & {
  index: number
}

export type Point = { x: number; y: number }

export type ZoomBounds = {
  media: { width: number; height: number }
  container: { width: number; height: number }
}

export type LightboxZoomController = {
  scale: MotionValue<number>
  x: MotionValue<number>
  y: MotionValue<number>
  configRef: MutableRefObject<LightboxZoomConfig>
  boundsRef: MutableRefObject<(() => ZoomBounds) | null>
  zoomed: boolean
  canZoomIn: boolean
  canZoomOut: boolean
  /** `point` is relative to the centre of the slide; omit to zoom on the centre. */
  zoomTo: (next: number, point?: Point, animated?: boolean) => void
  zoomBy: (factor: number, point?: Point) => void
  panBy: (dx: number, dy: number) => void
  panTo: (x: number, y: number) => void
  reset: (animated?: boolean) => void
}

export type LightboxSlidesMotion = {
  /** Resting position of the track for the current slide. */
  baseX: MotionValue<number>
  /** Live finger offset while swiping. */
  dragX: MotionValue<number>
  /** Live finger offset while pulling down to dismiss. */
  dragY: MotionValue<number>
  stepRef: MutableRefObject<number>
  /** Slide the track last moved (or is moving) towards. */
  targetRef: MutableRefObject<number>
  glideTo: (index: number, velocity?: number) => void
  /** Releases a swipe: settles on `target` carrying the finger's velocity. */
  settle: (target: number, velocity: number) => void
}

export type LightboxMediaEntry = { zoom: HTMLElement; media: HTMLElement }

export type LightboxContextValue = {
  open: boolean
  /** True one frame after mount, so CSS transitions have a start state. */
  shown: boolean
  index: number
  total: number
  captions: Record<number, string | undefined>
  pulling: boolean
  setPulling: (pulling: boolean) => void
  openAt: (index: number) => void
  close: () => void
  goTo: (index: number) => void
  next: () => void
  previous: () => void
  registerItem: (index: number, caption: string | undefined) => () => void
  thumbs: MutableRefObject<Map<number, HTMLElement>>
  triggers: MutableRefObject<Map<number, HTMLElement>>
  media: MutableRefObject<Map<number, LightboxMediaEntry>>
  /** True when the click that follows the current pointer should not dismiss. */
  draggedRef: MutableRefObject<boolean>
  indexRef: MutableRefObject<number>
  /** Content calls this on mount; returns its cleanup. */
  registerContent: () => () => void
  zoom: LightboxZoomController
  slides: LightboxSlidesMotion
}
