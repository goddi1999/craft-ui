export type DestinationSymbol = 'triangle' | 'square' | 'circle' | 'star'

export type BumpPathOptions = {
  /** viewBox width the path is drawn in. */
  width: number
  /** Peak centre as a 0–100 percentage of `width`. */
  position: number
  /** How far the peak rises above the baseline (0 = flat). */
  height: number
  /** Overall width of the bump. */
  sectionWidth: number
  /** Distance between the two peak control points. */
  topWidth: number
}

type BumpGeometry = {
  baselineY: number
  curveStartX: number
  curveEndX: number
  leftControlX: number
  centralControlX: number
  peakX: number
  peakY: number
  rightControl1X: number
  rightControl2X: number
}

const BASELINE_Y = 2
const SHOULDER = 33

function getGeometry({
  width,
  position,
  height,
  sectionWidth,
  topWidth,
}: BumpPathOptions): BumpGeometry {
  const peakX = (position / 100) * width
  const curveStartX = peakX - sectionWidth / 2
  const curveEndX = peakX + sectionWidth / 2
  return {
    baselineY: BASELINE_Y,
    curveStartX,
    curveEndX,
    leftControlX: curveStartX + SHOULDER,
    centralControlX: peakX - topWidth / 2,
    peakX,
    peakY: BASELINE_Y - height,
    rightControl1X: peakX + topWidth / 2,
    rightControl2X: curveEndX - SHOULDER,
  }
}

/** A flat line with a two-segment cubic bump, extended past both edges. */
export function buildBumpPath(options: BumpPathOptions) {
  const g = getGeometry(options)
  const overhang = options.sectionWidth / 2
  const y = g.baselineY
  return [
    `M ${-overhang} ${y}`,
    `L ${g.curveStartX} ${y}`,
    `C ${g.leftControlX} ${y} ${g.centralControlX} ${g.peakY} ${g.peakX} ${g.peakY}`,
    `C ${g.rightControl1X} ${g.peakY} ${g.rightControl2X} ${y} ${g.curveEndX} ${y}`,
    `L ${options.width + overhang} ${y}`,
  ].join(' ')
}

function cubicAt(p0: number, p1: number, p2: number, p3: number, t: number) {
  const mt = 1 - t
  return (
    mt * mt * mt * p0 + 3 * mt * mt * t * p1 + 3 * mt * t * t * p2 + t * t * t * p3
  )
}

/** Binary-search a cubic segment for the y at a given x. */
function yOnSegment(
  xs: [number, number, number, number],
  ys: [number, number, number, number],
  targetX: number,
) {
  let tMin = 0
  let tMax = 1
  let t = 0.5
  for (let i = 0; i < 20; i++) {
    const x = cubicAt(...xs, t)
    if (Math.abs(x - targetX) < 0.0001) break
    if (x < targetX) tMin = t
    else tMax = t
    t = (tMin + tMax) / 2
  }
  return cubicAt(...ys, t)
}

/** The y coordinate of the bump path at `x`, so markers can ride the curve. */
export function getBumpY(options: BumpPathOptions, x: number) {
  const g = getGeometry(options)
  if (x <= g.curveStartX || x >= g.curveEndX) return g.baselineY
  if (x <= g.peakX) {
    return yOnSegment(
      [g.curveStartX, g.leftControlX, g.centralControlX, g.peakX],
      [g.baselineY, g.baselineY, g.peakY, g.peakY],
      x,
    )
  }
  return yOnSegment(
    [g.peakX, g.rightControl1X, g.rightControl2X, g.curveEndX],
    [g.peakY, g.peakY, g.baselineY, g.baselineY],
    x,
  )
}

/** Which destination symbol a 0–100 progress maps to. */
export function getSymbol(percent: number): DestinationSymbol {
  if (percent < 25) return 'triangle'
  if (percent < 50) return 'square'
  if (percent < 75) return 'circle'
  return 'star'
}

/** Strip characters that are not valid in an SVG `url(#id)` reference. */
export function toSvgId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '')
}
