import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { INSTANT, PREVIEW_DELAY, TOOLTIP } from './web-search.constants'
import { useHoverIntent } from './web-search-hooks'
import { Favicon } from './web-search-parts'
import type { WebSearchCitationProps } from './web-search.types'
import { hostOf, linkTo, siteName } from './web-search.utils'

/**
 * An inline source chip for an answer. Hovering it, or focusing it from the
 * keyboard, opens a preview card with the page title and snippet.
 */
export function WebSearchCitation({
  source,
  index,
  linked = true,
  className,
  ...props
}: WebSearchCitationProps) {
  const reduced = !!useReducedMotion()
  const { active: open, set, hover } = useHoverIntent(PREVIEW_DELAY)

  return (
    <span
      data-slot="web-search-citation"
      className={cn('relative inline-flex align-baseline', className)}
      {...hover}
      // only keyboard focus opens it, a mouse click is already on its way to the link
      onFocus={(event) => event.target.matches(':focus-visible') && set(true, 0)}
      onBlur={() => set(false, 0)}
      {...props}
    >
      <a
        {...linkTo(source.url, linked)}
        tabIndex={linked ? undefined : 0}
        aria-label={`${source.title}, ${hostOf(source.url)}`}
        className={cn(
          !linked && 'cursor-default',
          'inline-flex h-[19px] -translate-y-px items-center gap-1 rounded-full bg-muted pr-1.5 pl-[3px] font-runde text-[11px] leading-none font-semibold text-muted-foreground no-underline outline-none transition-colors hover:bg-background hover:text-foreground hover:shadow-[0_1px_3px_rgba(0,0,0,0.1)] focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring dark:hover:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_10%)] dark:hover:shadow-none',
          open &&
            'bg-background text-foreground shadow-[0_1px_3px_rgba(0,0,0,0.1)] dark:bg-[color-mix(in_oklab,var(--muted),var(--foreground)_10%)] dark:shadow-none',
        )}
      >
        <Favicon source={source} size={14} />
        {siteName(source.url)}
        {index !== undefined && <span className="tabular-nums opacity-60">{index}</span>}
      </a>

      <AnimatePresence>
        {open && (
          // the padding bridges the gap to the chip, and wrapping resets because the chip sits in a nowrap span
          <motion.span
            role="tooltip"
            className="absolute bottom-full left-1/2 z-50 block w-72 pb-2 whitespace-normal"
            style={{ x: '-50%', originY: 1 }}
            initial={{ opacity: 0, y: 4, scale: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 4, scale: 0.98, filter: 'blur(2px)' }}
            transition={reduced ? INSTANT : TOOLTIP}
          >
            <a
              {...linkTo(source.url, linked)}
              tabIndex={-1}
              className="block rounded-[16px] bg-popover p-3 text-left font-runde no-underline shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18),0_0_0_1px_rgba(0,0,0,0.05)] dark:shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.07)]"
            >
              <span className="flex items-center gap-1.5">
                <Favicon source={source} size={18} />
                <span className="truncate text-[12px] font-medium text-muted-foreground">
                  {hostOf(source.url)}
                </span>
              </span>
              <span className="mt-1.5 line-clamp-2 block text-[13.5px] leading-[18px] font-semibold text-popover-foreground">
                {source.title}
              </span>
              {source.snippet && (
                <span className="mt-1 line-clamp-3 block text-[12.5px] leading-[17px] font-medium text-muted-foreground">
                  {source.snippet}
                </span>
              )}
            </a>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
