import type { PaymentLifecycleStatus, PaymentReceiptItem } from './payment-status.types'

// easyui motion tokens, inlined so the folder copies on its own
export const SPRING_SNAPPY = { type: 'spring', stiffness: 380, damping: 30, mass: 0.5 } as const
export const SPRING_GENTLE = { type: 'spring', stiffness: 170, damping: 26, mass: 0.9 } as const
export const FADE = { duration: 0.15 } as const

// seconds per turn of the spinner ring
export const PROCESSING_SPIN = 1.2
export const VERIFYING_SPIN = 1
export const CHECK_DRAW = { duration: 0.4, delay: 0.1, ease: 'easeOut' } as const

// the details rise in under the amount, or just fade with reduced motion
export const RISE = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 12 },
  transition: SPRING_GENTLE,
} as const
export const UNFOLD = {
  initial: { height: 0, opacity: 0 },
  animate: { height: 'auto', opacity: 1 },
  exit: { height: 0, opacity: 0 },
  transition: SPRING_GENTLE,
} as const
export const FADE_ONLY = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: FADE,
} as const

export const COPIED_MS = 2000
// revoking the url straight away can cancel the download in some browsers
export const REVOKE_MS = 1000
// longer ids are cut to this many characters in the row
export const ID_PREVIEW = 14

export const DEFAULT_ITEMS: PaymentReceiptItem[] = [
  { name: 'Pro Team Plan', quantity: 1, price: '$129.00' },
  { name: 'Priority Support Add-on', quantity: 1, price: '$20.00' },
]
export const DEFAULT_ERROR = "Payment couldn't be completed. Your card issuer declined the request."
export const DEFAULT_REFUND = 'Refunded to original payment method within 3–5 business days.'

export const TITLES: Record<PaymentLifecycleStatus, string> = {
  processing: 'Processing Payment',
  verifying: 'Verifying Transaction',
  success: 'Payment Successful',
  failed: "Payment Couldn't Be Completed",
  refunded: 'Payment Refunded',
}
export const PROCESSING_COPY = 'Securely communicating with payment provider...'
export const VERIFYING_COPY = 'Confirming token authorization and anti-fraud checks...'

export const BADGE = 'relative flex size-14 items-center justify-center rounded-full border'

// status colours have no shadcn token, so they use the Tailwind palette
export const BADGE_TONES: Record<PaymentLifecycleStatus, string> = {
  processing: 'border-border bg-muted text-muted-foreground',
  verifying: 'border-border bg-muted text-sky-600 dark:text-sky-400',
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  failed: 'border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400',
  refunded: 'border-border bg-muted text-muted-foreground',
}

export const PROCESSING_RING = 'inset-0 border-foreground/25 border-t-foreground'
export const VERIFYING_RING =
  'inset-1 border-sky-500/40 border-t-sky-500 dark:border-sky-400/40 dark:border-t-sky-400'

export const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'

export const SECONDARY_BUTTON =
  'inline-flex cursor-pointer items-center justify-center rounded-lg border border-border bg-muted font-medium text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-card hover:text-foreground'

export const PRIMARY_BUTTON =
  'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 sm:text-sm'
