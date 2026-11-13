import type { ComponentProps, ReactNode } from 'react'

import type { CHAPTER_COLORS } from './chapter-player.constants'

export type ChapterPlayerColor = (typeof CHAPTER_COLORS)[number]

/** `buttons`: a row of chapter buttons. `stepper`: a progress stepper with the chapter titles. */
export type ChapterPlayerNavigation = 'buttons' | 'stepper'

export type Chapter = {
  /** Chapter name, e.g. `Typography`. */
  label: string
  /** Second the chapter starts at. Chapters are sorted by this. */
  start: number
  /** What the stage shows for this chapter when there are no `children` and no `src`. */
  content?: ReactNode
}

/** What the stage knows, for a `children` render function. */
export type ChapterStageState = {
  /** Index of the current chapter. */
  index: number
  chapter: Chapter
  playing: boolean
  /** Jump to a second; the chapters and scrubber follow. */
  seek: (time: number) => void
}

export type ChapterPlayerProps = Omit<ComponentProps<'div'>, 'children' | 'color'> & {
  chapters: Chapter[]
  /** Total length in seconds. With `src` the video's own length is used once it loads. */
  duration?: number
  /**
   * Anything to render on the stage — slides, HTML, a canvas, your own video. A function gets the
   * current chapter. Takes priority over `src` and over each chapter's `content`.
   */
  children?: ReactNode | ((stage: ChapterStageState) => ReactNode)
  /** A video to play on the stage when there are no `children`. Without either, the stage cross-fades each chapter's `content`. */
  src?: string
  poster?: string
  /** Starts playing on mount, unless the viewer prefers reduced motion. @default true */
  autoPlay?: boolean
  /** Starts over at the end instead of stopping. @default true */
  loop?: boolean
  /** How the chapters are listed under the stage. @default 'buttons' */
  navigation?: ChapterPlayerNavigation
  /** Tapping the stage pauses and resumes. Turn off when the stage holds links or controls. @default true */
  tapToPause?: boolean
  /** Theme accent for the current chapter and the progress bars; `neutral` keeps the default foreground. @default 'neutral' */
  color?: ChapterPlayerColor
  /** Accessible name for the player. @default 'Chapter player' */
  label?: string
  onChapterChange?: (index: number) => void
}
