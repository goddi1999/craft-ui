import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  SCROLL_DRIVEN_LENS_ITEMS,
  type ScrollDrivenLensItem,
} from './scroll-driven-lens.data'

import './scroll-driven-lens.css'

export type ScrollDrivenLensProps = {
  /** Lens frames, left to right. @default SCROLL_DRIVEN_LENS_ITEMS */
  items?: readonly ScrollDrivenLensItem[]
  /** Accessible name for the horizontal scroller. @default 'Camera lenses' */
  label?: string
  /** Extra classes for the root. */
  className?: string
}

/**
 * A horizontal snap gallery where each frame grows, brightens and reveals its
 * caption as it reaches the centre — driven by an inline `view()` timeline.
 */
export function ScrollDrivenLens({
  items = SCROLL_DRIVEN_LENS_ITEMS,
  label = 'Camera lenses',
  className,
}: ScrollDrivenLensProps) {
  return (
    <div data-slot="scroll-driven-lens" className={cn(className)}>
      <section
        className="sdl__gallery"
        aria-label={label}
        tabIndex={0}
      >
        <ul>
          {items.map((item) => (
            <li
              key={`${item.zoom}-${item.lens}`}
              style={{ '--crop': item.crop } as CSSProperties}
            >
              <figure>
                <img src={item.src} alt={item.alt ?? ''} draggable={false} />
                <figcaption>
                  <span>{item.zoom}</span>
                  <span>{item.lens}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
