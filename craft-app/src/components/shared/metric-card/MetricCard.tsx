import { useEffect, useRef, useState } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  type Variants,
} from 'motion/react'
import { AnimatedCounter } from '../animated-counter'
import styles from './metric-card.module.css'

/** Durations, easings, and springs this component animates with. */
const motionTokens = {
  duration: {
    instant: 0.12,
    fast: 0.16,
    exit: 0.18,
    standard: 0.24,
    considered: 0.48,
  },
  ease: {
    enter: [0.16, 1, 0.3, 1],
    exit: [0.7, 0, 0.84, 0],
    standard: [0.22, 1, 0.36, 1],
    /** For elements that move while already on screen. */
    inOut: [0.65, 0, 0.35, 1],
  },
  spring: {
    responsive: { type: 'spring', stiffness: 520, damping: 38 },
    gentle: { type: 'spring', stiffness: 340, damping: 34 },
    /** Presses, toggles, thumbs, and small indicators. */
    snappy: { type: 'spring', visualDuration: 0.26, bounce: 0.12 },
    /** Panels, height changes, and layout shifts. Never overshoots. */
    smooth: { type: 'spring', visualDuration: 0.4, bounce: 0 },
    /** Shape morphs, shared layout highlights, and width changes. */
    morph: { type: 'spring', visualDuration: 0.42, bounce: 0.16 },
  },
  /** Stagger steps in seconds. Keep total stagger under roughly 0.4s. */
  stagger: { char: 0.016, word: 0.04, line: 0.08, item: 0.035 },
  /** Blur radii in px for text and content crossfades. */
  blur: { subtle: 2, soft: 4, text: 8 },
} as const
export type MetricCardProps = {
  label: string
  value: number
  suffix?: string
  context: string
  change?: string
}

/** Copy that holds a number enters from the side it moved toward: a larger value rises from below, a smaller one drops from above. */
const rise: Variants = {
  hidden: (direction: number) => ({
    opacity: 0,
    y: `${0.3 * direction}em`,
    filter: `blur(${motionTokens.blur.soft}px)`,
  }),
  shown: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: motionTokens.duration.standard,
      ease: [...motionTokens.ease.enter],
    },
  },
  gone: (direction: number) => ({
    opacity: 0,
    y: `${-0.3 * direction}em`,
    filter: `blur(${motionTokens.blur.subtle}px)`,
    transition: {
      duration: motionTokens.duration.fast,
      ease: [...motionTokens.ease.standard],
    },
  }),
}
const fade: Variants = {
  hidden: { opacity: 0, y: 0, filter: 'blur(0px)' },
  shown: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: motionTokens.duration.instant },
  },
  gone: {
    opacity: 0,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: motionTokens.duration.instant },
  },
}
const amountIn = (text: string) =>
  Number(text.replace(/,/g, '').match(/-?\d+(?:\.\d+)?/)?.[0] ?? NaN)

/** New copy rises in while the old copy leaves; `morph` springs the wrapper to the new text's width instead of letting it snap. */
function Swap({
  text,
  morph = false,
  block = false,
}: {
  text: string
  morph?: boolean
  block?: boolean
}) {
  const reduceMotion = !!useReducedMotion()
  const sizer = useRef<HTMLSpanElement>(null)
  const width = useMotionValue<number | 'auto'>('auto')
  const [shown, setShown] = useState({ text, direction: 1 })
  if (shown.text !== text)
    setShown({
      text,
      direction: amountIn(text) < amountIn(shown.text) ? -1 : 1,
    })
  useEffect(() => {
    const node = sizer.current
    if (!node || typeof ResizeObserver === 'undefined') return
    let measured: string | null = null
    // Layout size, not the transformed rect, so a scaling parent never leaves the text clipped. Only a new text springs; font loads jump.
    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return
      const next = entry.borderBoxSize?.[0]?.inlineSize ?? node.offsetWidth
      if (
        next &&
        measured !== null &&
        measured !== node.textContent &&
        !reduceMotion
      )
        animate(width, next, motionTokens.spring.morph)
      else width.jump(next || 'auto')
      measured = next ? node.textContent : null
    })
    observer.observe(node)
    return () => observer.disconnect()
  }, [morph, reduceMotion, width])
  return (
    <motion.span
      className={block ? styles.swapBlock : styles.swap}
      style={morph ? { width } : undefined}
    >
      {morph && (
        <span ref={sizer} className={styles.sizer} aria-hidden="true">
          {text}
        </span>
      )}
      <AnimatePresence
        mode="popLayout"
        initial={false}
        custom={shown.direction}
      >
        <motion.span
          key={text}
          className={styles.text}
          custom={shown.direction}
          variants={reduceMotion ? fade : rise}
          initial="hidden"
          animate="shown"
          exit="gone"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

export function MetricCard({
  label,
  value,
  suffix,
  context,
  change,
}: MetricCardProps) {
  const reduceMotion = !!useReducedMotion()
  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <span>
          <Swap text={label} block />
        </span>
        <AnimatePresence initial={false}>
          {change && (
            <motion.small
              key="change"
              data-trend={
                /^[+]/.test(change)
                  ? 'up'
                  : /^[-−]/.test(change)
                    ? 'down'
                    : undefined
              }
              initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: reduceMotion ? 1 : 0.96,
                transition: {
                  duration: motionTokens.duration.fast,
                  ease: [...motionTokens.ease.standard],
                },
              }}
              transition={
                reduceMotion ? { duration: 0 } : motionTokens.spring.snappy
              }
            >
              <Swap text={change} morph />
            </motion.small>
          )}
        </AnimatePresence>
      </div>
      <AnimatedCounter value={value} suffix={suffix} animateOnView />
      <p>
        <Swap text={context} block />
      </p>
    </article>
  )
}
