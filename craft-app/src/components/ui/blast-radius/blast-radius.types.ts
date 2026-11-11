// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { LucideIcon } from 'lucide-react'

export type BlastNode = {
  id: string
  label: string
  /** Id of the node this one is reached through. Leave out to attach it to the centre. */
  parent?: string
  /** Key into `kinds`: database, bucket, service, key, person… */
  kind: string
  /** In the blast radius: drawn with a negative ring, its path turns negative. */
  affected?: boolean
  /** Reached indirectly: its edge and ring are dashed. */
  indirect?: boolean
  /** Shown under the name in the tooltip, e.g. "Read by the new key". */
  note?: string
}

export type BlastKind = { label: string; color: string }

export type BlastRadiusProps = {
  /** The entity everything is measured from: a key, an agent, a person. */
  center: { label: string; initials?: string; icon?: LucideIcon }
  nodes: BlastNode[]
  /** Legend and colours per kind. Missing kinds get the categorical palette. */
  kinds?: Record<string, BlastKind>
  title: string
  subtitle?: string
  /** Right side of the header: a status pill or a count. */
  aside?: React.ReactNode
  onSelect?: (node: BlastNode) => void
  className?: string
}

export type Placed = BlastNode & {
  x: number
  y: number
  depth: number
  /** Parent position, or the centre for the first hop. */
  px: number
  py: number
  /** Ids from this node back to the centre. */
  path: string[]
  /** Affected, or leads to something affected. */
  reach: boolean
}
