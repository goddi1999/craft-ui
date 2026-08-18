import {
  useEffect,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react'

import {
  SpotlightPointerContext,
  createSpotlightPointerGroup,
} from './spotlight-pointer-context'

export type SpotlightPointerProviderProps = {
  children?: ReactNode
  /** Milliseconds the cursor must linger before the light comes up. */
  hoverDelay?: number
  className?: string
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>

/**
 * Shares one cursor position with every spotlight inside it, so a carousel
 * lights all of its slides from the same source and the highlight stays
 * continuous as slides scroll past.
 */
export function SpotlightPointerProvider({
  children,
  hoverDelay = 150,
  className,
  ...props
}: SpotlightPointerProviderProps) {
  const hostRef = useRef<HTMLDivElement>(null)
  // Created once; the object itself is the shared mutable channel.
  const [group] = useState(createSpotlightPointerGroup)
  // Kept in a ref so changing the delay does not rebind the pointer listeners.
  const hoverDelayRef = useRef(hoverDelay)

  useEffect(() => {
    hoverDelayRef.current = hoverDelay
  }, [hoverDelay])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let hoverTimer: number | null = null
    const clearHoverTimer = () => {
      if (hoverTimer !== null) {
        window.clearTimeout(hoverTimer)
        hoverTimer = null
      }
    }

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null
      // The tablist sits on top of the art; moving over it should not relight.
      if (target?.closest('[role="tablist"]')) return
      const rect = host.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      group.pointer.x = (event.clientX - rect.left) / rect.width
      group.pointer.y = (event.clientY - rect.top) / rect.height
      group.wakeAll()
      if (!group.pointer.active && hoverTimer === null) {
        hoverTimer = window.setTimeout(() => {
          hoverTimer = null
          group.pointer.active = true
          group.wakeAll()
        }, hoverDelayRef.current)
      }
    }

    const onPointerLeave = () => {
      clearHoverTimer()
      group.pointer.active = false
      group.wakeAll()
    }

    const onFocusIn = (event: FocusEvent) => {
      const target = event.target as HTMLElement | null
      if (target?.closest('[role="tablist"]')) return
      group.pointer.x = 0.5
      group.pointer.y = 0.5
      group.pointer.active = true
      group.wakeAll()
    }

    const onFocusOut = (event: FocusEvent) => {
      const next = event.relatedTarget as HTMLElement | null
      if (next?.closest('[role="tablist"]')) return
      group.pointer.active = false
      group.wakeAll()
    }

    host.addEventListener('pointermove', onPointerMove)
    host.addEventListener('pointerleave', onPointerLeave)
    host.addEventListener('focusin', onFocusIn)
    host.addEventListener('focusout', onFocusOut)

    return () => {
      clearHoverTimer()
      host.removeEventListener('pointermove', onPointerMove)
      host.removeEventListener('pointerleave', onPointerLeave)
      host.removeEventListener('focusin', onFocusIn)
      host.removeEventListener('focusout', onFocusOut)
    }
  }, [group])

  return (
    <SpotlightPointerContext.Provider value={group}>
      <div ref={hostRef} className={className} {...props}>
        {children}
      </div>
    </SpotlightPointerContext.Provider>
  )
}
