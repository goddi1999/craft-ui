import { Moon, Sun } from 'lucide-react'
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { flushSync } from 'react-dom'

import { cn } from '@/lib/utils'

import './3d-theme-switch.css'

export type ThemeSwitch3DProps = {
  /** Controlled state — `true` shows the dark face. */
  checked?: boolean
  /** Initial state when uncontrolled. @default false */
  defaultChecked?: boolean
  /** Called with the next state; runs inside the view transition update. */
  onCheckedChange?: (checked: boolean) => void
  /** Perspective depth as a multiple of the face width. @default 4 */
  perspective?: number
  /** How far the face is pushed back mid-turn, as a fraction of the perspective. @default 0.75 */
  distance?: number
  /** Length of the turn in seconds. @default 1.2 */
  duration?: number
  /** Show the opposite sky behind the turning face (night behind light). @default true */
  invert?: boolean
  /** Accessible name of the switch. @default 'Dark mode' */
  label?: string
  /** Content shown on the face, beside the switch. */
  children?: ReactNode
  /** Extra classes for the root (sky) element. */
  className?: string
}

const TRANSITION_NAME = 'theme-switch-3d'
const DOCUMENT_VARS = ['perspective', 'distance', 'half', 'duration'] as const

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

function clearDocumentVars() {
  for (const name of DOCUMENT_VARS) {
    document.documentElement.style.removeProperty(`--theme-switch-3d-${name}`)
  }
}

/**
 * A light/dark switch whose surface turns like the face of a cube, using a
 * View Transition with a chained `perspective()` transform. It only flips its
 * own face — wire `onCheckedChange` to your theme provider to drive the app.
 */
export function ThemeSwitch3D({
  checked,
  defaultChecked = false,
  onCheckedChange,
  perspective = 4,
  distance = 0.75,
  duration = 1.2,
  invert = true,
  label = 'Dark mode',
  children,
  className,
}: ThemeSwitch3DProps) {
  const isControlled = checked !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultChecked)
  const isChecked = isControlled ? checked : uncontrolled

  const faceRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<ViewTransition | null>(null)

  useEffect(
    () => () => {
      transitionRef.current?.skipTransition()
      transitionRef.current = null
      clearDocumentVars()
    },
    [],
  )

  const commit = (next: boolean) => {
    if (!isControlled) setUncontrolled(next)
    onCheckedChange?.(next)
  }

  const handleToggle = () => {
    const next = !isChecked
    const face = faceRef.current

    if (!face || !document.startViewTransition || prefersReducedMotion()) {
      commit(next)
      return
    }

    const width = face.getBoundingClientRect().width
    const root = document.documentElement.style
    root.setProperty('--theme-switch-3d-perspective', `${width * perspective}px`)
    root.setProperty('--theme-switch-3d-distance', `${-distance}`)
    root.setProperty('--theme-switch-3d-half', `${width / 2}px`)
    root.setProperty('--theme-switch-3d-duration', `${duration}s`)
    face.style.viewTransitionName = TRANSITION_NAME

    const transition = document.startViewTransition(() => {
      flushSync(() => commit(next))
    })
    transitionRef.current = transition

    transition.finished.finally(() => {
      if (transitionRef.current !== transition) return
      transitionRef.current = null
      face.style.viewTransitionName = ''
      clearDocumentVars()
    })
  }

  const rootStyle = {
    '--theme-switch-3d-sky-duration': `${duration}s`,
  } as CSSProperties

  const state = isChecked ? 'checked' : 'unchecked'

  return (
    <div
      data-slot="3d-theme-switch"
      data-state={state}
      data-invert={invert}
      className={cn(className)}
      style={rootStyle}
    >
      <div ref={faceRef} data-theme-switch-face="" data-state={state}>
        <button
          type="button"
          role="switch"
          aria-checked={isChecked}
          aria-label={label}
          data-theme-switch-control=""
          data-state={state}
          onClick={handleToggle}
        >
          <span data-theme-switch-thumb="">
            {isChecked ? (
              <Moon aria-hidden="true" className="size-3.5" />
            ) : (
              <Sun aria-hidden="true" className="size-3.5" />
            )}
          </span>
        </button>
        {children}
      </div>
    </div>
  )
}
