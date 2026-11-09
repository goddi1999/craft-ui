import { ChevronsUpDown } from 'lucide-react'
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react'

import { cn } from '@/lib/utils'

import './scroll-image-comparison.css'

export type ScrollImageComparisonProps = {
  /** Image underneath, revealed on the left. @default Vercel home (dark) */
  beforeSrc?: string
  /** Image on top, clipped from the left by the handle. @default Vercel home (light) */
  afterSrc?: string
  /** Alt text for the underneath image. @default 'Vercel home, dark theme' */
  beforeAlt?: string
  /** Alt text for the top image. @default 'Vercel home, light theme' */
  afterAlt?: string
  /** Starting handle position, 0–100. @default 50 */
  defaultValue?: number
  /** Called with the handle position, 0–100, as it moves. */
  onValueChange?: (value: number) => void
  /** Explode the layers into 3D with pointer parallax to show how it works. @default false */
  reveal?: boolean
  /** Accessible name for the range input. @default 'Compare images' */
  label?: string
  /** Extra classes for the root. */
  className?: string
}

/**
 * An image comparison slider with no JS wiring: the range thumb owns a
 * `view-timeline`, hoisted with `timeline-scope`, which animates `--sic-compare`
 * to drive the clip and the handle. State only backs it up where scroll
 * timelines are missing.
 */
export function ScrollImageComparison({
  beforeSrc = 'https://assets.codepen.io/605876/vercel-home--dark.png?format=auto&quality=100',
  afterSrc = 'https://assets.codepen.io/605876/vercel-home--light.png?format=auto&quality=100',
  beforeAlt = 'Vercel home, dark theme',
  afterAlt = 'Vercel home, light theme',
  defaultValue = 50,
  onValueChange,
  reveal = false,
  label = 'Compare images',
  className,
}: ScrollImageComparisonProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  // Fallback value: an animation with an inactive timeline has no effect, so
  // this inline `--sic-compare` only shows where the thumb timeline is missing.
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    const root = rootRef.current
    if (!root || !reveal) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handlePointerMove = ({ clientX, clientY }: PointerEvent) => {
      root.style.setProperty('--sic-xp', String(clientX / window.innerWidth))
      root.style.setProperty('--sic-yp', String(clientY / window.innerHeight))
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      root.style.removeProperty('--sic-xp')
      root.style.removeProperty('--sic-yp')
    }
  }, [reveal])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    setValue(next)
    onValueChange?.(next)
  }

  return (
    <div
      ref={rootRef}
      data-slot="scroll-image-comparison"
      data-reveal={reveal}
      className={cn(className)}
    >
      <div className="sic__stage">
        <section
          className="sic__frame"
          style={{ '--sic-compare': value } as CSSProperties}
        >
          <input
            className="sic__slider"
            type="range"
            min={0}
            max={100}
            value={value}
            aria-label={label}
            onChange={handleChange}
          />
          <div className="sic__drag" aria-hidden="true">
            <ChevronsUpDown strokeWidth={1.5} />
          </div>
          <img src={beforeSrc} alt={beforeAlt} draggable={false} />
          <img
            className="sic__after"
            src={afterSrc}
            alt={afterAlt}
            draggable={false}
          />
        </section>
      </div>
    </div>
  )
}
