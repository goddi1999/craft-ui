import type { ComponentProps, ReactNode } from 'react'
import type { ExternalToast, ToasterProps as SonnerToasterProps } from 'sonner'

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info' | 'loading'

export type ToastAction = {
  label: string
  onClick: () => void
}

// sonner's own styling options don't reach a custom toast, so they're left out
type SonnerStyling =
  | 'icon'
  | 'richColors'
  | 'invert'
  | 'closeButton'
  | 'unstyled'
  | 'classNames'
  | 'descriptionClassName'
  | 'cancel'
  | 'cancelButtonStyle'
  | 'actionButtonStyle'

export type ToastOptions = Omit<ExternalToast, SonnerStyling | 'description' | 'action'> & {
  /** Muted second line under the title. */
  description?: ReactNode
  /** A pill button on the right; clicking it runs onClick and closes the toast. */
  action?: ToastAction
}

export type ToastPromiseMessages<T> = {
  loading: ReactNode
  success: ReactNode | ((data: T) => ReactNode)
  error: ReactNode | ((error: unknown) => ReactNode)
}

export type ToastCardProps = Omit<ComponentProps<'div'>, 'title'> & {
  toastId: string | number
  type: ToastType
  title: ReactNode
  description?: ReactNode
  action?: ToastAction
  /** Shows the hover close button. @default true */
  dismissible?: boolean
}

export type ToasterProps = Omit<
  SonnerToasterProps,
  'theme' | 'richColors' | 'invert' | 'closeButton' | 'icons'
>
