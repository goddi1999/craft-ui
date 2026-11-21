import type { ComponentProps, HTMLAttributes } from 'react'
import type { motion } from 'motion/react'

export type CutoutCardContextValue = {
  hovered: boolean
  setHovered: (next: boolean) => void
}

export type CutoutCardProps = Omit<ComponentProps<typeof motion.div>, 'defaultValue'> & {
  /** When set, hover state is controlled by the parent. */
  hovered?: boolean
  /** Initial hover state when uncontrolled. */
  defaultHovered?: boolean
  /** Called when hover changes. */
  onHoveredChange?: (hovered: boolean) => void
  /** When true (default), pointer enter/leave and keyboard focus update hover state. */
  trackPointerHover?: boolean
}

export type CutoutCardMediaProps = HTMLAttributes<HTMLDivElement>
export type CutoutCardImageProps = ComponentProps<'img'>
export type CutoutCardOverlayProps = HTMLAttributes<HTMLDivElement>
export type CutoutCardContentProps = HTMLAttributes<HTMLDivElement>
export type CutoutCardFooterProps = HTMLAttributes<HTMLDivElement>
export type CutoutCardInsetLabelProps = HTMLAttributes<HTMLDivElement>
export type CutoutCardPinProps = HTMLAttributes<HTMLDivElement>

export type CutoutCornerProps = ComponentProps<'svg'> & {
  /** Pixel width/height of the SVG (square). */
  size?: number
}

export type CutoutCardActionProps = ComponentProps<typeof motion.div> & {
  /** When true (default), visibility follows card hover. False always shows it. */
  revealOnHover?: boolean
}
