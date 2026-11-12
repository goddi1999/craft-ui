import { X } from 'lucide-react'
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'motion/react'
import type { HTMLMotionProps, MotionProps } from 'motion/react'
import { Dialog } from 'radix-ui'
import { useId, useRef, useState, type CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  CARD,
  CLOSE,
  CLOSE_IN,
  DESCRIPTION,
  FADE,
  GROW,
  OVERLAY,
  OVERLAY_IN,
  OVERLAY_OUT,
  PANEL,
  REVEAL,
  SETTLE,
  SPRING_SNAPPY,
  TITLE,
  ZOOM,
  ZOOM_IN,
  ZOOM_OUT,
} from './dialog-card.constants'
import type { DialogCardProps, Side } from './dialog-card.types'
import { Status } from './dialog-card-parts'
import { useQuickLook } from './use-quick-look'

/**
 * A card for browsable items. With `details` the whole card opens and grows into a quick look
 * dialog; Escape or the close button morphs it back into place. Adapted from uiarc.
 */
export function DialogCard({
  title,
  description,
  media,
  action,
  avatar,
  meta,
  status,
  details,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  children,
  className,
  style,
  ...props
}: DialogCardProps) {
  const reduced = useReducedMotion() ?? false
  const group = useId()
  const cardRef = useRef<HTMLElement>(null)
  const descriptionRef = useRef<HTMLParagraphElement>(null)
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const [hovered, setHovered] = useState(false)
  const open = details ? (openProp ?? uncontrolled) : false
  const morph = Boolean(details) && !reduced
  const { geometry, landing, returning } = useQuickLook({
    open,
    morph,
    hasDescription: Boolean(description),
    cardRef,
    descriptionRef,
  })

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  // the same pieces live in the card and the quick look; a shared id lets each travel between them.
  // crossfade is off, so one solid surface moves instead of two translucent copies
  const shared = (id: string, side: Side, layout: true | 'position' = true): MotionProps =>
    morph
      ? {
          layoutId: id,
          layout,
          layoutCrossfade: false,
          layoutDependency: side === 'card' ? open : returning ? 'return' : 'panel',
          transition: { layout: side === 'card' ? SETTLE : GROW },
        }
      : {}

  const footer = (side: Side) =>
    avatar || meta || status || action ? (
      <div className="mt-5 flex items-center justify-between gap-3">
        {avatar || meta || status ? (
          <motion.div
            className="flex min-w-0 flex-[1_1_auto] items-center gap-3"
            {...shared('byline', side, 'position')}
          >
            {avatar ? (
              <span className="grid size-8 flex-none overflow-hidden rounded-full bg-muted *:size-full *:object-cover">
                {avatar}
              </span>
            ) : null}
            {/* a shrinkable column, so a narrow footer truncates the byline under the action */}
            <span className="grid min-w-0 grid-cols-[minmax(0,1fr)] text-xs leading-[1.4]">
              {meta ? <span className="truncate font-medium text-foreground">{meta}</span> : null}
              {status ? <Status text={status} reduced={reduced} /> : null}
            </span>
          </motion.div>
        ) : null}
        {action ? (
          <motion.div
            className="relative z-[1] flex flex-none flex-wrap gap-3"
            {...shared('action', side, 'position')}
          >
            {action}
          </motion.div>
        ) : null}
      </div>
    ) : null

  const card = (
    <motion.article
      {...(props as HTMLMotionProps<'article'>)}
      ref={cardRef}
      data-slot="dialog-card"
      data-hover={hovered || undefined}
      className={cn(CARD, className)}
      style={{ ...style, borderRadius: geometry.card ?? style?.borderRadius }}
      whileHover={reduced ? undefined : { y: -2 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      {...shared('card', 'card')}
      transition={{ default: SPRING_SNAPPY, layout: SETTLE }}
    >
      {media ? (
        <motion.div className="relative overflow-hidden bg-muted" {...shared('media', 'card')}>
          <motion.div
            className="grid min-h-28 place-items-center"
            initial={false}
            animate={{ scale: hovered && !reduced ? ZOOM : 1 }}
            transition={hovered ? ZOOM_IN : ZOOM_OUT}
          >
            {media}
          </motion.div>
        </motion.div>
      ) : null}
      <div className="p-5">
        <motion.h3 className={TITLE} {...shared('title', 'card')}>
          {details ? (
            <Dialog.Trigger asChild>
              {/* the title's hit area stretches over the whole card, while the action stays on top */}
              <button
                type="button"
                data-card-trigger=""
                className="cursor-pointer text-start outline-none [-webkit-tap-highlight-color:transparent] after:absolute after:inset-0"
              >
                {title}
              </button>
            </Dialog.Trigger>
          ) : (
            title
          )}
        </motion.h3>
        {description ? (
          <motion.p
            ref={descriptionRef}
            className={DESCRIPTION}
            {...shared('description', 'card', 'position')}
          >
            {description}
          </motion.p>
        ) : null}
        {children}
        {footer('card')}
      </div>
    </motion.article>
  )

  if (!details) return card

  const landingVars: Record<string, string> =
    landing && returning
      ? {
          '--landing-top': `${landing.top}px`,
          '--landing-left': `${landing.left}px`,
          '--landing-width': `${landing.width}px`,
          '--landing-height': `${landing.height}px`,
        }
      : {}

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <LayoutGroup id={group}>
        {card}
        <AnimatePresence>
          {(open || returning) && (
            <Dialog.Portal key="quick-look" forceMount>
              <AnimatePresence>
                {open && (
                  <Dialog.Overlay key="overlay" asChild forceMount>
                    <motion.div
                      className={OVERLAY}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: reduced ? FADE : OVERLAY_OUT }}
                      transition={reduced ? FADE : OVERLAY_IN}
                    />
                  </Dialog.Overlay>
                )}
              </AnimatePresence>
              <Dialog.Content
                asChild
                forceMount
                {...(description ? {} : { 'aria-describedby': undefined })}
              >
                <motion.div
                  className={PANEL}
                  // a portal root, so the panel is not projected against the card's ancestors
                  data-framer-portal-id={group}
                  data-returning={returning || undefined}
                  layoutScroll
                  style={
                    {
                      borderRadius: geometry.panel,
                      '--card-measure': geometry.measure ? `${geometry.measure}px` : undefined,
                      ...landingVars,
                    } as CSSProperties
                  }
                  {...(morph
                    ? {
                        ...shared('card', 'panel'),
                        initial: false,
                        animate:
                          geometry.card !== undefined && geometry.panel !== undefined
                            ? { borderRadius: returning ? geometry.card : geometry.panel }
                            : undefined,
                        transition: {
                          layout: returning ? SETTLE : GROW,
                          borderRadius: returning ? SETTLE : GROW,
                        },
                        exit: { opacity: 0, transition: { duration: 0 } },
                      }
                    : {
                        initial: { opacity: 0 },
                        animate: { opacity: 1 },
                        exit: { opacity: 0, transition: FADE },
                        transition: FADE,
                      })}
                >
                  {media ? (
                    <motion.div
                      className="relative overflow-hidden bg-muted"
                      {...shared('media', 'panel')}
                    >
                      <motion.div
                        className="grid min-h-28 place-items-center"
                        initial={{ scale: hovered && !reduced ? ZOOM : 1 }}
                        animate={{ scale: 1 }}
                        transition={GROW}
                      >
                        {media}
                      </motion.div>
                    </motion.div>
                  ) : null}
                  {/* the slot carries the entrance, so the button's own press answers at once */}
                  <motion.span
                    className="absolute top-4 right-4 z-[2] grid"
                    initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                    animate={returning ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                    transition={returning || reduced ? FADE : CLOSE_IN}
                  >
                    <Dialog.Close asChild>
                      <motion.button
                        type="button"
                        aria-label="Close quick look"
                        className={CLOSE}
                        whileTap={reduced ? undefined : { scale: 0.94 }}
                        transition={SPRING_SNAPPY}
                      >
                        <X size={16} strokeWidth={1.75} aria-hidden />
                      </motion.button>
                    </Dialog.Close>
                  </motion.span>
                  <div className="p-6 group-data-returning/panel:p-5">
                    <Dialog.Title asChild>
                      <motion.h2
                        className={cn(TITLE, 'text-[1.375rem] group-data-returning/panel:text-lg')}
                        {...shared('title', 'panel')}
                      >
                        {title}
                      </motion.h2>
                    </Dialog.Title>
                    {description ? (
                      <Dialog.Description asChild>
                        <motion.p
                          className={cn(DESCRIPTION, 'max-w-[var(--card-measure,34ch)]')}
                          {...shared('description', 'panel', 'position')}
                        >
                          {description}
                        </motion.p>
                      </Dialog.Description>
                    ) : null}
                    {children}
                    {footer('panel')}
                    <motion.div
                      className="mt-6 border-t border-border pt-5 text-sm leading-[1.4] text-muted-foreground"
                      initial={reduced ? false : { opacity: 0, y: 6 }}
                      animate={returning ? { opacity: 0, y: 0 } : { opacity: 1, y: 0 }}
                      exit={{ opacity: 0, transition: FADE }}
                      transition={returning || reduced ? FADE : REVEAL}
                    >
                      {details}
                    </motion.div>
                  </div>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </LayoutGroup>
    </Dialog.Root>
  )
}
