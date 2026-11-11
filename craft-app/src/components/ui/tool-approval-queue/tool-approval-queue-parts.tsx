// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Check, ChevronDown, Undo2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { Checkbox } from '../checkbox'
import { RollingNumber } from '../rolling-number'
import { Segmented } from '../segmented-control'
import { IconTile, Inset } from '../surface'
import {
  EASE_OUT,
  EXIT_FAST,
  INSTANT,
  KIND_ICONS,
  REVEAL,
  RISKS,
  SCOPES,
  TONE,
} from './tool-approval-queue.constants'
import type {
  GrantScope,
  Resolution,
  ToolApprovalRequest,
  ToolRisk,
} from './tool-approval-queue.types'
import { scopeText, targetOf } from './tool-approval-queue.utils'

export function GroupLabel({ risk, count }: { risk: ToolRisk; count: number }) {
  const Icon = RISKS[risk].icon
  return (
    <p
      className={cn(
        'flex items-center gap-1.5 px-2.5 pt-2 pb-1 text-xs font-medium',
        RISKS[risk].text,
      )}
    >
      <Icon fill="currentColor" fillOpacity={0.25} className="size-3.5" aria-hidden="true" />
      {RISKS[risk].label}
      <span className="text-muted-foreground">
        · <RollingNumber value={String(count)} />
      </span>
    </p>
  )
}

type BulkBarProps = {
  count: number
  onClear: () => void
  onDeny: () => void
  onApprove: () => void
}

/** Appears above the list while rows are selected. */
export function BulkBar({ count, onClear, onDeny, onApprove }: BulkBarProps) {
  return (
    <div className="m-1.5 mb-0 flex items-center gap-2 rounded-xl bg-primary/10 py-1.5 pr-1.5 pl-3 text-[0.8125rem]">
      <span className="font-medium tabular-nums">
        <RollingNumber value={String(count)} /> selected
      </span>
      <button
        type="button"
        onClick={onClear}
        className="rounded text-muted-foreground transition-colors duration-150 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        Clear
      </button>
      <Button variant="secondary" size="sm" className="ml-auto" onClick={onDeny}>
        Deny
      </Button>
      <Button size="sm" onClick={onApprove}>
        Approve
      </Button>
    </div>
  )
}

type RequestRowProps = {
  request: ToolApprovalRequest
  layout: 'grouped' | 'flat'
  open: boolean
  checked: boolean
  scope: GrantScope
  /** Keyboard-driven changes and reduced motion skip the animation. */
  still: boolean
  reduce: boolean
  rowRef: (el: HTMLDivElement | null) => void
  onToggleOpen: () => void
  onToggleSelect: () => void
  onKeyDown: (e: KeyboardEvent) => void
  onScope: (scope: GrantScope) => void
  onDecide: (decision: 'approved' | 'denied') => void
}

/** One pending request: a keyboard-navigable row that expands to its payload and actions. */
export function RequestRow({
  request: r,
  layout,
  open,
  checked,
  scope,
  still,
  reduce,
  rowRef,
  onToggleOpen,
  onToggleSelect,
  onKeyDown,
  onScope,
  onDecide,
}: RequestRowProps) {
  const Kind = KIND_ICONS[r.payload.kind]
  const Risk = RISKS[r.risk].icon
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, transition: reduce ? INSTANT : EXIT_FAST }}
      transition={reduce ? INSTANT : REVEAL}
      className="overflow-hidden"
    >
      <div
        className={cn('rounded-xl transition-colors', (open || checked) && 'bg-foreground/[0.035]')}
      >
        <div
          ref={rowRef}
          role="button"
          tabIndex={0}
          aria-expanded={open}
          aria-keyshortcuts="Space Enter ArrowUp ArrowDown"
          onClick={onToggleOpen}
          onKeyDown={onKeyDown}
          className="flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2.5 outline-none hover:bg-foreground/[0.03] focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <Checkbox
            tabIndex={-1}
            checked={checked}
            aria-label={`Select ${r.title}`}
            onClick={(e) => {
              e.stopPropagation()
              onToggleSelect()
            }}
          />
          <IconTile icon={Kind} className="size-8 rounded-lg bg-foreground/[0.05]" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm">{r.title}</span>
            <span className="block truncate font-mono text-xs text-muted-foreground">
              {r.tool}
              {targetOf(r.payload) && ` · ${targetOf(r.payload)}`}
            </span>
          </span>
          {layout === 'flat' && (
            <span className={cn('flex shrink-0 items-center gap-1 text-xs', RISKS[r.risk].text)}>
              <Risk fill="currentColor" fillOpacity={0.25} className="size-3.5" aria-hidden="true" />
              {RISKS[r.risk].short}
            </span>
          )}
          <ChevronDown
            strokeWidth={2.5}
            className={cn(
              'size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none',
              open && 'rotate-180',
            )}
            aria-hidden="true"
          />
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: still ? INSTANT : EXIT_FAST }}
              transition={still ? INSTANT : REVEAL}
              className="overflow-hidden"
            >
              <div className="px-2.5 pb-2.5">
                <Inset>
                  <Payload payload={r.payload} />
                </Inset>
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  <Segmented
                    label="Grant for"
                    className="mr-auto"
                    options={SCOPES.map((x) => ({ value: x.id, label: x.label }))}
                    value={scope}
                    onValueChange={onScope}
                  />
                  <Button variant="secondary" size="sm" onClick={() => onDecide('denied')}>
                    Deny
                  </Button>
                  <Button size="sm" onClick={() => onDecide('approved')}>
                    Approve {scopeText(scope)}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

type ResolvedRowProps = {
  request: ToolApprovalRequest
  resolution: Resolution
  onUndo: (request: ToolApprovalRequest) => void
}

/** One line in the resolved log, with Undo while the window is open. */
export function ResolvedRow({ request, resolution, onUndo }: ResolvedRowProps) {
  const ok = resolution.decision === 'approved'
  const Icon = ok ? Check : X
  return (
    <motion.li
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0, transition: EXIT_FAST }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
      className="overflow-hidden"
    >
      <div className="flex min-h-9 items-center gap-2.5 px-1.5 text-[0.8125rem]">
        <span
          className={cn(
            'flex size-5 shrink-0 items-center justify-center rounded-full bg-(--tone)/15 text-(--tone)',
            ok ? TONE.positive : TONE.negative,
          )}
        >
          <Icon fill="currentColor" strokeWidth={3} className="size-3" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate text-muted-foreground">
          <span className="text-foreground">{request.title}</span>
          {' · '}
          {ok ? `approved ${scopeText(resolution.scope)}` : 'denied'}
        </span>
        {resolution.undoable && (
          <Button
            variant="secondary"
            size="xs"
            onClick={() => onUndo(request)}
            className="h-7 gap-1 px-2.5"
          >
            <Undo2 strokeWidth={2.5} aria-hidden="true" />
            Undo
          </Button>
        )}
      </div>
    </motion.li>
  )
}

function Payload({ payload }: { payload: ToolApprovalRequest['payload'] }) {
  const box = 'font-mono text-[0.75rem] leading-5'
  switch (payload.kind) {
    case 'shell':
      return (
        <div className={cn(box, 'px-3.5 py-3')}>
          {payload.cwd && <p className="text-muted-foreground">{payload.cwd}</p>}
          <p className="break-all whitespace-pre-wrap">
            <span className="text-muted-foreground select-none">$ </span>
            {payload.command}
          </p>
        </div>
      )
    case 'diff':
      return (
        <div className={cn(box, 'max-h-40 overflow-x-hidden overflow-y-auto py-2')}>
          {payload.lines.map((line, i) => (
            <p
              key={i}
              className={cn(
                'flex px-3.5 [overflow-wrap:anywhere] whitespace-pre-wrap',
                line.type === 'add' && cn(TONE.positive, 'bg-(--tone)/10 text-(--tone)'),
                line.type === 'remove' && cn(TONE.negative, 'bg-(--tone)/10 text-(--tone)'),
              )}
            >
              <span className="shrink-0 select-none">
                {line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : '  '}
              </span>
              <span className="min-w-0">{line.text}</span>
            </p>
          ))}
        </div>
      )
    case 'email':
      return (
        <div className="px-3.5 py-3 text-[0.8125rem]">
          <p className="font-medium">{payload.subject}</p>
          <p className="mt-1 line-clamp-3 text-muted-foreground">{payload.body}</p>
        </div>
      )
    case 'json':
      return (
        <pre
          className={cn(
            box,
            'max-h-40 overflow-x-hidden overflow-y-auto px-3.5 py-3 [overflow-wrap:anywhere] whitespace-pre-wrap',
          )}
        >
          {JSON.stringify(payload.args, null, 2)}
        </pre>
      )
  }
}
