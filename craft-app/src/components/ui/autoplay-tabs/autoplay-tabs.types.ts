import type { ComponentProps, RefObject } from 'react'

export type AutoplayTabsContextValue = {
  value: number
  isPlaying: boolean
  prefersReducedMotion: boolean
  progressFillRef: RefObject<HTMLSpanElement | null>
  select: (index: number) => void
  play: () => void
  pause: () => void
}

/** Position of a tab among the tabs passed to `AutoplayTabsList`. */
export type AutoplayTabsTabState = {
  index: number
  count: number
}

export type AutoplayTabsRootProps = Omit<ComponentProps<'div'>, 'onChange'> & {
  /** Number of tabs; autoplay advances through `0..count - 1`. */
  count: number
  /** Controlled active index. */
  value?: number
  /**
   * Initial active index when uncontrolled.
   * @defaultValue 0
   */
  defaultValue?: number
  /** Called whenever the active index changes, by click, key or autoplay. */
  onValueChange?: (value: number) => void
  /**
   * Time each tab stays active during autoplay (ms).
   * @defaultValue 5000
   */
  duration?: number
  /**
   * Whether the last tab wraps to the first. Without it, autoplay stops on
   * the last tab and Play starts over from the first.
   * @defaultValue true
   */
  loop?: boolean
  /**
   * Whether autoplay starts on its own. Read once on mount.
   * @defaultValue true
   */
  autoPlay?: boolean
  /**
   * Size of the tab list and play button.
   * @defaultValue "default"
   */
  size?: 'default' | 'sm'
}
