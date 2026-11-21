import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { useExpandableScreen } from './expandable-screen-context'
import type {
  ExpandableScreenBackgroundProps,
  ExpandableScreenContentProps,
  ExpandableScreenTriggerProps,
} from './expandable-screen.types'

export function ExpandableScreenTrigger({ children, className }: ExpandableScreenTriggerProps) {
  const { isExpanded, expand, layoutId, triggerRadius } = useExpandableScreen()
  const reduced = useReducedMotion() ?? false

  return (
    <AnimatePresence initial={false}>
      {!isExpanded && (
        <motion.div className={cn('relative inline-block', className)}>
          {/* Background layer that morphs into the screen */}
          <motion.div
            style={{ borderRadius: triggerRadius }}
            layout={!reduced}
            layoutId={reduced ? undefined : layoutId}
            className="absolute inset-0 transform-gpu will-change-transform"
          />
          <motion.button
            type="button"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
            transition={reduced ? { duration: 0.15 } : { delay: 0.2 }}
            layout={false}
            onClick={expand}
            aria-expanded={false}
            className="relative cursor-pointer rounded-[inherit] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {children}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function ExpandableScreenContent({
  children,
  className,
  showCloseButton = true,
  closeButtonClassName,
}: ExpandableScreenContentProps) {
  const { isExpanded, collapse, layoutId, contentRadius, animationDuration } = useExpandableScreen()
  const reduced = useReducedMotion() ?? false

  return (
    <AnimatePresence initial={false}>
      {isExpanded && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-2">
          <motion.div
            role="dialog"
            aria-modal="true"
            layoutId={reduced ? undefined : layoutId}
            layout={!reduced}
            initial={reduced ? { opacity: 0 } : undefined}
            animate={reduced ? { opacity: 1 } : undefined}
            exit={reduced ? { opacity: 0 } : undefined}
            transition={{ duration: reduced ? 0.15 : animationDuration }}
            style={{ borderRadius: contentRadius }}
            className={cn(
              'relative flex h-full w-full transform-gpu overflow-y-auto will-change-transform',
              className,
            )}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={reduced ? { duration: 0 } : { delay: 0.15, duration: 0.4 }}
              className="relative z-20 w-full"
            >
              {children}
            </motion.div>

            {showCloseButton && (
              <button
                type="button"
                onClick={collapse}
                autoFocus
                aria-label="Close"
                className={cn(
                  'absolute top-6 right-6 z-30 flex size-10 items-center justify-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                  closeButtonClassName || 'bg-transparent text-primary-foreground hover:bg-primary-foreground/10',
                )}
              >
                <X className="size-5" aria-hidden />
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export function ExpandableScreenBackground({ trigger, content, className }: ExpandableScreenBackgroundProps) {
  const { isExpanded } = useExpandableScreen()
  const node = isExpanded ? content : trigger
  return node ? <div className={className}>{node}</div> : null
}
