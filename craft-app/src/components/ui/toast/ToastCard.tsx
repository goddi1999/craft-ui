import { toast as sonner } from 'sonner'

import { cn } from '@/lib/utils'

import { CARD_RADIUS, PADDING, TILE_RADIUS } from './toast.constants'
import { useBoxSize } from './toast-hooks'
import { ToastIcon } from './toast-parts'
import type { ToastCardProps } from './toast.types'
import { squirclePath } from './toast.utils'

/**
 * The toast itself: a squircle card with a status tile, title, optional
 * description and action, and a close button that shows on hover. `toast()`
 * renders it inside Sonner; render it directly for a static preview.
 */
export function ToastCard({
  toastId,
  type,
  title,
  description,
  action,
  dismissible = true,
  className,
  ...props
}: ToastCardProps) {
  const [cardRef, { width, height }] = useBoxSize<HTMLDivElement>()
  const outline = width > 0 ? squirclePath(width, height, CARD_RADIUS) : null

  return (
    <div
      data-slot="toast"
      data-type={type}
      {...props}
      // drop-shadow, since a box-shadow would be cut off by the squircle clip; its blur reads about twice a box-shadow's
      className={cn(
        'relative h-full w-full [filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.05))_drop-shadow(0_2px_5px_rgba(0,0,0,0.06))] dark:[filter:drop-shadow(0_1px_1px_rgba(0,0,0,0.3))_drop-shadow(0_2px_5px_rgba(0,0,0,0.3))]',
        className,
      )}
    >
      <div
        ref={cardRef}
        style={{
          padding: PADDING,
          borderRadius: CARD_RADIUS,
          clipPath: outline ? `path('${outline}')` : undefined,
        }}
        className="relative flex h-full items-center bg-popover"
      >
        {outline && (
          <svg
            aria-hidden
            width={width}
            height={height}
            className="pointer-events-none absolute inset-0"
          >
            {/* half the stroke is clipped away, leaving a 1px inner hairline */}
            <path d={outline} fill="none" strokeWidth={2} className="stroke-border" />
          </svg>
        )}
        {/* sonner squeezes back toasts to the front one's height, so their content hides */}
        <div className="flex min-w-0 flex-1 items-center gap-3 transition-opacity duration-300 group-data-[expanded=false]/toast:group-data-[front=false]/toast:opacity-0 motion-reduce:transition-none">
          {type !== 'default' && <ToastIcon type={type} />}
          <div
            className={cn(
              'flex min-h-9 min-w-0 flex-1 flex-col justify-center',
              type === 'default' && 'pl-1.5',
            )}
          >
            <p
              data-slot="toast-title"
              className="text-sm leading-5 font-semibold tracking-[-0.01em] text-popover-foreground"
            >
              {title}
            </p>
            {description && (
              <p
                data-slot="toast-description"
                className="text-[13px] leading-[18px] font-medium text-muted-foreground"
              >
                {description}
              </p>
            )}
          </div>
          {action && (
            <button
              type="button"
              data-slot="toast-action"
              onClick={() => {
                action.onClick()
                sonner.dismiss(toastId)
              }}
              style={{ borderRadius: TILE_RADIUS }}
              className="h-9 shrink-0 cursor-pointer bg-muted px-3.5 text-[13px] font-semibold text-foreground outline-none transition-[background-color,transform] hover:bg-muted-foreground/15 focus-visible:ring-2 focus-visible:ring-ring active:scale-95 motion-reduce:transition-none"
            >
              {action.label}
            </button>
          )}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          aria-label="Dismiss"
          data-slot="toast-close"
          onClick={() => sonner.dismiss(toastId)}
          // sits on the corner, outside the clipped card, so it never pushes the content around
          className="absolute -top-1.5 -left-1.5 grid size-5 cursor-pointer place-items-center rounded-full bg-popover text-muted-foreground opacity-0 shadow-[0_0_0_1px_var(--border)] outline-none transition-[opacity,color] group-hover/toast:opacity-100 hover:text-foreground focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none dark:bg-muted [@media(hover:none)]:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="size-2.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            strokeLinecap="round"
            aria-hidden
          >
            <path d="M7 7l10 10M17 7L7 17" />
          </svg>
        </button>
      )}
    </div>
  )
}
