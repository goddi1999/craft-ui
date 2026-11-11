import type { ComponentType } from 'react'

export type GalleryCategory =
  | 'charts'
  | 'data'
  | 'animation'
  | 'scroll'
  | 'navigation'
  | 'inputs'
  | 'layout'
  | 'effects'
  | 'media'

export type GalleryExample = {
  /** Route segment under `/examples/` and the preview image name. */
  slug: string
  /** Day the example joined the gallery (`YYYY-MM-DD`); newest cards show first. */
  addedAt: string
  title: string
  description: string
  /** Technique label shown on the card, e.g. `CSS · Popover`. */
  tech: string
  categories: GalleryCategory[]
  page: ComponentType
}
