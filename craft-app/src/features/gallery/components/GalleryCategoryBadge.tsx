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
  const { label, variant } = GALLERY_CATEGORIES[category]

  return (
    <Badge
      asChild
      variant={variant}
      size={size}
      className={active ? 'ring-2 ring-current/40' : 'opacity-80 hover:opacity-100'}
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
