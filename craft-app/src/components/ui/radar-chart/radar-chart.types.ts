// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type RadarSeries = {
  id: string
  label: string
  /** One value per axis, on the `0…max` scale. */
  values: number[]
  /** Any CSS color. Defaults to the primary color. */
  color?: string
}

type RadarMember = {
  id: string
  /** Short label drawn in the tooltip and legend, e.g. initials. */
  label: string
  /** Full name for screen readers. Defaults to `label`. */
  name?: string
  /** One value per axis, on the `0…max` scale. */
  values: number[]
  /** Any CSS color. Defaults to a categorical palette. */
  color?: string
}

type RadarBaseline = { label: string; values: number[] }

type RadarHeadline = { value: string; caption?: string }

type RadarChartProps = {
  /** One label per axis, clockwise from the top. Five to eight read best. */
  axes: string[]
  /** Top of the scale; the outer ring. */
  max: number
  /** The filled polygon, e.g. a team average. */
  series: RadarSeries
  /** A dashed polygon to measure against, e.g. the bar for a level. */
  baseline?: RadarBaseline
  /** Individual values drawn as dots on each spoke, without polygons. */
  members?: RadarMember[]
  title: string
  subtitle?: string
  /** Number in the header and the line next to it. */
  headline?: RadarHeadline
  format?: (value: number) => string
  onSelect?: (axis: number) => void
  className?: string
}

/** A member with its colour resolved. */
type ColoredMember = RadarMember & { color: string }

export type {
  ColoredMember,
  RadarBaseline,
  RadarChartProps,
  RadarHeadline,
  RadarMember,
  RadarSeries,
}
