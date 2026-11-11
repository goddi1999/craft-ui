// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type RadialSeries = {
  id: string
  label: string
  /** One value per sector. Series stack outward in order. */
  values: number[]
  /** Any CSS color. Defaults to blue, then foreground, then muted. */
  color?: string
}

type RadialCenter = { value: string; caption?: string }

type RadialDotsProps = {
  /** One label per sector, clockwise from the top: hours, weekdays, months. */
  labels: string[]
  series: RadialSeries[]
  title: string
  subtitle?: string
  /** Big number in the middle and the line under it. */
  center: RadialCenter
  /** Which sector labels to draw around the edge. Defaults to the four quarters. */
  axis?: number[]
  format?: (value: number) => string
  onSelect?: (index: number) => void
  className?: string
}

/** A series with its colour resolved. */
type ColoredRadialSeries = RadialSeries & { color: string }

export type {
  ColoredRadialSeries,
  RadialCenter,
  RadialDotsProps,
  RadialSeries,
}
