import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import './gooey-popover.css'

export type GooeyPopoverProps = {
  /** Content revealed inside the panel. */
  children: ReactNode
  /** Icon shown on the round trigger (and on the blob that closes it). @default rocket glyph */
  icon?: ReactNode
  /** Accessible name for the trigger and the panel. @default 'Stats' */
  label?: string
  /** Panel width in px once open. @default 200 */
  width?: number
  /** Panel height in px once open. @default 88 */
  height?: number
  /** Trigger diameter in px. @default 44 */
  size?: number
  /** Base morph duration in seconds. @default 0.2 */
  duration?: number
  /** Fired when the native popover opens or closes. */
  onOpenChange?: (open: boolean) => void
  /** Extra classes for the root element. */
  className?: string
}

function RocketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 0 1 .75.75c0 5.056-2.383 9.555-6.084 12.436A6.75 6.75 0 0 1 9.75 22.5a.75.75 0 0 1-.75-.75v-4.131A15.838 15.838 0 0 1 6.382 15H2.25a.75.75 0 0 1-.75-.75 6.75 6.75 0 0 1 7.815-6.666ZM15 6.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z"
        clipRule="evenodd"
      />
      <path d="M5.26 17.242a.75.75 0 1 0-.897-1.203 5.243 5.243 0 0 0-2.05 5.022.75.75 0 0 0 .625.627 5.243 5.243 0 0 0 5.022-2.051.75.75 0 1 0-1.202-.897 3.744 3.744 0 0 1-3.008 1.51c0-1.23.592-2.323 1.51-3.008Z" />
    </svg>
  )
}

const supportsAnchoring = () =>
  typeof CSS !== 'undefined' && CSS.supports('anchor-name: --a')

/**
 * A round trigger that melts into a panel through an SVG goo filter. Built on
 * the native `[popover]` API, positioned with CSS anchor positioning (with a
 * measured fallback where that is unsupported).
 */
export function GooeyPopover({
  children,
  icon = <RocketIcon />,
  label = 'Stats',
  width = 200,
  height = 88,
  size = 44,
  duration = 0.2,
  onOpenChange,
  className,
}: GooeyPopoverProps) {
  const reactId = useId()
  const uid = reactId.replace(/[^a-zA-Z0-9_-]/g, '')
  const popoverId = `gooey-popover-${uid}`
  const filterId = `gooey-popover-goo-${uid}`

  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const onOpenChangeRef = useRef(onOpenChange)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    onOpenChangeRef.current = onOpenChange
  })

  useEffect(() => {
    const popover = popoverRef.current
    const trigger = triggerRef.current
    if (!popover || !trigger) return

    const handleBeforeToggle = (event: Event) => {
      const { newState } = event as ToggleEvent
      if (newState !== 'open' || supportsAnchoring()) return
      const rect = trigger.getBoundingClientRect()
      popover.style.left = `${rect.left}px`
      popover.style.top = `${rect.top}px`
    }

    const handleToggle = (event: Event) => {
      const isOpen = (event as ToggleEvent).newState === 'open'
      setOpen(isOpen)
      onOpenChangeRef.current?.(isOpen)
    }

    popover.addEventListener('beforetoggle', handleBeforeToggle)
    popover.addEventListener('toggle', handleToggle)
    return () => {
      popover.removeEventListener('beforetoggle', handleBeforeToggle)
      popover.removeEventListener('toggle', handleToggle)
    }
  }, [])

  const rootStyle = {
    '--gooey-anchor': `--${popoverId}`,
    '--gooey-filter': `url(#${filterId})`,
    '--gooey-size': `${size}px`,
    '--gooey-width': `${width}px`,
    '--gooey-height': `${height}px`,
    '--gooey-speed': `${duration}s`,
  } as CSSProperties

  return (
    <div
      data-slot="gooey-popover"
      data-state={open ? 'open' : 'closed'}
      className={cn(className)}
      style={rootStyle}
    >
      <button
        ref={triggerRef}
        type="button"
        data-gooey-trigger=""
        popoverTarget={popoverId}
        popoverTargetAction="toggle"
        aria-label={label}
        aria-controls={popoverId}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        {icon}
      </button>

      <div
        ref={popoverRef}
        id={popoverId}
        popover="auto"
        role="dialog"
        aria-label={label}
        data-gooey-popover=""
      >
        <div data-gooey-layer="filtered" aria-hidden="true">
          <div data-gooey-content="" />
          <div data-gooey-blob="" />
        </div>
        <div data-gooey-layer="unfiltered">
          <div data-gooey-content="">
            <div data-gooey-body="">{children}</div>
          </div>
          <button
            type="button"
            data-gooey-blob=""
            popoverTarget={popoverId}
            popoverTargetAction="hide"
            aria-label={`Close ${label.toLowerCase()}`}
          >
            {icon}
          </button>
        </div>
      </div>

      <svg
        aria-hidden="true"
        width="0"
        height="0"
        data-gooey-filter=""
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blurred"
            />
            <feColorMatrix
              in="blurred"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
              result="adjusted"
            />
            <feComposite in="adjusted" operator="atop" result="combined" />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
