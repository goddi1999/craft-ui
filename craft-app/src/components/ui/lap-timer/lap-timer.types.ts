// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type LapSector = {
  id: string
  /** Stage name, e.g. "retrieve". */
  label: string
  /** Best split for this stage, in seconds. */
  best: number
  /** Split in seconds once the stage is done. Leave out while it runs. */
  split?: number
}

type LapTimerProps = {
  /** Stages in order. The first one without a `split` is the running one. */
  sectors: LapSector[]
  /** Seconds since the lap started. Drives the hand and the clock. */
  elapsed: number
  /** Best full lap in seconds. Defaults to the sum of the sector bests. */
  best?: number
  /** Whether the lap is still going. When false, the last split ends the lap. */
  running?: boolean
  /** Seconds per turn of the dial. Picked from the best lap when left out. */
  dial?: number
  title: string
  subtitle?: string
  /** Line above the sector table, e.g. "Lap 3". */
  lap?: string
  /** Extra content on the right of the header, e.g. a status pill. */
  aside?: React.ReactNode
  /** Formats split times. */
  format?: (seconds: number) => string
  className?: string
}

/** A finished or running sector's arc on the dial. */
type SectorArc = { id: string; d: string; state: 'live' | 'faster' | 'slower' }

export type { LapSector, LapTimerProps, SectorArc }
