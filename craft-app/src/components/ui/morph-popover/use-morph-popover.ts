import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react'

import type { MorphPopoverContextValue } from './morph-popover.types'

export const MorphPopoverContext = createContext<MorphPopoverContextValue | undefined>(undefined)

export function useMorphPopover() {
  const context = useContext(MorphPopoverContext)
  if (!context) throw new Error('useMorphPopover must be used within MorphPopover')
  return context
}

export function useMorphPopoverState(): MorphPopoverContextValue {
  const uniqueId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState('')

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => {
    setIsOpen(false)
    setNote('')
  }, [])

  return { isOpen, open, close, uniqueId, note, setNote, triggerRef }
}

/** Escape and outside pointer-down close the panel; listeners live only while open. */
export function useDismiss(
  ref: React.RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!isOpen) return
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) onDismiss()
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onDismiss()
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [ref, isOpen, onDismiss])
}
