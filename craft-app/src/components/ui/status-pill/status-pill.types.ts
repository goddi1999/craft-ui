// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { LucideIcon } from 'lucide-react'

type StatusTone = 'neutral' | 'brand' | 'positive' | 'negative' | 'warning'

type StatusPillSize = 'sm' | 'md'

type StatusPillProps = React.ComponentProps<'span'> & {
  tone?: StatusTone
  size?: StatusPillSize
  /** Optional icon before the text. The text always stays, so tone is never the only signal. */
  icon?: LucideIcon
  /** `bold` draws the icon with a heavier stroke. */
  iconWeight?: 'regular' | 'bold'
}

export type { StatusPillProps, StatusPillSize, StatusTone }
