import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { WalletCard } from '@/components/ui/wallet-card'

const CARD_TYPES = ['Mastercard', 'Visa', 'Amex'] as const
type CardType = (typeof CARD_TYPES)[number]

const DEFAULTS = {
  balance: '$4,566.00',
  balanceLabel: 'Total Balance',
  cardType: 'Mastercard' as CardType,
  cardLastFour: '3040',
  buttonLabel: 'Use Wallet',
  disabled: false,
}

const COMPONENT_DEFAULTS = { ...DEFAULTS }

const PROPS: DemoPropDoc[] = [
  {
    name: 'balance',
    type: 'string',
    default: "'$4,566.00'",
    description: 'The headline figure, shown as given.',
  },
  {
    name: 'balanceLabel',
    type: 'string',
    default: "'Total Balance'",
    description: 'Small caption under the balance.',
  },
  {
    name: 'cardType',
    type: 'string',
    default: "'Mastercard'",
    description: 'Card brand in the subtitle.',
  },
  {
    name: 'cardLastFour',
    type: 'string',
    default: "'3040'",
    description: 'Last four digits in the subtitle.',
  },
  {
    name: 'buttonLabel',
    type: 'string',
    default: "'Use Wallet'",
    description: 'Label on the action button.',
  },
  { name: 'onUseWallet', type: '() => void', description: 'Called when the button is pressed.' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button.' },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

export function WalletCardPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { balance, balanceLabel, cardType, cardLastFour, buttonLabel, disabled } = settings.values

  const usage = toUsageSnippet({
    component: 'WalletCard',
    from: '@/components/ui/wallet-card',
    props: {
      balance,
      balanceLabel,
      cardType,
      cardLastFour,
      buttonLabel,
      disabled,
      onUseWallet: { expression: 'payWithWallet' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / wallet-card"
      title="Wallet Card"
      description="A dark wallet card with a painted blue surface, a balance, a small iOS-style toggle and an action button that gives under a press. Move the pointer over the surface and a soft cyan shine follows it, driven by motion values so the card never re-renders. Adapted from EasyUI."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Balance"
            value={balance}
            onValueChange={(next) => settings.set('balance', next)}
            maxLength={14}
          />
          <DemoTextField
            label="Balance label"
            value={balanceLabel}
            onValueChange={(next) => settings.set('balanceLabel', next)}
            maxLength={24}
          />
          <DemoControlGroup
            title="Card"
            options={CARD_TYPES}
            value={cardType}
            onChange={(next) => settings.set('cardType', next)}
          />
          <DemoTextField
            label="Last four"
            value={cardLastFour}
            onValueChange={(next) => settings.set('cardLastFour', next)}
            maxLength={4}
          />
          <DemoTextField
            label="Button label"
            value={buttonLabel}
            onValueChange={(next) => settings.set('buttonLabel', next)}
            maxLength={16}
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(next) => settings.set('disabled', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/wallet-card/'], usage, props: PROPS }}
    >
      <WalletCard
        balance={balance}
        balanceLabel={balanceLabel}
        cardType={cardType}
        cardLastFour={cardLastFour}
        buttonLabel={buttonLabel}
        disabled={disabled}
      />
    </DemoPage>
  )
}
