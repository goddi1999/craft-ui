import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import {
  AnimatePresence,
  motion,
  Reorder,
  useAnimate,
  useDragControls,
  type MotionValue,
} from 'motion/react'
import { Check, GripVertical, Sigma, SquareFunction, X } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  BLOCKS,
  ENTER,
  EXIT,
  LIFT,
  LIFT_ROTATE,
  LIFT_SCALE,
  MARK_STAGGER,
  SHAKE,
  SHAKE_X,
} from './dnd-math.constants'
import { formatNumber, withUnit } from './dnd-math.engine'
import type {
  DnDMathBlock,
  DnDMathEquationRow,
  DnDMathMark,
  DnDMathRow,
  DnDMathSumRow,
  DnDMathValue,
} from './dnd-math.types'
import { sumTotal } from './dnd-math.utils'
import type { DragPayload, DragSession } from './use-dnd-math-drag'

type SourceProps = (payload: DragPayload, onActivate: () => void) => object

const chipBase =
  'inline-flex h-9 items-center rounded-full px-3.5 text-base tabular-nums whitespace-nowrap'

/** The draggable worked-out value at the end of a row: `340 €`. Click or Enter carries it on. */
export function ResultChip({
  rowId,
  value,
  locale,
  sourceProps,
  onCarry,
  disabled,
  lifted,
}: {
  rowId: string
  value: DnDMathValue
  locale: string
  sourceProps: SourceProps
  onCarry: () => void
  disabled?: boolean
  /** This chip is the one being dragged: leave its spot as an outline. */
  lifted?: boolean
}) {
  const display = withUnit(formatNumber(value.value, locale), value.unit)
  return (
    <motion.span
      className="inline-flex items-center gap-2"
      initial={{ opacity: 0, transform: 'translateX(-4px) scale(0.96)' }}
      animate={{ opacity: 1, transform: 'translateX(0px) scale(1)' }}
      exit={{ opacity: 0, transition: EXIT }}
      transition={ENTER}
    >
      <span className="text-muted-foreground" aria-hidden>
        =
      </span>
      <button
        type="button"
        disabled={disabled}
        aria-label={`${display}. Drag into another step or a sum, or press to start a new step with it`}
        className={cn(
          chipBase,
          'touch-none bg-background font-semibold text-foreground shadow-xs ring-1 ring-border',
          'cursor-grab transition-[transform,opacity] duration-150 ease-out active:scale-[0.97] active:cursor-grabbing',
          'outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default',
          lifted && 'opacity-40',
        )}
        {...(disabled ? {} : sourceProps({ type: 'value', from: rowId, value }, onCarry))}
      >
        {display}
      </button>
    </motion.span>
  )
}

/** An equation the student types: auto-sizing, worked out on Enter, shakes when it can't be. */
export function EquationChip({
  row,
  focus,
  disabled,
  onInput,
  onSubmit,
  onFocused,
  reducedMotion,
}: {
  row: DnDMathEquationRow
  focus: boolean
  disabled?: boolean
  onInput: (input: string) => void
  onSubmit: (input: string) => void
  onFocused: () => void
  reducedMotion: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const skipBlurRef = useRef(false)
  const [scope, animate] = useAnimate<HTMLSpanElement>()

  useEffect(() => {
    const input = inputRef.current
    if (!focus || !input) return
    input.focus()
    input.setSelectionRange(input.value.length, input.value.length)
    onFocused()
  }, [focus, onFocused])

  // a failed Enter shakes once per failure, not on every render in the error state
  const message = row.status === 'error' ? row.message : undefined
  useEffect(() => {
    if (!message || reducedMotion || !scope.current) return
    animate(scope.current, { x: SHAKE_X }, SHAKE)
  }, [message, reducedMotion, animate, scope])

  return (
    <span
      ref={scope}
      data-status={row.status}
      className={cn(
        chipBase,
        'inline-grid min-w-0 max-w-full transition-[background-color,color,box-shadow] duration-150 ease-out',
        'bg-muted text-foreground focus-within:ring-2 focus-within:ring-ring/40',
        'data-[status=solved]:bg-blue-500/10 data-[status=solved]:text-blue-700 dark:data-[status=solved]:text-blue-300',
        'data-[status=error]:bg-destructive/10 data-[status=error]:text-destructive data-[status=error]:ring-1 data-[status=error]:ring-destructive/30',
      )}
    >
      {/* the sizer and the input share one grid cell, so the chip is as wide as the text */}
      <span aria-hidden className="invisible col-start-1 row-start-1 min-w-[7ch] whitespace-pre">
        {row.input || '40 × 8,50 €'}
      </span>
      <input
        ref={inputRef}
        size={1}
        value={row.input}
        disabled={disabled}
        placeholder="40 × 8,50 €"
        aria-label="Equation"
        aria-invalid={row.status === 'error' || undefined}
        enterKeyHint="done"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        className="col-start-1 row-start-1 w-full min-w-0 bg-transparent text-base outline-none placeholder:text-muted-foreground/60"
        onChange={(event) => onInput(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            onSubmit(event.currentTarget.value)
          }
          if (event.key === 'Escape') {
            skipBlurRef.current = true
            event.currentTarget.blur()
          }
        }}
        onBlur={(event) => {
          // tapping away works it out too, unless Escape asked to leave it as typed
          if (skipBlurRef.current) skipBlurRef.current = false
          else if (row.status === 'draft' && event.currentTarget.value.trim())
            onSubmit(event.currentTarget.value)
        }}
      />
    </span>
  )
}

/** Σ: results dropped in, added up. Each added value can be taken out again. */
export function SumBody({
  row,
  locale,
  disabled,
  onRemoveItem,
  result,
}: {
  row: DnDMathSumRow
  locale: string
  disabled?: boolean
  onRemoveItem: (itemId: string) => void
  result: ReactNode
}) {
  const total = sumTotal(row)
  return (
    <>
      <span
        className={cn(
          chipBase,
          'gap-1 bg-orange-500/10 px-3 font-semibold text-orange-700 dark:text-orange-300',
        )}
      >
        <Sigma className="size-4" aria-hidden />
        <span className="sr-only">Sum of</span>
      </span>
      {row.items.length === 0 ? (
        <span className="inline-flex h-9 items-center rounded-full border border-dashed border-border px-3.5 text-sm text-muted-foreground">
          Drop results here
        </span>
      ) : (
        <AnimatePresence initial={false} mode="popLayout">
          {row.items.map((item, index) => (
            <motion.span
              key={item.id}
              layout="position"
              className="inline-flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: EXIT }}
              transition={ENTER}
            >
              {index > 0 && (
                <span className="text-muted-foreground" aria-hidden>
                  +
                </span>
              )}
              <button
                type="button"
                disabled={disabled}
                aria-label={`Remove ${withUnit(formatNumber(item.value, locale), item.unit)} from the sum`}
                className={cn(
                  chipBase,
                  'group/item gap-1.5 bg-muted transition-[background-color,transform] duration-150 ease-out active:scale-[0.97]',
                  'pointer-fine:hover:bg-destructive/10 outline-none focus-visible:ring-2 focus-visible:ring-ring',
                )}
                onClick={() => onRemoveItem(item.id)}
              >
                {withUnit(formatNumber(item.value, locale), item.unit)}
                <X
                  className="size-3.5 opacity-40 transition-opacity duration-150 pointer-fine:group-hover/item:opacity-100"
                  aria-hidden
                />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      )}
      <AnimatePresence initial={false}>{total && result}</AnimatePresence>
    </>
  )
}

/** One canvas row: a reorder grip, its content, a check mark after Check, and a remove button. */
export function RowShell({
  row,
  index,
  mark,
  over,
  disabled,
  onRemove,
  children,
}: {
  row: DnDMathRow
  index: number
  mark?: DnDMathMark
  /** A drag is over this row: `accept` or `reject`. */
  over?: 'accept' | 'reject'
  disabled?: boolean
  onRemove: () => void
  children: ReactNode
}) {
  const controls = useDragControls()
  const message = row.kind === 'sum' || row.status === 'error' ? row.message : undefined
  return (
    <Reorder.Item
      value={row}
      dragListener={false}
      dragControls={controls}
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97, transition: EXIT }}
      transition={ENTER}
      className="relative list-none"
    >
      <div
        data-row-id={row.id}
        data-over={over}
        data-mark={mark}
        className={cn(
          'group/row flex items-start gap-1.5 rounded-2xl px-1.5 py-1.5 transition-[background-color,box-shadow] duration-150 ease-out',
          'data-[over=accept]:bg-primary/5 data-[over=accept]:ring-2 data-[over=accept]:ring-primary/30',
          'data-[over=reject]:bg-destructive/5 data-[over=reject]:ring-2 data-[over=reject]:ring-destructive/40',
          'data-[mark=correct]:bg-emerald-500/5 data-[mark=wrong]:bg-destructive/5',
        )}
      >
        <button
          type="button"
          aria-label="Reorder step"
          disabled={disabled}
          className={cn(
            'mt-1.5 flex size-6 shrink-0 cursor-grab touch-none items-center justify-center rounded-md text-muted-foreground/50',
            'transition-[opacity,color] duration-150 active:cursor-grabbing pointer-fine:opacity-0 pointer-fine:group-hover/row:opacity-100',
            'focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:invisible',
            'pointer-fine:hover:text-foreground',
          )}
          onPointerDown={(event) => controls.start(event)}
        >
          <GripVertical className="size-4" aria-hidden />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex min-h-9 min-w-0 flex-wrap items-center gap-2">{children}</div>
          <AnimatePresence initial={false}>
            {message && (
              <motion.p
                key={message}
                role="status"
                className="px-1 text-sm text-destructive"
                initial={{ opacity: 0, transform: 'translateY(-2px)' }}
                animate={{ opacity: 1, transform: 'translateY(0px)' }}
                exit={{ opacity: 0, transition: EXIT }}
                transition={ENTER}
              >
                {message}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-1.5 flex shrink-0 items-center gap-1">
          <AnimatePresence initial={false}>
            {mark && (
              <motion.span
                key={mark}
                className={cn(
                  'flex size-6 items-center justify-center rounded-full text-white',
                  mark === 'correct' ? 'bg-emerald-600' : 'bg-destructive',
                )}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { ...ENTER, delay: index * MARK_STAGGER },
                }}
                exit={{ opacity: 0, transition: EXIT }}
              >
                {mark === 'correct' ? (
                  <Check className="size-3.5" strokeWidth={3} aria-label="Correct" />
                ) : (
                  <X className="size-3.5" strokeWidth={3} aria-label="Wrong" />
                )}
              </motion.span>
            )}
          </AnimatePresence>
          <button
            type="button"
            aria-label="Remove step"
            disabled={disabled}
            className={cn(
              'flex size-6 items-center justify-center rounded-md text-muted-foreground/60 transition-[opacity,color] duration-150',
              'pointer-fine:opacity-0 pointer-fine:group-hover/row:opacity-100 focus-visible:opacity-100',
              'pointer-fine:hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:invisible',
            )}
            onClick={onRemove}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </Reorder.Item>
  )
}

const BLOCK_ICON = { equation: SquareFunction, sum: Sigma } as const

/** A palette block. Drag it onto the canvas, or click to add it at the end. */
export function BlockChip({
  block,
  label,
  className,
  ...rest
}: {
  block: DnDMathBlock
  label: string
  className?: string
} & Record<string, unknown>) {
  const Icon = BLOCK_ICON[block]
  return (
    <button
      type="button"
      className={cn(
        chipBase,
        'h-9 touch-none gap-1.5 bg-background text-sm font-medium shadow-xs ring-1 ring-border',
        'cursor-grab transition-[transform,background-color] duration-150 ease-out active:scale-[0.97] active:cursor-grabbing',
        'pointer-fine:hover:bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        block === 'sum' && 'text-orange-700 dark:text-orange-300',
        className,
      )}
      {...rest}
    >
      <Icon className="size-4" aria-hidden />
      {label}
    </button>
  )
}

/** The copy that follows the pointer: lifted a little while dragging, springs home when dropped nowhere. */
export function DragGhost({
  session,
  x,
  y,
  locale,
  reject,
  reducedMotion,
}: {
  session: DragSession | null
  x: MotionValue<number>
  y: MotionValue<number>
  locale: string
  reject: boolean
  reducedMotion: boolean
}) {
  if (typeof document === 'undefined') return null
  const lifted = session?.phase === 'dragging' && !reducedMotion
  return createPortal(
    <AnimatePresence>
      {session && (
        <motion.div
          key="ghost"
          aria-hidden
          className="pointer-events-none fixed top-0 left-0 z-50"
          style={{ x, y, width: session.width, height: session.height }}
          exit={{ opacity: 0, transition: EXIT }}
        >
          <motion.div
            className={cn(
              chipBase,
              'h-full w-full justify-center gap-1.5 bg-background font-semibold ring-1 ring-border',
              'transition-[box-shadow,color] duration-150',
              lifted ? 'shadow-lg' : 'shadow-xs',
              reject && 'text-destructive ring-destructive/50',
            )}
            initial={false}
            animate={{ scale: lifted ? LIFT_SCALE : 1, rotate: lifted ? LIFT_ROTATE : 0 }}
            transition={LIFT}
          >
            {session.payload.type === 'block' ? (
              <GhostBlock block={session.payload.block} />
            ) : (
              withUnit(
                formatNumber(session.payload.value.value, locale),
                session.payload.value.unit,
              )
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

function GhostBlock({ block }: { block: DnDMathBlock }) {
  const Icon = BLOCK_ICON[block]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm',
        block === 'sum' && 'text-orange-700 dark:text-orange-300',
      )}
    >
      <Icon className="size-4" aria-hidden />
      {BLOCKS.find((item) => item.block === block)?.label}
    </span>
  )
}

/** Live score after Check: points, then the four PSCA parts. */
export function ScoreLine({
  points,
  maxPoints,
  parts,
  missing,
}: {
  points: number
  maxPoints: number
  parts: ReadonlyArray<{ label: string; value: number }>
  missing: number
}) {
  const [shown, setShown] = useState(false)
  return (
    <motion.div
      role="status"
      className="flex flex-col gap-1.5"
      initial={{ opacity: 0, transform: 'translateY(4px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      exit={{ opacity: 0, transition: EXIT }}
      transition={ENTER}
    >
      <button
        type="button"
        aria-expanded={shown}
        className="self-start text-sm font-semibold tabular-nums outline-none focus-visible:underline"
        onClick={() => setShown((value) => !value)}
      >
        {points.toLocaleString(undefined, { maximumFractionDigits: 2 })} / {maxPoints} points
        <span className="ml-1.5 font-normal text-muted-foreground">{shown ? 'Hide' : 'Why?'}</span>
      </button>
      {shown && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground tabular-nums">
          {parts.map((part) => (
            <span key={part.label}>
              {part.label} {Math.round(part.value * 100)} %
            </span>
          ))}
          {missing > 0 && (
            <span className="text-destructive">
              {missing} step{missing === 1 ? '' : 's'} missing
            </span>
          )}
        </div>
      )}
    </motion.div>
  )
}
