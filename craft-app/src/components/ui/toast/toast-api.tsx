import type { ReactNode } from 'react'
import { toast as sonner } from 'sonner'

import { ToastCard } from './ToastCard'
import type { ToastOptions, ToastPromiseMessages, ToastType } from './toast.types'
import { message } from './toast.utils'

function show(type: ToastType, title: ReactNode, { description, action, ...options }: ToastOptions = {}) {
  return sonner.custom(
    (id) => (
      <ToastCard
        toastId={id}
        type={type}
        title={title}
        description={description}
        action={action}
        dismissible={options.dismissible}
      />
    ),
    // loading stays up until it is updated or dismissed
    type === 'loading' ? { ...options, duration: options.duration ?? Infinity } : options,
  )
}

function promise<T>(
  task: Promise<T> | (() => Promise<T>),
  messages: ToastPromiseMessages<T>,
  options: ToastOptions = {},
) {
  const id = show('loading', messages.loading, { ...options, duration: Infinity })
  // same id swaps the content in place; duration is passed so the loading Infinity doesn't stick
  const settle = (type: ToastType, title: ReactNode) =>
    show(type, title, { ...options, id, duration: options.duration })

  const pending = typeof task === 'function' ? task() : task
  // catch after then, so a throwing success message still leaves the spinner
  pending
    .then((data) => settle('success', message(messages.success, data)))
    .catch((error) => settle('error', message(messages.error, error)))
  return pending
}

const variant = (type: ToastType) => (title: ReactNode, options?: ToastOptions) =>
  show(type, title, options)

/**
 * `toast(title, options)` shows a plain toast and returns its id; the
 * `.success`, `.error`, `.warning`, `.info` and `.loading` variants add a
 * status tile, and `.promise` morphs a spinner into the result in place.
 */
export const toast = Object.assign(variant('default'), {
  success: variant('success'),
  error: variant('error'),
  warning: variant('warning'),
  info: variant('info'),
  loading: variant('loading'),
  promise,
  dismiss: sonner.dismiss,
})
