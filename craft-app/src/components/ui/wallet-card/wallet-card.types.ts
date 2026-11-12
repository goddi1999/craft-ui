import type { ComponentProps } from 'react'

/**
 * A dark wallet card with a painted blue surface, a balance, a small iOS-style toggle and an
 * action button. A soft cyan shine follows the pointer across the surface.
 */
export type WalletCardProps = Omit<ComponentProps<'article'>, 'children'> & {
  /** The headline figure, shown as given. @default '$4,566.00' */
  balance?: string
  /** Small caption under the balance. @default 'Total Balance' */
  balanceLabel?: string
  /** Card brand in the subtitle, e.g. "Visa". @default 'Mastercard' */
  cardType?: string
  /** Last four digits in the subtitle. @default '3040' */
  cardLastFour?: string
  /** Label on the action button. @default 'Use Wallet' */
  buttonLabel?: string
  /** Called when the action button is pressed. */
  onUseWallet?: () => void
  /** Disables the action button. @default false */
  disabled?: boolean
}
