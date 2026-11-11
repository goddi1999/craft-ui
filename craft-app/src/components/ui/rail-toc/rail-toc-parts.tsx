import { motion, type MotionValue } from 'motion/react'
import type { RefObject } from 'react'

import { cn } from '@/lib/utils'

import type { RailTocGeometry, RailTocItem } from './rail-toc.types'
import { PLANE, PLANE_HOLE } from './rail-toc.utils'

type RailTocRailProps = {
  geometry: RailTocGeometry
  items: RailTocItem[]
  maskId: string
  /** Headings the plane has reached; their dots fill in. */
  reached: number
  /** 0–1 share of the rail drawn solid behind the plane. */
  filled: MotionValue<number>
  pathRef: RefObject<SVGPathElement | null>
  /** The two holes that follow the plane, one per mask. */
  holeRefs: RefObject<(SVGCircleElement | null)[]>
}

/** The dashed rail, its solid trail and one dot per heading, cut away under the plane. */
export function RailTocRail({
  geometry,
  items,
  maskId,
  reached,
  filled,
  pathRef,
  holeRefs,
}: RailTocRailProps) {
  const bounds = {
    x: -8,
    y: -8,
    width: geometry.width + 16,
    height: geometry.height + 16,
  }

  return (
    <svg
      className="pointer-events-none absolute top-0 left-0 overflow-visible"
      width={geometry.width}
      height={geometry.height}
      aria-hidden
    >
      <linearGradient
        id={`${maskId}-fade`}
        gradientUnits="userSpaceOnUse"
        x1={0}
        y1={0}
        x2={0}
        y2={geometry.nodes[0].y - 4}
      >
        <stop offset="0" stopColor="black" />
        <stop offset="1" stopColor="white" />
      </linearGradient>
      <mask id={maskId} maskUnits="userSpaceOnUse" {...bounds}>
        <rect {...bounds} fill={`url(#${maskId}-fade)`} />
        {geometry.nodes.map((node, i) => (
          <circle key={i} cx={node.x} cy={node.y} r={4} fill="black" />
        ))}
        <circle
          ref={(el) => {
            holeRefs.current[0] = el
          }}
          r={PLANE_HOLE}
          fill="black"
        />
      </mask>
      <mask id={`${maskId}-nodes`} maskUnits="userSpaceOnUse" {...bounds}>
        <rect {...bounds} fill="white" />
        <circle
          ref={(el) => {
            holeRefs.current[1] = el
          }}
          r={PLANE_HOLE}
          fill="black"
        />
      </mask>
      <g mask={`url(#${maskId})`}>
        <path
          ref={pathRef}
          d={geometry.d}
          fill="none"
          strokeWidth="1.25"
          strokeDasharray="2 5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="stroke-foreground/25"
        />
        <motion.path
          d={geometry.d}
          fill="none"
          strokeWidth="1.25"
          stroke="var(--rail)"
          strokeLinejoin="round"
          style={{ pathLength: filled }}
        />
      </g>
      <g mask={`url(#${maskId}-nodes)`}>
        {geometry.nodes.map((node, i) => {
          const isCovered = i < reached
          return (
            <circle
              key={items[i]?.id ?? i}
              cx={node.x}
              cy={node.y}
              r={isCovered ? 3 : 3.25}
              strokeWidth="1.25"
              className={cn(
                'transition-[fill,stroke] duration-200',
                isCovered
                  ? 'fill-(--rail) stroke-(--rail)'
                  : 'fill-transparent stroke-foreground/30',
              )}
            />
          )
        })}
      </g>
    </svg>
  )
}

type RailTocPlaneProps = {
  x: MotionValue<number>
  y: MotionValue<number>
  rotate: MotionValue<number>
}

/** The paper plane, posed along the rail from outside React's render. */
export function RailTocPlane({ x, y, rotate }: RailTocPlaneProps) {
  return (
    <motion.div
      data-slot="rail-toc-plane"
      className="pointer-events-none absolute top-0 left-0 -mt-2 -ml-2 size-4 text-foreground [filter:drop-shadow(0_0_2px_rgb(0_0_0/0.35))]"
      style={{ x, y, rotate }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4 overflow-visible">
        <path
          d={PLANE}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    </motion.div>
  )
}
