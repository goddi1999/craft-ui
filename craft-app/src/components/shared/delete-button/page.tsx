import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { DeleteButton } from '@/components/ui/delete-button'

type Draft = { id: string; name: string; meta: string }

const DRAFTS: Draft[] = [
  { id: 'q3-report', name: 'Q3 report.pdf', meta: '2.4 MB · edited today' },
  { id: 'launch-notes', name: 'Launch notes.md', meta: '18 KB · edited yesterday' },
  { id: 'hero-shot', name: 'Hero shot.png', meta: '6.1 MB · edited Monday' },
]

const ACCENTS = ['#FF5F2E', '#EF4444', '#3B82F6', '#22C55E'] as const
const ACCENT_LABELS: Record<(typeof ACCENTS)[number], string> = {
  '#FF5F2E': 'Orange',
  '#EF4444': 'Red',
  '#3B82F6': 'Blue',
  '#22C55E': 'Green',
}

// long enough for the done check to draw before the row leaves
const REMOVE_DELAY = 900

const DEFAULTS = {
  accentColor: '#FF5F2E' as (typeof ACCENTS)[number],
  removeOnConfirm: true,
}

const COMPONENT_DEFAULTS = { accentColor: '#FF5F2E' }

const PROPS: DemoPropDoc[] = [
  { name: 'onConfirm', type: '() => void', description: 'Called when the check is pressed.' },
  {
    name: 'onCancel',
    type: '() => void',
    description: 'Called when the panel closes without deleting: the cross, the bin, or Escape.',
  },
  {
    name: 'accentColor',
    type: 'string',
    default: "'#FF5F2E'",
    description: 'Any CSS colour for the confirm check and the done check.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Merged onto the root. It carries data-state (open/closed) and data-status (idle/deleted/kept).',
  },
]

export function DeleteButtonPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { accentColor, removeOnConfirm } = settings.values
  const [drafts, setDrafts] = useState(DRAFTS)
  const [lastAction, setLastAction] = useState('Click a bin to delete a draft.')
  const timers = useRef(new Set<number>())

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((timer) => clearTimeout(timer))
  }, [])

  const handleConfirm = (draft: Draft) => {
    setLastAction(`Deleted ${draft.name}`)
    if (!removeOnConfirm) return
    const timer = window.setTimeout(() => {
      timers.current.delete(timer)
      setDrafts((current) => current.filter((item) => item.id !== draft.id))
    }, REMOVE_DELAY)
    timers.current.add(timer)
  }

  const handleRestore = () => {
    setDrafts(DRAFTS)
    setLastAction('Drafts restored.')
  }

  const usage = toUsageSnippet({
    component: 'DeleteButton',
    from: '@/components/ui/delete-button',
    props: {
      onConfirm: { expression: '() => remove(id)' },
      accentColor,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / delete-button"
      title="Delete Button"
      description="A delete button that asks for confirmation in place, no dialog needed. Click the bin to lift its lid; a panel slides out with a check to confirm and a cross to back out. Escape backs out too. Confirming draws a check where the bin was, backing out settles the bin."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Accent"
            options={ACCENTS}
            value={accentColor}
            onChange={(next) => settings.set('accentColor', next)}
            format={(option) => ACCENT_LABELS[option]}
          />
          <DemoSwitch
            label="Remove row on confirm"
            checked={removeOnConfirm}
            onCheckedChange={(next) => settings.set('removeOnConfirm', next)}
          />
          <DemoAction onClick={handleRestore} disabled={drafts.length === DRAFTS.length}>
            Restore drafts
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/delete-button/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-sm flex-col gap-3">
        <div className="rounded-[22px] border bg-background p-2 font-runde">
          <p className="px-3 pt-2 pb-1 text-sm font-semibold text-foreground">Drafts</p>
          <ul className="flex flex-col">
            <AnimatePresence initial={false}>
              {drafts.map((draft) => (
                <motion.li
                  key={draft.id}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center justify-between gap-3 rounded-2xl px-3 py-1.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{draft.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{draft.meta}</p>
                    </div>
                    <DeleteButton
                      accentColor={accentColor}
                      onConfirm={() => handleConfirm(draft)}
                      onCancel={() => setLastAction(`Kept ${draft.name}`)}
                      className="shrink-0"
                    />
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
            {drafts.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                Nothing left. Restore the drafts from the settings.
              </li>
            ) : null}
          </ul>
        </div>
        <p className="text-center text-xs text-muted-foreground">
          {lastAction}
        </p>
      </div>
    </DemoPage>
  )
}
