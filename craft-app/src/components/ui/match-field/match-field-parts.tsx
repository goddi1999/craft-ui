// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { AnimatePresence, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { EASE_OUT, enter, exit, instant } from './match-field.constants'
import type { PlacedItem } from './match-field.types'
import { initialsOf, pct } from './match-field.utils'

type AvatarProps = {
  item: PlacedItem
  index: number
  active: boolean
  dim: boolean
  labeled: boolean
  strong: boolean
  /** Whether the name pill sits to the right of the avatar. */
  right: boolean
  fromKeyboard: boolean
  reduce: boolean | null
  left: string
  top: string
  onSelect: () => void
}

/** One item: an avatar on the field, with a name pill when active or a strong fit. */
export function MatchAvatar({
  item,
  index,
  active,
  dim,
  labeled,
  strong,
  right,
  fromKeyboard,
  reduce,
  left,
  top,
  onSelect,
}: AvatarProps) {
  return (
    <div
      className={cn(
        'absolute -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150',
        dim && 'opacity-40',
        fromKeyboard && 'duration-0',
        active && 'z-10',
      )}
      style={{ left, top }}
      onPointerEnter={onSelect}
      onClick={onSelect}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.25,
          ease: EASE_OUT,
          delay: reduce ? 0 : 0.2 + index * 0.04,
        }}
        className="relative"
      >
        <div
          className={cn(
            'rounded-full p-[2px] transition-colors duration-150',
            active ? 'bg-foreground' : 'bg-card',
            fromKeyboard && 'duration-0',
          )}
        >
          <div
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-full text-[0.6875rem] font-medium text-white @md:size-8"
            style={{ background: item.color }}
          >
            {item.initials ?? initialsOf(item.name)}
          </div>
        </div>
        <AnimatePresence initial={false}>
          {labeled && (
            <motion.span
              key="pill"
              initial={fromKeyboard ? false : { opacity: 0, scale: 0.96 }}
              animate={{
                opacity: 1,
                scale: 1,
                transition: fromKeyboard ? instant : enter,
              }}
              exit={{ opacity: 0, transition: fromKeyboard ? instant : exit }}
              className={cn(
                'pointer-events-none absolute top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-full bg-popover px-2.5 py-1 text-xs whitespace-nowrap text-popover-foreground shadow-md ring-1 ring-foreground/10',
                right ? 'left-full ml-1.5' : 'right-full mr-1.5',
              )}
              style={{ transformOrigin: right ? 'left center' : 'right center' }}
            >
              <span className="max-w-32 truncate">{item.name}</span>
              <span
                className={cn(
                  'font-mono tabular-nums',
                  strong ? 'font-medium text-foreground' : 'text-muted-foreground',
                )}
              >
                {pct(item.score)}
              </span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
