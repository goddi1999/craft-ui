import type { ReactNode } from 'react'

export type SizePresets =
  | 'reset'
  | 'empty'
  | 'default'
  | 'compact'
  | 'compactLong'
  | 'large'
  | 'long'
  | 'minimalLeading'
  | 'minimalTrailing'
  | 'compactMedium'
  | 'medium'
  | 'tall'
  | 'ultra'
  | 'massive'

export type IslandSize = { width: number; height: number; borderRadius: number }

export type ScheduledAnimation = { size: SizePresets; delay: number }

export type DynamicIslandState = {
  size: SizePresets
  previousSize: SizePresets | undefined
  animationQueue: ScheduledAnimation[]
  isAnimating: boolean
}

export type DynamicIslandContextValue = {
  state: DynamicIslandState
  setSize: (size: SizePresets) => void
  scheduleAnimation: (animations: ScheduledAnimation[]) => void
  presets: Record<SizePresets, IslandSize>
}

export type DynamicIslandProviderProps = {
  children: ReactNode
  initialSize?: SizePresets
  initialAnimation?: ScheduledAnimation[]
}

export type DynamicIslandProps = {
  id?: string
  className?: string
  children: ReactNode
}

export type DynamicPartProps = {
  className?: string
  children?: ReactNode
}
