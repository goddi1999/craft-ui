import gsap from 'gsap'
import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react'

import { cn } from '@/lib/utils'

import './destination-slider.css'

import {
  buildBumpPath,
  getBumpY,
  getSymbol,
  toSvgId,
} from './destination-slider.utils'

const VIEWBOX_WIDTH = 300
const STOPS = [0, 25, 50, 75, 100] as const
const DURATION = 0.15

export type DestinationSliderProps = {
  /** Controlled value. */
  value?: number
  /** Initial value when uncontrolled. @default 30 */
  defaultValue?: number
  /** Called with the new value on every input. */
  onValueChange?: (value: number) => void
  /** @default 0 */
  min?: number
  /** @default 100 */
  max?: number
  /** @default 1 */
  step?: number
  /** Accessible label for the range input. @default 'Destination' */
  label?: string
  /** CSS color of the marker balloon. @default 'hsl(10 100% 65%)' */
  accent?: string
  /** How high the track bumps up under the held marker (viewBox units). @default 40 */
  bumpHeight?: number
  /** Overall width of the bump (viewBox units). @default 150 */
  bumpWidth?: number
  /** Width of the bump's flat-ish peak (viewBox units). @default 65 */
  bumpTopWidth?: number
  /** Reveal the native range input underneath the drawing. @default false */
  explode?: boolean
  className?: string
}

/**
 * A native range input with an SVG skin: a dotted track that bumps up under
 * the marker while you hold it, stop markers that ride the curve, and a gooey
 * balloon showing a symbol for the current quarter of the range.
 */
export function DestinationSlider({
  value,
  defaultValue = 30,
  onValueChange,
  min = 0,
  max = 100,
  step = 1,
  label = 'Destination',
  accent = 'hsl(10 100% 65%)',
  bumpHeight = 40,
  bumpWidth = 150,
  bumpTopWidth = 65,
  explode = false,
  className,
}: DestinationSliderProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const firstRunRef = useRef(true)
  const baseId = toSvgId(useId())
  const boundsId = `${baseId}-bounds`
  const progressId = `${baseId}-progress`
  const gooId = `${baseId}-goo`

  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const [lifted, setLifted] = useState(false)
  const current = isControlled ? value : uncontrolled
  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100
  const activeSymbol = getSymbol(percent)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const duration = firstRunRef.current || reduceMotion ? 0 : DURATION
    firstRunRef.current = false

    const height = lifted ? bumpHeight : 0
    const geometry = {
      width: VIEWBOX_WIDTH,
      position: percent,
      height,
      sectionWidth: bumpWidth,
      topWidth: bumpTopWidth,
    }

    const tracks = svg.querySelectorAll('[data-part="track"]')
    const stops = svg.querySelectorAll<SVGElement>('[data-stop]')
    const marker = svg.querySelector('[data-part="marker"]')
    const progressRect = svg.querySelector('[data-part="progress-rect"]')

    const tweens = [
      gsap.to(tracks, { attr: { d: buildBumpPath(geometry) }, duration }),
      gsap.to(marker, {
        x: (VIEWBOX_WIDTH * percent) / 100,
        y: -height,
        duration,
      }),
      gsap.to(progressRect, {
        attr: { width: (VIEWBOX_WIDTH * percent) / 100 },
        duration,
      }),
      ...Array.from(stops, (stop) => {
        const x = (Number(stop.dataset.stop) / 100) * VIEWBOX_WIDTH
        const y = getBumpY(geometry, x)
        const attr = stop.tagName === 'circle' ? { cy: y } : { y }
        return gsap.to(stop, { attr, duration })
      }),
    ]

    return () => {
      tweens.forEach((tween) => tween.kill())
    }
  }, [percent, lifted, bumpHeight, bumpWidth, bumpTopWidth])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = Number(event.target.value)
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  const handleLift = () => setLifted(true)
  const handleDrop = () => setLifted(false)

  return (
    <div
      data-slot="destination-slider"
      data-explode={explode}
      className={cn(className)}
      style={{ '--destination-slider-accent': accent } as CSSProperties}
    >
      <input
        className="destination-slider__input"
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={current}
        onChange={handleChange}
        onPointerDown={handleLift}
        onPointerUp={handleDrop}
        onPointerCancel={handleDrop}
        onTouchEnd={handleDrop}
        onFocus={handleLift}
        onBlur={handleDrop}
      />
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX_WIDTH} 4`}
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <clipPath id={boundsId}>
            <rect x="0" y="-200" width={VIEWBOX_WIDTH} height="400" />
          </clipPath>
          <clipPath id={progressId}>
            <rect
              data-part="progress-rect"
              x="0"
              y="-200"
              width="0"
              height="400"
            />
          </clipPath>
          <filter id={gooId}>
            <feGaussianBlur
              result="blurred"
              in="SourceGraphic"
              stdDeviation="9.2"
            />
            <feColorMatrix
              result="adjusted"
              in="blurred"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 66 -10"
            />
            <feComposite in="adjusted" operator="atop" />
          </filter>
        </defs>

        <g clipPath={`url(#${boundsId})`}>
          <path data-part="track" className="destination-slider__track" />
        </g>
        <g clipPath={`url(#${progressId})`}>
          <path
            data-part="track"
            className="destination-slider__track"
            data-progress
          />
        </g>

        <g>
          {STOPS.map((stop) => {
            const x = (stop / 100) * VIEWBOX_WIDTH
            if (stop === 0 || stop === 100) {
              return (
                <circle
                  key={stop}
                  data-stop={stop}
                  className="destination-slider__stop"
                  data-end={stop === 100 || undefined}
                  cx={x}
                  cy="2"
                  r="6"
                  strokeWidth="2"
                />
              )
            }
            return (
              <rect
                key={stop}
                data-stop={stop}
                className="destination-slider__stop"
                x={x}
                y="2"
                width="3"
                height="12"
                transform="translate(-1 -6)"
              />
            )
          })}
        </g>

        <g data-part="marker">
          <g filter={`url(#${gooId})`}>
            <circle
              className="destination-slider__marker-fill"
              cx="0"
              cy="2"
              r="5.8"
              strokeWidth="2"
            />
            <g className="destination-slider__balloon">
              <circle
                className="destination-slider__marker-fill"
                cx="0"
                cy="2"
                r="18"
              />
            </g>
            <rect x="-50" y="-100" width="100" height="200" fill="none" />
          </g>
          <circle
            className="destination-slider__marker-fill"
            cx="0"
            cy="2"
            r="8"
            strokeWidth="2"
          />
          <g className="destination-slider__symbols">
            <path
              className="destination-slider__symbol"
              data-symbol="triangle"
              data-active={activeSymbol === 'triangle' || undefined}
              transform="translate(-9.55859 0)"
              d="M9.55859 2L17.5586 16H1.55859L9.55859 2Z"
            />
            <circle
              className="destination-slider__symbol"
              data-symbol="circle"
              data-active={activeSymbol === 'circle' || undefined}
              cx="0"
              cy="10"
              r="7"
            />
            <rect
              className="destination-slider__symbol"
              data-symbol="square"
              data-active={activeSymbol === 'square' || undefined}
              x="-7"
              y="3"
              width="14"
              height="14"
            />
            <path
              className="destination-slider__symbol"
              data-symbol="star"
              data-active={activeSymbol === 'star' || undefined}
              transform="translate(-9.55859 0)"
              d="M9.55859 1L11.5792 7.21885H18.1181L12.828 11.0623L14.8487 17.2812L9.55859 13.4377L4.26853 17.2812L6.28915 11.0623L0.999085 7.21885H7.53797L9.55859 1Z"
            />
          </g>
        </g>
      </svg>
    </div>
  )
}
