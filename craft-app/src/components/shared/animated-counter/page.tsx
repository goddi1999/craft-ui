import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { AnimatedCounter } from '@/components/ui/animated-counter'

const INITIAL_AMOUNT = 128_450
const LOCALES = ['en-US', 'de-DE', 'fr-FR', 'hi-IN'] as const

const DEFAULTS = {
  label: 'Raised',
  prefix: '$',
  suffix: '',
  decimals: 0,
  step: 2_500,
  locale: 'en-US' as (typeof LOCALES)[number],
  animateOnView: true,
}

/** The component's own defaults, so the snippet only prints real changes. */
const COMPONENT_DEFAULTS = {
  prefix: '',
  suffix: '',
  decimals: 0,
  locale: 'en-US',
  animateOnView: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'value',
    type: 'number',
    description: 'The number to show. Each change springs the digit wheels to it.',
  },
  {
    name: 'label',
    type: 'string',
    description: 'Small caption above the number; changing it crossfades.',
  },
  {
    name: 'prefix',
    type: 'string',
    default: "''",
    description: 'Text before the number, e.g. a currency symbol.',
  },
  {
    name: 'suffix',
    type: 'string',
    default: "''",
    description: 'Text after the number, e.g. % or a unit.',
  },
  {
    name: 'decimals',
    type: 'number',
    default: '0',
    description: 'Fixed number of fraction digits.',
  },
  {
    name: 'animateOnView',
    type: 'boolean',
    default: 'false',
    description: 'Roll every digit up from zero the first time it scrolls into view.',
  },
  {
    name: 'locale',
    type: 'string',
    default: "'en-US'",
    description: 'Formatting locale for group and decimal separators.',
  },
]

export function AnimatedCounterPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, prefix, suffix, decimals, step, locale, animateOnView } =
    settings.values
  const [amount, setAmount] = useState(INITIAL_AMOUNT)
  const [replayKey, setReplayKey] = useState(0)

  const value = decimals ? amount + 0.25 : amount

  const handleRandom = () => {
    setAmount(Math.round(Math.random() * 2_000_000))
  }

  const usage = toUsageSnippet({
    component: 'AnimatedCounter',
    from: '@/components/ui/animated-counter',
    props: {
      value: '{value}',
      label: label || undefined,
      prefix,
      suffix,
      decimals,
      locale,
      animateOnView,
    },
    defaults: COMPONENT_DEFAULTS,
  }).replace(/"\{(\w+)\}"/g, '{$1}')

  return (
    <DemoPage
      eyebrow="ui / animated-counter"
      title="Animated Counter"
      description="A number that springs to each new value like an odometer, rolling up from zero when it scrolls into view."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={24}
          />
          <DemoTextField
            label="Prefix"
            value={prefix}
            onValueChange={(value) => settings.set('prefix', value)}
            maxLength={4}
          />
          <DemoTextField
            label="Suffix"
            value={suffix}
            onValueChange={(value) => settings.set('suffix', value)}
            maxLength={6}
          />
          <DemoControlGroup
            title="Locale"
            options={LOCALES}
            value={locale}
            onChange={(value) => settings.set('locale', value)}
          />
          <DemoSlider
            label="Decimals"
            value={decimals}
            onValueChange={(value) => settings.set('decimals', value)}
            min={0}
            max={2}
          />
          <DemoSlider
            label="Step"
            value={step}
            onValueChange={(value) => settings.set('step', value)}
            min={100}
            max={50_000}
            step={100}
          />
          <DemoSwitch
            label="Animate on view"
            checked={animateOnView}
            onCheckedChange={(value) => settings.set('animateOnView', value)}
          />
          <div className="flex flex-wrap items-end justify-end gap-2">
            <DemoAction onClick={() => setAmount((current) => Math.max(0, current - step))}>
              − Step
            </DemoAction>
            <DemoAction onClick={() => setAmount((current) => current + step)}>
              + Step
            </DemoAction>
            <DemoAction onClick={handleRandom}>Random</DemoAction>
            <DemoAction onClick={() => setReplayKey((key) => key + 1)}>
              Replay
            </DemoAction>
          </div>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/animated-counter/'],
        usage,
        props: PROPS,
      }}
    >
      <AnimatedCounter
        key={`${replayKey}-${animateOnView}`}
        label={label || undefined}
        value={value}
        prefix={prefix}
        suffix={suffix}
        decimals={decimals}
        locale={locale}
        animateOnView={animateOnView}
      />
    </DemoPage>
  )
}
