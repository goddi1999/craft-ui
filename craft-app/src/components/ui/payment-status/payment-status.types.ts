import type { ComponentProps } from 'react'

export type PaymentLifecycleStatus = 'processing' | 'verifying' | 'success' | 'failed' | 'refunded'

export type PaymentReceiptItem = {
  name: string
  /** Printed as `2x` before the name. */
  quantity?: number
  /** Shown as given, e.g. `'$20.00'`. */
  price: string | number
}

/**
 * A payment card that moves through processing, verifying, success, failure and refund.
 * Success and refund show the transaction with a copyable ID, an itemised receipt and a
 * download; failure offers a retry and a different payment method.
 */
export type PaymentStatusProps = Omit<ComponentProps<'div'>, 'children'> & {
  /** Where the payment is in its lifecycle. @default 'processing' */
  status?: PaymentLifecycleStatus
  /** The total. A number gets the currency and two decimals. @default '$149.00' */
  amount?: string | number
  /** Put in front of the amount unless it already starts with it. @default '$' */
  currency?: string
  /** Transaction reference; the copy button copies all of it. @default 'tx_9842a8d11c7f' */
  transactionId?: string
  /** A `Date` is formatted in en-US; a string is shown as is. @default 'Today at 3:42 PM' */
  date?: string | Date
  /** Payment method label. @default 'Apple Pay' */
  paymentMethod?: string
  /** Last four digits of the card or account. Leave empty to hide them. @default '4242' */
  last4?: string
  /** Shown under the title when the status is `failed`. */
  errorMessage?: string
  /** Shown under the title when the status is `refunded`. */
  refundReason?: string
  /** Lines of the itemised receipt. */
  items?: PaymentReceiptItem[]
  /** Merchant named in the success message and the receipt. @default 'Acme Cloud' */
  merchantName?: string
  /** Called by Try Again on a failed payment. */
  onRetry?: () => void
  /** Called by Change Payment Method on a failed payment. */
  onChangePaymentMethod?: () => void
  /** Replaces the built-in plain-text receipt download. */
  onDownloadReceipt?: () => void
  /** Called when the itemised receipt opens. */
  onViewReceipt?: () => void
}
