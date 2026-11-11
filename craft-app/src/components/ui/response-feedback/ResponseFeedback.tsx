// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Copy, RotateCcw, ThumbsDown, ThumbsUp, Check } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState, type MouseEvent } from 'react'

import { cn } from '@/lib/utils'

import { Panel, Shell } from '../surface'
import {
  DEFAULT_REASONS,
  EASE_OUT,
  emptyFeedback,
  enter,
  exit,
  spring,
} from './response-feedback.constants'
import {
  FeedbackForm,
  FeedbackIconButton,
  FeedbackThanks,
  RatingScale,
  ThumbIcon,
} from './response-feedback-parts'
import type {
  Feedback,
  FeedbackRating,
  ResponseFeedbackProps,
} from './response-feedback.types'

/**
 * Feedback on one answer. `inline` is a row of thumbs (plus optional copy and
 * regenerate) that opens a reasons form on a thumbs down; `detailed` is a card
 * with a 1–5 rating and the reasons always shown. Controlled with `value`, or
 * leave it out and it keeps its own state.
 */
export function ResponseFeedback({
  value,
  onValueChange,
  onRate,
  onSubmit,
  onUndo,
  undoMs = 5000,
  onCopy,
  onRegenerate,
  reasons = DEFAULT_REASONS,
  variant = 'inline',
  className,
}: ResponseFeedbackProps) {
  const [own, setOwn] = useState<Feedback>(emptyFeedback)
  const fb = value ?? own
  const set = (next: Feedback) => {
    if (!value) setOwn(next)
    onValueChange?.(next)
  }
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)
  const [undoable, setUndoable] = useState(false)
  const [pop, setPop] = useState(0)
  const detailed = variant === 'detailed'
  // The detailed card is a shell; the inline row sits bare under an answer.
  const Root = detailed ? Shell : 'div'

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])
  useEffect(() => {
    if (!undoable) return
    const t = setTimeout(() => setUndoable(false), undoMs)
    return () => clearTimeout(t)
  }, [undoable, undoMs])

  const thumb = (rating: 'up' | 'down', e: MouseEvent) => {
    if (fb.rating === rating && fb.status !== 'open') {
      set(emptyFeedback) // a second press clears the vote
      return
    }
    if (e.detail !== 0) setPop((n) => n + 1) // no pop from the keyboard
    onRate?.(rating)
    set({ ...emptyFeedback, rating, status: rating === 'down' ? 'open' : 'idle' })
  }
  const rate = (rating: FeedbackRating) => {
    onRate?.(rating)
    set({ ...fb, rating })
  }
  const toggleReason = (reason: string) =>
    set({
      ...fb,
      reasons: fb.reasons.includes(reason)
        ? fb.reasons.filter((r) => r !== reason)
        : [...fb.reasons, reason],
    })
  const submit = () => {
    if (fb.rating === null) return
    onSubmit?.({ rating: fb.rating, reasons: fb.reasons, note: fb.note.trim() })
    set({ ...fb, status: 'sent' })
    setUndoable(true)
  }
  const undo = () => {
    set({ ...fb, status: detailed ? 'idle' : 'open' })
    setUndoable(false)
    onUndo?.()
  }

  const open = detailed ? fb.status !== 'sent' : fb.status === 'open'
  const sent = fb.status === 'sent'
  const canSend = fb.rating !== null && (fb.reasons.length > 0 || fb.note.trim() !== '')

  const form = (
    <FeedbackForm
      feedback={fb}
      reasons={reasons}
      detailed={detailed}
      canSend={canSend}
      onToggleReason={toggleReason}
      onNote={(note) => set({ ...fb, note })}
      onCancel={() => set(emptyFeedback)}
      onSubmit={submit}
    />
  )
  const thanks = <FeedbackThanks undoable={undoable} onUndo={undo} />

  const announcement = sent
    ? 'Feedback sent'
    : fb.rating === 'up'
      ? 'Marked as helpful'
      : fb.status === 'open'
        ? 'Tell us what went wrong'
        : ''

  return (
    <MotionConfig reducedMotion="user">
      <Root
        data-slot="response-feedback"
        data-variant={variant}
        className={cn('w-full max-w-xl', className)}
      >
        {detailed ? (
          <Panel className="p-4">
            <AnimatePresence mode="wait" initial={false}>
              {sent ? (
                thanks
              ) : (
                <motion.div key="form" exit={{ opacity: 0, transition: exit }}>
                  <p className="text-[0.9375rem] font-medium">How was this answer?</p>
                  <RatingScale rating={fb.rating} onRate={rate} />
                  {open && form}
                </motion.div>
              )}
            </AnimatePresence>
          </Panel>
        ) : (
          <>
            <div className="flex min-h-8 items-center gap-0.5">
              <AnimatePresence mode="popLayout" initial={false}>
                {sent ? (
                  thanks
                ) : (
                  <motion.div
                    key="actions"
                    exit={{ opacity: 0, transition: exit }}
                    className="flex items-center gap-0.5"
                  >
                    <FeedbackIconButton
                      label="Helpful"
                      pressed={fb.rating === 'up'}
                      onClick={(e) => thumb('up', e)}
                    >
                      <ThumbIcon icon={ThumbsUp} on={fb.rating === 'up'} pop={pop} />
                    </FeedbackIconButton>
                    <FeedbackIconButton
                      label="Not helpful"
                      pressed={fb.rating === 'down'}
                      onClick={(e) => thumb('down', e)}
                    >
                      <ThumbIcon icon={ThumbsDown} on={fb.rating === 'down'} pop={pop} />
                    </FeedbackIconButton>
                    {onCopy && (
                      <FeedbackIconButton
                        label={copied ? 'Copied' : 'Copy'}
                        onClick={() => {
                          onCopy()
                          setCopied(true)
                        }}
                      >
                        {copied ? (
                          <Check strokeWidth={2.5} className="size-4" aria-hidden="true" />
                        ) : (
                          <Copy className="size-4" aria-hidden="true" />
                        )}
                      </FeedbackIconButton>
                    )}
                    {onRegenerate && (
                      <FeedbackIconButton label="Regenerate" onClick={onRegenerate}>
                        <RotateCcw
                          strokeWidth={2.5}
                          className="size-4"
                          aria-hidden="true"
                        />
                      </FeedbackIconButton>
                    )}
                    <AnimatePresence initial={false}>
                      {fb.rating === 'up' && (
                        <motion.span
                          initial={{ opacity: 0, x: -4 }}
                          animate={{ opacity: 1, x: 0, transition: enter }}
                          exit={{ opacity: 0, transition: exit }}
                          className="ml-1.5 text-[0.8125rem] text-muted-foreground"
                        >
                          Thanks
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: 'auto',
                    opacity: 1,
                    transition: {
                      height: reduce ? { duration: 0 } : spring,
                      opacity: enter,
                    },
                  }}
                  exit={{
                    height: 0,
                    opacity: 0,
                    transition: {
                      height: reduce
                        ? { duration: 0 }
                        : { duration: 0.18, ease: EASE_OUT },
                      opacity: exit,
                    },
                  }}
                  className="overflow-hidden"
                >
                  <div className="mt-1 rounded-2xl bg-muted p-3 pt-0">{form}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </Root>
    </MotionConfig>
  )
}
