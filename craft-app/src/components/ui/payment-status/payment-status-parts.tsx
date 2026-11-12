import {
  ArrowRight,
  Check,
  CircleAlert,
  Copy,
  CreditCard,
  Download,
  Receipt,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useId, useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  BADGE,
  BADGE_TONES,
  CHECK_DRAW,
  COPIED_MS,
  FADE,
  FADE_ONLY,
  FOCUS,
  PRIMARY_BUTTON,
  PROCESSING_RING,
  PROCESSING_SPIN,
  SECONDARY_BUTTON,
  SPRING_SNAPPY,
  UNFOLD,
  VERIFYING_RING,
  VERIFYING_SPIN,
} from './payment-status.constants'
import type { PaymentLifecycleStatus, PaymentReceiptItem } from './payment-status.types'
import { copyText, shortenId } from './payment-status.utils'

export function StatusBadge({
  status,
  reduced,
}: {
  status: PaymentLifecycleStatus
  reduced: boolean
}) {
  if (status === 'processing' || status === 'verifying') {
    const verifying = status === 'verifying'
    return (
      <div className={cn(BADGE, BADGE_TONES[status])}>
        {/* with reduced motion the ring holds still and the title carries the state */}
        <motion.span
          aria-hidden
          className={cn(
            'absolute rounded-full border',
            verifying ? VERIFYING_RING : PROCESSING_RING,
          )}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={{
            duration: verifying ? VERIFYING_SPIN : PROCESSING_SPIN,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {verifying ? (
          <ShieldCheck className="size-6" aria-hidden />
        ) : (
          <CreditCard className="size-5" aria-hidden />
        )}
      </div>
    )
  }

  return (
    <motion.div
      className={cn(BADGE, BADGE_TONES[status])}
      initial={reduced ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={reduced ? FADE : SPRING_SNAPPY}
    >
      {status === 'success' && (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="size-7"
        >
          <motion.path
            d="M20 6L9 17l-5-5"
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={CHECK_DRAW}
          />
        </svg>
      )}
      {status === 'failed' && <CircleAlert className="size-7" aria-hidden />}
      {status === 'refunded' && <RotateCcw className="size-6" aria-hidden />}
    </motion.div>
  )
}

function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1">
      <span className="text-muted-foreground">{label}</span>
      {children}
    </div>
  )
}

export function ReceiptDetails({
  transactionId,
  date,
  method,
  total,
  items,
  reduced,
  onView,
  onDownload,
}: {
  transactionId: string
  date: string
  method: string
  total: string
  items: PaymentReceiptItem[]
  reduced: boolean
  onView?: () => void
  onDownload: () => void
}) {
  const breakdownId = useId()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const copyId = () => {
    copyText(transactionId).then((ok) => {
      if (ok) setCopied(true)
    })
  }

  const toggle = () => {
    if (!open) onView?.()
    setOpen(!open)
  }

  return (
    <>
      <div className="space-y-2.5">
        <DetailRow label="Transaction ID">
          <button
            type="button"
            onClick={copyId}
            title="Copy Transaction ID"
            aria-label={`Copy transaction ID ${transactionId}`}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1 rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-muted-foreground transition-colors hover:text-foreground',
              FOCUS,
            )}
          >
            <span>{shortenId(transactionId)}</span>
            {copied ? (
              <Check className="size-3 text-emerald-600 dark:text-emerald-400" aria-hidden />
            ) : (
              <Copy className="size-3" aria-hidden />
            )}
          </button>
          <span role="status" className="sr-only">
            {copied ? 'Transaction ID copied' : ''}
          </span>
        </DetailRow>

        <DetailRow label="Date & Time">
          <span className="font-mono text-foreground">{date}</span>
        </DetailRow>

        <DetailRow label="Payment Method">
          <span className="flex items-center gap-1.5 text-foreground">
            <CreditCard className="size-3.5 text-muted-foreground" aria-hidden />
            {method}
          </span>
        </DetailRow>
      </div>

      <div className="mt-4.5 flex items-center justify-between gap-2 border-t border-border pt-4">
        <button
          type="button"
          onClick={toggle}
          aria-expanded={open}
          aria-controls={open ? breakdownId : undefined}
          className={cn(SECONDARY_BUTTON, FOCUS, 'flex-1 gap-1.5 px-3 py-2 text-xs')}
        >
          <Receipt className="size-3.5" aria-hidden />
          <span>{open ? 'Hide Details' : 'View Receipt'}</span>
        </button>
        <button
          type="button"
          onClick={onDownload}
          className={cn(SECONDARY_BUTTON, FOCUS, 'flex-1 gap-1.5 px-3 py-2 text-xs')}
        >
          <Download className="size-3.5" aria-hidden />
          <span>Download</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          // padding lives inside, so the height can fold all the way to zero
          <motion.div
            key="breakdown"
            id={breakdownId}
            className="overflow-hidden"
            {...(reduced ? FADE_ONLY : UNFOLD)}
          >
            <div className="pt-2.5">
              <div className="space-y-1.5 rounded-lg border border-border bg-muted/50 p-3">
                <p className="mb-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">
                  Itemized Breakdown
                </p>
                {items.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between gap-3 text-xs text-muted-foreground"
                  >
                    <span>
                      {item.quantity ? `${item.quantity}x ` : ''}
                      {item.name}
                    </span>
                    <span className="font-mono text-foreground">{item.price}</span>
                  </div>
                ))}
                <div className="mt-1 flex justify-between border-t border-border pt-2 text-xs font-medium text-foreground">
                  <span>Total Paid</span>
                  <span className="font-mono">{total}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export function FailedActions({
  onRetry,
  onChangePaymentMethod,
}: {
  onRetry?: () => void
  onChangePaymentMethod?: () => void
}) {
  return (
    <>
      <button type="button" onClick={onRetry} className={cn(PRIMARY_BUTTON, FOCUS)}>
        <RotateCcw className="size-4" aria-hidden />
        <span>Try Again</span>
      </button>
      <button
        type="button"
        onClick={onChangePaymentMethod}
        className={cn(SECONDARY_BUTTON, FOCUS, 'w-full gap-2 px-4 py-2 text-xs')}
      >
        <span>Change Payment Method</span>
        <ArrowRight className="size-3.5" aria-hidden />
      </button>
    </>
  )
}
