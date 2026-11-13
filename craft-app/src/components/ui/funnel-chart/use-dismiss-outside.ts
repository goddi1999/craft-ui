import { useEffect, type RefObject } from 'react'

/** Clears selection when the pointer lands outside `ref`. */
export function useDismissOutside(
  ref: RefObject<HTMLElement | null>,
  active: boolean,
  onDismiss: () => void,
) {
  useEffect(() => {
    if (!active) return
    const handlePointerDown = (event: PointerEvent) => {
      const node = ref.current
      if (!node) return
      if (event.target instanceof Node && !node.contains(event.target)) onDismiss()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [active, onDismiss, ref])
}
