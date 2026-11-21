import type { MotionValue } from 'motion/react'
import type { ReactNode } from 'react'

export type CultDockContextValue = {
  mouseX: MotionValue<number>
  baseSize: number
  magnify: number
  reduceMotion: boolean
  openIds: string[]
  toggle: (id: string) => void
}

export type CultDockProps = {
  /** Width of the card right under the pointer, in px. */
  magnify?: number
  className?: string
  children: ReactNode
}

export type CultDockCardProps = {
  /** Unique id; also links the icon and its open indicator for the layout animation. */
  id: string
  /** Accessible name for the card button. */
  label: string
  className?: string
  children: ReactNode
}

export type CultDockCardInnerProps = {
  id: string
  /** Image shown as the app icon, plus a blurred copy behind it. */
  src: string
  /** Shown in place of the icon while the card is open. */
  children?: ReactNode
}
