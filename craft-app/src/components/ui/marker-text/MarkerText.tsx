import { useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

import { DEFAULT_GAP, VIEW_THRESHOLD } from './marker-text.constants'
import { MarkerContext } from './marker-text.context'
import type { MarkEntry, MarkerRegistry, MarkerTextProps, Stroke } from './marker-text.types'
import { schedule } from './marker-text.utils'
import { StrokeLayer } from './marker-text-parts'

/**
 * Text whose `Mark` phrases get highlighted, underlined, circled, boxed or
 * struck through by hand, one pen stroke after another in reading order.
 */
export function MarkerText({
  children,
  show,
  gap = DEFAULT_GAP,
  onDrawn,
  as: Tag = 'div',
  className,
  ...props
}: MarkerTextProps) {
  const rootRef = useRef<HTMLElement>(null)
  const entriesRef = useRef(new Map<string, MarkEntry>())
  const measureRef = useRef(() => {})
  const onDrawnRef = useRef(onDrawn)
  const totalRef = useRef(0)
  const [strokes, setStrokes] = useState<Stroke[]>([])
  const [seen, setSeen] = useState(false)
  // armed turns the transitions on: hiding is instant, drawing is not
  const [armed, setArmed] = useState(false)
  const reduced = useReducedMotion() ?? false
  const maskId = useId().replace(/[^a-zA-Z0-9_-]/g, '')

  const visible = show === undefined ? seen : show
  const total = strokes.reduce((end, stroke) => Math.max(end, stroke.delay + stroke.duration), 0)
  const hasStrokes = strokes.length > 0

  // hiding disarms in the same render, so the next show starts from blank
  const [wasVisible, setWasVisible] = useState(visible)
  if (visible !== wasVisible) {
    setWasVisible(visible)
    if (!visible) setArmed(false)
  }

  const measure = useCallback(() => {
    const root = rootRef.current
    if (!root) return
    const origin = root.getBoundingClientRect()
    // reading order is document order, whatever order the marks mounted in
    const order = Array.from(root.querySelectorAll('[data-mark]'))
    const marks = [...entriesRef.current.values()]
      .sort((a, b) => order.indexOf(a.el) - order.indexOf(b.el))
      .map((entry) => ({
        entry,
        lines: Array.from(entry.el.getClientRects())
          .filter((rect) => rect.width > 1)
          .map((rect) => ({
            left: rect.left - origin.left,
            top: rect.top - origin.top,
            right: rect.right - origin.left,
            bottom: rect.bottom - origin.top,
          })),
      }))
    setStrokes(schedule(marks, gap))
  }, [gap])

  // marks register in their own layout effects, which run before this one,
  // so the first measure happens here once every mark is in
  useLayoutEffect(() => {
    measureRef.current = measure
    measure()
  }, [measure])

  useLayoutEffect(() => {
    onDrawnRef.current = onDrawn
    totalRef.current = total
  })

  const [registry] = useState<MarkerRegistry>(() => ({
    add: (id, entry) => {
      entriesRef.current.set(id, entry)
      measureRef.current()
      return () => {
        entriesRef.current.delete(id)
        measureRef.current()
      }
    },
  }))

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const resize = new ResizeObserver(() => measureRef.current())
    resize.observe(root)
    // web fonts can swap in after the first measure and move every line
    document.fonts.ready.then(() => measureRef.current())
    const view = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setSeen(true)
        view.disconnect()
      },
      { threshold: VIEW_THRESHOLD },
    )
    view.observe(root)
    return () => {
      resize.disconnect()
      view.disconnect()
    }
  }, [])

  // draw on the frame after the hidden state has painted, so going from
  // hidden to shown always runs the transition, even on a replay
  useEffect(() => {
    if (!visible) return
    let second = 0
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => setArmed(true))
    })
    return () => {
      cancelAnimationFrame(first)
      cancelAnimationFrame(second)
    }
  }, [visible])

  // reports once per draw; re-measuring mid-draw (a resize) doesn't restart the clock
  useEffect(() => {
    if (!(armed && hasStrokes)) return
    const timer = window.setTimeout(() => onDrawnRef.current?.(), reduced ? 0 : totalRef.current)
    return () => window.clearTimeout(timer)
  }, [armed, hasStrokes, reduced])

  return (
    <MarkerContext.Provider value={registry}>
      <Tag ref={rootRef} className={cn('relative isolate', className)} {...props}>
        <StrokeLayer strokes={strokes} under armed={armed} reduced={reduced} maskId={maskId} />
        {children}
        <StrokeLayer
          strokes={strokes}
          under={false}
          armed={armed}
          reduced={reduced}
          maskId={maskId}
        />
      </Tag>
    </MarkerContext.Provider>
  )
}
