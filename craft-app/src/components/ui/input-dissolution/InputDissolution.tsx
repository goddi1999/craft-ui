import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
} from 'react'
import { useAnimate, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import './input-dissolution.css'

import {
  DEFAULT_ACCENT,
  LIFT,
  LIFT_Y,
  SETTLE,
  SHAKE,
  SHAKE_X,
} from './input-dissolution.constants'
import type { InputDissolutionProps } from './input-dissolution.types'
import { resolveAccent } from './input-dissolution.utils'

/**
 * An email field that answers its submit. Wrong shakes it. Correct plays one effect: the text
 * dissolves into noise (the input is clipped away while a filtered copy and an SVG-displaced
 * backdrop sweep across it), or the field bounces and clears.
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
  color = 'var(--foreground)',
  accent = DEFAULT_ACCENT,
  underline = false,
  effect = 'dissolve',
  shake = true,
  invalidColor = 'var(--destructive)',
  validate,
  className,
}: InputDissolutionProps) {
  const reduced = useReducedMotion() === true
  const [field, animate] = useAnimate<HTMLDivElement>()
  const [invalid, setInvalid] = useState(false)
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (explode || submitted) return
    const valid = validate
      ? validate(value)
      : value.trim() !== '' && inputRef.current?.checkValidity() === true
    const moves = !reduced && field.current !== null

    // wrong: shake
    if (!valid) {
      setInvalid(true)
      if (shake && moves) animate(field.current, { x: SHAKE_X }, SHAKE)
      return
    }

    // correct: one effect, the dissolve or the bounce
    setInvalid(false)
    onSubmit?.(value)
    if (effect === 'dissolve') {
      setSubmitted(true)
      return
    }
    if (moves) {
      await animate(field.current, { y: LIFT_Y }, LIFT)
      animate(field.current, { y: 0 }, SETTLE)
    }
    // the field clears at the top of the lift, as it starts to settle
    setValue('')
  }

  const style = {
    '--speed': speed,
    '--scrub': progress / 100,
    '--idis-dissolve': `url("#${dissolveId}")`,
    '--idis-noise': `url("#${noiseId}")`,
    '--idis-ink': color,
    '--idis-accent': resolveAccent(accent),
    '--idis-invalid': invalidColor,
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
      data-underline={underline}
      data-effect={effect}
      data-invalid={invalid}
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
        {/* noValidate: invalid input shakes here instead of opening the browser's bubble */}
        <form className="idis__form" noValidate onSubmit={handleSubmit}>
          <div ref={field} className="idis__field">
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
                aria-invalid={invalid || undefined}
                onChange={(event) => {
                  setValue(event.target.value)
                  if (invalid) setInvalid(false)
                }}
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
