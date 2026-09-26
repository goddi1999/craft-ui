import { useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { Archive, Check, Undo2 } from 'lucide-react'
import type { ReactNode } from 'react'

import './fuse-button.css'

export type FusePosition = 'outline' | 'bottom' | 'top'
export type FuseCommitOn = 'press' | 'fuseEnd'
export type FuseSettle = 'reset' | 'stay'
export type FusePhase = 'idle' | 'armed' | 'settled'
export type FuseSize = 'sm' | 'md' | 'lg'

export interface FuseButtonProps {
  /** Idle action text. @default 'Archive' */
  label?: string
  /** Label shown while the fuse burns (Undo face). @default 'Undo' */
  undoLabel?: string
  /** Text shown with a checkmark once the fuse burns out (if settle is 'stay'). @default 'Archived' */
  doneLabel?: string
  /** Idle glyph; an archive icon is used by default if omitted. */
  icon?: ReactNode
  /** Ink color for labels and icons. @default '#f5f5f5' */
  color?: string
  /** Background surface color of the button. @default '#27272a' */
  background?: string
  /** Color of the lit fuse line or ring. @default '#ff5e24' */
  fuseColor?: string
  /** Height: 36, 44, or 52px with matching typography. @default 'md' */
  size?: FuseSize
  /** Corner radius in px (22 is a full pill at medium size). @default 22 */
  radius?: number
  /** Duration (ms) the fuse burns and Undo remains available. @default 4000 */
  undoWindow?: number
  /** Rim burning clockwise, or a line at the bottom/top edge. @default 'outline' */
  fuse?: FusePosition
  /** Stroke width or line height of the fuse in px. @default 1.5 */
  fuseThickness?: number
  /** Blur crossfade duration between faces after a pointer press. @default 200 */
  crossfadeMs?: number
  /** When onCommit fires: immediately on press (with undo) or after fuse ends. @default 'press' */
  commitOn?: FuseCommitOn
  /** If true, hovering with a mouse freezes the fuse timer. @default true */
  pauseOnHover?: boolean
  /** Return to idle, or stay on the done face after completion. @default 'reset' */
  settle?: FuseSettle
  /** Dims the idle button and ignores presses. @default false */
  disabled?: boolean
  /** Primary action callback. */
  onCommit?: (reason: FuseCommitOn) => void
  /** Called when the action is reverted via Undo or Escape. */
  onUndo?: () => void
  /** Called when the fuse window closes without an undo. */
  onFuseEnd?: () => void
  /** Called on every state transition. */
  onPhaseChange?: (phase: FusePhase) => void
  /** Extra classes for the root. */
  className?: string
  /** HTML button type attribute. @default 'button' */
  type?: 'button' | 'submit' | 'reset'
}

interface Latest {
  onCommit?: (reason: FuseCommitOn) => void
  onUndo?: () => void
  onFuseEnd?: () => void
  onPhaseChange?: (phase: FusePhase) => void
  commitOn: FuseCommitOn
  settle: FuseSettle
}

const LINE: Keyframe[] = [{ transform: 'scaleX(1)' }, { transform: 'scaleX(0)' }]
const OUTLINE: Keyframe[] = [{ strokeDashoffset: 0 }, { strokeDashoffset: -1 }]
const SIZES: Record<FuseSize, { height: number; font: number; icon: number; px: number }> = {
  sm: { height: 36, font: 13, icon: 14, px: 16 },
  md: { height: 44, font: 14, icon: 15, px: 20 },
  lg: { height: 52, font: 15, icon: 17, px: 24 },
}

export function FuseButton({
  label = 'Archive',
  undoLabel = 'Undo',
  doneLabel = 'Archived',
  icon,
  color = '#f5f5f5',
  background = '#27272a',
  fuseColor = '#ff5e24',
  size = 'md',
  radius = 22,
  undoWindow = 4000,
  fuse = 'outline',
  fuseThickness = 1.5,
  crossfadeMs = 200,
  commitOn = 'press',
  pauseOnHover = true,
  settle = 'reset',
  disabled = false,
  onCommit,
  onUndo,
  onFuseEnd,
  onPhaseChange,
  className = '',
  type = 'button',
}: FuseButtonProps) {
  const [phase, setPhase] = useState<FusePhase>('idle')
  const [instant, setInstant] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const idleRef = useRef<HTMLButtonElement>(null)
  const undoRef = useRef<HTMLButtonElement>(null)
  const lineRef = useRef<HTMLElement>(null)
  const rimRef = useRef<SVGRectElement>(null)
  const anim = useRef<Animation | null>(null)
  const pause = useRef({ hover: false, hidden: false, canHoverPause: false })
  const lastInput = useRef<'pointer' | 'keyboard'>('pointer')
  const windowRef = useRef(undoWindow)
  const latest = useRef<Latest>({ commitOn, settle })
  latest.current = { onCommit, onUndo, onFuseEnd, onPhaseChange, commitOn, settle }
  const statusId = useId()
  const preset = SIZES[size] || SIZES.md

  const go = (next: FusePhase) => {
    setInstant(lastInput.current === 'keyboard')
    setPhase(next)
    latest.current.onPhaseChange?.(next)
  }

  const syncPlayState = () => {
    const a = anim.current
    if (!a) return
    const { hover, hidden } = pause.current
    if (hover || hidden) {
      if (a.playState === 'running') a.pause()
    } else if (a.playState === 'paused') {
      a.play()
    }
  }

  const light = (from = 0) => {
    const el = fuse === 'outline' ? rimRef.current : lineRef.current
    if (!el) return
    anim.current?.cancel()
    const a = el.animate(fuse === 'outline' ? OUTLINE : LINE, {
      duration: windowRef.current,
      easing: 'linear',
      fill: 'forwards',
    })
    if (from) a.currentTime = from
    a.onfinish = () => {
      const l = latest.current
      l.onFuseEnd?.()
      if (l.commitOn === 'fuseEnd') l.onCommit?.('fuseEnd')
      lastInput.current = 'pointer'
      go(l.settle === 'stay' ? 'settled' : 'idle')
    }
    anim.current = a
    syncPlayState()
  }

  const arm = () => {
    if (disabled || phase !== 'idle') return
    windowRef.current = undoWindow
    light()
    pause.current.canHoverPause = false
    pause.current.hover = false
    if (commitOn === 'press') onCommit?.('press')
    go('armed')
  }

  const undo = () => {
    if (phase !== 'armed') return
    const a = anim.current
    if (a) {
      a.onfinish = null
      a.pause()
    }
    onUndo?.()
    go('idle')
  }

  useEffect(() => {
    const inside = rootRef.current?.contains(document.activeElement)
    if (phase === 'armed') undoRef.current?.focus({ preventScroll: true })
    else if (inside) (phase === 'idle' ? idleRef.current : rootRef.current)?.focus({ preventScroll: true })
  }, [phase])

  useEffect(() => {
    const onVisibility = () => {
      pause.current.hidden = document.hidden
      syncPlayState()
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      anim.current?.cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const a = anim.current
    if (!a || phase !== 'armed') return
    light(Number(a.currentTime) || 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fuse])

  useEffect(() => {
    if (pauseOnHover) return
    pause.current.hover = false
    syncPlayState()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pauseOnHover])

  const handlePointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    lastInput.current = 'pointer'
    const pressable = phase === 'armed' || (phase === 'idle' && !disabled)
    if (e.button === 0 && pressable && rootRef.current) rootRef.current.dataset.pressed = ''
  }
  const release = () => {
    if (rootRef.current) delete rootRef.current.dataset.pressed
  }
  const handlePointerEnter = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (pauseOnHover && e.pointerType === 'mouse' && pause.current.canHoverPause) {
      pause.current.hover = true
      syncPlayState()
    }
  }
  const handlePointerLeave = (e: React.PointerEvent<HTMLSpanElement>) => {
    release()
    if (e.pointerType !== 'mouse') return
    pause.current.canHoverPause = true
    pause.current.hover = false
    syncPlayState()
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (e.key === 'Enter' || e.key === ' ') lastInput.current = 'keyboard'
    if (e.key === 'Escape' && phase === 'armed') {
      e.preventDefault()
      lastInput.current = 'keyboard'
      undo()
    }
  }

  const actionIcon = icon ?? <Archive size={preset.icon} strokeWidth={1.8} />
  const line = <i ref={lineRef} className="fuse-button__fuse" aria-hidden="true" />

  return (
    <span
      ref={rootRef}
      data-slot="fuse-button"
      tabIndex={-1}
      className={`fuse-button${className ? ` ${className}` : ''}`}
      data-phase={phase}
      data-fuse={fuse}
      data-instant={instant ? '' : undefined}
      aria-disabled={phase === 'settled' || undefined}
      style={
        {
          '--fb-ink': color,
          '--fb-bg': background,
          '--fb-fuse': fuseColor,
          '--fb-fuse-h': `${fuseThickness}px`,
          '--fb-radius': `${radius}px`,
          '--fb-fade': `${crossfadeMs}ms`,
          '--fb-h': `${preset.height}px`,
          '--fb-fs': `${preset.font}px`,
          '--fb-icon': `${preset.icon}px`,
          '--fb-px': `${preset.px}px`,
        } as CSSProperties
      }
      onPointerDown={handlePointerDown}
      onPointerUp={release}
      onPointerCancel={release}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={idleRef}
        type={type}
        className="fuse-button__face fuse-button__idle"
        disabled={disabled}
        inert={phase !== 'idle'}
        onClick={arm}
      >
        <span className="fuse-button__icon" aria-hidden="true">
          {actionIcon}
        </span>
        {label}
      </button>
      <button
        ref={undoRef}
        type="button"
        className="fuse-button__face fuse-button__undo"
        aria-describedby={statusId}
        aria-keyshortcuts="Escape"
        inert={phase !== 'armed'}
        onClick={undo}
      >
        <span className="fuse-button__icon fuse-button__icon--undo" aria-hidden="true">
          <Undo2 size={preset.icon} strokeWidth={2} />
        </span>
        {undoLabel}
        {fuse !== 'outline' ? line : null}
      </button>
      <span className="fuse-button__face fuse-button__settled" inert={phase !== 'settled'}>
        <span className="fuse-button__icon" aria-hidden="true">
          <Check size={preset.icon} strokeWidth={2.2} />
        </span>
        {doneLabel}
      </span>
      {fuse === 'outline' ? (
        <svg className="fuse-button__rim" aria-hidden="true">
          <rect ref={rimRef} pathLength="1" />
        </svg>
      ) : null}
      <span className="fuse-button__status" id={statusId} role="status" aria-live="polite">
        {phase === 'idle' ? '' : doneLabel}
      </span>
    </span>
  )
}
