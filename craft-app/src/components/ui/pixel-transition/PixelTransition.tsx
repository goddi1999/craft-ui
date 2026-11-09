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

type SpritePair = {
  inUrl: string
  outUrl: string
  frameCount: number
  inSvg: SVGSVGElement
  outSvg: SVGSVGElement
}

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
  const [sprites, setSprites] = useState<SpritePair | null>(null)
  const inContainerRef = useRef<HTMLDivElement>(null)
  const outContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const out = generateSprite(`o-${reactId}`, cells, frames)
    const inn = generateSprite(`i-${reactId}`, cells, frames)
    setSprites({
      inUrl: inn.dataURL,
      outUrl: out.dataURL,
      frameCount: inn.frameCount,
      inSvg: inn.svg,
      outSvg: out.svg,
    })
  }, [cells, frames, reactId])

  useEffect(() => {
    if (!sprites) return
    const inEl = inContainerRef.current
    const outEl = outContainerRef.current
    if (!inEl || !outEl) return
    inEl.replaceChildren(sprites.inSvg)
    outEl.replaceChildren(sprites.outSvg)
  }, [sprites])

  const handleFlip = () => {
    const next = !flipped
    if (!controlled) setInnerFlipped(next)
    onFlippedChange?.(next)
  }

  return (
    <div
      data-slot="pixel-transition"
      data-flip={flipped ? 'true' : 'false'}
      className={cn(className)}
      style={
        {
          '--mask-speed': speed,
          '--mask-delay': delay,
          '--mask-frames': sprites?.frameCount ?? frames,
          '--mask-in': sprites ? `url(${sprites.inUrl})` : undefined,
          '--mask-out': sprites ? `url(${sprites.outUrl})` : undefined,
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
