import { Sun, SunDim } from 'lucide-react'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import './liquid-slider.css'

import { toLiquid, toPercent, toSvgId } from './liquid-slider.utils'

type EdgeBounce = 'start' | 'end'

export type LiquidSliderProps = {
  /** Controlled value. */
  value?: number
  /** Initial value when uncontrolled. @default 40 */
  defaultValue?: number
  /** Called with the new value on every input. */
  onValueChange?: (value: number) => void
  /** @default 0 */
  min?: number
  /** @default 100 */
  max?: number
  /** @default 1 */
  step?: number
  /** Accessible label for the range input. @default 'Brightness' */
  label?: string
  /** Icon at the minimum end. @default <SunDim /> */
  startIcon?: ReactNode
  /** Icon at the maximum end. @default <Sun /> */
  endIcon?: ReactNode
  /** Gaussian blur (stdDeviation) of the goo filter. @default 2 */
  blur?: number
  /** Alpha multiplier of the goo filter; higher = sharper blob edges. @default 16 */
  alpha?: number
  /** Cap on how far pointer speed stretches the thumb. @default 5 */
  deltaCap?: number
  /** Spring ease when the thumb grows on press (pointer devices). @default true */
  springy?: boolean
  /** Hold the thumb in its pressed, glassy state. @default false */
  active?: boolean
  /** Pull the layers apart to show how the effect is built. @default false */
  debug?: boolean
  className?: string
}

function LiquidThumb({ debugCopy = false }: { debugCopy?: boolean }) {
  return (
    <div
      className="liquid-slider__thumb"
      data-debug-copy={debugCopy || undefined}
      aria-hidden="true"
    >
      <div className="liquid-slider__shadow" />
      <div className="liquid-slider__wrapper">
        <div className="liquid-slider__liquids" data-kind="track">
          <div className="liquid-slider__liquid-shadow" />
          <div className="liquid-slider__liquid" />
        </div>
        <div className="liquid-slider__liquids" data-kind="fill">
          <div className="liquid-slider__liquid-shadow" />
          <div className="liquid-slider__liquid" />
        </div>
      </div>
      <div className="liquid-slider__cover" />
    </div>
  )
}

function Knockout({ debugCopy = false }: { debugCopy?: boolean }) {
  return (
    <div
      className="liquid-slider__knockout"
      data-debug-copy={debugCopy || undefined}
      aria-hidden="true"
    >
      <div className="liquid-slider__fill" />
      <div className="liquid-slider__mask-host">
        <div className="liquid-slider__mask" />
      </div>
    </div>
  )
}

/**
 * A range input dressed as an iOS-style liquid glass slider. The track has a
 * hole knocked out under the thumb by an SVG filter, and on press the thumb
 * swells into a gooey lens that stretches with pointer speed.
 */
export function LiquidSlider({
  value,
  defaultValue = 40,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label = 'Brightness',
  startIcon = <SunDim strokeWidth={2.5} />,
  endIcon = <Sun strokeWidth={2.25} />,
  blur = 2,
  alpha = 16,
  deltaCap = 5,
  springy = true,
  active = false,
  debug = false,
  className,
}: LiquidSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const releaseRef = useRef<(() => void) | null>(null)
  const baseId = toSvgId(useId())
  const gooId = `${baseId}-goo`
  const knockoutId = `${baseId}-remove-black`

  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const [edgeBounce, setEdgeBounce] = useState<EdgeBounce | null>(null)
  const current = isControlled ? value : uncontrolled
  const complete = toPercent(current, min, max)

  useEffect(() => () => releaseRef.current?.(), [])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
    if (edgeBounce) return
    if (next === max) setEdgeBounce('end')
    else if (next === min) setEdgeBounce('start')
  }

  const handlePointerDown = () => {
    const root = rootRef.current
    if (!root) return
    releaseRef.current?.()

    const handleMove = (event: PointerEvent) => {
      const delta = Math.min(Math.abs(event.movementX), deltaCap)
      root.style.setProperty('--liquid-slider-delta', String(delta))
    }
    const release = () => {
      root.style.setProperty('--liquid-slider-delta', '0')
      document.removeEventListener('pointermove', handleMove)
      document.removeEventListener('pointerup', release)
      document.removeEventListener('pointercancel', release)
      releaseRef.current = null
    }

    document.addEventListener('pointermove', handleMove)
    document.addEventListener('pointerup', release)
    document.addEventListener('pointercancel', release)
    releaseRef.current = release
  }

  const handleBounceEnd = () => setEdgeBounce(null)

  return (
    <div
      ref={rootRef}
      data-slot="liquid-slider"
      data-active={active}
      data-springy={springy}
      data-debug={debug}
      data-edge-bounce={edgeBounce ?? undefined}
      className={cn(className)}
      style={
        {
          '--liquid-slider-complete': Math.round(complete),
          '--liquid-slider-liquid': Math.round(toLiquid(complete)),
          '--liquid-slider-goo-filter': `url(#${gooId})`,
          '--liquid-slider-knockout-filter': `url(#${knockoutId})`,
        } as CSSProperties
      }
    >
      <span
        className="liquid-slider__icon"
        data-edge="start"
        aria-hidden="true"
        onAnimationEnd={handleBounceEnd}
      >
        {startIcon}
      </span>
      <span
        className="liquid-slider__icon"
        data-edge="end"
        aria-hidden="true"
        onAnimationEnd={handleBounceEnd}
      >
        {endIcon}
      </span>

      <Knockout />
      <Knockout debugCopy />
      <LiquidThumb debugCopy />

      <div className="liquid-slider__track">
        <input
          className="liquid-slider__input"
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          onPointerDown={handlePointerDown}
        />
        <LiquidThumb />
      </div>

      <svg className="liquid-slider__filters" aria-hidden="true">
        <defs>
          <filter id={gooId}>
            <feGaussianBlur
              result="blurred"
              in="SourceGraphic"
              stdDeviation={blur}
            />
            <feColorMatrix
              result="adjusted"
              in="blurred"
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${alpha} -10`}
            />
            <feComposite in="adjusted" operator="atop" />
          </filter>
          <filter id={knockoutId} colorInterpolationFilters="sRGB">
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -255 -255 -255 0 1"
              result="black-pixels"
            />
            <feMorphology
              in="black-pixels"
              operator="dilate"
              radius="0.5"
              result="smoothed"
            />
            <feComposite in="SourceGraphic" in2="smoothed" operator="out" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
