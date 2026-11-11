import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ComponentPropsWithoutRef,
} from 'react'

import { cn } from '@/lib/utils'

import { generateSprite } from './generate-sprite'
import './pixel-transition.css'

const DEFAULT_IMAGES = [
  'https://assets.codepen.io/605876/cyber-car-one.jpg',
  'https://assets.codepen.io/605876/cyber-city.jpg',
] as const

export type PixelTransitionImages = readonly [string, string]

export type PixelTransitionProps = {
  /** Grid resolution for the pixel mask. @default 12 */
  cells?: number
  /** Animation frame count for the stepped mask. @default 12 */
  frames?: number
  /** Mask transition duration in seconds. @default 0.25 */
  speed?: number
  /** Delay multiplier for the trailing mask layer. @default 0.4 */
  delay?: number
  /** Pair of image URLs to crossfade between. */
  images?: PixelTransitionImages
  /** Controlled flip state. */
  flipped?: boolean
  /** Initial flip when uncontrolled. @default false */
  defaultFlipped?: boolean
  /** Fires when the flip state changes. */
  onFlippedChange?: (flipped: boolean) => void
  className?: string
} & Omit<ComponentPropsWithoutRef<'div'>, 'children'>

/**
 * Two images that crossfade through a generated SVG pixel-mask sprite sheet.
 * Click (or activate the overlay button) to flip between them.
 */
export function PixelTransition({
  cells = 12,
  frames = 12,
  speed = 0.25,
  delay = 0.4,
  images = DEFAULT_IMAGES,
  flipped: flippedProp,
  defaultFlipped = false,
  onFlippedChange,
  className,
  style,
  ...props
}: PixelTransitionProps) {
  const reactId = useId().replace(/:/g, '')
  const controlled = flippedProp !== undefined
  const [innerFlipped, setInnerFlipped] = useState(defaultFlipped)
  const flipped = controlled ? flippedProp : innerFlipped
  const rootRef = useRef<HTMLDivElement>(null)
  const inContainerRef = useRef<HTMLDivElement>(null)
  const outContainerRef = useRef<HTMLDivElement>(null)

  // The sprites are random DOM, so they are built after mount and written
  // straight onto the element rather than through React state.
  useEffect(() => {
    const root = rootRef.current
    const inEl = inContainerRef.current
    const outEl = outContainerRef.current
    if (!root || !inEl || !outEl) return
    const out = generateSprite(`o-${reactId}`, cells, frames)
    const inn = generateSprite(`i-${reactId}`, cells, frames)
    root.style.setProperty('--mask-frames', String(inn.frameCount))
    root.style.setProperty('--mask-in', `url(${inn.dataURL})`)
    root.style.setProperty('--mask-out', `url(${out.dataURL})`)
    inEl.replaceChildren(inn.svg)
    outEl.replaceChildren(out.svg)
  }, [cells, frames, reactId])

  const handleFlip = () => {
    const next = !flipped
    if (!controlled) setInnerFlipped(next)
    onFlippedChange?.(next)
  }

  return (
    <div
      ref={rootRef}
      data-slot="pixel-transition"
      data-flip={flipped ? 'true' : 'false'}
      className={cn(className)}
      style={
        {
          '--mask-speed': speed,
          '--mask-delay': delay,
          ...style,
        } as CSSProperties
      }
      {...props}
    >
      <button
        type="button"
        className="pixel-transition__trigger"
        aria-label="Transition image"
        onClick={handleFlip}
      />
      <div className="pixel-transition__images">
        <div className="pixel-transition__image-holder">
          <img src={images[0]} alt="" draggable={false} />
        </div>
        <div className="pixel-transition__image-holder">
          <img src={images[1]} alt="" draggable={false} />
        </div>
      </div>
      <div className="pixel-transition__sprites" aria-hidden="true">
        <div
          ref={inContainerRef}
          className="pixel-transition__sprite-container pixel-transition__sprite-container--in"
        />
        <div
          ref={outContainerRef}
          className="pixel-transition__sprite-container pixel-transition__sprite-container--out"
        />
      </div>
    </div>
  )
}
