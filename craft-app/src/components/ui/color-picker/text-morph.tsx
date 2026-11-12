import {
  AnimatePresence,
  animate,
  motion,
  useReducedMotion,
  type AnimationPlaybackControls,
} from 'motion/react'
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'

import {
  BLUR_SOFT,
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  MORPH_SPRING,
  STAGGER_CHAR,
  TEXT_MORPH_HANDOFF,
} from './color-picker.constants'
import { enterOrder, toGlyphs } from './color-picker.utils'

const BLURRED = `blur(${BLUR_SOFT}px)`
const measure = (element: HTMLElement) => parseFloat(getComputedStyle(element).width)

/**
 * Morphs one short label into the next in place: shared letters glide to their new spots, new
 * ones sharpen in, removed ones blur away, and the width follows on a spring. Screen readers
 * get the plain text. Vendored from uiarc's text-morph so this folder stays self-contained.
 */
export function TextMorph({ children, className }: { children: string; className?: string }) {
  const reduced = useReducedMotion() === true
  const frame = useRef<HTMLSpanElement>(null)
  const track = useRef<HTMLSpanElement>(null)
  const width = useRef(0)
  const sizing = useRef<AnimationPlaybackControls | null>(null)

  // the previous label tells which letters are new, so only they stagger
  const [labels, setLabels] = useState({ current: children, previous: children })
  if (labels.current !== children) setLabels({ current: children, previous: labels.current })
  const glyphs = useMemo(() => toGlyphs(children), [children])
  const orders = useMemo(
    () => enterOrder(glyphs, new Set(toGlyphs(labels.previous).map((glyph) => glyph.key))),
    [glyphs, labels.previous],
  )

  // the frame holds an explicit width so a new label never snaps it; the spring then follows
  // the track, which already has the new letters in place
  useLayoutEffect(() => {
    const frameElement = frame.current
    const trackElement = track.current
    if (!frameElement || !trackElement) return
    const next = measure(trackElement)
    if (!Number.isFinite(next)) return
    if (width.current && Math.abs(next - width.current) > 0.5 && !reduced) {
      sizing.current = animate(frameElement, { width: next }, MORPH_SPRING)
    } else {
      sizing.current?.stop()
      frameElement.style.width = `${next}px`
    }
    width.current = next
  }, [children, reduced])

  // font loading changes the width without a new label: follow it at once
  useEffect(() => {
    const frameElement = frame.current
    const trackElement = track.current
    if (!frameElement || !trackElement) return
    const observer = new ResizeObserver(() => {
      const next = measure(trackElement)
      if (!Number.isFinite(next) || Math.abs(next - width.current) < 0.5) return
      sizing.current?.stop()
      frameElement.style.width = `${next}px`
      width.current = next
    })
    observer.observe(trackElement)
    return () => observer.disconnect()
  }, [])

  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      {/* the mask's soft trailing edge reveals letters as the width grows; the padding and
          matching negative margin give it room without moving the layout */}
      <span
        ref={frame}
        aria-hidden
        className="relative -my-[0.5em] -mr-[0.5em] -ml-[0.2em] box-content inline-block py-[0.5em] pr-[0.5em] pl-[0.2em] text-start whitespace-nowrap [mask-image:linear-gradient(90deg,#000_calc(100%_-_0.5em),transparent)]"
      >
        <span ref={track} className="relative inline-block whitespace-nowrap">
          <AnimatePresence mode="popLayout" initial={false}>
            {glyphs.map(({ char, key }, index) => (
              <motion.span
                key={key}
                layout="position"
                className="inline-block origin-[50%_60%] whitespace-pre"
                initial={
                  reduced ? false : { opacity: 0, scale: 0.8, y: '0.14em', filter: BLURRED }
                }
                animate={{ opacity: 1, scale: 1, y: '0em', filter: 'blur(0px)' }}
                exit={
                  reduced
                    ? { opacity: 0, transition: { duration: 0 } }
                    : {
                        opacity: 0,
                        scale: 0.86,
                        y: '-0.1em',
                        filter: BLURRED,
                        transition: { duration: DURATION.exit, ease: EASE_STANDARD },
                      }
                }
                transition={
                  reduced
                    ? { duration: 0 }
                    : {
                        layout: MORPH_SPRING,
                        default: {
                          duration: DURATION.standard + 0.04,
                          ease: EASE_ENTER,
                          delay:
                            TEXT_MORPH_HANDOFF + Math.min(orders[index], 8) * STAGGER_CHAR * 2,
                        },
                      }
                }
              >
                {char === ' ' ? ' ' : char}
              </motion.span>
            ))}
          </AnimatePresence>
        </span>
      </span>
    </span>
  )
}
