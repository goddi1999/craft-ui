import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'motion/react'
import { useEffect, useLayoutEffect, useRef, type PointerEvent } from 'react'

import { cn } from '@/lib/utils'

import {
  DEPTH_SPRING,
  FADE_DEPTH,
  LEVEL_DIM,
  LEVEL_SCALE,
  LEVEL_Y,
  LEVELS,
  TILT,
} from './swipe-deck.constants'
import type { SwipeDeckItem } from './swipe-deck.types'
import { calm, clamp } from './swipe-deck.utils'
import type { CardMotion } from './use-swipe-deck'

type DeckCardProps = {
  item: SwipeDeckItem
  /** Place in the deck, 0 is on top. */
  index: number
  /** Which sketch tile is highlighted when there is no image. */
  accent: number
  isTop: boolean
  lift: MotionValue<number>
  threshold: number
  reduced: boolean
  leftLabel: string
  rightLabel: string
  register: (id: string, card: CardMotion) => () => void
  onPointerDown: (event: PointerEvent<HTMLElement>, id: string) => void
  onPointerMove: (event: PointerEvent<HTMLElement>) => void
  onPointerUp: (event: PointerEvent<HTMLElement>) => void
}

export function DeckCard({
  item,
  index,
  accent,
  isTop,
  lift,
  threshold,
  reduced,
  leftLabel,
  rightLabel,
  register,
  onPointerDown,
  onPointerMove,
  onPointerUp,
}: DeckCardProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const depth = useMotionValue(index)
  const flight = useMotionValue(0)
  const grab = useMotionValue(1)
  const latestIndex = useRef(index)

  useLayoutEffect(
    () =>
      register(item.id, {
        x,
        y,
        depth,
        flight,
        grab,
        rejoin: (count) => {
          // come in from deeper than the last card
          depth.jump(count + 0.5)
          animate(depth, latestIndex.current, calm(DEPTH_SPRING, reduced))
        },
      }),
    [register, item.id, x, y, depth, flight, grab, reduced],
  )

  useEffect(() => {
    latestIndex.current = index
    const controls = animate(depth, index, calm(DEPTH_SPRING, reduced))
    return () => controls.stop()
  }, [depth, index, reduced])

  // cards behind rise with the drag; the top card and a thrown one keep their own depth
  const level = useTransform([depth, lift, flight], ([d, l, f]: number[]) =>
    Math.max(0, d - (isTop || f ? 0 : l)),
  )
  const scale = useTransform(level, (l) => 1 - Math.min(l, LEVELS) * LEVEL_SCALE)
  const offsetY = useTransform([y, level], ([dy, l]: number[]) => dy + Math.min(l, LEVELS) * LEVEL_Y)
  const rotate = useTransform([x, grab], ([dx, g]: number[]) => dx * TILT * g)
  const opacity = useTransform(level, (l) => clamp(FADE_DEPTH - l, 0, 1))
  // no shadows, so each card behind is a step darker; that is what separates them
  const dim = useTransform(level, (l) => (l > 0.01 ? Math.min(l, LEVELS) * LEVEL_DIM : 0))
  const zIndex = useTransform(flight, (f) => (f ? 50 : 40 - index))
  const pointerEvents = useTransform(flight, (f) => (f ? 'none' : 'auto'))
  const right = useTransform([x, flight], ([dx, f]: number[]) =>
    isTop || f ? clamp(dx / threshold, 0, 1) : 0,
  )
  const left = useTransform([x, flight], ([dx, f]: number[]) =>
    isTop || f ? clamp(-dx / threshold, 0, 1) : 0,
  )

  return (
    <motion.article
      aria-hidden
      data-slot="swipe-deck-card"
      onPointerDown={(event) => onPointerDown(event, item.id)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={cn(
        'absolute inset-0 touch-none rounded-3xl bg-muted p-3 select-none',
        isTop && 'cursor-grab active:cursor-grabbing',
      )}
      style={{ x, y: offsetY, rotate, scale, opacity, zIndex, pointerEvents }}
    >
      <Cover item={item} accent={accent} />
      <div className="px-1.5 pt-3.5">
        <div className="flex items-baseline justify-between gap-3">
          <p className="truncate text-base font-semibold tracking-[-0.01em]">{item.title}</p>
          {item.aside ? (
            <span className="shrink-0 text-sm font-semibold tabular-nums">{item.aside}</span>
          ) : null}
        </div>
        {item.description ? (
          <p className="mt-[3px] truncate text-xs text-muted-foreground">{item.description}</p>
        ) : null}
        {item.tags?.length ? (
          <div className="mt-3 flex gap-1.5 overflow-hidden">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-foreground/[0.09] px-[9px] py-[5px] text-xs font-medium whitespace-nowrap text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      {/* --green has no theme token; the source keeps it the same in both themes */}
      <motion.span
        className="pointer-events-none absolute top-[22px] left-[22px] -rotate-10 rounded-full bg-[#34d17a] px-3 py-1.5 text-[13px] font-semibold tracking-[0.06em] text-black uppercase"
        style={{ opacity: right }}
      >
        {rightLabel}
      </motion.span>
      <motion.span
        className="pointer-events-none absolute top-[22px] right-[22px] rotate-10 rounded-full bg-foreground px-3 py-1.5 text-[13px] font-semibold tracking-[0.06em] text-background uppercase"
        style={{ opacity: left }}
      >
        {leftLabel}
      </motion.span>
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black"
        style={{ opacity: dim }}
      />
    </motion.article>
  )
}

function Cover({ item, accent }: { item: SwipeDeckItem; accent: number }) {
  if (item.image) {
    return (
      <div className="relative h-[172px] overflow-hidden rounded-2xl bg-foreground/5">
        <img
          src={item.image}
          alt=""
          draggable={false}
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    )
  }

  // a tiny page: nav bar, hero, a row of three tiles
  return (
    <div className="grid h-[172px] grid-rows-[10px_1fr_34px] gap-2 overflow-hidden rounded-2xl bg-foreground/5 p-3">
      <span className="w-3/5 rounded-[5px] bg-foreground/[0.09]" />
      <span className="rounded-lg bg-foreground/[0.09]" />
      <span className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((tile) => (
          <span
            key={tile}
            className={cn('rounded-md', tile === accent ? 'bg-primary' : 'bg-foreground/[0.09]')}
          />
        ))}
      </span>
    </div>
  )
}
