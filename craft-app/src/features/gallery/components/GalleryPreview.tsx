import { useState } from 'react'

import { cn } from '@/lib/utils'

import { previewSrc } from '../gallery.constants'

type GalleryPreviewProps = {
  slug: string
  title: string
  className?: string
}

/** A screenshot of the live demo, falling back to the title when none exists. */
export function GalleryPreview({ slug, title, className }: GalleryPreviewProps) {
  const [missing, setMissing] = useState(false)

  return (
    <div
      className={cn(
        'relative aspect-[16/10] overflow-hidden bg-muted',
        className,
      )}
    >
      {missing ? (
        <div className="flex h-full items-center justify-center p-6 text-center text-lg font-medium text-muted-foreground">
          {title}
        </div>
      ) : (
        <img
          src={previewSrc(slug)}
          alt={`Preview of ${title}`}
          loading="lazy"
          decoding="async"
          onError={() => setMissing(true)}
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      )}
    </div>
  )
}
