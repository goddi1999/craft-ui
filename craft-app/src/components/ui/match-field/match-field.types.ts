// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import type { LucideIcon } from 'lucide-react'

type MatchItem = {
  id: string
  name: string
  /** Shown in the avatar. Defaults to the first letters of the name. */
  initials?: string
  /** Index into `sectors`. */
  sector: number
  /** Fit from 0 to 1. Higher sits closer to the middle. */
  score: number
  /** Avatar color, any CSS color. Defaults to a categorical palette. */
  color?: string
}

type MatchFieldProps = {
  /** Categories around the edge, clockwise from the top. */
  sectors: string[]
  items: MatchItem[]
  title: string
  subtitle?: string
  /** Scores drawn as dashed rings. */
  rings?: number[]
  /** Score that counts as a strong fit: its ring and everything inside it is tinted. */
  threshold?: number
  /** Score that sits on the outer edge. Lower scores are clamped to it. */
  min?: number
  /** Icon in the middle, e.g. the role or request being matched. */
  icon?: LucideIcon
  onSelect?: (item: MatchItem) => void
  className?: string
}

/** An item with its position and colour resolved. */
type PlacedItem = MatchItem & {
  turn: number
  x: number
  y: number
  color: string
}

type FieldDot = { x: number; y: number; size: number; on: boolean }
type FieldRow = { r: number; dots: FieldDot[] }

export type { FieldDot, FieldRow, MatchFieldProps, MatchItem, PlacedItem }
