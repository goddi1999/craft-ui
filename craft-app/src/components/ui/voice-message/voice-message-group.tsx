import { useCallback, useMemo, useRef, type ReactNode } from 'react'

import { VoiceMessageGroupContext } from './voice-message-context'

/**
 * Wrap a conversation in this so only one message plays at a time. The map
 * lives in a ref, so claiming a turn never re-renders the other messages.
 */
export function VoiceMessageGroup({ children }: { children: ReactNode }) {
  const messages = useRef(new Map<string, () => void>())

  const claim = useCallback((id: string, pause: () => void) => {
    messages.current.set(id, pause)
    messages.current.forEach((stop, other) => other !== id && stop())
  }, [])

  const value = useMemo(() => ({ claim }), [claim])

  return (
    <VoiceMessageGroupContext.Provider value={value}>
      {children}
    </VoiceMessageGroupContext.Provider>
  )
}
