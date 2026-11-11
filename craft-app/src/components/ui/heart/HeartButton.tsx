import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

// ─── Color palette ─────────────────────────────────────────────────────────

const COLORS = [
  { key: 'violet', label: 'Violet', oklch: '0.76 0.18 305' },
  { key: 'indigo', label: 'Indigo', oklch: '0.74 0.15 275' },
  { key: 'blue', label: 'Blue', oklch: '0.78 0.14 245' },
  { key: 'cyan', label: 'Cyan', oklch: '0.80 0.13 215' },
  { key: 'teal', label: 'Teal', oklch: '0.78 0.14 185' },
  { key: 'green', label: 'Green', oklch: '0.80 0.16 150' },
  { key: 'lime', label: 'Lime', oklch: '0.84 0.18 125' },
  { key: 'orange', label: 'Orange', oklch: '0.82 0.17 55' },
  { key: 'pink', label: 'Pink', oklch: '0.80 0.17 10' },
  { key: 'darkblue', label: 'Darkblue', oklch: '0.45 0.14 254' },
] as const

type ColorKey = (typeof COLORS)[number]['key']

function toOklch(val: string) {
  return `oklch(${val})`
}

function darken(val: string) {
  const [l, c, h] = val.trim().split(/\s+/)
  return `oklch(${Math.max(0, +l - 0.15)} ${c} ${h})`
}

function withAlpha(val: string, a: number) {
  return `oklch(${val} / ${a})`
}

// ─── Hook ──────────────────────────────────────────────────────────────────

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!media) return
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener?.('change', update)
    return () => media.removeEventListener?.('change', update)
  }, [])
  return reduced
}

// ─── Heart SVG path ────────────────────────────────────────────────────────

const HEART_PATH =
  'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'

// ─── HeartButton ───────────────────────────────────────────────────────────

export type HeartButtonProps = {
  /** Heart width and height in px. */
  size?: number
  /** OKLCH channels without the function, e.g. `'0.76 0.18 305'`. */
  oklchVal: string
  /** Start filled. */
  defaultLiked?: boolean
  /** Called with the new state after each toggle. */
  onChange?: (liked: boolean) => void
}

export function HeartButton({
  size = 72,
  oklchVal,
  defaultLiked = false,
  onChange,
}: HeartButtonProps) {
  const uid = useId().replace(/:/g, '')
  const clipId = useMemo(() => `hclip-${uid}`, [uid])
  const reduced = usePrefersReducedMotion()

  const [liked, setLiked] = useState(defaultLiked)

  const rootRef = useRef<HTMLDivElement>(null)
  const btnRef = useRef<HTMLButtonElement>(null)
  const circleRef = useRef<SVGCircleElement>(null)

  const fill = toOklch(oklchVal)
  const stroke = darken(oklchVal)
  const hover = withAlpha(oklchVal, 0.08)

  const setRadius = useCallback(
    (next: boolean, instant?: boolean) => {
      const c = circleRef.current
      if (!c) return
      gsap.killTweensOf(c)
      if (instant || reduced) {
        c.setAttribute('r', next ? '14' : '0')
        return
      }
      gsap.to(c, { attr: { r: next ? 14 : 0 }, duration: 0.22, ease: 'power2.out' })
    },
    [reduced],
  )

  const bounce = useCallback(() => {
    const el = btnRef.current
    if (!el || reduced) return
    gsap.killTweensOf(el)
    gsap.fromTo(
      el,
      { scale: 1 },
      {
        scale: 0.82,
        duration: 0.08,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1,
        onComplete: () => {
          gsap.to(el, { scale: 1, duration: 0.14, ease: 'back.out(3)' })
        },
      },
    )
  }, [reduced])

  const spawnParticles = useCallback(() => {
    const root = rootRef.current
    if (!root || reduced) return
    for (let i = 0; i < 6; i++) {
      const p = document.createElement('div')
      p.setAttribute('aria-hidden', 'true')
      Object.assign(p.style, {
        position: 'absolute',
        left: '50%',
        top: '40%',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
        willChange: 'transform,opacity',
      })
      p.innerHTML = `<svg viewBox="0 0 24 24" width="12" height="12">
        <path d="${HEART_PATH}" fill="${fill}" />
      </svg>`
      root.appendChild(p)
      gsap.to(p, {
        x: gsap.utils.random(-44, 44),
        y: gsap.utils.random(-64, -18),
        opacity: 0,
        rotate: gsap.utils.random(-22, 22),
        scale: gsap.utils.random(0.5, 1.3),
        delay: i * 0.045,
        duration: 0.58,
        ease: 'power2.out',
        onComplete: () => p.remove(),
      })
    }
  }, [reduced, fill])

  const toggle = useCallback(() => {
    bounce()
    setLiked((prev) => {
      const next = !prev
      setRadius(next)
      if (next) spawnParticles()
      onChange?.(next)
      return next
    })
  }, [bounce, setRadius, spawnParticles, onChange])

  useEffect(() => {
    setRadius(liked, true)
  }, []) // eslint-disable-line

  return (
    <div
      ref={rootRef}
      style={{ position: 'relative', display: 'inline-flex' }}
    >
      <button
        ref={btnRef}
        type="button"
        aria-label={liked ? 'Unlike' : 'Like'}
        aria-pressed={liked}
        onClick={toggle}
        className="inline-flex cursor-pointer items-center justify-center rounded-full border-0 bg-transparent p-[18px] outline-none transition-[background-color] duration-200 ease-out [-webkit-tap-highlight-color:transparent] hover:bg-(--heart-hover) focus-visible:ring-2 focus-visible:ring-ring"
        style={{ ['--heart-hover' as string]: hover }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size}
          height={size}
          overflow="visible"
        >
          <defs>
            <clipPath id={clipId}>
              <circle
                ref={circleRef}
                cx="12"
                cy="12"
                r="0"
              />
            </clipPath>
          </defs>
          {/* Filled layer — clipped circle expanding from center */}
          <path
            d={HEART_PATH}
            fill={fill}
            clipPath={`url(#${clipId})`}
          />
          {/* Flat 2D outline */}
          <path
            d={HEART_PATH}
            fill="none"
            stroke={liked ? stroke : '#d1d5db'}
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 0.22s ease' }}
          />
        </svg>
      </button>
    </div>
  )
}

export { COLORS as HEART_COLORS }
export type { ColorKey as HeartColorKey }
