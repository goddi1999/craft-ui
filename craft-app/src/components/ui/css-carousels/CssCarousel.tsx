import { useId, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import './css-carousels.css'

import {
  DEFAULT_CAROUSEL_SLIDES,
  wrapIndex,
  type CssCarouselSlide,
  type CssCarouselVariant,
} from './css-carousels.utils'

export type CssCarouselProps = {
  /** Slides to cycle through. @default DEFAULT_CAROUSEL_SLIDES (A–E) */
  slides?: readonly CssCarouselSlide[]
  /** Transition style between slides. @default 'fade' */
  variant?: CssCarouselVariant
  /** Controlled active slide index. */
  index?: number
  /** Initial slide when uncontrolled. @default 0 */
  defaultIndex?: number
  /** Called when the active slide changes. */
  onIndexChange?: (index: number) => void
  /** Accessible name for the carousel region. @default 'Carousel' */
  label?: string
  className?: string
}

/**
 * A carousel whose state lives in a group of native radio inputs. Arrows and
 * dots are `<label>`s pointing at the previous / next / nth radio, so every
 * transition is CSS keyed off the checked slide.
 */
export function CssCarousel({
  slides = DEFAULT_CAROUSEL_SLIDES,
  variant = 'fade',
  index,
  defaultIndex = 0,
  onIndexChange,
  label = 'Carousel',
  className,
}: CssCarouselProps) {
  const groupId = useId()
  const isControlled = index !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultIndex)
  const count = slides.length
  const active = count > 0 ? wrapIndex(isControlled ? index : uncontrolled, count) : 0

  const slideId = (i: number) => `${groupId}-slide-${wrapIndex(i, count)}`

  const handleSelect = (next: number) => {
    if (!isControlled) setUncontrolled(next)
    onIndexChange?.(next)
  }

  return (
    <div
      data-slot="css-carousels"
      data-variant={variant}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className={cn(className)}
      style={{ '--css-carousels-active': active } as CSSProperties}
    >
      {slides.map((slide, i) => (
        <input
          key={slide.label + i}
          id={slideId(i)}
          className="css-carousels__activator"
          type="radio"
          name={groupId}
          checked={i === active}
          aria-label={`Slide ${i + 1} of ${count}: ${slide.label}`}
          onChange={() => handleSelect(i)}
        />
      ))}

      {count > 1 && (
        <div className="css-carousels__controls" aria-hidden="true">
          <label
            htmlFor={slideId(active - 1)}
            className="css-carousels__control"
            data-direction="backward"
          />
          <label
            htmlFor={slideId(active + 1)}
            className="css-carousels__control"
            data-direction="forward"
          />
        </div>
      )}

      <ul className="css-carousels__track">
        {slides.map((slide, i) => (
          <li
            key={slide.label + i}
            className="css-carousels__slide"
            data-state={i === active ? 'active' : 'inactive'}
            aria-hidden={i !== active}
            style={
              {
                '--css-carousels-i': i,
                backgroundImage: `url(${slide.image})`,
              } as CSSProperties
            }
          >
            <span className="css-carousels__caption">{slide.label}</span>
          </li>
        ))}
      </ul>

      <div className="css-carousels__indicators" aria-hidden="true">
        {slides.map((slide, i) => (
          <label
            key={slide.label + i}
            htmlFor={slideId(i)}
            className="css-carousels__indicator"
            data-state={i === active ? 'active' : 'inactive'}
            style={
              variant === 'thumbnails'
                ? { backgroundImage: `url(${slide.image})` }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  )
}
