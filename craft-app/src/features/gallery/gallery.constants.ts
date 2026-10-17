import type { VariantProps } from 'class-variance-authority'

import type { badgeVariants } from '@/components/ui/badge-variants'

import type { GalleryCategory } from './gallery.types'

type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

type CategoryMeta = {
  label: string
  variant: BadgeVariant
}

/** Display order of the filter chips, and the badge color for each category. */
export const GALLERY_CATEGORIES: Record<GalleryCategory, CategoryMeta> = {
  charts: { label: 'Charts', variant: 'blue' },
  data: { label: 'Data display', variant: 'cyan' },
  animation: { label: 'Animation', variant: 'violet' },
  scroll: { label: 'Scroll-driven', variant: 'teal' },
  navigation: { label: 'Navigation', variant: 'indigo' },
  inputs: { label: 'Inputs & controls', variant: 'orange' },
  layout: { label: 'Cards & layout', variant: 'green' },
  effects: { label: 'Backgrounds & effects', variant: 'pink' },
  media: { label: 'Media', variant: 'lime' },
}

export const CATEGORY_ORDER = Object.keys(GALLERY_CATEGORIES) as GalleryCategory[]

export const examplePath = (slug: string) => `/examples/${slug}`
export const previewSrc = (slug: string) => `/previews/${slug}.jpg`
