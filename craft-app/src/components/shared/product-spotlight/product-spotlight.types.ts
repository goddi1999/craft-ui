import type {
  AnchorHTMLAttributes,
  CSSProperties,
  HTMLAttributes,
  LiHTMLAttributes,
  ReactNode,
} from 'react'

/** A complete lighting rig, chosen by intent rather than by tuning numbers. */
export type ProductSpotlightPreset =
  | 'default'
  | 'dramatic'
  | 'soft'
  | 'cinematic'

/** Card treatment: the finished product, or the depth-map blueprint behind it. */
export type ProductSpotlightCardVariant = 'default' | 'blueprint'

export type SpotlightParams = {
  lightHeight: number
  shadowStrength: number
  shadowSoftness: number
  minBrightness: number
  normalStrength: number
  parallax: number
  aoStrength: number
  shadowLength: number
  lightBoost: number
  highlight: number
  spotRadius: number
  spotFloor: number
  spotFalloff: number
  spotColor: string
  trackingSpeed: number
  returnSpeed: number
  fadeIn: number
  fadeOut: number
  hoverDelay: number
}

export type ProductSpotlightProps = {
  /** Product photo. */
  src: string
  /** Greyscale depth map matching `src`. */
  depth: string
  preset?: ProductSpotlightPreset
  /** Describes the product for assistive tech. */
  alt?: string
  className?: string
  style?: CSSProperties
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type ProductSpotlightCardProps = {
  children?: ReactNode
  variant?: ProductSpotlightCardVariant
  className?: string
} & Omit<HTMLAttributes<HTMLElement>, 'children'>

export type ProductSpotlightStackProps = {
  children?: ReactNode
  /** Fan the stack apart to expose the blueprint card behind it. */
  reveal?: boolean
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type ProductSpotlightCarouselProps = {
  children?: ReactNode
  /** Accessible name for the slide tablist. */
  label?: string
  /** Markers are rendered but inert — used by the blueprint card. */
  inert?: boolean
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

export type ProductSpotlightSlideProps = {
  children?: ReactNode
  className?: string
} & Omit<LiHTMLAttributes<HTMLLIElement>, 'children'>

export type ProductSpotlightBodyProps = {
  brand: string
  name: string
  price: string
  /** Where the buy affordance points. */
  href?: string
  className?: string
} & Omit<AnchorHTMLAttributes<HTMLElement>, 'children' | 'href'>
