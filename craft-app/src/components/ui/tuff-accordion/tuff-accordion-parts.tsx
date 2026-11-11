// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { ChevronDown } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useId } from 'react'

import { cn } from '@/lib/utils'

import { EASE_OUT, SPRING } from './tuff-accordion.constants'
import type { SectionProps } from './tuff-accordion.types'

/** One header + body pair; shared by Accordion items and Collapsible. */
export function AccordionSection({
  title,
  icon: Icon,
  meta,
  open,
  onToggle,
  disabled,
  instant,
  className,
  children,
}: SectionProps) {
  const id = useId()
  const reduce = useReducedMotion()
  const still = instant || !!reduce

  return (
    <div data-slot="tuff-accordion-section" className={cn('rounded-xl', className)}>
      <h3>
        <button
          type="button"
          id={`${id}-trigger`}
          aria-expanded={open}
          aria-controls={`${id}-body`}
          disabled={disabled}
          // detail is 0 for keyboard-initiated clicks.
          onClick={(e) => onToggle(e.detail === 0)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-[background-color,scale] duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] hover:bg-foreground/[0.03] active:scale-[0.99] disabled:opacity-40"
        >
          {Icon && (
            <Icon
              aria-hidden="true"
              className="size-4 shrink-0 text-muted-foreground"
            />
          )}
          <span className="min-w-0 flex-1 truncate">{title}</span>
          {meta && (
            <span className="shrink-0 text-[0.8125rem] font-normal text-muted-foreground">
              {meta}
            </span>
          )}
          <ChevronDown
            strokeWidth={2.5}
            aria-hidden="true"
            className={cn(
              'size-3.5 shrink-0 text-muted-foreground transition-transform duration-200 ease-[cubic-bezier(0.77,0,0.175,1)]',
              open && 'rotate-180',
              still && 'transition-none',
            )}
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`${id}-body`}
            role="region"
            aria-labelledby={`${id}-trigger`}
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: still
                ? { duration: 0 }
                : { height: SPRING, opacity: { duration: 0.2, ease: EASE_OUT } },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: still
                ? { duration: 0 }
                : { height: { ...SPRING, duration: 0.22 }, opacity: { duration: 0.12 } },
            }}
            className="overflow-hidden"
          >
            <div className="px-3 pt-0.5 pb-3 text-[0.8125rem] text-muted-foreground">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
