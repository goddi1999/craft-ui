// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ShieldCheck } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '../empty'
import { RollingNumber } from '../rolling-number'
import { Panel, Shell, ShellHeader } from '../surface'
import { BulkBar, GroupLabel, RequestRow, ResolvedRow } from './tool-approval-queue-parts'
import {
  EXIT_FAST,
  INSTANT,
  REVEAL,
  RISKS,
  RISK_ORDER,
} from './tool-approval-queue.constants'
import type {
  GrantScope,
  Resolution,
  ToolApprovalQueueProps,
  ToolApprovalRequest,
  ToolDecision,
} from './tool-approval-queue.types'
import { scopeText } from './tool-approval-queue.utils'

export function ToolApprovalQueue({
  data,
  layout = 'grouped',
  onDecide,
  onUndo,
  undoMs = 5000,
  selected: selectedProp,
  onSelectedChange,
  defaultExpanded,
  className,
}: ToolApprovalQueueProps) {
  const [local, setLocal] = useState<Record<string, Resolution>>({})
  const [ownSelected, setOwnSelected] = useState<string[]>([])
  const [expanded, setExpanded] = useState<string | null>(defaultExpanded ?? null)
  const [scopeById, setScopeById] = useState<Record<string, GrantScope>>({})
  const [announcement, setAnnouncement] = useState('')
  const rows = useRef<Map<string, HTMLDivElement>>(new Map())
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())
  // Keyboard-driven changes (Enter, Space) and reduced motion skip the animation.
  const [viaKeys, setViaKeys] = useState(false)
  const reduce = !!useReducedMotion()
  const still = viaKeys || reduce

  useEffect(() => {
    const pendingTimers = timers.current
    return () => pendingTimers.forEach(clearTimeout)
  }, [])

  const resolutionOf = (r: ToolApprovalRequest): Resolution | undefined =>
    local[r.id] ??
    (r.status && r.status !== 'pending'
      ? { decision: r.status, scope: r.scope ?? 'once', undoable: false }
      : undefined)
  const pending = data.filter((r) => !resolutionOf(r))
  const resolved = data.filter((r) => resolutionOf(r))
  const selectedIds = (selectedProp ?? ownSelected).filter((id) =>
    pending.some((r) => r.id === id),
  )
  const setSelected = (ids: string[]) => {
    setOwnSelected(ids)
    onSelectedChange?.(ids)
  }
  const toggle = (id: string) =>
    setSelected(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id],
    )

  const decide = (requests: ToolApprovalRequest[], decision: ToolDecision, scope: GrantScope) => {
    setLocal((l) => ({
      ...l,
      ...Object.fromEntries(requests.map((r) => [r.id, { decision, scope, undoable: true }])),
    }))
    for (const r of requests) {
      timers.current.set(
        r.id,
        setTimeout(
          () =>
            setLocal((l) => (l[r.id] ? { ...l, [r.id]: { ...l[r.id], undoable: false } } : l)),
          undoMs,
        ),
      )
    }
    setSelected(selectedIds.filter((id) => !requests.some((r) => r.id === id)))
    setAnnouncement(
      `${requests.length === 1 ? requests[0].title : `${requests.length} requests`} ${decision}${decision === 'approved' ? ` ${scopeText(scope)}` : ''}`,
    )
    onDecide?.(requests, decision, scope)
  }

  const undo = (r: ToolApprovalRequest) => {
    clearTimeout(timers.current.get(r.id))
    setLocal((l) => {
      const next = { ...l }
      delete next[r.id]
      return next
    })
    setAnnouncement(`${r.title} back in the queue`)
    onUndo?.(r)
  }

  const groups =
    layout === 'grouped'
      ? RISK_ORDER.map((risk) => ({ risk, items: pending.filter((r) => r.risk === risk) })).filter(
          (g) => g.items.length,
        )
      : [{ risk: null, items: pending }]
  const bulk = pending.filter((r) => selectedIds.includes(r.id))

  const onRowKey = (e: KeyboardEvent, r: ToolApprovalRequest) => {
    const order = groups.flatMap((g) => g.items)
    const i = order.findIndex((x) => x.id === r.id)
    const move = (to: number) => rows.current.get(order[to]?.id)?.focus()
    if (e.key === 'ArrowDown') move(Math.min(i + 1, order.length - 1))
    else if (e.key === 'ArrowUp') move(Math.max(i - 1, 0))
    else if (e.key === ' ') toggle(r.id)
    else if (e.key === 'Enter') setExpanded(expanded === r.id ? null : r.id)
    else return
    setViaKeys(true)
    e.preventDefault()
  }

  return (
    <MotionConfig reducedMotion="user">
      <Shell
        data-slot="tool-approval-queue"
        aria-label="Permission requests"
        className={cn('max-w-xl', className)}
      >
        <ShellHeader
          icon={ShieldCheck}
          title="Permission requests"
          aside={
            <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
              {pending.length ? (
                <>
                  <RollingNumber value={String(pending.length)} /> waiting on you
                </>
              ) : (
                'All clear'
              )}
            </span>
          }
        />
        <Panel className="overflow-hidden">
          <AnimatePresence initial={false}>
            {bulk.length > 0 && (
              <motion.div
                key="bulk"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0, transition: still ? INSTANT : EXIT_FAST }}
                transition={still ? INSTANT : REVEAL}
                className="overflow-hidden"
              >
                <BulkBar
                  count={bulk.length}
                  onClear={() => setSelected([])}
                  onDeny={() => decide(bulk, 'denied', 'once')}
                  onApprove={() => decide(bulk, 'approved', 'once')}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {pending.length === 0 && (
            <Empty className="p-8 md:p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShieldCheck />
                </EmptyMedia>
                <EmptyTitle className="text-base">Nothing to review</EmptyTitle>
                <EmptyDescription>New requests appear here.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
          <div className={cn('p-1.5', pending.length === 0 && 'hidden')}>
            {/* Groups grow and shrink with their rows, so a label never pops in or out
                and the last row of a group can play its exit. */}
            <AnimatePresence initial={false}>
              {groups.map((g) => (
                <motion.div
                  key={g.risk ?? 'all'}
                  role="group"
                  aria-label={g.risk ? RISKS[g.risk].label : 'Requests'}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0, transition: reduce ? INSTANT : EXIT_FAST }}
                  transition={reduce ? INSTANT : REVEAL}
                  className="overflow-hidden"
                >
                  {g.risk && <GroupLabel risk={g.risk} count={g.items.length} />}
                  <AnimatePresence initial={false}>
                    {g.items.map((r) => (
                      <RequestRow
                        key={r.id}
                        request={r}
                        layout={layout}
                        open={expanded === r.id}
                        checked={selectedIds.includes(r.id)}
                        scope={scopeById[r.id] ?? 'once'}
                        still={still}
                        reduce={reduce}
                        rowRef={(el) => {
                          if (el) rows.current.set(r.id, el)
                          else rows.current.delete(r.id)
                        }}
                        onToggleOpen={() => {
                          setViaKeys(false)
                          setExpanded(expanded === r.id ? null : r.id)
                        }}
                        onToggleSelect={() => {
                          setViaKeys(false)
                          toggle(r.id)
                        }}
                        onKeyDown={(e) => onRowKey(e, r)}
                        onScope={(scope) => setScopeById((m) => ({ ...m, [r.id]: scope }))}
                        onDecide={(decision) =>
                          decide([r], decision, scopeById[r.id] ?? 'once')
                        }
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </Panel>
        <AnimatePresence initial={false}>
          {resolved.length > 0 && (
            <motion.div
              key="resolved"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0, transition: reduce ? INSTANT : EXIT_FAST }}
              transition={reduce ? INSTANT : REVEAL}
              className="overflow-hidden"
            >
              <div className="px-2 pt-2.5 pb-1">
                <p className="px-1.5 pb-1 text-xs text-muted-foreground">
                  Resolved · {resolved.length}
                </p>
                <ul>
                  <AnimatePresence initial={false}>
                    {resolved.map((r) => (
                      <ResolvedRow
                        key={r.id}
                        request={r}
                        resolution={resolutionOf(r)!}
                        onUndo={undo}
                      />
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <p role="status" aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </Shell>
    </MotionConfig>
  )
}
