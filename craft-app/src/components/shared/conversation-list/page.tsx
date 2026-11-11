import { useState } from 'react'
import { PanelLeftClose } from 'lucide-react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import {
  ConversationList,
  type Conversation,
  type ConversationListVariant,
} from '@/components/ui/conversation-list'

const VARIANTS: ConversationListVariant[] = ['sidebar', 'compact']

// A fixed "now" (local time, so the groups match in every time zone) keeps
// Today / Yesterday / Previous 7 days the same on every visit.
const NOW = new Date(2026, 10, 11, 14, 0)
const hoursAgo = (hours: number) =>
  new Date(NOW.getTime() - hours * 3_600_000).toISOString()

const SEED: Conversation[] = [
  { id: 'glossary', title: 'Product glossary for translators', updatedAt: hoursAgo(70), pinned: true },
  { id: 'de', title: 'German onboarding emails', updatedAt: hoursAgo(0.2), running: true },
  { id: 'og', title: 'OG images for the blog', updatedAt: hoursAgo(2) },
  { id: 'pricing', title: 'Pricing page copy review', updatedAt: hoursAgo(5) },
  { id: 'licenses', title: 'npm license audit', updatedAt: hoursAgo(20) },
  { id: 'cli', title: 'Migrate the CLI to commander', updatedAt: hoursAgo(30) },
  { id: 'release', title: 'Release notes for 2.4', updatedAt: hoursAgo(80) },
  { id: 'invoices', title: 'Backfill March invoices', updatedAt: hoursAgo(300) },
]

const DEFAULTS = {
  variant: 'sidebar' as ConversationListVariant,
  undoSeconds: 5,
  headerAction: false,
}

const COMPONENT_DEFAULTS = { variant: 'sidebar', undoMs: 5000 }

const PROPS: DemoPropDoc[] = [
  { name: 'data', type: 'Conversation[]', description: 'Chats with id, title, updatedAt (ISO), and optional pinned and running. Grouped into Pinned, Today, Yesterday, Previous 7 days and Older.' },
  { name: 'activeId', type: 'string', description: 'The open chat, marked with aria-current.' },
  { name: 'onSelect', type: '(conversation) => void', description: 'Click or Enter on a row. Arrow keys, Home and End move between rows.' },
  { name: 'onNew', type: '() => void', description: 'Shows a New chat button in the header.' },
  { name: 'onRename', type: '(conversation, title) => void', description: 'Inline rename from the row menu: Enter or blur saves, Esc cancels.' },
  { name: 'onPin', type: '(conversation, pinned) => void', description: 'Pin or unpin from the row menu.' },
  { name: 'onArchive / onDelete', type: '(conversation) => void', description: 'The row hides at once with an Undo pill; the callback runs when the undo window closes.' },
  { name: 'undoMs', type: 'number', default: '5000', description: 'How long Undo stays available.' },
  { name: 'variant', type: "'sidebar' | 'compact'", default: "'sidebar'", description: 'Compact lists titles only, without search or group labels.' },
  { name: 'now', type: 'string', description: 'Reference time for the date groups (ISO); defaults to the current time.' },
  { name: 'headerAction', type: 'ReactNode', description: 'Extra control in the header next to New chat, such as a hide-sidebar toggle.' },
  { name: 'className', type: 'string', description: 'Extra classes for the shell.' },
]

export function ConversationListPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, undoSeconds, headerAction } = settings.values
  const [chats, setChats] = useState(SEED)
  const [active, setActive] = useState('de')
  const [created, setCreated] = useState(1)

  const update = (id: string, patch: Partial<Conversation>) =>
    setChats((current) => current.map((c) => (c.id === id ? { ...c, ...patch } : c)))
  const drop = (conversation: Conversation) =>
    setChats((current) => current.filter((c) => c.id !== conversation.id))

  const newChat = () => {
    const id = `new-${created}`
    setCreated((n) => n + 1)
    setChats((current) => [
      { id, title: `New chat ${created}`, updatedAt: NOW.toISOString() },
      ...current,
    ])
    setActive(id)
  }

  const usage = toUsageSnippet({
    component: 'ConversationList',
    from: '@/components/ui/conversation-list',
    props: {
      data: { expression: 'chats' },
      activeId: { expression: 'activeId' },
      onSelect: { expression: '(c) => router.push(`/chat/${c.id}`)' },
      onNew: { expression: 'newChat' },
      onRename: { expression: '(c, title) => api.rename(c.id, title)' },
      onPin: { expression: '(c, pinned) => api.pin(c.id, pinned)' },
      onArchive: { expression: '(c) => api.archive(c.id)' },
      onDelete: { expression: '(c) => api.remove(c.id)' },
      undoMs: undoSeconds * 1000,
      variant,
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / conversation-list"
      title="Conversation List"
      description={
        <>
          A chat sidebar with date groups, search, and a row menu to pin,
          rename, archive or delete. Archive and delete stay undoable for a few
          seconds. Adapted from{' '}
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
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoSlider
            label="Undo window"
            value={undoSeconds}
            onValueChange={(next) => settings.set('undoSeconds', next)}
            min={1}
            max={10}
            unit="s"
          />
          <DemoSwitch
            label="Header action"
            checked={headerAction}
            onCheckedChange={(next) => settings.set('headerAction', next)}
          />
          <DemoAction
            onClick={() => {
              setChats(SEED)
              setActive('de')
            }}
          >
            Restore chats
          </DemoAction>
        </DemoSettings>
      }
      docs={{
        paths: [
          'src/components/ui/conversation-list/',
          'src/components/ui/surface/',
          'src/components/ui/dropdown-menu.tsx',
          'src/components/ui/empty.tsx',
          'src/components/ui/spinner.tsx',
        ],
        usage,
        props: PROPS,
      }}
    >
      <ConversationList
        data={chats}
        activeId={active}
        now={NOW.toISOString()}
        variant={variant}
        undoMs={undoSeconds * 1000}
        onSelect={(c) => setActive(c.id)}
        onNew={newChat}
        onRename={(c, title) => update(c.id, { title })}
        onPin={(c, pinned) => update(c.id, { pinned })}
        onArchive={drop}
        onDelete={drop}
        headerAction={
          headerAction ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Hide sidebar"
              className="rounded-lg"
            >
              <PanelLeftClose aria-hidden="true" />
            </Button>
          ) : undefined
        }
      />
    </DemoPage>
  )
}
