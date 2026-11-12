import { Check, Plus } from 'lucide-react'
import { useState } from 'react'

import { AgentComputerIcon, BOT_COLORS } from '@/components/ui/agent-computer-icon'
import { cn } from '@/lib/utils'

import { TEAM, type BotSample } from './bot-samples'

const PRESS =
  'transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97] motion-reduce:transition-none'

/** A team switcher: four bots, each with an online dot cut out of its body. */
export function BotPicker({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (bot: BotSample) => void
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Bots"
      className="grid grid-cols-2 gap-2 rounded-[28px] bg-card p-4 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.25)] ring-1 ring-border"
    >
      {TEAM.map((bot) => {
        const checked = bot.name === value
        return (
          <button
            key={bot.name}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onValueChange(bot)}
            className={cn(
              'flex flex-col items-center gap-2 rounded-2xl px-3 pt-4 pb-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring',
              checked ? 'bg-muted' : 'hover:bg-muted/60',
              PRESS,
            )}
          >
            <AgentComputerIcon
              shape={bot.shape}
              face={bot.face}
              color={bot.color}
              size={72}
              online
              lookAtCursor
            />
            <span className="max-w-full truncate">{bot.name}</span>
          </button>
        )
      })}
    </div>
  )
}

/** A marketplace feature: a large bot with its maker's avatar tucked into its corner. */
export function FeaturedBot({ bot }: { bot: BotSample }) {
  return (
    <article className="dark flex flex-col items-center justify-center rounded-[28px] bg-card px-6 py-8 text-center text-card-foreground ring-1 ring-border">
      <div className="relative">
        <AgentComputerIcon shape={bot.shape} face={bot.face} color={bot.color} size={120} />
        <span
          aria-hidden
          className="absolute right-0 bottom-1 grid size-9 place-items-center rounded-full bg-[#f1efe9] text-xs font-semibold text-[#0a0a0c] ring-4 ring-card"
        >
          {bot.creator.slice(0, 1)}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-medium" style={{ color: BOT_COLORS[bot.color] }}>
        {bot.name}
      </h3>
      <p className="text-sm text-muted-foreground">by {bot.creator}</p>
    </article>
  )
}

/** A card with a two-line description that truncates after that. */
export function BotCard({ bot }: { bot: BotSample }) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border bg-card p-4">
      <AgentComputerIcon shape={bot.shape} face={bot.face} color={bot.color} size={48} />
      <div className="min-w-0">
        <h3 className="truncate text-[15px] font-medium">{bot.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{bot.description}</p>
      </div>
    </article>
  )
}

/** A directory row: bot, title, one line of description, and an Add pill. */
export function BotRow({ bot }: { bot: BotSample }) {
  const [added, setAdded] = useState(false)
  return (
    <li className="flex items-center gap-4 py-3">
      <AgentComputerIcon shape={bot.shape} face={bot.face} color={bot.color} size={56} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{bot.name}</p>
        <p className="truncate text-sm text-muted-foreground">{bot.description}</p>
      </div>
      <button
        type="button"
        aria-pressed={added}
        aria-label={`${added ? 'Remove' : 'Add'} ${bot.name}`}
        onClick={() => setAdded((value) => !value)}
        className={cn(
          'flex h-8 shrink-0 items-center gap-1 rounded-full px-3.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring',
          added ? 'bg-foreground text-background' : 'bg-muted text-foreground hover:bg-muted/70',
          PRESS,
        )}
      >
        {added ? (
          <Check className="size-3.5" strokeWidth={2.25} aria-hidden />
        ) : (
          <Plus className="size-3.5" strokeWidth={2.25} aria-hidden />
        )}
        {added ? 'Added' : 'Add'}
      </button>
    </li>
  )
}
