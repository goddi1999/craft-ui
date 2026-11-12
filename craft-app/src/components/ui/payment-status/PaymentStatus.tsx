import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

import {
  DEFAULT_ERROR,
  DEFAULT_ITEMS,
  DEFAULT_REFUND,
  FADE_ONLY,
  RISE,
  TITLES,
} from './payment-status.constants'
import type { PaymentStatusProps } from './payment-status.types'
import {
  buildReceipt,
  describeStatus,
  downloadText,
  formatAmount,
  formatDate,
  withLast4,
} from './payment-status.utils'
import { FailedActions, ReceiptDetails, StatusBadge } from './payment-status-parts'

/**
 * A payment card that moves through processing, verifying, success, failure and refund.
 * Success draws its checkmark and rises in the transaction details, with a copyable ID,
 * an itemised receipt that unfolds and a download; failure offers a retry. Adapted from EasyUI.
 */
export function PaymentStatus({
  status = 'processing',
  amount = '$149.00',
  currency = '$',
  transactionId = 'tx_9842a8d11c7f',
  date = 'Today at 3:42 PM',
  paymentMethod = 'Apple Pay',
  last4 = '4242',
  errorMessage = DEFAULT_ERROR,
  refundReason = DEFAULT_REFUND,
  items = DEFAULT_ITEMS,
  merchantName = 'Acme Cloud',
  onRetry,
  onChangePaymentMethod,
  onDownloadReceipt,
  onViewReceipt,
  className,
  ...props
}: PaymentStatusProps) {
  const reduced = useReducedMotion() ?? false
  const total = formatAmount(amount, currency)
  const when = formatDate(date)
  const method = withLast4(paymentMethod, last4)
  const settled = status === 'success' || status === 'refunded'
  const enter = reduced ? FADE_ONLY : RISE

  const download = () => {
    if (onDownloadReceipt) return onDownloadReceipt()
    const receipt = buildReceipt({
      merchantName,
      transactionId,
      date: when,
      paymentMethod: method,
      amount: total,
      status,
      items,
    })
    downloadText(receipt, `receipt-${transactionId}.txt`)
  }

  return (
    <div
      data-slot="payment-status"
      className={cn(
        'mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-6 text-left font-sans text-card-foreground shadow-[0_12px_30px_-10px_rgba(0,0,0,0.14)] select-none sm:p-7 dark:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-5">
          {/* a new status remounts the badge, so each one plays its own entrance */}
          <StatusBadge key={status} status={status} reduced={reduced} />
        </div>

        {/* announces each new status to screen readers */}
        <div role="status" className="flex flex-col items-center">
          <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {TITLES[status]}
          </h3>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground sm:text-sm">
            {describeStatus(status, { merchantName, errorMessage, refundReason })}
          </p>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted px-3.5 py-1">
          <span className="font-mono text-[11px] text-muted-foreground">Total</span>
          <span className="font-mono text-sm font-semibold text-foreground">{total}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {settled && (
          <motion.div
            key="receipt"
            className="mt-6 border-t border-border pt-5 text-xs"
            {...enter}
          >
            <ReceiptDetails
              transactionId={transactionId}
              date={when}
              method={method}
              total={total}
              items={items}
              reduced={reduced}
              onView={onViewReceipt}
              onDownload={download}
            />
          </motion.div>
        )}
        {status === 'failed' && (
          <motion.div
            key="failed"
            className="mt-6 space-y-2 border-t border-border pt-5"
            {...enter}
          >
            <FailedActions onRetry={onRetry} onChangePaymentMethod={onChangePaymentMethod} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
