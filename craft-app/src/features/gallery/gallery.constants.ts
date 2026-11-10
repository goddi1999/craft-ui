import type { GalleryCategory } from './gallery.types'

type CategoryMeta = {
  label: string
}

/** Display order of the filter chips. Badges stay neutral — no per-category color. */
export const GALLERY_CATEGORIES: Record<GalleryCategory, CategoryMeta> = {
  charts: { label: 'Charts' },
  data: { label: 'Data display' },
  animation: { label: 'Animation' },
  scroll: { label: 'Scroll-driven' },
  navigation: { label: 'Navigation' },
  inputs: { label: 'Inputs & controls' },
  layout: { label: 'Cards & layout' },
  effects: { label: 'Backgrounds & effects' },
  media: { label: 'Media' },
}

export const CATEGORY_ORDER = Object.keys(GALLERY_CATEGORIES) as GalleryCategory[]

export const examplePath = (slug: string) => `/examples/${slug}`
export const previewSrc = (slug: string) => `/previews/${slug}.jpg`
