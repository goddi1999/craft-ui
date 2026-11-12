import {
  ID_PREVIEW,
  PROCESSING_COPY,
  REVOKE_MS,
  VERIFYING_COPY,
} from './payment-status.constants'
import type { PaymentLifecycleStatus, PaymentReceiptItem } from './payment-status.types'

export function formatAmount(amount: string | number, currency: string) {
  if (typeof amount === 'number') return `${currency}${amount.toFixed(2)}`
  return amount.startsWith(currency) ? amount : `${currency}${amount}`
}

export function formatDate(date: string | Date) {
  if (typeof date === 'string') return date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// a short id is shown whole, only a long one gets cut
export const shortenId = (id: string) =>
  id.length > ID_PREVIEW ? `${id.slice(0, ID_PREVIEW)}...` : id

export const withLast4 = (method: string, last4: string) =>
  last4 ? `${method} (•••• ${last4})` : method

export function describeStatus(
  status: PaymentLifecycleStatus,
  copy: { merchantName: string; errorMessage: string; refundReason: string },
) {
  if (status === 'processing') return PROCESSING_COPY
  if (status === 'verifying') return VERIFYING_COPY
  if (status === 'success') return `Your purchase with ${copy.merchantName} is confirmed.`
  return status === 'failed' ? copy.errorMessage : copy.refundReason
}

/** Resolves true once the text is on the clipboard. */
export function copyText(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(
      () => true,
      () => false,
    )
  }
  // plain http has no clipboard api, so copy from a hidden field and hand focus back
  const previous = document.activeElement
  const field = document.createElement('textarea')
  field.value = text
  field.readOnly = true
  field.style.position = 'fixed'
  field.style.left = '-9999px'
  document.body.appendChild(field)
  field.focus()
  field.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  field.remove()
  if (previous instanceof HTMLElement) previous.focus()
  return Promise.resolve(copied)
}

export function buildReceipt(receipt: {
  merchantName: string
  transactionId: string
  date: string
  paymentMethod: string
  amount: string
  status: PaymentLifecycleStatus
  items: PaymentReceiptItem[]
}) {
  const lines = receipt.items.map((item) => `- ${item.name} (${item.quantity || 1}x): ${item.price}`)
  return [
    `RECEIPT - ${receipt.merchantName}`,
    `Transaction ID: ${receipt.transactionId}`,
    `Date: ${receipt.date}`,
    `Payment Method: ${receipt.paymentMethod}`,
    `Amount: ${receipt.amount}`,
    `Status: ${receipt.status.toUpperCase()}`,
    'Items:',
    ...lines,
    '',
  ].join('\n')
}

export function downloadText(text: string, filename: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  setTimeout(() => URL.revokeObjectURL(url), REVOKE_MS)
}
