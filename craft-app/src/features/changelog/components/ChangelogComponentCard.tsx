import { Link } from 'react-router-dom'

import { GalleryPreview, examplePath } from '@/features/gallery'

import type { ChangelogComponent } from '../changelog.types'

/** Preview and title of one added component. The inner radius is the outer one minus the padding. */
export function ChangelogComponentCard({ component }: { component: ChangelogComponent }) {
  return (
    <Link
      to={examplePath(component.slug)}
      className="group flex h-full flex-col rounded-[22px] border bg-card p-1.5 text-card-foreground outline-none transition-[box-shadow,transform] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] motion-reduce:active:scale-100"
    >
      <GalleryPreview slug={component.slug} title={component.title} className="rounded-2xl" />
      <div className="px-2.5 pt-3 pb-2">
        <h4 className="text-sm font-medium leading-snug">{component.title}</h4>
        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{component.description}</p>
      </div>
    </Link>
  )
}
