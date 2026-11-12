import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion, useMotionValue, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  CLEAR_MS,
  HEIGHT_SPRING,
  LINE_HEIGHT,
  LINGER_MS,
  MAX_HEIGHT,
  MORPH_SPRING,
  STATUS_SPRING,
} from './prompt-box.constants'
import type { PromptBoxProps } from './prompt-box.types'
import { SendButton, StatusLine } from './prompt-box-parts'
import { springTo } from './prompt-box.utils'

/**
 * An AI prompt field that grows with the text on a spring, turns Send into Stop
 * while it answers, and opens a status line above the text.
 */
export function PromptBox({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  onSubmit,
  busy = false,
  onStop,
  status,
  placeholder = 'Ask anything',
  className,
  ...props
}: PromptBoxProps) {
  const reduced = useReducedMotion() ?? false
  const field = useRef<HTMLTextAreaElement>(null)
  const clearTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const [inner, setInner] = useState(defaultValue)
  const text = valueProp !== undefined ? valueProp : inner

  // when an answer ends the line stays open a moment to say how it went
  const [wasBusy, setWasBusy] = useState(busy)
  const [lingering, setLingering] = useState(false)
  if (busy !== wasBusy) {
    setWasBusy(busy)
    setLingering(!busy)
  }

  const height = useMotionValue(LINE_HEIGHT)
  const statusOpen = useMotionValue(busy ? 1 : 0)
  const morph = useMotionValue(busy ? 1 : 0)

  const open = busy || lingering
  const ready = busy || text.trim().length > 0
  const label = status !== undefined ? status : busy ? 'Thinking' : 'Done'

  const setText = (next: string) => {
    if (valueProp === undefined) setInner(next)
    onValueChange?.(next)
  }

  useEffect(() => {
    if (!lingering) return
    const fold = setTimeout(() => setLingering(false), LINGER_MS)
    return () => clearTimeout(fold)
  }, [lingering])

  // measure at auto height, put the old height back, then spring to the new one
  useLayoutEffect(() => {
    const element = field.current
    if (!element) return
    element.style.height = 'auto'
    const next = Math.min(element.scrollHeight, MAX_HEIGHT)
    element.style.height = `${height.get()}px`
    springTo(height, next, HEIGHT_SPRING, reduced)
  }, [text, height, reduced])

  useEffect(() => {
    springTo(statusOpen, open ? 1 : 0, STATUS_SPRING, reduced)
  }, [open, statusOpen, reduced])

  useEffect(() => {
    springTo(morph, busy ? 1 : 0, MORPH_SPRING, reduced)
  }, [busy, morph, reduced])

  useEffect(
    () => () => {
      clearTimeout(clearTimer.current)
      height.stop()
      statusOpen.stop()
      morph.stop()
    },
    [height, statusOpen, morph],
  )

  const handleSubmit = () => {
    const prompt = text.trim()
    if (busy || !prompt) return
    onSubmit?.(prompt)
    clearTimeout(clearTimer.current)
    clearTimer.current = setTimeout(() => setText(''), CLEAR_MS)
  }

  const handleSend = () => {
    if (busy) onStop?.()
    else handleSubmit()
  }

  // Enter sends, Shift+Enter is a new line; leave IME composition alone
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) return
    event.preventDefault()
    handleSubmit()
  }

  return (
    <div
      data-slot="prompt-box"
      data-busy={busy || undefined}
      className={cn('w-full max-w-[380px] rounded-3xl bg-muted py-2.5 pr-2.5 pl-[18px]', className)}
      {...props}
    >
      <StatusLine open={statusOpen} thinking={busy} reduced={reduced} label={label} />
      <div className="flex items-end gap-2.5">
        <motion.textarea
          ref={field}
          rows={1}
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={placeholder}
          className="mb-[5px] min-w-0 flex-1 resize-none overflow-y-auto bg-transparent p-0 text-[15px] leading-[22px] text-foreground caret-foreground outline-none [scrollbar-width:none] placeholder:text-muted-foreground"
          style={{ height }}
        />
        <SendButton
          morph={morph}
          ready={ready}
          onClick={handleSend}
          aria-label={busy ? 'Stop' : 'Send'}
          aria-disabled={!ready || undefined}
        />
      </div>
    </div>
  )
}
