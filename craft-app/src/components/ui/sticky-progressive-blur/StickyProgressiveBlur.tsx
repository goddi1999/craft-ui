import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import { STICKY_PROGRESSIVE_BLUR_IMAGES } from './sticky-progressive-blur.data'

import './sticky-progressive-blur.css'

export type StickyProgressiveBlurProps = {
  /** Images that scroll up into the blur. @default STICKY_PROGRESSIVE_BLUR_IMAGES */
  images?: readonly string[]
  /** Red tag above the heading. @default 'Craft of UI' */
  tag?: string
  /** Sticky heading. @default 'Bringing clarity to the art of UI development' */
  heading?: string
  /** Sticky body copy. */
  description?: string
  /** Call-to-action label. @default 'Start seeing clearly' */
  ctaLabel?: string
  /** Call-to-action link. @default 'https://craftofui.dev' */
  ctaHref?: string
  /** Number of stacked backdrop-filter layers. @default 5 */
  layers?: number
  /** Strongest blur in px, applied by the first layer. @default 40 */
  blur?: number
  /** Height of the blurred band, as % of the viewport. @default 45 */
  mask?: number
  /** Image saturation, 0–1. @default 0.1 */
  saturate?: number
  /** Where the first image starts, as % of the viewport. @default 50 */
  padding?: number
  /** Outline each blur layer and label the overlay. @default false */
  debug?: boolean
  /** Extra classes for the root. */
  className?: string
}

/**
 * A sticky stack of `backdrop-filter` layers, each with a stronger blur and a
 * shorter mask, fades the bottom of the viewport into a progressive blur that
 * images scroll through.
 */
export function StickyProgressiveBlur({
  images = STICKY_PROGRESSIVE_BLUR_IMAGES,
  tag = 'Craft of UI',
  heading = 'Bringing clarity to the art of UI development',
  description = 'You want to build exceptional user interfaces, I want to empower you to do so.',
  ctaLabel = 'Start seeing clearly',
  ctaHref = 'https://craftofui.dev',
  layers = 5,
  blur = 40,
  mask = 45,
  saturate = 0.1,
  padding = 50,
  debug = false,
  className,
}: StickyProgressiveBlurProps) {
  const layerCount = Math.max(1, Math.round(layers))
  const rootStyle = {
    '--spb-layers': layerCount,
    '--spb-blur-max': blur,
    '--spb-mask-stop': mask,
    '--spb-saturate': saturate,
    '--spb-padding': padding,
  } as CSSProperties

  return (
    <div
      data-slot="sticky-progressive-blur"
      data-debug={debug}
      className={cn(className)}
      style={rootStyle}
    >
      <div className="spb__header">
        <div className="spb__intro">
          <h2 className="spb__tag">{tag}</h2>
          <p className="spb__heading">{heading}</p>
          <p className="spb__description">{description}</p>
          <a
            className="spb__cta"
            href={ctaHref}
            target="_blank"
            rel="noreferrer"
          >
            {ctaLabel}
          </a>
        </div>
        <div className="spb__label" aria-hidden="true" />
        <ul className="spb__images">
          {images.map((src) => (
            <li key={src}>
              <img src={src} alt="" loading="lazy" />
            </li>
          ))}
        </ul>
        <div className="spb__blur" aria-hidden="true">
          {Array.from({ length: layerCount }, (_, index) => (
            <div key={index} style={{ '--i': index + 1 } as CSSProperties} />
          ))}
        </div>
      </div>
    </div>
  )
}
