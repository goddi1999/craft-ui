import { Slot, Slottable } from '@radix-ui/react-slot'
import { useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import { ICON, SURFACE } from './notification-bell.constants'
import type { NotificationBellProps } from './notification-bell.types'
import { BellIcon, CountBadge } from './notification-bell-parts'
import { useBellRing } from './use-bell-ring'

/**
 * An iOS-style bell with an unread badge. The bell swings when the count goes up,
 * harder for bursts, and each digit rolls the way the count moved.
 */
export function NotificationBell({
  count = 0,
  max = 99,
  variant = 'count',
  size = 48,
  color = 'red',
  asChild = false,
  className,
  style,
  children,
  ...props
}: NotificationBellProps) {
  const reduced = useReducedMotion() ?? false
  const total = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0
  // use the total so a weird count cannot ring the bell
  const { swing, clapper } = useBellRing(total, reduced)

  const badge = (
    <CountBadge
      total={total}
      max={max}
      size={size}
      color={color}
      dot={variant === 'dot'}
      reduced={reduced}
    />
  )

  // this is also the button label, so the count gets read out when it changes
  const label = (
    <span role="status" className="sr-only">
      {total > 0 ? `Notifications, ${total} unread` : 'Notifications'}
    </span>
  )

  if (asChild) {
    return (
      <Slot
        data-slot="notification-bell"
        className={cn('relative', className)}
        style={style}
        {...props}
      >
        <Slottable>{children}</Slottable>
        {label}
        {badge}
      </Slot>
    )
  }

  return (
    <button
      type="button"
      data-slot="notification-bell"
      className={cn(
        'relative grid place-items-center rounded-full outline-none transition-transform focus-visible:ring-2 focus-visible:ring-ring active:scale-90 motion-reduce:active:scale-100',
        SURFACE,
        className,
      )}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      {label}
      <BellIcon side={size * ICON} swing={swing} clapper={clapper} />
      {badge}
    </button>
  )
}
