// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { C, ENTER, EXIT, INSTANT, SIZE } from './blast-radius.constants'
import type { BlastKind, Placed } from './blast-radius.types'
import { hops, pct } from './blast-radius.utils'

type TooltipProps = {
  current: Placed | undefined
  kind: BlastKind | undefined
  fromKeyboard: boolean
}

/** Node details, anchored to the node and opening away from the centre so it stays in the card. */
export function BlastTooltip({ current, kind, fromKeyboard }: TooltipProps) {
  const tipLeft = current ? current.x < C : true
  const tipTop = current ? current.y < C : true
  return (
    <AnimatePresence>
      {current && (
        <motion.div
          key={current.id}
          initial={fromKeyboard ? false : { opacity: 0, scale: 0.97 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: fromKeyboard ? INSTANT : ENTER,
          }}
          exit={{ opacity: 0, transition: fromKeyboard ? INSTANT : EXIT }}
          className="pointer-events-none absolute z-10 w-max rounded-xl bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10"
          style={{
            [tipLeft ? 'left' : 'right']: tipLeft
              ? `calc(${pct(current.x)} + 12px)`
              : `calc(${pct(SIZE - current.x)} + 12px)`,
            [tipTop ? 'top' : 'bottom']: tipTop
              ? `calc(${pct(current.y)} + 4px)`
              : `calc(${pct(SIZE - current.y)} + 4px)`,
            maxWidth: `min(13rem, calc(${pct(tipLeft ? SIZE - current.x : current.x)} - 12px))`,
            transformOrigin: `${tipTop ? 'top' : 'bottom'} ${tipLeft ? 'left' : 'right'}`,
          }}
        >
          <p className="font-mono font-medium break-words">{current.label}</p>
          {current.note && <p className="mt-0.5 text-muted-foreground">{current.note}</p>}
          <p className="mt-0.5 text-muted-foreground">
            {kind?.label} · {hops(current.depth)}
            {current.affected && <span className="text-(--tone)"> · Affected</span>}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

type LegendProps = {
  kinds: { key: string; kind: BlastKind }[]
  affected: boolean
}

export function BlastLegend({ kinds, affected }: LegendProps) {
  return (
    <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {kinds.map(({ key, kind }) => (
        <span key={key} className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-2 rounded-full"
            style={{ background: kind.color }}
          />
          {kind.label}
        </span>
      ))}
      {affected && (
        <span className="flex items-center gap-1.5">
          <svg aria-hidden="true" viewBox="0 0 10 10" className="size-2.5">
            <circle cx={5} cy={5} r={4} fill="none" strokeWidth={1.5} className="stroke-(--tone)" />
          </svg>
          Affected
        </span>
      )}
    </div>
  )
}

export const fadeClass = (fromKeyboard: boolean) =>
  cn('transition-opacity duration-150', fromKeyboard && 'duration-0')
