import { SCALE } from './agent-computer-icon.constants'
import type { ArcFrame, DotFrame } from './agent-computer-icon.types'

/** Each ring's three-stop hue gradient, laid along its long axis. */
export function ArcGradients({ arcs, prefix }: { arcs: ArcFrame[]; prefix: string }) {
  return arcs.map((arc) => (
    <linearGradient
      key={arc.id}
      id={`${prefix}-${arc.id}`}
      gradientUnits="userSpaceOnUse"
      x1={arc.gradient.x1}
      y1={arc.gradient.y1}
      x2={arc.gradient.x2}
      y2={arc.gradient.y2}
    >
      {arc.gradient.stops.map((stop, index) => (
        <stop key={index} offset={index / (arc.gradient.stops.length - 1)} stopColor={stop} />
      ))}
    </linearGradient>
  ))
}

/** The stretch of every ring on one side of the body: `back` is drawn under it, `front` over it. */
export function ArcStrokes({
  arcs,
  side,
  prefix,
}: {
  arcs: ArcFrame[]
  side: 'front' | 'back'
  prefix: string
}) {
  return (
    <g fill="none" strokeLinecap="round">
      {arcs.map((arc) =>
        arc[side] ? (
          <path
            key={arc.id}
            d={arc[side]}
            opacity={arc.opacity}
            stroke={`url(#${prefix}-${arc.id})`}
            strokeWidth={arc.width}
          />
        ) : null,
      )}
    </g>
  )
}

/** Loose dots in the body's colour: circles, or a path such as the alert's drop. */
export function Dots({ dots, fill }: { dots: DotFrame[]; fill: string }) {
  return dots.map((dot, index) =>
    dot.d ? (
      <path
        key={index}
        d={dot.d}
        fill={fill}
        opacity={dot.opacity}
        transform={`translate(${dot.x} ${dot.y}) rotate(${dot.rot ?? 0}) scale(${SCALE})`}
      />
    ) : (
      <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} fill={fill} opacity={dot.opacity} />
    ),
  )
}
