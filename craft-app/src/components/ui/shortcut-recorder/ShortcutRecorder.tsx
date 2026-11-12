import { RotateCcw, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'

import { cn } from '@/lib/utils'

import {
  ACTION_BUTTON,
  BLUR_SOFT,
  BLUR_SUBTLE,
  CHIP,
  CHIP_FADE,
  DURATION,
  EASE_ENTER,
  EASE_IN_OUT,
  LINK_BUTTON,
  LINK_QUIET,
  NO_TAP,
  POP,
  SETTLE_MS,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
} from './shortcut-recorder.constants'
import type {
  PendingShortcut,
  ShortcutBinding,
  ShortcutRecorderProps,
} from './shortcut-recorder.types'
import {
  findConflict,
  formatShortcut,
  hasStrongModifier,
  liveModifiers,
  shortcutFromEvent,
  shortcutTokens,
} from './shortcut-recorder.utils'
import { ShortcutKbd } from './shortcut-recorder-parts'
import { usePlatform } from './use-platform'

type Message = { tone: 'hint' | 'warning'; key: string; body: ReactNode }

const CONTROL_STATE = {
  idle: 'hover:border-foreground',
  recording: 'border-primary bg-primary/4',
  conflict: 'border-amber-500',
} as const

/**
 * A field that records a keyboard shortcut. Press it, then press the combination: held
 * modifiers light up as caps while you build the chord, the finished shortcut settles into
 * place, and a combination that is already taken asks before it is used. Escape cancels,
 * Backspace clears, and the reset button restores the default. Adapted from uiarc.
 */
export function ShortcutRecorder({
  label,
  hideLabel = false,
  value,
  defaultValue = null,
  onValueChange,
  resetValue,
  bindings = [],
  warnReserved = true,
  requireModifier = true,
  platform: platformProp,
  placeholder = 'Record shortcut',
  description,
  disabled = false,
  id,
  className,
}: ShortcutRecorderProps) {
  const reduced = useReducedMotion() === true
  const platform = usePlatform(platformProp)
  const uid = useId()
  const buttonId = id ?? `${uid}-button`
  const labelId = `${uid}-label`
  const messageId = `${uid}-message`

  const [inner, setInner] = useState<string | null>(defaultValue)
  const current = value !== undefined ? value : inner
  const restoreTo = resetValue !== undefined ? resetValue : defaultValue

  const [recording, setRecording] = useState(false)
  const [live, setLive] = useState<string[]>([])
  const [pending, setPending] = useState<PendingShortcut | null>(null)
  const [nudge, setNudge] = useState<string | null>(null)
  const [settled, setSettled] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  const buttonRef = useRef<HTMLButtonElement>(null)

  // the message slot springs to its measured height, so a message that wraps grows in
  const [messageHeight, setMessageHeight] = useState<number | null>(null)
  const measureMessage = useCallback((node: HTMLDivElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(() => setMessageHeight(node.getBoundingClientRect().height))
    observer.observe(node)
    return () => {
      observer.disconnect()
      setMessageHeight(null)
    }
  }, [])

  useEffect(() => {
    if (!settled) return
    const timer = window.setTimeout(() => setSettled(0), SETTLE_MS)
    return () => window.clearTimeout(timer)
  }, [settled])

  const spoken = (shortcut: string | null) =>
    shortcut ? formatShortcut(shortcut, platform).spoken : 'none'

  function commit(next: string | null, replaced?: ShortcutBinding) {
    setPending(null)
    setNudge(null)
    if (value === undefined) setInner(next)
    onValueChange?.(next, { replaced })
    setSettled((count) => count + 1)
    setAnnouncement(next ? `Shortcut set to ${spoken(next)}` : 'Shortcut cleared')
  }

  function start() {
    if (disabled) return
    setPending(null)
    setNudge(null)
    setLive([])
    setRecording(true)
    setAnnouncement('Recording. Press the new shortcut, or Escape to cancel.')
  }

  function stop() {
    setRecording(false)
    setLive([])
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!recording) {
      if ((event.key === 'Backspace' || event.key === 'Delete') && current) {
        event.preventDefault()
        commit(null)
      }
      return
    }
    if (event.key === 'Tab' && !event.shiftKey && !event.metaKey && !event.ctrlKey && !event.altKey) {
      stop()
      return
    }
    // the chord belongs to the recorder: keep it from the page's own shortcuts, such as a ⌘K menu
    event.preventDefault()
    event.stopPropagation()
    const bare = !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey
    if (bare && event.key === 'Escape') {
      stop()
      setAnnouncement('Recording canceled')
      return
    }
    if (bare && (event.key === 'Backspace' || event.key === 'Delete')) {
      stop()
      commit(null)
      return
    }
    const shortcut = shortcutFromEvent(event.nativeEvent, platform)
    if (!shortcut) {
      setLive(liveModifiers(event, platform))
      return
    }
    if (requireModifier && !hasStrongModifier(shortcut)) {
      const hint = platform === 'mac' ? 'Include ⌘, ⌃, or ⌥' : 'Include Ctrl or Alt'
      setNudge(hint)
      setAnnouncement(hint)
      setLive(liveModifiers(event, platform))
      return
    }
    stop()
    const conflict = findConflict({ shortcut, current, bindings, warnReserved, platform })
    if (conflict) {
      setPending(conflict)
      setAnnouncement(
        `${spoken(shortcut)} is ${conflict.reserved ? 'reserved for' : 'used by'} ${conflict.conflict.label}. Use anyway, or record another.`,
      )
      return
    }
    commit(shortcut)
  }

  function onKeyUp(event: KeyboardEvent<HTMLButtonElement>) {
    if (recording) setLive(liveModifiers(event, platform))
  }

  const shown = pending?.shortcut ?? current
  const tokens = recording
    ? shortcutTokens(live.join('+'), platform)
    : shown
      ? shortcutTokens(shown, platform)
      : []
  const state = recording ? 'recording' : pending ? 'conflict' : 'idle'
  const canReset = !recording && (pending !== null || (current ?? null) !== (restoreTo ?? null))
  const canClear = !recording && !!current && !pending
  const message: Message | null = pending
    ? {
        tone: 'warning',
        key: `c-${pending.shortcut}`,
        body: (
          <>
            {pending.reserved ? 'Reserved for' : 'Already used by'}{' '}
            <strong className="font-medium text-foreground">{pending.conflict.label}</strong>
          </>
        ),
      }
    : nudge
      ? { tone: 'hint', key: `n-${nudge}`, body: nudge }
      : recording
        ? { tone: 'hint', key: 'rec', body: 'Esc to cancel, Backspace to clear' }
        : description
          ? { tone: 'hint', key: 'd', body: description }
          : null

  const pop = reduced ? { duration: 0 } : SPRING_SNAPPY

  return (
    <div
      data-slot="shortcut-recorder"
      data-disabled={disabled || undefined}
      className={cn('grid min-w-0', className)}
    >
      <span
        id={labelId}
        className={
          hideLabel
            ? 'sr-only'
            : 'mb-2 justify-self-start text-sm leading-[1.4] font-medium text-foreground'
        }
      >
        {label}
      </span>
      <div
        data-state={state}
        className={cn(
          'relative box-border flex h-11 min-w-0 items-center rounded-[1.125rem] border border-foreground/25 bg-card transition-[border-color,background-color] duration-160 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
          'has-[[data-recorder]:focus-visible]:border-foreground has-[[data-recorder]:focus-visible]:ring-2 has-[[data-recorder]:focus-visible]:ring-ring/40',
          CONTROL_STATE[state],
          disabled && 'bg-muted opacity-50',
        )}
      >
        <button
          ref={buttonRef}
          id={buttonId}
          type="button"
          data-recorder=""
          disabled={disabled}
          aria-labelledby={`${labelId} ${buttonId}`}
          aria-describedby={message ? messageId : undefined}
          aria-pressed={recording}
          onClick={(event) => {
            if (!recording) {
              start()
              return
            }
            // a click from the pointer cancels; enter and space are chords while recording
            if (event.detail !== 0) {
              stop()
              setAnnouncement('Recording canceled')
            }
          }}
          onKeyDown={onKeyDown}
          onKeyUp={onKeyUp}
          onBlur={() => {
            if (!recording) return
            stop()
            setNudge(null)
          }}
          className={cn(
            'flex h-full min-w-0 flex-1 cursor-pointer touch-manipulation items-center rounded-[1.125rem] pr-1.5 pl-[9px] text-left text-foreground outline-none disabled:cursor-not-allowed',
            NO_TAP,
          )}
        >
          <span className="sr-only">{recording ? 'Recording' : shown ? spoken(shown) : placeholder}</span>
          <span className="relative flex min-w-0 items-center gap-1" aria-hidden="true">
            {recording ? (
              // a recording light: a slow breath, steady in reduced motion
              <motion.span
                className="mr-1.5 ml-[3px] size-[7px] flex-none rounded-full bg-primary"
                animate={reduced ? { opacity: 1 } : { opacity: [1, 0.35, 1] }}
                transition={
                  reduced ? { duration: 0 } : { duration: 1.4, ease: EASE_IN_OUT, repeat: Infinity }
                }
              />
            ) : null}
            <AnimatePresence initial={false} mode="popLayout">
              {tokens.map((token, index) => (
                <motion.span
                  key={token.id}
                  layout={reduced ? false : 'position'}
                  custom={recording ? 0 : index}
                  variants={reduced ? CHIP_FADE : CHIP}
                  initial="enter"
                  animate="rest"
                  exit="exit"
                  transition={reduced ? { duration: 0 } : { layout: SPRING_SNAPPY }}
                  className="inline-flex"
                >
                  <ShortcutKbd
                    pressed={recording || (settled > 0 && !pending)}
                    data-tone={pending ? 'warning' : undefined}
                  >
                    {token.label}
                  </ShortcutKbd>
                </motion.span>
              ))}
              {tokens.length === 0 ? (
                <motion.span
                  key={recording ? 'prompt' : 'placeholder'}
                  className="pl-[3px] text-sm whitespace-nowrap text-muted-foreground"
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: 4, filter: `blur(${BLUR_SUBTLE}px)` }
                  }
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  transition={
                    reduced ? { duration: 0.1 } : { duration: DURATION.fast, ease: EASE_ENTER }
                  }
                >
                  {recording ? 'Press keys' : placeholder}
                </motion.span>
              ) : null}
            </AnimatePresence>
          </span>
        </button>

        <span className="flex flex-none items-center gap-0.5 pr-1">
          <AnimatePresence initial={false}>
            {canReset ? (
              <motion.button
                key="reset"
                type="button"
                aria-label={`Reset to ${spoken(restoreTo ?? null)}`}
                onClick={() => {
                  commit(restoreTo ?? null)
                  buttonRef.current?.focus()
                }}
                {...POP}
                transition={pop}
                className={ACTION_BUTTON}
              >
                <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
              </motion.button>
            ) : null}
            {canClear ? (
              <motion.button
                key="clear"
                type="button"
                aria-label="Clear shortcut"
                onClick={() => {
                  commit(null)
                  buttonRef.current?.focus()
                }}
                {...POP}
                transition={pop}
                className={ACTION_BUTTON}
              >
                <X size={16} strokeWidth={1.75} aria-hidden="true" />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </span>
      </div>

      <AnimatePresence initial={false}>
        {message ? (
          <motion.div
            key="slot"
            className="relative overflow-hidden"
            initial={reduced ? false : { height: 0, opacity: 0 }}
            animate={{ height: messageHeight ?? 'auto', opacity: 1 }}
            exit={{
              height: 0,
              opacity: 0,
              transition: reduced
                ? { duration: 0 }
                : { height: SPRING_SMOOTH, opacity: { duration: 0.1 } },
            }}
            transition={
              reduced
                ? { duration: 0 }
                : { height: SPRING_SMOOTH, opacity: { duration: DURATION.fast } }
            }
          >
            <div ref={measureMessage}>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={message.key}
                  id={messageId}
                  data-tone={message.tone}
                  className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 pt-2 text-xs leading-[1.4] text-muted-foreground"
                  initial={
                    reduced
                      ? { opacity: 0 }
                      : { opacity: 0, y: '0.35em', filter: `blur(${BLUR_SOFT}px)` }
                  }
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, transition: { duration: 0.08 } }}
                  transition={{ duration: reduced ? 0.1 : DURATION.standard, ease: EASE_ENTER }}
                >
                  <span>
                    {message.tone === 'warning' ? (
                      <span
                        aria-hidden="true"
                        className="mr-[7px] mb-px ml-px inline-block size-1.5 rounded-full bg-amber-500 align-middle"
                      />
                    ) : null}
                    {message.body}
                  </span>
                  {pending ? (
                    <span className="inline-flex gap-3">
                      <button
                        type="button"
                        className={LINK_BUTTON}
                        onClick={() => {
                          commit(pending.shortcut, pending.reserved ? undefined : pending.conflict)
                          buttonRef.current?.focus()
                        }}
                      >
                        Use anyway
                      </button>
                      <button
                        type="button"
                        className={cn(LINK_BUTTON, LINK_QUIET)}
                        onClick={() => {
                          setPending(null)
                          setAnnouncement('Kept the previous shortcut')
                          buttonRef.current?.focus()
                        }}
                      >
                        Cancel
                      </button>
                    </span>
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <span className="sr-only" role="status" aria-live="polite">
        {announcement}
      </span>
    </div>
  )
}
