import { useId, useState } from 'react'
import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { DeployGlobeStatusBadge, DeployPath, GlobeWireframe, NodeMarker } from './deploy-globe-parts'
import {
  DEFAULT_ACCENT,
  DEFAULT_DURATION,
  DEFAULT_NODES,
  STATUS_LABELS,
  VIEW_HEIGHT,
  VIEW_WIDTH,
} from './deploy-globe.constants'
import type { DeployGlobeProps } from './deploy-globe.types'
import { toNodeData } from './deploy-globe.utils'

const CX = VIEW_WIDTH / 2
const CY = VIEW_HEIGHT
const RADIUS = VIEW_HEIGHT

/** A wireframe half-globe where glowing paths travel from the pole to each node, then ripple on arrival. */
export function DeployGlobe({
  status = 'deployed',
  nodes = DEFAULT_NODES,
  accentColor = DEFAULT_ACCENT,
  duration = DEFAULT_DURATION,
  className,
  onReplay,
}: DeployGlobeProps) {
  const [animationKey, setAnimationKey] = useState(0)
  const reducedMotion = useReducedMotion() === true
  const baseId = useId()

  const isError = status === 'error'
  const accent = isError ? 'var(--destructive)' : accentColor
  const nodeData = toNodeData(nodes, CX, CY, RADIUS)

  function handleReplay() {
    setAnimationKey((key) => key + 1)
    onReplay?.()
  }

  return (
    <div data-slot="deploy-globe" className={cn('relative flex w-full flex-col items-center justify-center', className)}>
      <svg
        key={animationKey}
        data-slot="deploy-globe-svg"
        aria-hidden
        className="h-auto w-full max-w-[800px] overflow-visible"
        viewBox={`-1 -1 ${VIEW_WIDTH + 2} ${VIEW_HEIGHT + 2}`}
      >
        <GlobeWireframe cx={CX} cy={CY} radius={RADIUS} />
        {isError
          ? null
          : nodeData.map((node) => (
              <DeployPath
                key={`p-${node.id}`}
                gradientId={`${baseId}-${node.id}`}
                pathD={node.pathD}
                waypoints={node.waypoints}
                accent={accent}
                duration={duration}
                reducedMotion={reducedMotion}
              />
            ))}
        {nodeData.map((node) => (
          <NodeMarker
            key={`n-${node.id}`}
            x={node.endPt.x}
            y={node.endPt.y}
            icon={node.icon}
            accent={accent}
            duration={duration}
            waypointCount={node.waypoints.length}
            reducedMotion={reducedMotion}
          />
        ))}
      </svg>
      <DeployGlobeStatusBadge label={STATUS_LABELS[status]} onReplay={handleReplay} />
    </div>
  )
}
