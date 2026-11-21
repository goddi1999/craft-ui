import { useState } from 'react'

import { DemoControlGroup, DemoSettings, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  MorphPopover,
  MorphPopoverButton,
  MorphPopoverCloseButton,
  MorphPopoverContent,
  MorphPopoverFooter,
  MorphPopoverForm,
  MorphPopoverHeader,
  MorphPopoverLabel,
  MorphPopoverSubmitButton,
  MorphPopoverTextarea,
  MorphPopoverTrigger,
} from '@/components/ui/morph-popover'

const VARIANTS = ['form', 'menu'] as const

const DEFAULTS = { variant: 'form' as (typeof VARIANTS)[number] }

const PROPS: DemoPropDoc[] = [
  { name: 'children', type: 'ReactNode', description: 'MorphPopover: a Trigger and a Content.' },
  {
    name: 'onSubmit',
    type: '(note: string) => void',
    description: 'MorphPopoverForm: called with the textarea value, then the panel closes.',
  },
  {
    name: 'placeholderLabel',
    type: 'string',
    default: "'Note'",
    description: 'MorphPopoverTextarea: accessible name for the textarea.',
  },
  { name: 'className', type: 'string', description: 'Merged onto every part.' },
]

const MENU = ['Rename', 'Duplicate', 'Share', 'Archive']

export function MorphPopoverPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant } = settings.values
  const [lastNote, setLastNote] = useState('')
  const [lastAction, setLastAction] = useState('')

  const usage = toUsageSnippet({
    component: 'MorphPopover',
    from: '@/components/ui/morph-popover',
    props: {},
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / morph-popover"
      title="Morph Popover"
      description="A button that morphs into a panel with a shared-layout spring; its label slides into place as the textarea placeholder. Escape or a click outside closes it and focus returns to the button. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Content"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/morph-popover/'], usage, props: PROPS }}
    >
      <div className="flex h-[260px] w-full flex-col items-center justify-center gap-6">
        {variant === 'form' ? (
          <MorphPopover key="form">
            <MorphPopoverTrigger>Add note</MorphPopoverTrigger>
            <MorphPopoverContent>
              <MorphPopoverForm onSubmit={setLastNote}>
                <MorphPopoverLabel>Add note</MorphPopoverLabel>
                <MorphPopoverTextarea placeholderLabel="Add note" />
                <MorphPopoverFooter>
                  <MorphPopoverCloseButton />
                  <MorphPopoverSubmitButton />
                </MorphPopoverFooter>
              </MorphPopoverForm>
            </MorphPopoverContent>
          </MorphPopover>
        ) : (
          <MorphPopover key="menu">
            <MorphPopoverTrigger>Actions</MorphPopoverTrigger>
            <MorphPopoverContent className="h-auto w-48 py-1">
              <MorphPopoverHeader>Actions</MorphPopoverHeader>
              {MENU.map((item) => (
                <MorphPopoverButton key={item} onClick={() => setLastAction(item)}>
                  {item}
                </MorphPopoverButton>
              ))}
            </MorphPopoverContent>
          </MorphPopover>
        )}
        <p className="text-sm text-muted-foreground" aria-live="polite">
          {variant === 'form'
            ? lastNote
              ? `Saved: ${lastNote}`
              : 'Nothing saved yet'
            : lastAction
              ? `Picked: ${lastAction}`
              : 'Nothing picked yet'}
        </p>
      </div>
    </DemoPage>
  )
}
