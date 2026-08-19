import { useCallback, useState } from 'react'

export type UseDisclosureReturn = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
  onToggle: () => void
}

/**
 * Boolean open/closed state for anything that toggles between two visibility
 * states — sidebars, dialogs, popovers, accordions.
 */
export function useDisclosure(defaultOpen = false): UseDisclosureReturn {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  const onOpen = useCallback(() => setIsOpen(true), [])
  const onClose = useCallback(() => setIsOpen(false), [])
  const onToggle = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, onOpen, onClose, onToggle }
}
