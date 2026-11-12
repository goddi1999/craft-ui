import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react'

import { PANEL_RADIUS_REM, RETURN_MS } from './dialog-card.constants'
import type { Geometry, Landing } from './dialog-card.types'
import { remToPx, toPx } from './dialog-card.utils'

type Options = {
  open: boolean
  morph: boolean
  hasDescription: boolean
  cardRef: RefObject<HTMLElement | null>
  descriptionRef: RefObject<HTMLParagraphElement | null>
}

/**
 * Measures what the morph needs and keeps the quick look mounted while it closes, so the surface
 * travels back to the card's box above the page and only then hands over to the card.
 */
export function useQuickLook({ open, morph, hasDescription, cardRef, descriptionRef }: Options) {
  const [geometry, setGeometry] = useState<Geometry>({})
  const [landing, setLanding] = useState<Landing | null>(null)
  // reopening mid-return cancels the landing
  const [seenOpen, setSeenOpen] = useState(open)
  if (seenOpen !== open) {
    setSeenOpen(open)
    if (open) setLanding(null)
  }
  const returning = !open && landing !== null

  // the quick look keeps the card's line length, so the description never rewraps while it travels
  useEffect(() => {
    const node = cardRef.current
    const text = descriptionRef.current
    if (!morph || !node || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => {
      const card = toPx(node, getComputedStyle(node).borderTopLeftRadius)
      const panel = remToPx(node, PANEL_RADIUS_REM)
      const measure = text?.offsetWidth || undefined
      setGeometry((current) =>
        current.card !== undefined && current.measure === measure
          ? current
          : { card: current.card ?? card, panel: current.panel ?? panel, measure },
      )
    })
    observer.observe(node)
    if (text) observer.observe(text)
    return () => observer.disconnect()
  }, [morph, hasDescription, cardRef, descriptionRef])

  // closing measures the card's box, so the panel lands exactly where the card sits
  const wasOpen = useRef(open)
  useLayoutEffect(() => {
    const closed = wasOpen.current && !open
    wasOpen.current = open
    const node = cardRef.current
    if (!closed || !morph || !node) return
    const box = node.getBoundingClientRect()
    setLanding({ top: box.top, left: box.left, width: box.width, height: box.height })
  }, [open, morph, cardRef])

  // once the surface has visually landed the card takes over; any last sub-pixel of travel carries
  // on in the card itself, so the handoff has no seam
  useEffect(() => {
    if (!returning) return
    const timer = window.setTimeout(() => setLanding(null), RETURN_MS)
    return () => window.clearTimeout(timer)
  }, [returning])

  return { geometry, landing, returning }
}
