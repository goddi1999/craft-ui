// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Check, Undo2, type LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Textarea } from '../textarea'
import {
  PRESS,
  RATING_LABELS,
  enter,
  exit,
} from './response-feedback.constants'
import type { Feedback, FeedbackRating } from './response-feedback.types'

type FeedbackIconButtonProps = {
  label: string
  pressed?: boolean
  onClick: (e: MouseEvent) => void
  children: ReactNode
}

/** Round icon-only button for the inline action row. */
export function FeedbackIconButton({
  label,
  pressed,
  onClick,
  children,
}: FeedbackIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'flex size-8 items-center justify-center rounded-full outline-none hover:bg-foreground/[0.06] hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50',
        pressed ? 'bg-foreground/[0.08] text-foreground' : 'text-muted-foreground',
        PRESS,
      )}
    >
      {children}
    </button>
  )
}

type ThumbIconProps = {
  icon: LucideIcon
  on: boolean
  /** Bumped on each pointer press so the icon re-pops even when already on. */
  pop: number
}

/** Filled thumb that springs from 0.85 to 1 when it turns on. */
export function ThumbIcon({ icon: Icon, on, pop }: ThumbIconProps) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      key={on ? `on-${pop}` : 'off'}
      initial={on && !reduce ? { scale: 0.85 } : false}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', duration: 0.3, bounce: 0.3 }}
      className="flex"
    >
      <Icon fill="currentColor" className="size-4" aria-hidden="true" />
    </motion.span>
  )
}

type RatingScaleProps = {
  rating: FeedbackRating | null
  onRate: (rating: FeedbackRating) => void
}

/** The 1–5 radio group of the detailed variant. */
export function RatingScale({ rating, onRate }: RatingScaleProps) {
  return (
    <div role="radiogroup" aria-label="Rating" className="mt-3 grid grid-cols-5 gap-1.5">
      {RATING_LABELS.map((label, i) => {
        const n = (i + 1) as FeedbackRating
        const on = rating === n
        return (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => onRate(n)}
            className={cn(
              'flex flex-col items-center gap-0.5 rounded-xl py-2 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
              on
                ? 'bg-foreground text-background'
                : 'bg-foreground/[0.04] hover:bg-foreground/[0.07]',
              PRESS,
            )}
          >
            <span className="font-mono text-sm tabular-nums">{n}</span>
            <span className={cn('text-[0.6875rem]', !on && 'text-muted-foreground')}>
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

type FeedbackFormProps = {
  feedback: Feedback
  reasons: string[]
  detailed: boolean
  canSend: boolean
  onToggleReason: (reason: string) => void
  onNote: (note: string) => void
  onCancel: () => void
  onSubmit: () => void
}

/** Reasons, a note and the send button. */
export function FeedbackForm({
  feedback,
  reasons,
  detailed,
  canSend,
  onToggleReason,
  onNote,
  onCancel,
  onSubmit,
}: FeedbackFormProps) {
  return (
    <div className="flex flex-col gap-3 pt-3">
      <p className="text-[0.8125rem] text-muted-foreground">
        {detailed ? 'What stood out?' : 'What went wrong?'}
      </p>
      <div role="group" aria-label="Reasons" className="flex flex-wrap gap-1.5">
        {reasons.map((reason) => {
          const on = feedback.reasons.includes(reason)
          return (
            <button
              key={reason}
              type="button"
              aria-pressed={on}
              onClick={() => onToggleReason(reason)}
              className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50',
                on
                  ? 'bg-foreground text-background'
                  : 'bg-foreground/[0.06] hover:bg-foreground/[0.1]',
                PRESS,
              )}
            >
              {on && <Check strokeWidth={2.5} className="size-3.5" aria-hidden="true" />}
              {reason}
            </button>
          )
        })}
      </div>
      <Textarea
        aria-label="Add a note"
        rows={2}
        value={feedback.note}
        onChange={(e) => onNote(e.target.value)}
        placeholder="Add a note (optional)"
        className="rounded-xl"
      />
      <div className="flex items-center justify-end gap-2">
        {!detailed && (
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" size="sm" onClick={onSubmit} disabled={!canSend} className="px-4">
          Send feedback
        </Button>
      </div>
    </div>
  )
}

type FeedbackThanksProps = {
  undoable: boolean
  onUndo: () => void
}

/** Thank-you line with a short-lived Undo. */
export function FeedbackThanks({ undoable, onUndo }: FeedbackThanksProps) {
  return (
    <motion.div
      key="thanks"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0, transition: enter }}
      exit={{ opacity: 0, transition: exit }}
      className="flex items-center gap-2 text-[0.8125rem]"
    >
      <Check
        strokeWidth={2.5}
        className="size-3.5 text-[oklch(0.55_0.15_150)] dark:text-[oklch(0.78_0.17_150)]"
        aria-hidden="true"
      />
      <span>Thanks — we&apos;ll use this to improve.</span>
      {undoable && (
        <Button
          type="button"
          variant="secondary"
          size="xs"
          onClick={onUndo}
          className="h-7 gap-1 px-2.5"
        >
          <Undo2 strokeWidth={2.5} aria-hidden="true" />
          Undo
        </Button>
      )}
    </motion.div>
  )
}
