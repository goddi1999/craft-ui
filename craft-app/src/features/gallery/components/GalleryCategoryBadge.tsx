import { Badge } from '@/components/ui/badge'

import { GALLERY_CATEGORIES } from '../gallery.constants'
import type { GalleryCategory } from '../gallery.types'

type GalleryCategoryBadgeProps = {
  category: GalleryCategory
  active: boolean
  onToggle: (category: GalleryCategory) => void
  count?: number
  size?: 'sm' | 'lg'
}

/** A category badge that doubles as a filter toggle. */
export function GalleryCategoryBadge({
  category,
  active,
  onToggle,
  count,
  size = 'sm',
}: GalleryCategoryBadgeProps) {
  const { label } = GALLERY_CATEGORIES[category]

  return (
    <Badge
      asChild
      variant={active ? 'default' : 'outline'}
      size={size}
      className="transition-[transform,background-color,color] duration-150 active:scale-[0.97]"
    >
      <button
        type="button"
        aria-pressed={active}
        onClick={() => onToggle(category)}
      >
        {label}
        {count === undefined ? null : (
          <span className="tabular-nums opacity-70">{count}</span>
        )}
      </button>
    </Badge>
  )
}
