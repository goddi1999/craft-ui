// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
type EvalRacer = {
  id: string
  /** Short name drawn in the standings, e.g. a model id. */
  label: string
  /** Full name for screen readers. Defaults to `label`. */
  name?: string
  /** Cases scored so far, `0…total`. */
  scored: number
  /** Duration of each completed lap, in seconds. */
  laps?: number[]
}

type EvalRaceLayout = 'race' | 'standings'

type EvalRaceProps = {
  racers: EvalRacer[]
  /** Cases in the eval set; the finish. */
  total: number
  /** Cases per lap of the track. */
  perLap: number
  title?: string
  subtitle?: string
  /** `race` puts the track first; `standings` leads with the table. */
  layout?: EvalRaceLayout
  /** Defaults to final once every racer has scored `total`. */
  status?: 'live' | 'final'
  formatTime?: (seconds: number) => string
  /** Called when a racer is hovered or reached with the arrow keys. */
  onSelect?: (id: string | null) => void
  className?: string
}

type EvalRacePosition = EvalRacer & {
  rank: number
  done: boolean
  lap: number
  best: number | null
  last: number | null
  /** Cases behind the leader. */
  behind: number
  gap: string
}

export type { EvalRaceLayout, EvalRacePosition, EvalRaceProps, EvalRacer }
