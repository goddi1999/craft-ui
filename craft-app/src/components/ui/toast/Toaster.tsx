import { createPortal } from 'react-dom'
import { Toaster as Sonner } from 'sonner'

import { cn } from '@/lib/utils'

import type { ToasterProps } from './toast.types'

/**
 * Mount once. Wraps Sonner with unstyled toasts so `ToastCard` draws them,
 * and tags each toast `group/toast` so the card can react to Sonner's
 * hover, front and expanded states. Dark mode follows the `.dark` class.
 */
export function Toaster({ position = 'bottom-right', gap = 10, toastOptions, ...props }: ToasterProps) {
  // portaled so a z-index or transform on an ancestor can't trap or clip the stack
  return createPortal(
    <Sonner
      position={position}
      gap={gap}
      {...props}
      toastOptions={{
        unstyled: true,
        ...toastOptions,
        classNames: {
          ...toastOptions?.classNames,
          toast: cn('group/toast w-full', toastOptions?.classNames?.toast),
        },
      }}
    />,
    document.body,
  )
}
