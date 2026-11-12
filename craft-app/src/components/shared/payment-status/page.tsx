import { useEffect, useRef } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { PaymentStatus, type PaymentLifecycleStatus } from '@/components/ui/payment-status'

const STATUSES: readonly PaymentLifecycleStatus[] = [
  'processing',
  'verifying',
  'success',
  'failed',
  'refunded',
]
const METHODS = ['Apple Pay', 'Visa', 'PayPal'] as const
type Method = (typeof METHODS)[number]

// how long the simulated checkout sits in each pending step
const STEP_MS = 1400

const DEFAULTS = {
  status: 'success' as PaymentLifecycleStatus,
  paymentMethod: 'Apple Pay' as Method,
  amount: '$149.00',
  merchantName: 'Acme Cloud',
}

const COMPONENT_DEFAULTS = {
  status: 'processing',
  paymentMethod: 'Apple Pay',
  amount: '$149.00',
  merchantName: 'Acme Cloud',
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'status',
    type: "'processing' | 'verifying' | 'success' | 'failed' | 'refunded'",
    default: "'processing'",
    description: 'Where the payment is. Success and refunded show the receipt; failed shows retry.',
  },
  {
    name: 'amount',
    type: 'string | number',
    default: "'$149.00'",
    description: 'The total. A number gets the currency and two decimals.',
  },
  {
    name: 'currency',
    type: 'string',
    default: "'$'",
    description: 'Put in front of the amount unless it already starts with it.',
  },
  {
    name: 'transactionId',
    type: 'string',
    default: "'tx_9842a8d11c7f'",
    description: 'Shown in the receipt, cut short when long; the copy button copies all of it.',
  },
  {
    name: 'date',
    type: 'string | Date',
    default: "'Today at 3:42 PM'",
    description: 'A Date is formatted in en-US; a string is shown as is.',
  },
  {
    name: 'paymentMethod',
    type: 'string',
    default: "'Apple Pay'",
    description: 'Payment method label.',
  },
  {
    name: 'last4',
    type: 'string',
    default: "'4242'",
    description: 'Last four digits after the method. Leave empty to hide them.',
  },
  { name: 'errorMessage', type: 'string', description: 'Shown when the status is failed.' },
  { name: 'refundReason', type: 'string', description: 'Shown when the status is refunded.' },
  {
    name: 'items',
    type: 'PaymentReceiptItem[]',
    description: 'Lines of the itemised receipt. `{ name, quantity?, price }` each.',
  },
  {
    name: 'merchantName',
    type: 'string',
    default: "'Acme Cloud'",
    description: 'Named in the success message and the receipt.',
  },
  { name: 'onRetry', type: '() => void', description: 'Called by Try Again.' },
  {
    name: 'onChangePaymentMethod',
    type: '() => void',
    description: 'Called by Change Payment Method.',
  },
  {
    name: 'onDownloadReceipt',
    type: '() => void',
    description: 'Replaces the built-in plain-text receipt download.',
  },
  { name: 'onViewReceipt', type: '() => void', description: 'Called when the receipt opens.' },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

export function PaymentStatusPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { status, paymentMethod, amount, merchantName } = settings.values
  const timers = useRef<number[]>([])

  useEffect(() => {
    const pending = timers.current
    return () => pending.splice(0).forEach((timer) => clearTimeout(timer))
  }, [])

  const stop = () => timers.current.splice(0).forEach((timer) => clearTimeout(timer))

  // processing, then verifying, then the outcome
  const simulate = (outcome: 'success' | 'failed') => {
    stop()
    settings.set('status', 'processing')
    timers.current.push(
      window.setTimeout(() => settings.set('status', 'verifying'), STEP_MS),
      window.setTimeout(() => settings.set('status', outcome), STEP_MS * 2),
    )
  }

  const changeMethod = () => {
    settings.set('paymentMethod', METHODS[(METHODS.indexOf(paymentMethod) + 1) % METHODS.length])
    simulate('success')
  }

  const usage = toUsageSnippet({
    component: 'PaymentStatus',
    from: '@/components/ui/payment-status',
    props: {
      status,
      paymentMethod,
      amount,
      merchantName,
      onRetry: status === 'failed' ? { expression: 'retry' } : undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / payment-status"
      title="Payment Status"
      description="A payment card that moves through processing, verifying, success, failure and refund. Success draws its checkmark and rises in the transaction details, with a copyable ID, an itemised receipt that unfolds and a plain-text download; a failure offers a retry or another payment method. Adapted from EasyUI."
      align="start"
      previewClassName="min-h-[38rem]"
      settings={
        <DemoSettings
          onReset={() => {
            stop()
            settings.reset()
          }}
          canReset={settings.isDirty}
        >
          <DemoControlGroup
            title="Status"
            options={STATUSES}
            value={status}
            onChange={(next) => {
              stop()
              settings.set('status', next)
            }}
          />
          <DemoControlGroup
            title="Payment method"
            options={METHODS}
            value={paymentMethod}
            onChange={(next) => settings.set('paymentMethod', next)}
          />
          <DemoTextField
            label="Amount"
            value={amount}
            onValueChange={(next) => settings.set('amount', next)}
            maxLength={12}
          />
          <DemoTextField
            label="Merchant"
            value={merchantName}
            onValueChange={(next) => settings.set('merchantName', next)}
            maxLength={24}
          />
          <DemoAction onClick={() => simulate('success')}>Simulate checkout</DemoAction>
          <DemoAction onClick={() => simulate('failed')}>Simulate decline</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/payment-status/'], usage, props: PROPS }}
    >
      <PaymentStatus
        status={status}
        paymentMethod={paymentMethod}
        amount={amount}
        merchantName={merchantName}
        onRetry={() => simulate('success')}
        onChangePaymentMethod={changeMethod}
      />
    </DemoPage>
  )
}
