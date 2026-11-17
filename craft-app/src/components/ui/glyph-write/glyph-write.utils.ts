import type { GlyphStroke } from './glyph-write.types'

export type TimedStroke = GlyphStroke & { delay: number }

/**
 * Resolves each stroke's start time. A stroke starts `gap` seconds after the
 * previous one started (default: when it finishes); all times are scaled.
 */
export function timeStrokes(
  strokes: GlyphStroke[],
  startAt: number,
  durationScale: number,
): TimedStroke[] {
  return strokes.reduce<TimedStroke[]>((timed, stroke, index) => {
    const previous = timed[index - 1]
    const delay = previous
      ? previous.delay +
        (stroke.gap ?? strokes[index - 1].duration) * durationScale
      : startAt
    return [
      ...timed,
      { ...stroke, delay, duration: stroke.duration * durationScale },
    ]
  }, [])
}
