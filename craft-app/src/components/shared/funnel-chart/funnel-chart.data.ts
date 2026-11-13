import type { FunnelStage } from '@/components/ui/funnel-chart'

/** SaaS signup funnel. */
export const SIGNUP: FunnelStage[] = [
  { label: 'Visitors', value: 48_200 },
  { label: 'Sign ups', value: 12_640 },
  { label: 'Activated', value: 7_180 },
  { label: 'Paid', value: 2_140 },
]

/** Commerce checkout funnel. */
export const CHECKOUT: FunnelStage[] = [
  { label: 'Product views', value: 92_400 },
  { label: 'Add to cart', value: 28_100 },
  { label: 'Checkout started', value: 14_820 },
  { label: 'Payment', value: 9_640 },
  { label: 'Orders', value: 8_210 },
]

export const DATASETS = {
  signup: SIGNUP,
  checkout: CHECKOUT,
} as const

export type FunnelDataset = keyof typeof DATASETS
