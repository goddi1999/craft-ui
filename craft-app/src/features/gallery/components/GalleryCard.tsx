import { Link } from 'react-router-dom'

import { examplePath } from '../gallery.constants'
import type { GalleryCategory, GalleryExample } from '../gallery.types'

import { GalleryCategoryBadge } from './GalleryCategoryBadge'
import { GalleryPreview } from './GalleryPreview'

type GalleryCardProps = {
  example: GalleryExample
  selectedCategories: GalleryCategory[]
  onToggleCategory: (category: GalleryCategory) => void
}

export function GalleryCard({
  example,
  selectedCategories,
  onToggleCategory,
}: GalleryCardProps) {
  const path = examplePath(example.slug)

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <Link to={path} tabIndex={-1} aria-hidden="true">
        <GalleryPreview slug={example.slug} title={example.title} />
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-medium leading-snug">
            <Link
              to={path}
              className="outline-none hover:underline focus-visible:underline"
            >
              {example.title}
            </Link>
          </h2>
          <span className="shrink-0 text-xs text-muted-foreground">
            {example.tech}
          </span>
        </div>

        <p className="flex-1 text-sm text-muted-foreground">
          {example.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          {example.categories.map((category) => (
            <GalleryCategoryBadge
              key={category}
              category={category}
              active={selectedCategories.includes(category)}
              onToggle={onToggleCategory}
            />
          ))}
        </div>
      </div>
    </article>
  )
}
