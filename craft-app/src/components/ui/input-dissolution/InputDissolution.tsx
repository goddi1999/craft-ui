import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react'

import { cn } from '@/lib/utils'

import './input-dissolution.css'

export type InputDissolutionNoise = 'fractalNoise' | 'turbulence'

export type InputDissolutionProps = {
  /** Placeholder shown in the empty field. @default 'rockstar@ui.dev' */
  placeholder?: string
  /** Accessible name for the email field. @default 'Email address' */
  label?: string
  /** Submit button text, rendered as `[LABEL]`. @default 'Enlist' */
  submitLabel?: string
  /** Called with the email when a valid value is submitted, before it dissolves. */
  onSubmit?: (value: string) => void
  /** Dissolve right-to-left instead of left-to-right. @default false */
  rtl?: boolean
  /** Seconds the dissolve sweep takes. @default 2 */
  speed?: number
  /** Run the text copy through the blur + displacement filter. @default true */
  filtered?: boolean
  /** Freeze the sweep and drive it from `progress` instead. @default false */
  debug?: boolean
  /** In debug, tilt the stage and pull each pass apart in 3D. @default false */
  explode?: boolean
  /** Manual sweep position (0–100) used in debug. @default 0 */
  progress?: number
  /** feTurbulence base frequency — higher means finer grains. @default 1.8 */
  baseFrequency?: number
  /** feTurbulence octaves. @default 10 */
  numOctaves?: number
  /** feTurbulence seed. @default 1 */
  seed?: number
  /** feTurbulence noise type. @default 'fractalNoise' */
  noiseType?: InputDissolutionNoise
  /** feDisplacementMap scale — how far the grains scatter. @default 20 */
  displacementScale?: number
  className?: string
}

/**
 * An email field whose text dissolves into noise on submit: the input is
 * clipped away while a filtered copy and an SVG-displaced backdrop sweep
 * across it, then the field fades back in empty.
 */
export function InputDissolution({
  placeholder = 'rockstar@ui.dev',
  label = 'Email address',
  submitLabel = 'Enlist',
  onSubmit,
  rtl = false,
  speed = 2,
  filtered = true,
  debug = false,
  explode = false,
  progress = 0,
  baseFrequency = 1.8,
  numOctaves = 10,
  seed = 1,
  noiseType = 'fractalNoise',
  displacementScale = 20,
  className,
}: InputDissolutionProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const previousExplode = useRef(explode)
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '')
  const dissolveId = `idis-dissolve-${uid}`
  const noiseId = `idis-noise-${uid}`

  const syncScroll = () => {
    const root = rootRef.current
    const input = inputRef.current
    if (!root || !input) return
    root.querySelectorAll<HTMLElement>('.idis__dupe').forEach((dupe) => {
      dupe.scrollLeft = input.scrollLeft
    })
  }

  useLayoutEffect(syncScroll, [value])

  // Once the sweep's transitions settle, reset the field.
  useEffect(() => {
    const root = rootRef.current
    if (!submitted || !root) return
    let cancelled = false
    const finished = root
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished)
    Promise.allSettled(finished).then(() => {
      if (cancelled) return
      setSubmitted(false)
      setValue('')
    })
    return () => {
      cancelled = true
    }
  }, [submitted])

  // Keep 3D context alive while the explode transition plays in either direction.
  useEffect(() => {
    const root = rootRef.current
    if (!root || previousExplode.current === explode) return
    previousExplode.current = explode
    let cancelled = false
    root.dataset.exploding = 'true'
    const finished = root
      .getAnimations({ subtree: true })
      .map((animation) => animation.finished)
    Promise.allSettled(finished).then(() => {
      if (!cancelled) root.dataset.exploding = 'false'
    })
    return () => {
      cancelled = true
    }
  }, [explode])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (explode || submitted) return
    onSubmit?.(value)
    setSubmitted(true)
  }

  const style = {
    '--speed': speed,
    '--scrub': progress / 100,
    '--idis-dissolve': `url("#${dissolveId}")`,
    '--idis-noise': `url("#${noiseId}")`,
  } as CSSProperties

  const turbulence = {
    type: noiseType,
    baseFrequency,
    numOctaves,
    seed,
    stitchTiles: 'noStitch',
  } as const

  return (
    <div
      ref={rootRef}
      data-slot="input-dissolution"
      data-rtl={rtl}
      data-debug={debug}
      data-explode={explode}
      data-filtered={filtered}
      data-submitted={submitted}
      className={cn(className)}
      style={style}
    >
      <svg className="idis__defs" aria-hidden="true" focusable="false">
        <defs>
          <filter
            id={dissolveId}
            colorInterpolationFilters="sRGB"
            overflow="visible"
          >
            <feTurbulence {...turbulence} result="noise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={displacementScale}
            />
          </filter>
          <filter
            id={noiseId}
            colorInterpolationFilters="sRGB"
            overflow="visible"
          >
            <feTurbulence {...turbulence} />
          </filter>
        </defs>
      </svg>

      <div className="idis__stage">
        <form className="idis__form" onSubmit={handleSubmit}>
          <div className="idis__field">
            <div
              className="idis__layer idis__layer--filter"
              aria-hidden="true"
            >
              <span className="idis__label">filtered</span>
              <div className="idis__debug-wrapper">
                <div className="idis__dupe idis__filter-debug idis__filtered">
                  {value}
                </div>
              </div>
            </div>
            <div className="idis__layer idis__layer--input" aria-hidden="true">
              <span className="idis__label">input</span>
              <div className="idis__debug-wrapper">
                <div className="idis__dupe idis__input-debug">{value}</div>
              </div>
            </div>
            <div
              className="idis__layer idis__layer--displace"
              aria-hidden="true"
            >
              <span className="idis__label">displace</span>
              <div className="idis__debug-wrapper">
                <div className="idis__displace-debug" />
              </div>
            </div>

            <div className="idis__wrap">
              <input
                ref={inputRef}
                type="email"
                required
                autoComplete="off"
                spellCheck={false}
                aria-label={label}
                placeholder={placeholder}
                value={value}
                readOnly={submitted}
                onChange={(event) => setValue(event.target.value)}
                onKeyUp={syncScroll}
                onScroll={syncScroll}
                onSelect={syncScroll}
              />
              <div
                className="idis__dupe idis__filtered"
                aria-hidden="true"
              >
                {value}
              </div>
              <div className="idis__displacer" aria-hidden="true" />
            </div>
          </div>

          <button type="submit" className="idis__submit" aria-label={submitLabel}>
            [{submitLabel}]
          </button>
        </form>
      </div>
    </div>
  )
}
