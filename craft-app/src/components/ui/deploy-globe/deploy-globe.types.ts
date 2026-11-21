export type DeployStatus = 'deploying' | 'deployed' | 'error'

/** [meridian index -4..4, latitude row 0..9] */
export type TrajectoryStep = [number, number]

export type BuiltInNodeIcon =
  | 'triangle'
  | 'server'
  | 'database'
  | 'globe'
  | 'shield'
  | 'zap'
  | 'cloud'
  | 'hexagon'

export type CustomNodeIcon = { d: string; viewBox?: string }

export type NodeIcon = BuiltInNodeIcon | CustomNodeIcon

export type DeployNode = {
  id: string
  trajectory: TrajectoryStep[]
  icon?: NodeIcon
}

export type Point = { x: number; y: number }

export type DeployNodeData = DeployNode & {
  pathD: string
  waypoints: Point[]
  endPt: Point
}

export type DeployGlobeProps = {
  status?: DeployStatus
  nodes?: DeployNode[]
  /** Any CSS colour. Ignored while status is 'error'. */
  accentColor?: string
  /** Seconds per animation loop. */
  duration?: number
  className?: string
  onReplay?: () => void
}
