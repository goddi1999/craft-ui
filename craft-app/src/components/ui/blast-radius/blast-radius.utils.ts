// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { C, OUTER, SIZE, SPREAD } from './blast-radius.constants'
import type { BlastNode, Placed } from './blast-radius.types'

export const round = (n: number) => Math.round(n * 100) / 100

export const polar = (turn: number, r: number) => {
  const a = turn * 2 * Math.PI - Math.PI / 2
  // Rounded so server and client trig agree and hydration matches.
  return [round(C + r * Math.cos(a)), round(C + r * Math.sin(a))] as const
}

export const hops = (depth: number) => `${depth} ${depth === 1 ? 'hop' : 'hops'}`

/** A coordinate in the 320 viewBox as a percentage of the container. */
export const pct = (v: number) => `${round((v / SIZE) * 100)}%`

/**
 * Lays nodes out from data alone: the first hop evenly by angle, every later
 * hop fanned around its parent inside the parent's sector. Returns nodes in
 * clockwise depth-first order, which is also the keyboard order.
 */
export function layoutNodes(nodes: BlastNode[]) {
  const ids = new Set(nodes.map((n) => n.id))
  const children = new Map<string, BlastNode[]>()
  for (const node of nodes) {
    const parent = node.parent && ids.has(node.parent) ? node.parent : ''
    children.set(parent, [...(children.get(parent) ?? []), node])
  }

  const raw: { node: BlastNode; turn: number; depth: number; path: string[] }[] = []
  const seen = new Set<string>()
  const walk = (parent: string, turn: number, span: number, depth: number, path: string[]) => {
    const kids = (children.get(parent) ?? []).filter((k) => !seen.has(k.id))
    kids.forEach((kid, j) => {
      seen.add(kid.id)
      const share = depth === 0 ? span : span * SPREAD
      const t = depth === 0 ? j / kids.length : turn + share * ((j + 0.5) / kids.length - 0.5)
      const kidPath = [kid.id, ...path]
      raw.push({ node: kid, turn: t, depth: depth + 1, path: kidPath })
      walk(kid.id, t, share / kids.length, depth + 1, kidPath)
    })
  }
  walk('', 0, 1, 0, [])

  const maxDepth = Math.max(1, ...raw.map((r) => r.depth))
  const radius = (depth: number) => round((OUTER * depth) / maxDepth)
  const pos = new Map<string, readonly [number, number]>()
  for (const r of raw) pos.set(r.node.id, polar(r.turn, radius(r.depth)))

  // A node is on an affected path when it, or anything reached through it, is affected.
  const reach = new Set<string>()
  for (const r of raw) if (r.node.affected) r.path.forEach((id) => reach.add(id))

  const placed: Placed[] = raw.map((r) => {
    const [x, y] = pos.get(r.node.id)!
    const [px, py] = r.depth === 1 ? [C, C] : pos.get(r.path[1])!
    return {
      ...r.node,
      x,
      y,
      px,
      py,
      depth: r.depth,
      path: r.path,
      reach: reach.has(r.node.id),
    }
  })

  // Ring labels sit on the sector boundary nearest 9 o'clock, where no edge runs.
  const first = children.get('')?.length ?? 0
  const gap = first
    ? Array.from({ length: first }, (_, i) => (i + 0.5) / first).reduce((best, t) =>
        Math.abs(t - 0.75) < Math.abs(best - 0.75) ? t : best,
      )
    : 0.75

  return { placed, maxDepth, radius, gap }
}
