import { DEFAULT_ICON_VIEWBOX, ICON_PATHS, ICON_SIZE } from './deploy-globe.constants'
import type { DeployNode, DeployNodeData, NodeIcon, Point, TrajectoryStep } from './deploy-globe.types'

/** Horizontal semi-axis of meridian ellipse `index` (-4..4). */
export function meridianA(index: number, radius: number) {
  return radius * Math.sin((Math.abs(index) / 4) * (Math.PI / 2)) * Math.sign(index)
}

function rowY(row: number, cy: number, radius: number) {
  return cy - radius + row * ((2 * radius) / 10)
}

function pointOnMeridian(mIdx: number, row: number, cx: number, cy: number, radius: number): Point {
  const a = meridianA(mIdx, radius)
  const y = rowY(row, cy, radius)
  const t = (y - cy) / radius
  const xOff = Math.abs(a) * Math.sqrt(Math.max(0, 1 - t * t))
  return { x: cx + (a >= 0 ? xOff : -xOff), y }
}

export function horizontalSpan(row: number, cx: number, cy: number, radius: number) {
  const y = rowY(row, cy, radius)
  const t = (y - cy) / radius
  const half = radius * Math.sqrt(Math.max(0, 1 - t * t))
  return { x1: cx - half, x2: cx + half, y }
}

function arcOrLine(a: number, radius: number, sweep: number, point: Point) {
  const to = `${point.x.toFixed(2)} ${point.y.toFixed(2)}`
  return a < 0.5 ? `L ${to}` : `A ${a.toFixed(2)} ${radius} 0 0 ${sweep} ${to}`
}

function buildPathData(trajectory: TrajectoryStep[], cx: number, cy: number, radius: number) {
  const northPole = { x: cx, y: cy - radius }
  const points = trajectory.map(([m, row]) => pointOnMeridian(m, row, cx, cy, radius))
  const waypoints = [northPole, ...points]
  const parts = [`M ${northPole.x.toFixed(2)} ${northPole.y.toFixed(2)}`]

  points.forEach((point, index) => {
    const [m, row] = trajectory[index]
    if (index === 0) {
      parts.push(arcOrLine(Math.abs(meridianA(m, radius)), radius, m >= 0 ? 1 : 0, point))
      return
    }
    const [prevM, prevRow] = trajectory[index - 1]
    if (m !== prevM) {
      parts.push(`L ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
      return
    }
    const goingDown = row > prevRow
    const sweep = m >= 0 ? (goingDown ? 1 : 0) : goingDown ? 0 : 1
    parts.push(arcOrLine(Math.abs(meridianA(m, radius)), radius, sweep, point))
  })

  return { d: parts.join(' '), waypoints }
}

export function toNodeData(nodes: DeployNode[], cx: number, cy: number, radius: number): DeployNodeData[] {
  return nodes.map((node) => {
    const { d, waypoints } = buildPathData(node.trajectory, cx, cy, radius)
    return { ...node, pathD: d, waypoints, endPt: waypoints[waypoints.length - 1] }
  })
}

/** Path + transform that centres an icon at (x, y) at ICON_SIZE. */
export function resolveIcon(icon: NodeIcon, x: number, y: number) {
  const d = typeof icon === 'string' ? ICON_PATHS[icon] : icon.d
  const viewBox = typeof icon === 'string' || icon.viewBox === undefined ? DEFAULT_ICON_VIEWBOX : icon.viewBox
  const [vbX, vbY, vbW, vbH] = viewBox.split(' ').map(Number)
  const scale = ICON_SIZE / Math.max(vbW, vbH)
  const offsetX = x - (vbW * scale) / 2 - vbX * scale
  const offsetY = y - (vbH * scale) / 2 - vbY * scale
  return { d, transform: `translate(${offsetX.toFixed(2)}, ${offsetY.toFixed(2)}) scale(${scale.toFixed(4)})` }
}

/** SMIL values for the travelling glow: grow at the pole, follow each waypoint, fade at the end, reset. */
export function buildGlowKeyframes(waypoints: Point[]) {
  const count = waypoints.length
  const totalPhases = count + 3
  const first = waypoints[0]
  const last = waypoints[count - 1]
  const frames: { p: Point; r: number; o: number }[] = [
    { p: first, r: 0, o: 0 },
    ...waypoints.map((p) => ({ p, r: 140, o: 1 })),
    { p: last, r: 140, o: 1 },
    { p: last, r: 0, o: 0 },
    { p: first, r: 0, o: 0 },
  ]
  return {
    keyTimes: frames.map((_, index) => (index / totalPhases).toFixed(4)).join(';'),
    cx: frames.map((f) => f.p.x.toFixed(1)).join(';'),
    cy: frames.map((f) => f.p.y.toFixed(1)).join(';'),
    r: frames.map((f) => String(f.r)).join(';'),
    opacity: frames.map((f) => String(f.o)).join(';'),
  }
}

/** Key times for the arrival ripple, timed to when the glow reaches the node. */
export function buildRippleKeyTimes(waypointCount: number) {
  const p1 = waypointCount / (waypointCount + 3)
  const times = [0, p1, Math.min(p1 + 0.06, 0.97), Math.min(p1 + 0.12, 0.98), Math.min(p1 + 0.2, 0.99), 1]
  return times.map((t) => t.toFixed(4)).join(';')
}
