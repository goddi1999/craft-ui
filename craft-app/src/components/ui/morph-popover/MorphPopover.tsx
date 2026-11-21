import { X } from 'lucide-react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/utils'

import { CONTENT_RADIUS, MORPH_POPOVER_TRANSITION, TRIGGER_RADIUS } from './morph-popover.constants'
import type {
  MorphPopoverButtonProps,
  MorphPopoverFormProps,
  MorphPopoverTextareaProps,
  WithChildren,
} from './morph-popover.types'
import { MorphPopoverContext, useDismiss, useMorphPopover, useMorphPopoverState } from './use-morph-popover'

export function MorphPopover({ children, className }: WithChildren) {
  const state = useMorphPopoverState()

  return (
    <MorphPopoverContext.Provider value={state}>
      {/* reducedMotion="user" drops the layout morph to an instant swap */}
      <MotionConfig transition={MORPH_POPOVER_TRANSITION} reducedMotion="user">
        <div className={cn('relative isolate flex items-center justify-center', className)}>
          {children}
        </div>
      </MotionConfig>
    </MorphPopoverContext.Provider>
  )
}

export function MorphPopoverTrigger({ children, className }: WithChildren) {
  const { open, isOpen, uniqueId, triggerRef } = useMorphPopover()

  return (
    <motion.button
      ref={triggerRef}
      type="button"
      layoutId={`morph-popover-${uniqueId}`}
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      className={cn(
        'flex h-9 items-center border border-border bg-background px-3 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring',
        className,
      )}
      style={{ borderRadius: TRIGGER_RADIUS }}
      onClick={open}
    >
      <motion.span layoutId={`morph-popover-label-${uniqueId}`} className="text-sm">
        {children}
      </motion.span>
    </motion.button>
  )
}

export function MorphPopoverContent({ children, className }: WithChildren) {
  const { isOpen, close, uniqueId, triggerRef } = useMorphPopover()
  const panelRef = useRef<HTMLDivElement>(null)
  const wasOpen = useRef(false)

  useDismiss(panelRef, isOpen, close)

  // hand focus back to the trigger once the panel closes
  useEffect(() => {
    if (wasOpen.current && !isOpen) triggerRef.current?.focus()
    wasOpen.current = isOpen
  }, [isOpen, triggerRef])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          role="dialog"
          layoutId={`morph-popover-${uniqueId}`}
          className={cn(
            'absolute z-50 h-[200px] w-[364px] max-w-[calc(100vw-2rem)] overflow-hidden border border-border bg-popover text-popover-foreground shadow-lg outline-none',
            className,
          )}
          style={{ borderRadius: CONTENT_RADIUS }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function MorphPopoverForm({ children, onSubmit, className }: MorphPopoverFormProps) {
  const { note, close } = useMorphPopover()

  return (
    <form
      className={cn('flex h-full flex-col', className)}
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit?.(note)
        close()
      }}
    >
      {children}
    </form>
  )
}

export function MorphPopoverLabel({ children, className }: WithChildren) {
  const { uniqueId, note } = useMorphPopover()

  return (
    <motion.span
      layoutId={`morph-popover-label-${uniqueId}`}
      aria-hidden="true"
      style={{ opacity: note ? 0 : 1 }}
      className={cn('pointer-events-none absolute top-3 left-4 text-sm text-muted-foreground select-none', className)}
    >
      {children}
    </motion.span>
  )
}

export function MorphPopoverTextarea({ className, placeholderLabel = 'Note' }: MorphPopoverTextareaProps) {
  const { note, setNote } = useMorphPopover()

  return (
    <textarea
      aria-label={placeholderLabel}
      className={cn('h-full w-full resize-none rounded-md bg-transparent px-4 py-3 text-sm outline-none', className)}
      autoFocus
      value={note}
      onChange={(event) => setNote(event.target.value)}
    />
  )
}

export function MorphPopoverFooter({ children, className }: WithChildren) {
  return <div className={cn('flex justify-between px-4 py-3', className)}>{children}</div>
}

export function MorphPopoverCloseButton({ className }: { className?: string }) {
  const { close } = useMorphPopover()

  return (
    <button
      type="button"
      className={cn('flex items-center rounded-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
      onClick={close}
      aria-label="Close popover"
    >
      <X className="size-4" aria-hidden />
    </button>
  )
}

export function MorphPopoverSubmitButton({ className, children = 'Submit' }: { className?: string; children?: React.ReactNode }) {
  return (
    <button
      type="submit"
      className={cn(
        'relative ml-1 flex h-8 shrink-0 items-center justify-center rounded-lg border border-border bg-transparent px-2 text-sm text-muted-foreground transition-colors select-none outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98] motion-reduce:active:scale-100',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function MorphPopoverHeader({ children, className }: WithChildren) {
  return <div className={cn('px-4 py-2 font-semibold text-foreground', className)}>{children}</div>
}

export function MorphPopoverBody({ children, className }: WithChildren) {
  return <div className={cn('p-4', className)}>{children}</div>
}

export function MorphPopoverButton({ children, onClick, className }: MorphPopoverButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex w-full items-center gap-2 rounded-md px-4 py-2 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent',
        className,
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
