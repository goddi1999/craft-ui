import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { ToggleSwitch } from '@/components/ui/toggle-switch'
import { cn } from '@/lib/utils'

// the source's glowing orb avatars: a bright colour lit from the top left drifting into a second one
const ORBS = {
  magenta: ['#ff6ad5', '#7b5cff'],
  sky: ['#3ec9ff', '#5b5bff'],
  violet: ['#c69bff', '#ff5c9e'],
  mint: ['#6dffb0', '#12b86a'],
  peach: ['#ffb38a', '#ff4f86'],
  indigo: ['#9d6bff', '#3a3ad9'],
  lime: ['#e6ff5c', '#3fcf5a'],
  pink: ['#ff7ab0', '#a64dff'],
} as const

export type OrbTone = keyof typeof ORBS

// bars of the activity chart, in % of its height; the highlighted one is the busiest day
const BARS = [38, 52, 44, 70, 58, 82, 64, 90, 72, 100, 86, 78]
const PEAK = 9
// dock.css: each bar grows with an overshoot, 35ms after the one before
const BAR_EASE = [0.34, 1.56, 0.64, 1] as const
const BAR_DELAY = 0.22
const BAR_STAGGER = 0.035
const BAR_DURATION = 0.8
// dock.js: typing starts after 260ms, one letter every 70ms
const TYPE_DELAY_MS = 260
const TYPE_MS = 70

function Orb({ tone, size = 36 }: { tone: OrbTone; size?: number }) {
  const [from, to] = ORBS[tone]
  return (
    <span
      aria-hidden
      className="shrink-0 rounded-full"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(55% 55% at 30% 22%, rgb(255 255 255 / 0.42) 0, rgb(255 255 255 / 0) 70%), radial-gradient(110% 80% at 50% 118%, rgb(0 0 0 / 0.16) 0, rgb(0 0 0 / 0) 60%), radial-gradient(95% 95% at 82% 88%, ${to} 8%, transparent 78%), ${from}`,
      }}
    />
  )
}

export function PanelHead({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>
      <span className="text-xs text-muted-foreground">{meta}</span>
    </div>
  )
}

export function StatTiles({
  stats,
}: {
  stats: readonly { label: string; value: string; change?: string }[]
}) {
  return (
    <div className="mb-3 grid grid-cols-3 gap-2">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-xl bg-foreground/5 p-3">
          <span className="mb-1.5 block text-[11px] text-muted-foreground">{stat.label}</span>
          <b className="text-[17px] font-semibold tracking-[-0.02em]">{stat.value}</b>
          {stat.change ? (
            // status green with no theme token, darker in light mode for contrast
            <span className="ml-1 text-[11px] text-[#15803d] dark:text-[#3ce085]">
              {stat.change}
            </span>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export function ActivityChart({ label }: { label: string }) {
  const reduced = useReducedMotion()

  return (
    <div
      role="img"
      aria-label={label}
      className="flex h-[118px] items-end gap-1.5 rounded-xl bg-foreground/5 px-3.5 pt-3.5 pb-3"
    >
      {BARS.map((height, index) => (
        <motion.div
          key={index}
          className={cn(
            'flex-1 origin-bottom rounded-[5px]',
            index === PEAK ? 'bg-primary' : 'bg-foreground/[0.14]',
          )}
          style={{ height: `${height}%` }}
          initial={reduced ? false : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{
            duration: BAR_DURATION,
            ease: BAR_EASE,
            delay: BAR_DELAY + index * BAR_STAGGER,
          }}
        />
      ))}
    </div>
  )
}

/** The search field types its query in each time the card opens. */
export function SearchField({ query }: { query: string }) {
  const reduced = useReducedMotion()
  const [typed, setTyped] = useState(0)

  useEffect(() => {
    let count = 0
    let timer = 0
    const typeNext = () => {
      count += 1
      setTyped(count)
      if (count < query.length) timer = window.setTimeout(typeNext, TYPE_MS)
    }
    timer = window.setTimeout(typeNext, TYPE_DELAY_MS + TYPE_MS)
    return () => window.clearTimeout(timer)
  }, [query])

  return (
    <div className="mb-3 flex h-11 items-center gap-2.5 rounded-xl bg-foreground/5 px-3.5 text-sm">
      <Search className="size-[18px] shrink-0 text-muted-foreground" strokeWidth={2} aria-hidden />
      <span>
        {query.slice(0, typed)}
        <motion.span
          aria-hidden
          className="ml-0.5 inline-block h-4 w-[1.5px] bg-foreground align-[-3px]"
          animate={reduced ? undefined : { opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: 'linear' }}
        />
      </span>
    </div>
  )
}

export function Chips({ labels }: { labels: readonly string[] }) {
  return (
    <div className="mb-3.5 flex flex-wrap gap-1.5">
      {labels.map((label) => (
        <span
          key={label}
          className="rounded-full bg-foreground/[0.09] px-2.5 py-1.5 text-xs font-medium text-muted-foreground"
        >
          {label}
        </span>
      ))}
    </div>
  )
}

export function MessageRow({
  tone,
  title,
  detail,
  time,
  unread = false,
}: {
  tone: OrbTone
  title: string
  detail: string
  time?: string
  unread?: boolean
}) {
  return (
    <div className="flex items-center gap-3 py-[9px]">
      <Orb tone={tone} />
      <div className="min-w-0 flex-1">
        <b className="block text-[13px] font-medium">{title}</b>
        <span className="block truncate text-xs text-muted-foreground">{detail}</span>
      </div>
      {time ? <time className="text-[11px] text-muted-foreground">{time}</time> : null}
      {unread ? (
        <span className="size-[7px] shrink-0 rounded-full bg-primary">
          <span className="sr-only">Unread</span>
        </span>
      ) : null}
    </div>
  )
}

export function ProfileHead({ name, handle }: { name: string; handle: string }) {
  return (
    <div className="mb-4 flex items-center gap-3.5">
      <Orb tone="sky" size={52} />
      <div>
        <b className="block text-base font-semibold">{name}</b>
        <span className="text-xs text-muted-foreground">{handle}</span>
      </div>
    </div>
  )
}

export function SettingRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex h-[46px] items-center justify-between text-sm text-foreground/80">
      {label}
      <ToggleSwitch aria-label={label} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}
