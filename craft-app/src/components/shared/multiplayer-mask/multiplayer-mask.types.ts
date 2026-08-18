import type {
  ButtonHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from 'react'

export type MultiplayerMaskTheme = 'system' | 'light' | 'dark'

export type MultiplayerMaskSize = 'sm' | 'default' | 'lg'

/** Which edge the stack overlaps from — decides which side the mask hole is cut on. */
export type MultiplayerMaskDirection = 'ltr' | 'rtl'

/** How a member name is revealed on hover. */
export type MultiplayerMaskLabel = 'ring' | 'above' | 'none'

export type MultiplayerMaskMember = {
  name: string
  avatar?: string
}

export type MultiplayerMaskProps = {
  children?: ReactNode
  size?: MultiplayerMaskSize
  direction?: MultiplayerMaskDirection
  label?: MultiplayerMaskLabel
  theme?: MultiplayerMaskTheme
  /** Portion of the avatar height that lifts out of the mask, 0–1. */
  movement?: number
  /** Hover transition duration in seconds. */
  transition?: number
  /** Start of the ring text along the circle, in `ch`. Only used by `label="ring"`. */
  ringOffset?: number
  /** Gap in px cut between an avatar and the neighbour masking it. */
  border?: number
  /** Grid column width in px — smaller values pack the stack tighter. */
  column?: number
  /** Animated hue-cycling glow behind the stack. */
  glow?: boolean
  /** Overlay the grid column and masked item guides. */
  debug?: boolean
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type MultiplayerMaskListProps = {
  children?: ReactNode
  className?: string
} & Omit<HTMLAttributes<HTMLUListElement>, 'children'>

export type MultiplayerMaskItemProps = {
  name: string
  avatar?: string
  /** Rendered inside the avatar circle when no `avatar` is supplied. */
  fallback?: ReactNode
  className?: string
} & Omit<LiHTMLAttributes<HTMLLIElement>, 'children'>

export type MultiplayerMaskNameProps = {
  name: string
  className?: string
} & Omit<HTMLAttributes<HTMLSpanElement>, 'children'>

export type MultiplayerMaskOverflowProps = {
  children?: ReactNode
  label?: string
  className?: string
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>
