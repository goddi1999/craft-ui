import { CORNER_FRAME_DEFAULTS } from './corner-frame.constants'

export type CornerFrameMetrics = {
  length: number
  width: number
  height: number
}

/** Build the top-left L path and SVG box size from length / width / height. */
export function cornerFramePath({
  length = CORNER_FRAME_DEFAULTS.length,
  width = CORNER_FRAME_DEFAULTS.width,
  height = CORNER_FRAME_DEFAULTS.height,
}: Partial<CornerFrameMetrics>) {
  const half = width / 2
  const radius = Math.max(height, half + 1)
  const leg = Math.max(length, radius)
  const size = leg + half
  const arc = radius - half

  const path = [
    `M ${half} ${leg}`,
    `L ${half} ${radius}`,
    `A ${arc} ${arc} 0 0 1 ${radius} ${half}`,
    `L ${leg} ${half}`,
  ].join(' ')

  return { path, size, stroke: width }
}
