import { useEffect, useRef, useState } from 'react'
import { BarChart3, Globe, Mail, Search } from 'lucide-react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  PromptSuggestions,
  type PromptSuggestion,
  type PromptSuggestionsVariant,
} from '@/components/ui/prompt-suggestions'

const VARIANTS: PromptSuggestionsVariant[] = ['cards', 'chips']
const REFRESH_MS = 700

const DEFAULTS = {
  variant: 'cards' as PromptSuggestionsVariant,
  heading: true,
  refreshable: true,
  refreshing: false,
}

const COMPONENT_DEFAULTS = { variant: 'cards', refreshing: false }

const PROPS: DemoPropDoc[] = [
  { name: 'data', type: 'PromptSuggestion[]', description: 'The suggestions. Each has id, title and optional hint, icon (a lucide icon) and prompt (text to send, defaults to the title).' },
  { name: 'onSelect', type: '(suggestion, prompt) => void', description: 'Called with the suggestion and the prompt text to send.' },
  { name: 'variant', type: "'cards' | 'chips'", default: "'cards'", description: 'Cards for an empty chat, chips for follow-ups under an answer.' },
  { name: 'onRefresh', type: '() => void', description: 'Shows a refresh button after the chips.' },
  { name: 'refreshing', type: 'boolean', default: 'false', description: 'Disables the chips and spins the refresh icon while new ones load.' },
  { name: 'heading', type: 'string', description: 'A label above the suggestions, also used as the list name.' },
  { name: 'className', type: 'string', description: 'Extra classes for the root.' },
]

const STARTERS: PromptSuggestion[] = [
  { id: 'a', icon: Globe, title: 'Localize the onboarding flow', hint: 'German and Japanese, with the glossary' },
  { id: 'b', icon: BarChart3, title: "Chart last month's signups", hint: 'By plan and by country' },
  { id: 'c', icon: Mail, title: 'Draft the 2.4 release email', hint: 'From the merged pull requests' },
  { id: 'd', icon: Search, title: 'Find unused feature flags', hint: 'Across web and api' },
]

const FOLLOW_UPS: PromptSuggestion[][] = [
  [
    { id: 'f1', title: 'Send test emails to me' },
    { id: 'f2', title: 'Add Japanese next' },
    { id: 'f3', title: 'Show the German subject lines' },
  ],
  [
    { id: 'f4', title: 'Compare open rates by locale' },
    { id: 'f5', title: 'Schedule for Monday 9:00' },
    { id: 'f6', title: 'Review the plan names' },
  ],
  [
    { id: 'f7', title: 'Translate the footer too' },
    { id: 'f8', title: 'Check the unsubscribe link' },
    { id: 'f9', title: 'Export the copy as CSV' },
  ],
]

export function PromptSuggestionsPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, heading, refreshable, refreshing } = settings.values
  const [set, setSet] = useState(0)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  // Fake network round trip: chips disable and the icon spins, then new ones arrive.
  const refresh = () => {
    setLoading(true)
    timer.current = setTimeout(() => {
      setSet((current) => (current + 1) % FOLLOW_UPS.length)
      setLoading(false)
    }, REFRESH_MS)
  }

  const chips = variant === 'chips'
  const headingText = chips ? 'Follow-ups' : 'What should we work on?'

  const usage = toUsageSnippet({
    component: 'PromptSuggestions',
    from: '@/components/ui/prompt-suggestions',
    props: {
      data: { expression: chips ? 'followUps' : 'starters' },
      variant,
      onSelect: { expression: 'send' },
      onRefresh: chips && refreshable ? { expression: 'refresh' } : undefined,
      refreshing: refreshing || loading,
      heading: heading ? headingText : undefined,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / prompt-suggestions"
      title="Prompt Suggestions"
      description={
        <>
          Starter prompts for an empty chat and quick follow-ups under an
          answer. Cards show an icon and a hint, chips are one line with a
          refresh button. Adapted from{' '}
          <a href="https://tuffui.com" target="_blank" rel="noreferrer">
            TuffUI
          </a>{' '}
          (MIT).
        </>
      }
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => {
              settings.set('variant', next)
              setSent(null)
            }}
          />
          <DemoSwitch
            label="Heading"
            checked={heading}
            onCheckedChange={(next) => settings.set('heading', next)}
          />
          <DemoSwitch
            label="Refresh button (chips)"
            checked={refreshable}
            onCheckedChange={(next) => settings.set('refreshable', next)}
          />
          <DemoSwitch
            label="Refreshing"
            checked={refreshing}
            onCheckedChange={(next) => settings.set('refreshing', next)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/prompt-suggestions/', 'src/components/ui/surface/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full max-w-lg flex-col gap-3">
        {chips && (
          <p className="text-sm leading-relaxed">
            All four onboarding emails now have German versions, with product
            names kept in English.
          </p>
        )}
        <PromptSuggestions
          key={variant}
          variant={variant}
          data={chips ? FOLLOW_UPS[set] : STARTERS}
          heading={heading ? headingText : undefined}
          onSelect={(_, prompt) => setSent(prompt)}
          onRefresh={chips && refreshable ? refresh : undefined}
          refreshing={refreshing || loading}
        />
        <p className="min-h-4 text-xs text-muted-foreground" aria-live="polite">
          {sent ? `Sent: ${sent}` : 'Pick a suggestion to send it.'}
        </p>
      </div>
    </DemoPage>
  )
}
