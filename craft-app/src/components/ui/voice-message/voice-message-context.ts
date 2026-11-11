import { createContext } from 'react'

export type VoiceMessageGroupContextValue = {
  /** Take the turn: every other message in the group pauses. */
  claim: (id: string, pause: () => void) => void
}

export const VoiceMessageGroupContext =
  createContext<VoiceMessageGroupContextValue | null>(null)
