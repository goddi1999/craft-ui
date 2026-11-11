// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { Bot } from 'lucide-react'
import { motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { EASE_OUT, EASE_OUT_CLASS, ROW, SPRING } from './tool-call-graph.constants'
import type { HotTone, ToolCallMetric, ToolCallNode } from './tool-call-graph.types'
import { count, percent } from './tool-call-graph.utils'

type AgentNodeProps = { agent: { label: string; meta?: string } }

/** The caller on the left: an icon chip, plus its name on wider cards. */
export function AgentNode({ agent }: AgentNodeProps) {
  return (
    <div className="flex size-9 items-center justify-center rounded-xl bg-foreground/[0.06] @md:block @md:size-auto @md:p-3">
      <span className="flex size-9 items-center justify-center rounded-lg text-primary @md:size-7 @md:bg-primary/15">
        <Bot
          fill="currentColor"
          fillOpacity={0.25}
          aria-hidden="true"
          className="size-4"
        />
      </span>
      <div className="sr-only @md:not-sr-only @md:mt-2.5">
        <p className="font-mono text-[0.8125rem] leading-5 text-pretty break-words text-foreground">
          {agent.label}
        </p>
        {agent.meta && (
          <p className="mt-0.5 text-xs text-pretty break-words text-muted-foreground">
            {agent.meta}
          </p>
        )}
      </div>
    </div>
  )
}

type EdgesProps = {
  edges: { t: ToolCallNode; norm: number; d: string }[]
  width: number
  height: number
  measured: boolean
  active: string | null
  hotId: string | null
  hotTone: HotTone
  reduce: boolean | null
}

/** One curve per tool, as heavy as its metric, with flowing dashes on the hot one. */
export function ToolEdges({
  edges,
  width,
  height,
  measured,
  active,
  hotId,
  hotTone,
  reduce,
}: EdgesProps) {
  const hotEdge = edges.find((e) => e.t.id === hotId)
  return (
    <svg
      key={measured ? 'measured' : 'guess'}
      visibility={measured ? undefined : 'hidden'}
      aria-hidden="true"
      width={width}
      height={height}
      className="block overflow-visible"
    >
      {edges.map(({ t, norm, d }) => {
        const dim = active !== null && active !== t.id
        const focus = active === t.id
        const isHot = t.id === hotId
        return (
          <motion.path
            key={t.id}
            d={d}
            fill="none"
            initial={false}
            animate={{
              strokeWidth: 1.25 + norm * 5,
              opacity: dim ? 0.12 : isHot ? 0.4 : focus ? 1 : 0.3 + norm * 0.5,
            }}
            transition={SPRING}
            className={cn(
              'transition-[stroke] duration-200',
              isHot
                ? hotTone === 'negative'
                  ? 'stroke-(--negative)'
                  : 'stroke-primary'
                : focus
                  ? 'stroke-foreground/70'
                  : 'stroke-foreground/45',
            )}
          />
        )
      })}
      {hotEdge && (
        // Dashes flow from the agent to the tool, over its own tinted edge.
        <motion.path
          key={`${hotEdge.t.id}-${hotTone}`}
          d={hotEdge.d}
          fill="none"
          strokeDasharray="4 8"
          strokeLinecap="round"
          strokeWidth={2}
          initial={{ opacity: 0, strokeDashoffset: 0 }}
          animate={{
            opacity: active !== null && active !== hotEdge.t.id ? 0.15 : 1,
            strokeDashoffset: reduce ? 0 : -24,
          }}
          transition={{
            opacity: { duration: 0.2, ease: EASE_OUT },
            strokeDashoffset: { duration: 1.6, ease: 'linear', repeat: Infinity },
          }}
          className={hotTone === 'negative' ? 'stroke-(--negative)' : 'stroke-primary'}
        />
      )}
    </svg>
  )
}

type ToolRowProps = {
  tool: ToolCallNode
  metric: ToolCallMetric
  noun: string
  uid: string
  isHot: boolean
  bad: boolean
  hotTone: HotTone
  formatLatency: (ms: number) => string
  onActive: (id: string | null) => void
  onSelect?: (id: string) => void
}

/** One tool: a button with its calls, latency and error chip. */
export function ToolRow({
  tool: t,
  metric,
  noun,
  uid,
  isHot,
  bad,
  hotTone,
  formatLatency,
  onActive,
  onSelect,
}: ToolRowProps) {
  const tone = isHot ? hotTone : null
  const em = (m: ToolCallMetric) =>
    m === metric
      ? tone === 'brand'
        ? 'text-primary'
        : 'text-foreground'
      : 'text-muted-foreground'
  return (
    <li>
      <button
        type="button"
        aria-label={`${t.label}: ${count(t.calls)} calls, p50 ${formatLatency(t.p50Ms)}, ${percent(t.errorRate)} errors${isHot ? `, highest ${noun}` : ''}`}
        onPointerEnter={() => onActive(t.id)}
        onPointerLeave={() => onActive(null)}
        onFocus={() => onActive(t.id)}
        onBlur={() => onActive(null)}
        onClick={() => onSelect?.(t.id)}
        className={`relative flex w-full items-center gap-2.5 rounded-xl bg-foreground/[0.04] pr-2.5 pl-3 text-left transition-[background-color,scale] duration-150 ${EASE_OUT_CLASS} outline-none hover:bg-foreground/[0.07] focus-visible:bg-foreground/[0.08] focus-visible:ring-2 focus-visible:ring-ring/50 active:scale-[0.98] @max-md:pl-2.5`}
        style={{ height: ROW }}
      >
        {isHot && (
          <motion.span
            layoutId={`${uid}-hot`}
            transition={SPRING}
            aria-hidden="true"
            className="absolute inset-0 rounded-xl transition-[background-color] duration-200"
            style={{
              backgroundColor: `color-mix(in oklab, var(--${hotTone === 'brand' ? 'primary' : 'negative'}) ${hotTone === 'brand' ? 8 : 13}%, transparent)`,
            }}
          />
        )}
        <span
          aria-hidden="true"
          className={cn(
            'relative size-1.5 shrink-0 rounded-full transition-colors duration-200',
            bad ? 'bg-(--negative)' : isHot ? 'bg-primary' : 'bg-foreground/25',
          )}
        />
        <span className="relative min-w-0 flex-1">
          <span className="block truncate font-mono text-[0.8125rem] text-foreground">
            {t.label}
          </span>
          <span className="mt-0.5 block truncate font-mono text-xs tabular-nums @max-sm:hidden">
            <span className={cn('transition-colors duration-200', em('calls'))}>
              {count(t.calls)}
            </span>
            <span className="text-muted-foreground/60"> · </span>
            <span className={cn('transition-colors duration-200', em('latency'))}>
              <span className="@max-md:hidden">p50 </span>
              {formatLatency(t.p50Ms)}
            </span>
          </span>
          {/* Narrow cards drop the chip and keep only the chosen metric. */}
          <span
            className={cn(
              'mt-0.5 block truncate font-mono text-xs tabular-nums @sm:hidden',
              metric === 'errors' && bad
                ? 'text-(--negative)'
                : tone === 'brand'
                  ? 'text-primary'
                  : 'text-muted-foreground',
            )}
          >
            {metric === 'calls'
              ? `${count(t.calls)} calls`
              : metric === 'latency'
                ? `p50 ${formatLatency(t.p50Ms)}`
                : `${percent(t.errorRate)} err`}
          </span>
        </span>
        <span
          className={cn(
            'relative inline-flex h-6 shrink-0 items-center rounded-md px-2 font-mono text-[0.6875rem] tabular-nums transition-colors duration-200 @max-sm:hidden',
            metric === 'errors'
              ? bad
                ? 'bg-(--negative)/15 text-(--negative)'
                : tone === 'brand'
                  ? 'bg-primary/15 text-primary'
                  : 'bg-foreground/[0.08] text-foreground'
              : bad
                ? 'bg-foreground/[0.05] text-(--negative)'
                : 'bg-foreground/[0.05] text-muted-foreground',
          )}
        >
          {percent(t.errorRate)}
          <span className="@max-md:hidden">&nbsp;err</span>
        </span>
      </button>
    </li>
  )
}
