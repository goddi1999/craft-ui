// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ArrowUpRight, RotateCw } from 'lucide-react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'

import { cn } from '@/lib/utils'

import { Button } from '../button'
import { IconTile } from '../surface'
import { EASE_OUT, STAGGER, exit } from './prompt-suggestions.constants'
import type {
  PromptSuggestion,
  PromptSuggestionsProps,
} from './prompt-suggestions.types'

/**
 * Starter prompts for an empty chat (`cards`) or quick follow-ups under an
 * answer (`chips`). Selecting one hands back the prompt text to send.
 */
export function PromptSuggestions({
  data,
  variant = 'cards',
  onSelect,
  onRefresh,
  refreshing = false,
  heading,
  className,
}: PromptSuggestionsProps) {
  const send = (s: PromptSuggestion) => onSelect(s, s.prompt ?? s.title)
  const appear = (i: number) => ({
    initial: { opacity: 0, y: 6 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.22, ease: EASE_OUT, delay: i * STAGGER },
    },
    exit: { opacity: 0, transition: exit },
  })

  if (variant === 'chips') {
    return (
      <MotionConfig reducedMotion="user">
        <div
          data-slot="prompt-suggestions"
          data-variant="chips"
          className={cn('flex w-full flex-col gap-2', className)}
        >
          {heading && (
            <p className="px-1 text-xs font-medium text-muted-foreground">{heading}</p>
          )}
          <ul
            aria-label={heading ?? 'Suggested follow-ups'}
            aria-busy={refreshing || undefined}
            className="flex flex-wrap items-center gap-1.5"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {data.map((s, i) => (
                <motion.li key={s.id} layout="position" {...appear(i)}>
                  <button
                    type="button"
                    onClick={() => send(s)}
                    disabled={refreshing}
                    className="flex h-8 max-w-80 items-center gap-1.5 rounded-full bg-foreground/[0.06] pr-2.5 pl-3.5 text-[0.8125rem] transition-[background-color,scale,opacity] duration-150 ease-out outline-none hover:bg-foreground/[0.1] focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.97] disabled:opacity-50"
                  >
                    <span className="truncate">{s.title}</span>
                    <ArrowUpRight
                      strokeWidth={2.5}
                      className="size-3 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
            {onRefresh && (
              <li>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="More suggestions"
                  onClick={onRefresh}
                  disabled={refreshing}
                  className={cn(
                    'rounded-full text-muted-foreground',
                    refreshing && '[&_svg]:animate-spin motion-reduce:[&_svg]:animate-none',
                  )}
                >
                  <RotateCw strokeWidth={2.5} aria-hidden="true" />
                </Button>
              </li>
            )}
          </ul>
          <p role="status" aria-live="polite" className="sr-only">
            {refreshing ? 'Loading new suggestions' : ''}
          </p>
        </div>
      </MotionConfig>
    )
  }

  return (
    <MotionConfig reducedMotion="user">
      <div
        data-slot="prompt-suggestions"
        data-variant="cards"
        className={cn('@container flex w-full max-w-xl flex-col gap-3', className)}
      >
        {heading && <p className="px-1 text-[0.9375rem] font-medium">{heading}</p>}
        <ul
          aria-label={heading ?? 'Suggested prompts'}
          className="grid grid-cols-1 gap-2 @md:grid-cols-2"
        >
          {data.map((s, i) => (
            <motion.li key={s.id} {...appear(i)}>
              <button
                type="button"
                onClick={() => send(s)}
                className="group flex h-full w-full items-center gap-3 rounded-[1.125rem] bg-muted p-1.5 pr-3.5 text-left transition-[background-color,scale] duration-150 ease-out outline-none hover:bg-foreground/[0.09] focus-visible:ring-[3px] focus-visible:ring-ring/50 active:scale-[0.98]"
              >
                {s.icon && <IconTile icon={s.icon} className="bg-card" />}
                <span className={cn('min-w-0 flex-1 py-1', !s.icon && 'pl-2')}>
                  <span className="block truncate text-[0.8125rem] font-medium">
                    {s.title}
                  </span>
                  {s.hint && (
                    <span className="block truncate text-xs text-muted-foreground">
                      {s.hint}
                    </span>
                  )}
                </span>
                <ArrowUpRight
                  strokeWidth={2.5}
                  aria-hidden="true"
                  className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-[opacity,translate] duration-150 ease-out group-hover:translate-x-0.5 group-hover:opacity-100 group-focus-visible:opacity-100"
                />
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </MotionConfig>
  )
}
