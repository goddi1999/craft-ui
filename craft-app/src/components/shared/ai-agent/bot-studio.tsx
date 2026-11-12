import { Check, Dices, Palette, Sparkles } from 'lucide-react'
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react'

import {
  AgentComputerIcon,
  BOT_COLOR_NAMES,
  BOT_COLORS,
  BOT_FACE_NAMES,
  BOT_MOTIONS,
  BOT_SHAPES,
  type BotMotion,
} from '@/components/ui/agent-computer-icon'
import { cn } from '@/lib/utils'

import type { StudioLook } from './use-studio-url'

const MOVES = BOT_MOTIONS.filter((motion) => motion !== 'idle')
const NAMES: Partial<Record<string, string>> = {
  wide: 'Wide eyes',
  notify: 'Notification',
  exclaim: 'Exclamation',
}
const nameOf = (value: string) => NAMES[value] ?? value.charAt(0).toUpperCase() + value.slice(1)
const pickOther = <T,>(list: readonly T[], not: T) => {
  const options = list.filter((item) => item !== not)
  return options[Math.floor(Math.random() * options.length)] ?? not
}

const CAPS = 'font-mono text-xs leading-4 font-medium tracking-widest text-muted-foreground uppercase'
const GRID = 'grid border-t [clip-path:inset(1px_0_0_1px)] *:border-t *:border-l'
const TILE =
  'relative flex min-w-0 cursor-pointer flex-col items-center gap-1.5 px-1.5 pt-4 pb-3 outline-none select-none hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-checked:bg-muted'
const TILE_LABEL =
  'w-full truncate text-center text-[0.6875rem] leading-tight text-muted-foreground in-data-checked:font-medium in-data-checked:text-foreground'

function CheckBadge() {
  return (
    <span
      aria-hidden
      className="absolute end-2 top-2 hidden size-4 place-items-center rounded-full bg-foreground text-background in-data-checked:grid"
    >
      <Check className="size-2.5" strokeWidth={3} />
    </span>
  )
}

function Section({ label, value, children }: { label: string; value: string; children: ReactNode }) {
  const id = useId()
  return (
    <section aria-labelledby={id} className="border-t first:border-t-0">
      <div className="flex items-baseline justify-between gap-4 border-b px-5 py-3 md:px-6">
        <h3 id={id} className={CAPS}>
          {label}
        </h3>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
      {children}
    </section>
  )
}

/** A radio grid: one tab stop, arrow keys walk it (and pick as they go), like the studio's sets. */
function RadioGrid<T extends string>({
  label,
  options,
  value,
  onChange,
  columns,
  renderOption,
  optionLabel,
  tileClassName,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
  columns: 4 | 6
  renderOption: (option: T) => ReactNode
  optionLabel?: (option: T) => string
  tileClassName?: string
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const steps: Record<string, number> = {
      ArrowRight: 1,
      ArrowLeft: -1,
      ArrowDown: columns,
      ArrowUp: -columns,
    }
    const step = steps[event.key]
    if (step === undefined) return
    event.preventDefault()
    const index = options.indexOf(value)
    const next = options[(index + step + options.length) % options.length]
    onChange(next)
    const tiles = event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')
    tiles[options.indexOf(next)]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn(GRID, columns === 4 ? 'grid-cols-4' : 'grid-cols-6')}
    >
      {options.map((option) => {
        const checked = option === value
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={checked}
            aria-label={optionLabel?.(option)}
            title={optionLabel?.(option)}
            tabIndex={checked ? 0 : -1}
            data-checked={checked || undefined}
            onClick={() => onChange(option)}
            className={cn(TILE, tileClassName)}
          >
            {renderOption(option)}
            <CheckBadge />
          </button>
        )
      })}
    </div>
  )
}

export type BotStudioProps = {
  look: StudioLook
  onLookChange: (look: StudioLook) => void
  size: number
  lookAtCursor: boolean
  animated: boolean
  online: boolean
}

/** The grokbots.ai studio: the bot on the left, its look and its moves on the right. */
export function BotStudio({ look, onLookChange, size, lookAtCursor, animated, online }: BotStudioProps) {
  const { shape, face, color } = look
  const [tab, setTab] = useState<'look' | 'move'>('look')
  const [playing, setPlaying] = useState<BotMotion | null>(null)
  const [playCount, setPlayCount] = useState(0)
  const tabsId = useId()
  const name = `${nameOf(color)} ${nameOf(shape)} · ${nameOf(face)}`
  const thumb = { shape, face, color, size: 56, paused: true, className: 'max-w-full' } as const

  const surprise = () =>
    onLookChange({
      shape: pickOther(BOT_SHAPES, shape),
      face: pickOther(BOT_FACE_NAMES, face),
      color: pickOther(BOT_COLOR_NAMES, color),
    })
  const play = (motion: BotMotion) => {
    setPlaying(motion)
    setPlayCount((count) => count + 1)
  }
  const handleTabKeys = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
    event.preventDefault()
    const next = tab === 'look' ? 'move' : 'look'
    setTab(next)
    event.currentTarget.querySelector<HTMLElement>(`#${CSS.escape(`${tabsId}-${next}`)}`)?.focus()
  }

  return (
    <div className="grid w-full overflow-hidden rounded-2xl border bg-background text-foreground md:grid-cols-2">
      <div className="flex min-w-0 flex-col border-b md:sticky md:top-0 md:self-start md:border-b-0">
        <div className="flex items-center justify-between gap-3 border-b px-5 py-2.5 md:px-6">
          <p aria-live="polite" className={cn(CAPS, 'truncate')}>
            {name}
          </p>
          <button
            type="button"
            onClick={surprise}
            className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border bg-background px-3 text-[0.8125rem] font-medium outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] motion-reduce:transition-none"
          >
            <Dices className="size-4" aria-hidden />
            Surprise me
          </button>
        </div>
        <div className="relative flex h-80 items-center justify-center overflow-hidden md:h-[26rem]">
          <div
            aria-hidden
            className="absolute inset-0 bg-[radial-gradient(color-mix(in_oklab,var(--color-foreground)_14%,transparent)_1px,transparent_1px)] bg-size-[20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_72%)]"
          />
          <div
            aria-hidden
            className="absolute inset-0 transition-[background] duration-500 motion-reduce:transition-none"
            style={{ background: `radial-gradient(circle at 50% 50%, ${BOT_COLORS[color]}2e, transparent 58%)` }}
          />
          <AgentComputerIcon
            shape={shape}
            face={face}
            color={color}
            size={size}
            online={online}
            animated={animated}
            lookAtCursor={lookAtCursor}
            motion={playing ?? 'idle'}
            motionKey={playCount}
            onMotionEnd={() => setPlaying(null)}
            label={name}
            className="relative h-auto max-w-[62%]"
          />
          <p className="absolute inset-x-0 bottom-3 text-center text-xs text-muted-foreground">
            {lookAtCursor ? 'It looks at your cursor.' : 'Hover it and it blinks.'}
          </p>
        </div>
      </div>

      <div className="flex min-w-0 flex-col md:border-s">
        <div
          role="tablist"
          aria-label="Bot settings"
          onKeyDown={handleTabKeys}
          className="grid grid-cols-2 border-b"
        >
          {(['look', 'move'] as const).map((id) => {
            const Icon = id === 'look' ? Palette : Sparkles
            const selected = tab === id
            return (
              <button
                key={id}
                id={`${tabsId}-${id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`${tabsId}-${id}-panel`}
                tabIndex={selected ? 0 : -1}
                data-active={selected || undefined}
                onClick={() => setTab(id)}
                className="flex h-12 items-center justify-center gap-2 text-sm text-foreground/75 outline-none not-first:border-s hover:bg-muted/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset data-active:bg-muted/60 data-active:font-medium data-active:text-foreground"
              >
                <Icon className="size-4" aria-hidden />
                {id === 'look' ? 'Look' : 'Move'}
              </button>
            )
          })}
        </div>

        {tab === 'look' ? (
          <div id={`${tabsId}-look-panel`} role="tabpanel" aria-labelledby={`${tabsId}-look`}>
            <Section label="Shape" value={nameOf(shape)}>
              <RadioGrid
                label="Shape"
                options={BOT_SHAPES}
                value={shape}
                onChange={(next) => onLookChange({ ...look, shape: next })}
                columns={4}
                renderOption={(option) => (
                  <>
                    <AgentComputerIcon {...thumb} shape={option} />
                    <span className={TILE_LABEL}>{nameOf(option)}</span>
                  </>
                )}
              />
            </Section>
            <Section label="Face" value={nameOf(face)}>
              <RadioGrid
                label="Face"
                options={BOT_FACE_NAMES}
                value={face}
                onChange={(next) => onLookChange({ ...look, face: next })}
                columns={4}
                renderOption={(option) => (
                  <>
                    <AgentComputerIcon {...thumb} face={option} />
                    <span className={TILE_LABEL}>{nameOf(option)}</span>
                  </>
                )}
              />
            </Section>
            <Section label="Colour" value={nameOf(color)}>
              <RadioGrid
                label="Colour"
                options={BOT_COLOR_NAMES}
                value={color}
                onChange={(next) => onLookChange({ ...look, color: next })}
                columns={6}
                optionLabel={(option) => nameOf(option)}
                tileClassName="justify-center py-4"
                renderOption={(option) => (
                  <span
                    className="block size-8 rounded-full ring-1 ring-black/10 ring-inset in-data-checked:outline-2 in-data-checked:outline-offset-3 in-data-checked:outline-foreground"
                    style={{ backgroundColor: BOT_COLORS[option] }}
                  />
                )}
              />
            </Section>
          </div>
        ) : (
          <div id={`${tabsId}-move-panel`} role="tabpanel" aria-labelledby={`${tabsId}-move`}>
            <Section label="Move" value={playing ? nameOf(playing) : 'Idle'}>
              <div role="group" aria-label="Moves" className={cn(GRID, 'grid-cols-4')}>
                {MOVES.map((motion) => (
                  <button
                    key={motion}
                    type="button"
                    data-checked={playing === motion || undefined}
                    onClick={() => play(motion)}
                    className={TILE}
                  >
                    <AgentComputerIcon {...thumb} motion={motion} />
                    <span className={TILE_LABEL}>{nameOf(motion)}</span>
                  </button>
                ))}
              </div>
            </Section>
          </div>
        )}
      </div>
    </div>
  )
}
