import type { RailTocPoint } from './rail-toc.types'

export const RAIL_X = 5
export const LABEL_GAP = 14
export const TRAVEL_SPRING = { stiffness: 140, damping: 26, mass: 0.6 }
export const TURN_SPRING = { stiffness: 260, damping: 30 }
// rail length the plane must back up before it turns around, so scroll jitter can't flip it
export const TURN_SLACK = 2

export const PLANE = 'M12 2 20.5 21 12 17.5 3.5 21z'
// the plane is narrower than a dot, so the rail and dots under it are cut away
export const PLANE_HOLE = 4

export function buildPath(nodes: RailTocPoint[]) {
  const points: RailTocPoint[] = [{ x: nodes[0].x, y: 0 }, nodes[0]]
  for (let i = 1; i < nodes.length; i++) {
    const from = nodes[i - 1]
    const to = nodes[i]
    if (from.x !== to.x) {
      const bend = (to.y - from.y) * 0.3
      points.push({ x: from.x, y: from.y + bend }, { x: to.x, y: to.y - bend })
    }
    points.push(to)
  }
  return points.map((p, i) => `${i ? 'L' : 'M'}${p.x} ${p.y}`).join(' ')
}

// the rail only ever runs downward, so y is monotonic along its length
export function lengthAtY(path: SVGPathElement, total: number, y: number) {
  let lo = 0
  let hi = total
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2
    if (path.getPointAtLength(mid).y < y) lo = mid
    else hi = mid
  }
  return hi
}

/** Where the plane should sit along the rail for the current scroll position. */
export function getRailTarget(
  items: { id: string }[],
  nodes: number[],
  scroller: HTMLElement | null | undefined,
  offset: number,
) {
  const scrollTop = scroller ? scroller.scrollTop : window.scrollY
  const viewHeight = scroller ? scroller.clientHeight : window.innerHeight
  const scrollHeight = scroller
    ? scroller.scrollHeight
    : document.documentElement.scrollHeight
  const originTop = scroller ? scroller.getBoundingClientRect().top : 0

  // the anchor starts at the top edge and sweeps to the bottom near the end, so the first and last headings are both reachable
  const remaining = Math.max(0, scrollHeight - viewHeight - scrollTop)
  const line = Math.min(offset, scrollTop)
  const anchor = line + Math.max(0, viewHeight - line - remaining)

  const tops = items.map((item) => {
    const el = document.getElementById(item.id)
    return el ? el.getBoundingClientRect().top - originTop : Infinity
  })

  const index = tops.findLastIndex((top) => top <= anchor)
  if (index === -1) return nodes[0]
  if (index === nodes.length - 1) return nodes[index]
  const span = tops[index + 1] - tops[index]
  const progress = span > 0 ? (anchor - tops[index]) / span : 0
  return nodes[index] + Math.min(1, Math.max(0, progress)) * (nodes[index + 1] - nodes[index])
}
