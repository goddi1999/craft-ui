import { useEffect, useState } from 'react'

import { MORPH_SETTLE_MS } from './color-picker.constants'

type FormatMorph = { id: number; from: string; to: string; phase: 0 | 1 }

/**
 * The text that covers the field while the format changes: it mounts showing the old string,
 * morphs to the new one on the next frame, and clears once it settles so the live input returns.
 */
export function useFormatMorph() {
  const [morph, setMorph] = useState<FormatMorph | null>(null)

  useEffect(() => {
    if (!morph || morph.phase === 1) return
    const frame = requestAnimationFrame(() =>
      setMorph((current) => (current?.id === morph.id ? { ...current, phase: 1 } : current)),
    )
    return () => cancelAnimationFrame(frame)
  }, [morph])

  useEffect(() => {
    if (!morph || morph.phase === 0) return
    const timer = window.setTimeout(
      () => setMorph((current) => (current?.id === morph.id ? null : current)),
      MORPH_SETTLE_MS,
    )
    return () => window.clearTimeout(timer)
  }, [morph])

  const start = (from: string, to: string) => setMorph({ id: Date.now(), from, to, phase: 0 })

  return [morph ? (morph.phase === 0 ? morph.from : morph.to) : null, start] as const
}
