import {
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GhostSuggestion, type GhostSuggestionNote } from '@/components/ui/ghost-suggestion'

const NOTES: GhostSuggestionNote[] = [
  { text: 'The 2.4 release cuts cold starts', suggestion: ' from four seconds to under one.' },
  { text: 'Roll the new billing page out to', suggestion: ' ten teams first, then everyone.' },
  { text: 'Before Friday, remove the flags', suggestion: ' nobody has touched in a month.' },
]

const DEFAULTS = {
  autoAccept: true,
  acceptAfter: 1500,
  label: 'Release notes',
}

const COMPONENT_DEFAULTS = { autoAccept: true, acceptAfter: 1500, label: 'Notes' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'notes',
    type: '{ text: string; suggestion: string }[]',
    description:
      'Typed out one after another. Each offers its suggestion, then the next note follows. Start a suggestion with a space to continue after a word.',
  },
  {
    name: 'autoAccept',
    type: 'boolean',
    default: 'true',
    description: 'Accept by itself after `acceptAfter`. Off, it waits for Tab or a click.',
  },
  {
    name: 'acceptAfter',
    type: 'number',
    default: '1500',
    description: 'How long a suggestion waits before accepting itself, in ms.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Notes'",
    description: "Heading in the top left, and the field's accessible name.",
  },
  {
    name: 'hint',
    type: 'string',
    default: "'Suggestions on'",
    description: 'Chip in the top right.',
  },
  {
    name: 'onAccept',
    type: '(note: GhostSuggestionNote) => void',
    description: 'Called with the note whose suggestion was just accepted.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

export function GhostSuggestionPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { autoAccept, acceptAfter, label } = settings.values

  const usage = toUsageSnippet({
    component: 'GhostSuggestion',
    from: '@/components/ui/ghost-suggestion',
    props: { notes: { expression: 'notes' }, autoAccept, acceptAfter, label },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / ghost-suggestion"
      title="Ghost Suggestion"
      description="A note types itself out, then the AI offers the rest of the sentence in a dim colour with a Tab key beside it. Press Tab or click to accept: the key drops away, each letter brightens with a small hop from left to right, and the caret jumps to the end. Adapted from Design Bookmark's motion studies."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSwitch
            label="Accept by itself"
            checked={autoAccept}
            onCheckedChange={(next) => settings.set('autoAccept', next)}
          />
          {autoAccept && (
            <DemoSlider
              label="Accept after"
              value={acceptAfter}
              onValueChange={(next) => settings.set('acceptAfter', next)}
              min={500}
              max={4000}
              step={100}
              unit="ms"
            />
          )}
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={32}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/ghost-suggestion/'], usage, props: PROPS }}
    >
      <div className="flex w-full flex-col items-center gap-4">
        <GhostSuggestion
          notes={NOTES}
          autoAccept={autoAccept}
          acceptAfter={acceptAfter}
          label={label}
        />
        <p className="text-xs text-muted-foreground">
          Click the note, or focus it and press Tab, to accept early
        </p>
      </div>
    </DemoPage>
  )
}
