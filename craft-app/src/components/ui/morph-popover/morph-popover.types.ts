import type { ReactNode } from 'react'

export type MorphPopoverContextValue = {
  isOpen: boolean
  open: () => void
  close: () => void
  uniqueId: string
  note: string
  setNote: (note: string) => void
  triggerRef: React.RefObject<HTMLButtonElement | null>
}

export type WithChildren = { children: ReactNode; className?: string }

export type MorphPopoverFormProps = WithChildren & {
  onSubmit?: (note: string) => void
}

export type MorphPopoverTextareaProps = {
  className?: string
  placeholderLabel?: string
}

export type MorphPopoverButtonProps = WithChildren & { onClick?: () => void }
