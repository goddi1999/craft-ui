import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_STEPS,
  DIM_MS,
  EASE_OUT,
  PILL_IN,
  PILL_SPRING,
  PILL_VARIANTS,
  WEIGHT_MS,
} from './emphasis-text.constants'
import type { EmphasisTextProps } from './emphasis-text.types'

/**
 * A sentence you set emphasis on word by word. Tap a word and a pill slides to it while the
 * rest dims; tap it again and it eases to the next weight (Regular → Bold → Light).
 * Arrow keys move between words, Enter or Space changes the weight, Escape lets go.
 */
export function EmphasisText({
  text,
  weights: weightsProp,
  onWeightsChange,
  steps = DEFAULT_STEPS,
  label = 'Set emphasis',
  className,
  ...props
}: EmphasisTextProps) {
  const reduced = useReducedMotion() ?? false
  const pillId = useId()
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])
  const resting = steps[0]?.value ?? 400
  const [inner, setInner] = useState<number[]>(() => words.map(() => resting))
  const weights = weightsProp ?? inner
  const [active, setActive] = useState<number | null>(null)
  const [cursor, setCursor] = useState(0)
  // arrow keys can repeat many times a second, so a keyboard move jumps the pill instead of sliding it
  const [viaKeys, setViaKeys] = useState(false)
  const instant = reduced || viaKeys
  const root = useRef<HTMLDivElement>(null)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  const weightOf = (index: number) => weights[index] ?? resting

  const cycle = (index: number) => {
    const at = steps.findIndex((step) => step.value === weightOf(index))
    const next = steps[(at + 1) % steps.length]?.value ?? resting
    const updated = words.map((_, i) => (i === index ? next : weightOf(i)))
    setInner(updated)
    onWeightsChange?.(updated)
  }

  const select = (index: number) => {
    setViaKeys(false)
    setCursor(index)
    if (active === index) cycle(index)
    else setActive(index)
  }

  // a tap outside lets go of the word
  useEffect(() => {
    if (active === null) return
    const onDown = (event: PointerEvent) => {
      if (root.current?.contains(event.target as Node)) return
      setViaKeys(false)
      setActive(null)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [active])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const move = (to: number) => {
      event.preventDefault()
      const next = (to + words.length) % words.length
      setViaKeys(true)
      setCursor(next)
      setActive(next)
      buttons.current[next]?.focus()
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') move(cursor + 1)
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') move(cursor - 1)
    else if (event.key === 'Home') move(0)
    else if (event.key === 'End') move(words.length - 1)
    else if (event.key === 'Escape') {
      setViaKeys(true)
      setActive(null)
    }
  }

  const stepName = (value: number) => steps.find((step) => step.value === value)?.name ?? `${value}`

  return (
    <div
      ref={root}
      role="toolbar"
      aria-label={label}
      data-slot="emphasis-text"
      data-active={active !== null || undefined}
      onKeyDown={onKeyDown}
      className={cn('group/emphasis flex flex-wrap gap-x-[0.08em]', className)}
      style={{ '--weight-ms': `${reduced ? 0 : WEIGHT_MS}ms` } as CSSProperties}
      {...props}
    >
      <LayoutGroup id={pillId}>
        {words.map((word, index) => {
          const on = index === active
          const weight = weightOf(index)
          return (
            <button
              key={`${word}-${index}`}
              ref={(node) => {
                buttons.current[index] = node
              }}
              type="button"
              tabIndex={index === cursor ? 0 : -1}
              aria-label={`${word}, ${stepName(weight)}`}
              data-on={on || undefined}
              onClick={() => select(index)}
              onFocus={() => setCursor(index)}
              className={cn(
                'relative rounded-[0.3em] px-[0.14em] outline-none pointer-coarse:min-h-11 select-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] focus-visible:ring-2 focus-visible:ring-ring',
                'text-foreground transition-[color,font-weight] group-data-active/emphasis:text-foreground/30 data-on:text-foreground!',
              )}
              style={{
                fontWeight: weight,
                transitionDuration: `${DIM_MS}ms, var(--weight-ms)`,
                transitionTimingFunction: EASE_OUT,
              }}
            >
              <AnimatePresence custom={instant}>
                {on && (
                  <motion.span
                    layoutId="pill"
                    aria-hidden
                    variants={PILL_VARIANTS}
                    custom={instant}
                    initial="hidden"
                    animate="shown"
                    exit="gone"
                    transition={instant ? { duration: 0 } : { layout: PILL_SPRING, default: PILL_IN }}
                    className="absolute inset-0 -z-0 rounded-[0.3em] bg-foreground/[0.09]"
                  />
                )}
              </AnimatePresence>
              <span className="relative">{word}</span>
            </button>
          )
        })}
      </LayoutGroup>
    </div>
  )
}
