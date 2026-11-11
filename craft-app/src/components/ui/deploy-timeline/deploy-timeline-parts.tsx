// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { cn } from '@/lib/utils'

import { RollingNumber } from '../rolling-number'
import type { DeployItem, DeployStat } from './deploy-timeline.types'
import { duration, percent, points } from './deploy-timeline.utils'

type CalloutProps = {
  item: DeployItem
  threshold?: number
  formatScore: (score: number) => string
  formatDate: (date: Date) => string
  compact: boolean
}

/** Detail for the emphasized deploy: version, change, date, score and status. */
export function DeployCallout({
  item,
  threshold,
  formatScore,
  formatDate,
  compact,
}: CalloutProps) {
  const { d, before, status } = item
  const delta = before !== null ? d.score - before : null
  return (
    <>
      <p className="flex items-center gap-1.5">
        <span className="font-mono font-medium">{d.version}</span>
        <span className="max-w-56 truncate text-muted-foreground">
          {(!compact && d.label) || d.kind} · {formatDate(new Date(item.at))}
        </span>
      </p>
      <p className="mt-0.5 flex items-center gap-1.5">
        <span className="font-mono tabular-nums">{formatScore(d.score)}</span>
        {delta !== null && (
          <span
            className={cn(
              'font-mono tabular-nums',
              item.regression || (threshold !== undefined && d.score < threshold)
                ? 'text-(--negative)'
                : delta > 0
                  ? 'text-(--positive)'
                  : 'text-muted-foreground',
            )}
          >
            {points(delta)}
          </span>
        )}
        {status !== 'shipped' && (
          <span
            className={cn(
              status === 'rolled-back' || status === 'below'
                ? 'text-(--negative)'
                : 'text-primary',
            )}
          >
            ·{' '}
            {status === 'rolled-back'
              ? `${compact ? 'back in' : 'rolled back in'} ${duration(d.rolledBackAfter ?? 0)}`
              : status === 'below'
                ? 'below min'
                : status === 'canary'
                  ? `canary ${percent(d.canary ?? 0)}`
                  : 'live'}
          </span>
        )}
      </p>
    </>
  )
}

/** Chips under the chart: live version, canary, eval and deploy count. */
export function DeployStats({ stats }: { stats: DeployStat[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {stats.map((s) => (
        <span
          key={s.label.replace(/[\d.%]+/g, '')}
          className={cn(
            'inline-flex h-6 items-center gap-1.5 rounded-lg px-2 font-mono text-[0.6875rem] whitespace-nowrap',
            s.tone === 'brand'
              ? 'bg-primary/[0.12] text-primary'
              : s.tone === 'negative'
                ? 'bg-foreground/[0.05] text-(--negative)'
                : 'bg-foreground/[0.05] text-foreground',
          )}
        >
          <RollingNumber
            value={s.label}
            className={s.tone === 'brand' ? 'opacity-70' : 'text-muted-foreground'}
          />
          <RollingNumber value={s.value} />
        </span>
      ))}
    </div>
  )
}

type TableProps = {
  title: string
  summary: string
  items: DeployItem[]
  formatScore: (score: number) => string
  formatDate: (date: Date) => string
}

/** The chart as a table for screen readers. */
export function DeployTable({
  title,
  summary,
  items,
  formatScore,
  formatDate,
}: TableProps) {
  return (
    <table className="sr-only">
      <caption>{`${title}: ${summary}.`}</caption>
      <thead>
        <tr>
          <th scope="col">Version</th>
          <th scope="col">Kind</th>
          <th scope="col">Deployed</th>
          <th scope="col">Eval score</th>
          <th scope="col">Change</th>
          <th scope="col">Status</th>
        </tr>
      </thead>
      <tbody>
        {items.map((it) => (
          <tr key={it.d.id}>
            <th scope="row">
              {it.d.label ? `${it.d.version}: ${it.d.label}` : it.d.version}
            </th>
            <td>{it.d.kind}</td>
            <td>{formatDate(new Date(it.at))}</td>
            <td>{formatScore(it.d.score)}</td>
            <td>{it.before !== null ? points(it.d.score - it.before) : 'First'}</td>
            <td>
              {it.status === 'rolled-back'
                ? `Rolled back after ${duration(it.d.rolledBackAfter ?? 0)}`
                : it.status === 'below'
                  ? 'Below minimum'
                  : it.status === 'canary'
                    ? `Canary, ${percent(it.d.canary ?? 0)} of traffic`
                    : it.status === 'live'
                      ? 'Live'
                      : 'Replaced'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
