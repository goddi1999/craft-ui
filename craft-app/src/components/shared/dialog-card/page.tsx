import { getAvatarUrl } from '@wq-org/avatars'
import { Bookmark } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { DialogCard } from '@/components/ui/dialog-card'
import { cn } from '@/lib/utils'

type Fact = [label: string, value: string]

type Guide = {
  id: string
  title: string
  description: string
  photo: string
  author: string
  avatar: string
  status: string
  intro: string
  facts: Fact[]
}

const avatarOf = (id: string) => getAvatarUrl(id)?.imageUrl ?? ''

const GUIDES: Guide[] = [
  {
    id: 'ha-long',
    title: 'Ha Long Bay by kayak',
    description: 'Two nights on the water, paddling between limestone islands at first light.',
    photo: '/lightbox/1-640w.webp',
    author: 'Linh Tran',
    avatar: avatarOf('avatar_female_vietnamese_01'),
    status: 'Updated 2 hours ago',
    intro:
      'Book a boat that anchors in Lan Ha Bay rather than the main harbour: the water is calmer, the beaches emptier, and you can launch a kayak straight from the deck.',
    facts: [
      ['Best months', 'March to May'],
      ['From Hanoi', '2.5 h by shuttle'],
      ['Budget', 'About $180 a person'],
    ],
  },
  {
    id: 'trang-an',
    title: 'Trang An by rowing boat',
    description: 'A slow river loop through caves and temples at the foot of the karst.',
    photo: '/lightbox/3-640w.webp',
    author: 'Lukas Becker',
    avatar: avatarOf('avatar_male_german_01'),
    status: 'Updated yesterday',
    intro:
      'Take route one for the longest caves and go before eight, when the rowers are fresh and the tour buses from Hanoi have not arrived yet.',
    facts: [
      ['Loop', '3 hours, 9 caves'],
      ['Tickets', '250,000 VND, boat included'],
      ['Stay', 'Tam Coc homestays'],
    ],
  },
  {
    id: 'saigon',
    title: 'Saigon after dark',
    description: 'Rooftop bars, night markets and the riverside walk as the towers light up.',
    photo: '/lightbox/6-640w.webp',
    author: 'Ada Okafor',
    avatar: avatarOf('avatar_female_nigerian_01'),
    status: 'Updated 3 days ago',
    intro:
      'Start on the Bach Dang riverside at sunset, eat your way through Ben Thanh night market, then finish on a rooftop in District 1 with the Bitexco tower lit up.',
    facts: [
      ['Start', 'Bach Dang Wharf, 6 pm'],
      ['Getting around', 'Grab bike, under $2'],
      ['Wear', 'Light layers, it rains'],
    ],
  },
]

// a status line that keeps changing, so the rolling words can be seen
const STATUSES = [
  'Updated 2 hours ago',
  'Linh added 3 photos',
  'Updated just now',
  'Edited 5 minutes ago',
]

const DEFAULTS = {
  title: GUIDES[0].title,
  quickLook: true,
  photo: true,
  saveButton: true,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'title',
    type: 'string',
    description: 'Heading of the card. In the quick look it becomes the dialog title.',
  },
  {
    name: 'description',
    type: 'string',
    description: 'One or two lines under the title. Keeps its line length in the quick look.',
  },
  {
    name: 'media',
    type: 'ReactNode',
    description: 'A photo across the top. It drifts in a little while the card is pointed at.',
  },
  {
    name: 'avatar',
    type: 'ReactNode',
    description: 'A small leading visual for the footer, such as the owner’s portrait.',
  },
  { name: 'meta', type: 'ReactNode', description: 'Who the card belongs to.' },
  {
    name: 'status',
    type: 'string',
    description: 'A short status under the meta. Changed words rise in and are announced politely.',
  },
  {
    name: 'action',
    type: 'ReactNode',
    description: 'Buttons in the footer. They sit above the card’s hit area, so they never open it.',
  },
  {
    name: 'details',
    type: 'ReactNode',
    description:
      'Quick look content. When set, the whole card opens and grows into a dialog; Escape or the close button morphs it back.',
  },
  { name: 'open', type: 'boolean', description: 'Whether the quick look is open, when controlled.' },
  {
    name: 'defaultOpen',
    type: 'boolean',
    default: 'false',
    description: 'Whether the quick look starts open, when uncontrolled.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called when the card opens or closes.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

function QuickLook({ guide }: { guide: Guide }) {
  return (
    <div className="grid gap-4">
      <p className="text-pretty">{guide.intro}</p>
      <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-6 gap-y-2">
        {guide.facts.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-foreground">{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

// the card and its quick look each render the action, so the saved state lives on the page
function SaveButton({
  title,
  saved,
  onToggle,
}: {
  title: string
  saved: boolean
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      aria-label={`Save ${title}`}
      aria-pressed={saved}
      onClick={onToggle}
      className="grid size-8 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground outline-none transition-[color,scale] duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:scale-90 aria-pressed:text-foreground motion-reduce:active:scale-100"
    >
      <Bookmark
        className={cn('size-4', saved && 'fill-current')}
        strokeWidth={1.75}
        aria-hidden
      />
    </button>
  )
}

export function DialogCardPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, quickLook, photo, saveButton } = settings.values
  const [statusIndex, setStatusIndex] = useState(0)
  const [saved, setSaved] = useState<string[]>([])
  const toggleSaved = (id: string) =>
    setSaved((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  const cards = GUIDES.map((guide, index) => {
    const first = index === 0
    const media: ReactNode = photo ? (
      <img
        src={guide.photo}
        alt=""
        width={640}
        height={360}
        decoding="async"
        className="aspect-[16/10] w-full object-cover"
      />
    ) : undefined
    return (
      <DialogCard
        key={guide.id}
        title={first ? title || GUIDES[0].title : guide.title}
        description={guide.description}
        media={media}
        avatar={<img src={guide.avatar} alt="" />}
        meta={guide.author}
        status={first ? STATUSES[statusIndex] : guide.status}
        action={
          saveButton ? (
            <SaveButton
              title={guide.title}
              saved={saved.includes(guide.id)}
              onToggle={() => toggleSaved(guide.id)}
            />
          ) : undefined
        }
        details={quickLook ? <QuickLook guide={guide} /> : undefined}
      />
    )
  })

  const usage = toUsageSnippet({
    component: 'DialogCard',
    from: '@/components/ui/dialog-card',
    props: {
      title,
      description: GUIDES[0].description,
      media: photo ? { expression: '<img src="/ha-long.webp" alt="" />' } : undefined,
      avatar: { expression: '<img src={linh} alt="" />' },
      meta: GUIDES[0].author,
      status: STATUSES[statusIndex],
      action: saveButton ? { expression: '<SaveButton />' } : undefined,
      details: quickLook ? { expression: '<Itinerary />' } : undefined,
    },
  })

  return (
    <DemoPage
      eyebrow="ui / dialog-card"
      title="Dialog Card"
      description="A card for browsable items that grows into a quick look. Press a card and its surface, photo and copy travel on one spring into a dialog while the details settle in beneath them; Escape or the close button morphs it back into place. The photo drifts in on hover and the status line rolls in word by word when it changes. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
          />
          <DemoSwitch
            label="Quick look"
            checked={quickLook}
            onCheckedChange={(next) => settings.set('quickLook', next)}
          />
          <DemoSwitch
            label="Photo"
            checked={photo}
            onCheckedChange={(next) => settings.set('photo', next)}
          />
          <DemoSwitch
            label="Save button"
            checked={saveButton}
            onCheckedChange={(next) => settings.set('saveButton', next)}
          />
          <DemoAction onClick={() => setStatusIndex((value) => (value + 1) % STATUSES.length)}>
            Update status
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/dialog-card/'], usage, props: PROPS }}
    >
      <div className="grid w-full max-w-4xl items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards}
      </div>
    </DemoPage>
  )
}
