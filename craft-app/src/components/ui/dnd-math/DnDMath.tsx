import { useCallback, useImperativeHandle, useRef, useState } from 'react'
import { AnimatePresence, motion, Reorder, useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import './dnd-math.css'

import {
  BlockChip,
  DragGhost,
  EquationChip,
  ResultChip,
  RowShell,
  ScoreLine,
  SumBody,
} from './dnd-math-parts'
import { BLOCKS, DEFAULT_LOCALE, DEFAULT_POINTS, DROP_SLOP, ENTER } from './dnd-math.constants'
import type {
  DnDMathBlock,
  DnDMathProps,
  DnDMathRow,
  DnDMathScore,
  DnDMathValue,
} from './dnd-math.types'
import {
  addToSum,
  carryText,
  createEquationRow,
  createSumRow,
  rowsToSteps,
  rowValue,
  scoreRows,
  solveRow,
} from './dnd-math.utils'
import { useDnDMathDrag, type DragPayload, type DropTarget } from './use-dnd-math-drag'

const SCORE_PARTS = [
  { key: 'result', label: 'Result' },
  { key: 'steps', label: 'Steps' },
  { key: 'method', label: 'Method' },
  { key: 'errorFree', label: 'Error-free' },
] as const

const initialRows = (equations: readonly string[] = []) =>
  equations.map((equation) => solveRow(createEquationRow(), equation))

/**
 * A step-by-step maths canvas. Drag an Equation block in and type a step (`40 × 8,50 €`); Enter
 * works it out with its unit. Drag the result into a new step, onto an unfinished one, or into a
 * Σ row to add results up. Check scores the steps against `solution` with PSCA.
 */
export function DnDMath({
  solution,
  points = DEFAULT_POINTS,
  weighting = 'full',
  mode = 'carry',
  graceful = false,
  locale = DEFAULT_LOCALE,
  defaultRows,
  onRowsChange,
  onCheck,
  showCheck = true,
  disabled = false,
  className,
  ref,
}: DnDMathProps) {
  const reducedMotion = useReducedMotion() === true
  const [rows, setRows] = useState<DnDMathRow[]>(() => initialRows(defaultRows))
  const [score, setScore] = useState<DnDMathScore | null>(null)
  const [focusId, setFocusId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  // every change clears a shown score: it no longer describes the canvas
  const update = (next: DnDMathRow[]) => {
    setRows(next)
    setScore(null)
    onRowsChange?.(next)
  }
  const updateRow = (id: string, change: (row: DnDMathRow) => DnDMathRow) =>
    update(rows.map((row) => (row.id === id ? change(row) : row)))

  const insertAt = (index: number, row: DnDMathRow) => {
    update([...rows.slice(0, index), row, ...rows.slice(index)])
    if (row.kind === 'equation') setFocusId(row.id)
  }

  const newBlock = (block: DnDMathBlock) => (block === 'sum' ? createSumRow() : createEquationRow())

  const carryInto = (index: number, value: DnDMathValue) =>
    insertAt(index, createEquationRow(`${carryText(value, locale)} `))

  /** Whether a value can land on this row, and why not. */
  const valueDrop = (rowId: string, value: DnDMathValue) => {
    const row = rows.find((candidate) => candidate.id === rowId)
    if (!row) return null
    if (row.kind === 'sum') return addToSum(row, value)
    return row.status === 'solved' ? null : ({ ok: true } as const)
  }

  const resolveTarget = (payload: DragPayload, x: number, y: number): DropTarget | null => {
    const canvas = canvasRef.current
    if (!canvas) return null
    const bounds = canvas.getBoundingClientRect()
    const inside =
      x >= bounds.left - DROP_SLOP &&
      x <= bounds.right + DROP_SLOP &&
      y >= bounds.top - DROP_SLOP &&
      y <= bounds.bottom + DROP_SLOP
    if (!inside) return null

    const rowEls = Array.from(canvas.querySelectorAll<HTMLElement>('[data-row-id]'))
    if (payload.type === 'value') {
      const hit = rowEls.find((el) => {
        const r = el.getBoundingClientRect()
        return y >= r.top && y <= r.bottom && x >= r.left && x <= r.right
      })
      const rowId = hit?.dataset.rowId
      if (rowId === payload.from) return null
      if (rowId && valueDrop(rowId, payload.value)) return { type: 'row', rowId }
    }

    // between rows: count the rows whose middle is above the pointer
    const rects = rowEls.map((el) => el.getBoundingClientRect())
    const index = rects.filter((r) => r.top + r.height / 2 < y).length
    const lineY =
      rects.length === 0
        ? bounds.height / 2
        : index === 0
          ? rects[0].top - bounds.top - 2
          : rects[index - 1].bottom - bounds.top + 2
    return { type: 'gap', index, y: Math.round(lineY) }
  }

  const handleDrop = (payload: DragPayload, target: DropTarget): boolean => {
    if (target.type === 'gap') {
      if (payload.type === 'block') insertAt(target.index, newBlock(payload.block))
      else carryInto(target.index, payload.value)
      return true
    }
    if (payload.type !== 'value') return false
    const row = rows.find((candidate) => candidate.id === target.rowId)
    if (!row) return false
    if (row.kind === 'sum') {
      const outcome = addToSum(row, payload.value)
      if ('message' in outcome) {
        updateRow(row.id, () => ({ ...row, message: outcome.message }))
        return false
      }
      updateRow(row.id, () => outcome.row)
      return true
    }
    // onto an unfinished step: the value joins the end of what's typed
    const joined = `${row.input.trimEnd()} ${carryText(payload.value, locale)} `.trimStart()
    updateRow(row.id, () => ({ ...row, input: joined, status: 'draft', message: undefined }))
    setFocusId(row.id)
    return true
  }

  const drag = useDnDMathDrag({ resolveTarget, onDrop: handleDrop, disabled, reducedMotion })

  const overState = (rowId: string, value: DnDMathValue | null) => {
    if (drag.target?.type !== 'row' || drag.target.rowId !== rowId || !value) return undefined
    return valueDrop(rowId, value)?.ok ? 'accept' : 'reject'
  }
  const draggedValue = drag.session?.payload.type === 'value' ? drag.session.payload : null
  const ghostRejects =
    draggedValue !== null &&
    drag.target?.type === 'row' &&
    valueDrop(drag.target.rowId, draggedValue.value)?.ok === false

  const check = () => {
    if (!solution || disabled) return null
    const next = scoreRows(rows, solution, { points, weighting, mode, graceful })
    setScore(next)
    if (next) onCheck?.(next)
    return next
  }

  useImperativeHandle(ref, () => ({ check, reset: () => update([]) }))

  const clearFocus = useCallback(() => setFocusId(null), [])
  const canCheck = Boolean(solution?.length) && rowsToSteps(rows).length > 0 && !disabled
  const gap = drag.target?.type === 'gap' ? drag.target : null

  return (
    <div
      data-slot="dnd-math"
      data-disabled={disabled || undefined}
      className={cn(
        'flex w-full flex-col overflow-hidden rounded-3xl border bg-card text-card-foreground',
        className,
      )}
    >
      <div
        ref={canvasRef}
        className={cn(
          'relative min-h-44 p-2 transition-[background-color] duration-150 ease-out sm:p-3',
          drag.session && rows.length === 0 && gap && 'bg-primary/5',
        )}
      >
        {rows.length === 0 && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-balance text-muted-foreground">
            Drag an Equation block here, or tap one below, and type the first step.
          </p>
        )}

        <Reorder.Group axis="y" values={rows} onReorder={update} className="flex flex-col gap-1">
          <AnimatePresence initial={false}>
            {rows.map((row, index) => {
              const value = rowValue(row)
              const result = value && (
                <ResultChip
                  key={`${row.id}:${value.value}:${value.unit}`}
                  rowId={row.id}
                  value={value}
                  locale={locale}
                  disabled={disabled}
                  lifted={draggedValue?.from === row.id}
                  sourceProps={drag.sourceProps}
                  onCarry={() => carryInto(index + 1, value)}
                />
              )
              return (
                <RowShell
                  key={row.id}
                  row={row}
                  index={index}
                  mark={score?.marks[row.id]}
                  over={overState(row.id, draggedValue?.value ?? null)}
                  disabled={disabled}
                  onRemove={() => update(rows.filter((candidate) => candidate.id !== row.id))}
                >
                  {row.kind === 'equation' ? (
                    <>
                      <EquationChip
                        row={row}
                        focus={focusId === row.id}
                        disabled={disabled}
                        reducedMotion={reducedMotion}
                        onFocused={clearFocus}
                        onInput={(input) =>
                          updateRow(row.id, () => ({
                            id: row.id,
                            kind: 'equation',
                            input,
                            status: 'draft',
                          }))
                        }
                        onSubmit={(input) => updateRow(row.id, () => solveRow(row, input))}
                      />
                      <AnimatePresence initial={false}>{result}</AnimatePresence>
                    </>
                  ) : (
                    <SumBody
                      row={row}
                      locale={locale}
                      disabled={disabled}
                      result={result}
                      onRemoveItem={(itemId) =>
                        updateRow(row.id, () => ({
                          ...row,
                          message: undefined,
                          items: row.items.filter((item) => item.id !== itemId),
                        }))
                      }
                    />
                  )}
                </RowShell>
              )
            })}
          </AnimatePresence>
        </Reorder.Group>

        {/* where a drop between rows will land */}
        <AnimatePresence>
          {gap && rows.length > 0 && (
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-x-3 top-0 h-0.5 rounded-full bg-primary"
              initial={{ opacity: 0, y: gap.y, scaleX: 0.9 }}
              animate={{ opacity: 1, y: gap.y, scaleX: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={ENTER}
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t bg-muted/40 px-3 py-2.5">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Blocks">
          {BLOCKS.map(({ block, label, hint }) => (
            <BlockChip
              key={block}
              block={block}
              label={label}
              title={hint}
              disabled={disabled}
              {...drag.sourceProps({ type: 'block', block }, () =>
                insertAt(rows.length, newBlock(block)),
              )}
            />
          ))}
        </div>

        {solution && showCheck && (
          <div className="ml-auto flex items-center gap-3">
            <AnimatePresence mode="wait" initial={false}>
              {score && (
                <ScoreLine
                  key="score"
                  points={score.points}
                  maxPoints={score.maxPoints}
                  missing={score.missing}
                  parts={SCORE_PARTS.map(({ key, label }) => ({ label, value: score[key] }))}
                />
              )}
            </AnimatePresence>
            <Button className="h-11 px-5 sm:h-9" disabled={!canCheck} onClick={check}>
              Check
            </Button>
          </div>
        )}
      </div>

      <DragGhost
        session={drag.session}
        x={drag.x}
        y={drag.y}
        locale={locale}
        reject={ghostRejects}
        reducedMotion={reducedMotion}
      />
    </div>
  )
}
