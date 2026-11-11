import type { ComponentProps, RefObject } from 'react'

export type AppleCarouselContextValue = {
  id: string
  index: number
  loop: boolean
  isPlaying: boolean
  prefersReducedMotion: boolean
  viewportRef: RefObject<HTMLDivElement | null>
  progressFillRef: RefObject<HTMLSpanElement | null>
  goTo: (index: number) => void
  play: () => void
  pause: () => void
}

export type AppleCarouselItemState = {
  /** Position of the item among the items passed to `AppleCarouselContent`. */
  index: number
  /** Whether the item is the one being shown. */
  isCurrent: boolean
  /** Whether this copy is a clone rendered to keep the loop seamless. */
  isClone: boolean
}

/** Position of a tab among the tabs passed to `AppleCarouselTabList`. */
export type AppleCarouselTabState = {
  index: number
  count: number
}

// `auto` holds back under reduced motion. Pressing play is an explicit opt-in,
// so `playing` ignores that preference and cards jump instead of sliding.
export type AppleCarouselPlayback = 'auto' | 'playing' | 'paused'

export type AppleCarouselRootProps = ComponentProps<'div'> & {
  /**
   * Time each card stays up during autoplay (ms).
   * @defaultValue 5000
   */
  duration?: number
  /**
   * Whether the last card wraps around to the first. Without it, autoplay
   * stops on the last card and Play starts over from the first.
   * @defaultValue true
   */
  loop?: boolean
  /**
   * Whether autoplay starts on its own. Read once on mount; the viewer's
   * play/pause button takes over after that. Remount (change `key`) to reset.
   * @default true
   */
  autoPlay?: boolean
}

export type AppleCarouselControlsProps = ComponentProps<'div'> & {
  /**
   * Size of the tab list and play button inside.
   * @defaultValue "default"
   */
  size?: 'default' | 'sm'
}
