// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
export type Slot = {
  id: string
  /** ISO date, e.g. "2026-11-10". */
  day: string
  /** 24h "HH:MM" in `timeZone`. */
  start: string
  end: string
  busy?: boolean
  /** The slot the agent recommends. */
  suggested?: boolean
}

export type SlotZone = {
  label: string
  /** Hours from UTC. */
  offset: number
}

export type SlotPickerProps = {
  data: { title?: string; slots: Slot[]; timeZone: SlotZone; attendeeZone?: SlotZone }
  variant?: 'week' | 'day'
  selectedId?: string | null
  onSelect?: (slot: Slot | null) => void
  onConfirm?: (slot: Slot) => void
  /** Set to show the confirmed summary from outside. */
  confirmedId?: string | null
  onChange?: () => void
  className?: string
}
