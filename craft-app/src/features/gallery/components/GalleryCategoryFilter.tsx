import { Badge } from '@/components/ui/badge'

import { CATEGORY_ORDER } from '../gallery.constants'
import type { GalleryCategory } from '../gallery.types'

import { GalleryCategoryBadge } from './GalleryCategoryBadge'

type GalleryCategoryFilterProps = {
  selected: GalleryCategory[]
  counts: Record<GalleryCategory, number>
  total: number
  onToggle: (category: GalleryCategory) => void
  onClear: () => void
}

export function GalleryCategoryFilter({
  selected,
  counts,
  total,
  onToggle,
  onClear,
}: GalleryCategoryFilterProps) {
  const showingAll = selected.length === 0

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className="flex flex-wrap justify-center gap-2"
    >
      <Badge asChild variant={showingAll ? 'default' : 'outline'} size="lg">
        <button type="button" aria-pressed={showingAll} onClick={onClear}>
          All
          <span className="tabular-nums opacity-70">{total}</span>
        </button>
      </Badge>
      {CATEGORY_ORDER.map((category) => (
        <GalleryCategoryBadge
          key={category}
          category={category}
          active={selected.includes(category)}
          count={counts[category]}
          size="lg"
          onToggle={onToggle}
        />
      ))}
    </div>
  )
}
