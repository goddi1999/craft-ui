import type { ReactNode } from 'react'

export type DynamicIslandSize = 'default' | 'expanded' | 'large' | 'ultra'

export type PhoneFrameColor = 'graphite' | 'silver' | 'gold' | 'blue'

export type PhoneFrameProps = {
  /** Screen content, laid out below the status bar. */
  children?: ReactNode
  /** Island size preset. Controlled when `onDynamicIslandTap` is set. */
  dynamicIslandSize?: DynamicIslandSize
  /** Frame material. */
  frameColor?: PhoneFrameColor
  /** Time shown in the status bar. */
  time?: string
  /** Battery level, 0–100. */
  batteryLevel?: number
  /** Signal bars, 0–4. */
  signalStrength?: number
  /** Called when the island is tapped. Without it the island toggles default ↔ expanded itself. */
  onDynamicIslandTap?: () => void
  className?: string
}
