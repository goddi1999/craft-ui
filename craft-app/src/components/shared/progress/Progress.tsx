import { useEffect } from 'react'
import {
  AnimatePresence,
  animate,
  motion,
  useIsPresent,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from 'motion/react'
import { Check } from 'lucide-react'
import styles from './progress.module.css'

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

export type ProgressProps = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'children'
> & {
  value?: number
  max?: number
  label?: string
  showValue?: boolean
}

const exitFast: Transition = {
  duration: motionTokens.duration.fast,
  ease: [...motionTokens.ease.standard],
}
const textIn: TargetAndTransition = {
  opacity: 0,
  y: '0.3em',
  filter: `blur(${motionTokens.blur.soft}px)`,
}
const textOut: TargetAndTransition = {
  opacity: 0,
  y: '-0.3em',
  filter: `blur(${motionTokens.blur.subtle}px)`,
  transition: exitFast,
}
const iconIn: TargetAndTransition = {
  opacity: 0,
  scale: 0.6,
  filter: `blur(${motionTokens.blur.subtle}px)`,
}
const shown: TargetAndTransition = {
  opacity: 1,
  y: '0em',
  scale: 1,
  filter: 'blur(0px)',
}
const fadeOut: TargetAndTransition = {
  opacity: 0,
  transition: { duration: motionTokens.duration.instant },
}

/** Outgoing copies are hidden from assistive tech while they fade. */
function Swap(props: HTMLMotionProps<'span'>) {
  const present = useIsPresent()
  return (
    <motion.span
      {...props}
      aria-hidden={present ? props['aria-hidden'] : true}
    />
  )
}

export function Progress({
  value = 0,
  max = 100,
  label,
  showValue = false,
  className,
  ...props
}: ProgressProps) {
  const reduce = useReducedMotion()
  const safeMax = max > 0 ? max : 100
  const safeValue = Math.min(Math.max(value, 0), safeMax)
  const percentage = Math.round((safeValue / safeMax) * 100)
  const complete = percentage >= 100
  // One spring drives both the fill and the counted label, so the number always matches the bar.
  const progress = useMotionValue(percentage)
  // The fill slides in from the left instead of scaling, so its rounded end keeps its shape at every value.
  const x = useTransform(
    progress,
    (latest) => `${Math.min(Math.max(latest, 0), 100) - 100}%`,
  )
  const counted = useTransform(
    progress,
    (latest) => `${Math.round(Math.min(Math.max(latest, 0), 100))}%`,
  )
  useEffect(() => {
    if (reduce) {
      progress.jump(percentage)
      return
    }
    const controls = animate(progress, percentage, motionTokens.spring.smooth)
    return () => controls.stop()
  }, [percentage, progress, reduce])
  const enter: Transition = reduce
    ? { duration: motionTokens.duration.instant }
    : {
        duration: motionTokens.duration.standard,
        ease: [...motionTokens.ease.enter],
      }
  const classes = [styles.progress, className].filter(Boolean).join(' ')
  return (
    <div
      {...props}
      className={classes}
      data-complete={complete ? '' : undefined}
      role="progressbar"
      aria-label={label ?? 'Progress'}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={safeValue}
      aria-valuetext={`${percentage}%`}
    >
      {label || showValue ? (
        <div className={styles.meta}>
          {label ? (
            <span className={styles.label}>
              <AnimatePresence mode="popLayout" initial={false}>
                <Swap
                  key={label}
                  className={styles.line}
                  initial={reduce ? { opacity: 0 } : textIn}
                  animate={shown}
                  exit={reduce ? fadeOut : textOut}
                  transition={enter}
                >
                  {label}
                </Swap>
              </AnimatePresence>
            </span>
          ) : (
            <span />
          )}
          {showValue ? (
            <span className={styles.value}>
              {/* Completion lands as the fill arrives: a check settles in beside the final count. */}
              <AnimatePresence initial={false}>
                {complete && (
                  <motion.span
                    key="done"
                    className={styles.done}
                    initial={reduce ? { opacity: 0 } : iconIn}
                    animate={shown}
                    exit={
                      reduce ? fadeOut : { ...iconIn, transition: exitFast }
                    }
                    transition={
                      reduce
                        ? enter
                        : { ...motionTokens.spring.snappy, delay: 0.24 }
                    }
                  >
                    <Check size={14} strokeWidth={1.75} aria-hidden="true" />
                  </motion.span>
                )}
              </AnimatePresence>
              <motion.span className={styles.count}>{counted}</motion.span>
            </span>
          ) : null}
        </div>
      ) : null}
      <div className={styles.track}>
        <motion.span className={styles.fill} style={{ x }} />
      </div>
    </div>
  )
}
