import { RotateCw } from 'lucide-react'

import { MERIDIANS, ROWS } from './deploy-globe.constants'
import type { NodeIcon, Point } from './deploy-globe.types'
import {
  buildGlowKeyframes,
  buildRippleKeyTimes,
  horizontalSpan,
  meridianA,
  resolveIcon,
} from './deploy-globe.utils'

type Circle = { cx: number; cy: number; radius: number }

export function GlobeWireframe({ cx, cy, radius }: Circle) {
  return (
    <g data-slot="deploy-globe-wireframe" className="stroke-border" fill="none" strokeWidth="1" opacity="0.75">
      <circle cx={cx} cy={cy} r={radius} vectorEffect="non-scaling-stroke" />
      {MERIDIANS.map((m) => (
        <path
          key={`m${m}`}
          d={`M ${cx} ${cy + radius} A ${Math.abs(meridianA(m, radius)).toFixed(3)} ${radius} 0 0 ${m >= 0 ? 1 : 0} ${cx} ${cy - radius}`}
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {ROWS.map((row) => {
        const { x1, x2, y } = horizontalSpan(row, cx, cy, radius)
        return (
          <line
            key={`r${row}`}
            x1={x1.toFixed(2)}
            x2={x2.toFixed(2)}
            y1={y.toFixed(2)}
            y2={y.toFixed(2)}
            vectorEffect="non-scaling-stroke"
          />
        )
      })}
    </g>
  )
}

type DeployPathProps = {
  gradientId: string
  pathD: string
  waypoints: Point[]
  accent: string
  duration: number
  reducedMotion: boolean
}

export function DeployPath({ gradientId, pathD, waypoints, accent, duration, reducedMotion }: DeployPathProps) {
  if (reducedMotion) {
    return (
      <path
        data-slot="deploy-globe-path"
        d={pathD}
        fill="none"
        stroke={accent}
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0.6"
        vectorEffect="non-scaling-stroke"
      />
    )
  }

  const frames = buildGlowKeyframes(waypoints)
  const first = waypoints[0]
  const dur = `${duration}s`

  return (
    <g data-slot="deploy-globe-path">
      <path
        d={pathD}
        fill="none"
        stroke={`url(#${gradientId})`}
        strokeLinecap="round"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      >
        <animate attributeName="opacity" dur={dur} keyTimes={frames.keyTimes} repeatCount="indefinite" values={frames.opacity} />
      </path>
      <defs>
        <radialGradient id={gradientId} cx={first.x} cy={first.y} r="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={accent} />
          <stop offset="0.4" stopColor={accent} />
          <stop offset="1" stopColor={accent} stopOpacity="0" />
          <animate attributeName="cx" dur={dur} keyTimes={frames.keyTimes} repeatCount="indefinite" values={frames.cx} />
          <animate attributeName="cy" dur={dur} keyTimes={frames.keyTimes} repeatCount="indefinite" values={frames.cy} />
          <animate attributeName="r" dur={dur} keyTimes={frames.keyTimes} repeatCount="indefinite" values={frames.r} />
        </radialGradient>
      </defs>
    </g>
  )
}

type NodeMarkerProps = Point & {
  accent: string
  duration: number
  waypointCount: number
  icon?: NodeIcon
  reducedMotion: boolean
}

export function NodeMarker({ x, y, accent, duration, waypointCount, icon, reducedMotion }: NodeMarkerProps) {
  const keyTimes = buildRippleKeyTimes(waypointCount)
  const dur = `${duration}s`

  return (
    <g data-slot="deploy-globe-node-marker">
      {reducedMotion ? null : (
        <circle cx={x} cy={y} r="0" fill="none" opacity="0" stroke={accent} strokeWidth="2">
          <animate attributeName="r" dur={dur} keyTimes={keyTimes} repeatCount="indefinite" values="0;0;14;22;28;0" />
          <animate attributeName="opacity" dur={dur} keyTimes={keyTimes} repeatCount="indefinite" values="0;0;0.9;0.5;0;0" />
        </circle>
      )}
      <circle cx={x} cy={y} r="16" className="fill-background stroke-border" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      {icon === undefined ? (
        <circle cx={x} cy={y} r="8" className="fill-muted-foreground" />
      ) : (
        <NodeIconPath icon={icon} x={x} y={y} />
      )}
    </g>
  )
}

function NodeIconPath({ icon, x, y }: Point & { icon: NodeIcon }) {
  const { d, transform } = resolveIcon(icon, x, y)
  return <path d={d} transform={transform} className="fill-muted-foreground" fillRule="evenodd" clipRule="evenodd" />
}

type StatusBadgeProps = {
  label: string
  onReplay: () => void
}

export function DeployGlobeStatusBadge({ label, onReplay }: StatusBadgeProps) {
  return (
    <div
      data-slot="deploy-globe-status"
      className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center overflow-hidden rounded-lg border bg-background shadow-sm select-none"
    >
      <span role="status" className="px-4 py-2 font-mono text-xs tracking-wide text-muted-foreground">
        {label}
      </span>
      <button
        type="button"
        data-slot="deploy-globe-replay"
        aria-label="Replay globe animation"
        onClick={onReplay}
        className="flex items-center self-stretch border-l px-3 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
      >
        <RotateCw className="size-3.5" aria-hidden />
      </button>
    </div>
  )
}
