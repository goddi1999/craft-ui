import { getAvatarUrl } from '@wq-org/avatars'
import { useState } from 'react'

import {
  DemoAction,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  CommentThread,
  type CommentAuthor,
  type ThreadComment,
} from '@/components/ui/comment-thread'

const photo = (id: string) => getAvatarUrl(id)?.imageUrl

const ME: CommentAuthor = {
  id: 'lena',
  name: 'Lena Wagner',
  avatar: photo('avatar_female_german_01'),
}
const SOPHIE: CommentAuthor = {
  id: 'sophie',
  name: 'Sophie Laurent',
  avatar: photo('avatar_female_french_01'),
}
const MATEUS: CommentAuthor = {
  id: 'mateus',
  name: 'Mateus Oliveira',
  avatar: photo('avatar_male_brazil_01'),
}
const ADA: CommentAuthor = {
  id: 'ada',
  name: 'Ada Okafor',
  avatar: photo('avatar_female_nigerian_01'),
}
const LUKAS: CommentAuthor = {
  id: 'lukas',
  name: 'Lukas Becker',
  avatar: photo('avatar_male_german_01'),
}
const LINH: CommentAuthor = {
  id: 'linh',
  name: 'Linh Tran',
  avatar: photo('avatar_female_vietnamese_01'),
}
// no photo, so the initials fallback shows in the @mention list
const PRIYA: CommentAuthor = { id: 'priya', name: 'Priya Nair' }

const TEAM = [ME, SOPHIE, MATEUS, ADA, LUKAS, LINH, PRIYA]

// a design review on a landing page; Lena's own comment can be edited and deleted
const COMMENTS: ThreadComment[] = [
  {
    id: 'c1',
    author: SOPHIE,
    createdAt: '2h',
    body: 'The new headline reads much better. Can we tighten the subline so it fits on two lines at 1280?',
    reactions: [{ emoji: '👍', users: ['mateus', 'ada'] }],
    replies: [
      {
        id: 'c2',
        author: MATEUS,
        createdAt: '1h',
        body: 'Tried “Plan, review and ship in one place”. It wraps cleanly down to 1024.',
        reactions: [{ emoji: '🎉', users: ['sophie'] }],
        replies: [
          {
            id: 'c3',
            author: ME,
            createdAt: '48m',
            edited: true,
            body: '@Mateus Oliveira that matches the pricing page too, so let’s go with it.',
          },
        ],
      },
      {
        id: 'c4',
        author: ADA,
        createdAt: '40m',
        body: 'Let’s check the German build as well, it usually runs about a third longer.',
        reactions: [{ emoji: '👀', users: ['lena', 'lukas'] }],
      },
    ],
  },
  {
    id: 'c5',
    author: LUKAS,
    createdAt: '25m',
    body: 'The CTA is 4.2:1 on the gradient. @Linh Tran could we darken the stop at 60%?',
    replies: [
      {
        id: 'c6',
        author: LINH,
        createdAt: '12m',
        body: 'On it. The fix should land before the 3pm review.',
        reactions: [{ emoji: '🚀', users: ['lukas', 'lena', 'sophie'] }],
      },
    ],
  },
]

const DEFAULTS = {
  title: 'Hero headline',
  maxDepth: 2,
  width: 480,
  startResolved: false,
  startEmpty: false,
}

const COMPONENT_DEFAULTS = { maxDepth: 2, defaultResolved: false }

const PROPS: DemoPropDoc[] = [
  {
    name: 'currentUser',
    type: '{ id: string; name: string; avatar?: string }',
    description: 'The person writing. Only their comments show Edit and Delete.',
  },
  {
    name: 'comments',
    type: 'ThreadComment[]',
    description:
      'The tree, when controlled: `{ id, author, body, createdAt, edited?, deleted?, reactions?, replies? }`.',
  },
  {
    name: 'defaultComments',
    type: 'ThreadComment[]',
    default: '[]',
    description: 'The starting tree, when uncontrolled.',
  },
  {
    name: 'onCommentsChange',
    type: '(comments: ThreadComment[], event: CommentThreadEvent) => void',
    description:
      'The full next tree and what changed: `reply`, `edit`, `delete` or `react`. Sync the event rather than diffing trees.',
  },
  {
    name: 'people',
    type: 'CommentAuthor[]',
    description: 'Who can be @mentioned. Defaults to everyone in the thread.',
  },
  { name: 'resolved', type: 'boolean', description: 'Resolved state, when controlled.' },
  {
    name: 'defaultResolved',
    type: 'boolean',
    default: 'false',
    description: 'Start folded into the resolved chip.',
  },
  {
    name: 'onResolvedChange',
    type: '(resolved: boolean) => void',
    description: 'Called on Resolve and Reopen.',
  },
  {
    name: 'title',
    type: 'ReactNode',
    description: 'What the thread is about, shown in the header and the resolved chip.',
  },
  {
    name: 'reactions',
    type: 'string[]',
    default: "['👍', '❤️', '🎉', '👀', '🚀', '✅']",
    description: 'Emoji offered by the reaction picker.',
  },
  {
    name: 'placeholder',
    type: 'string',
    default: "'Reply, or @mention someone'",
    description: 'Composer placeholder.',
  },
  {
    name: 'maxDepth',
    type: 'number',
    default: '2',
    description: 'Replies deeper than this attach to the deepest allowed parent.',
  },
  {
    name: 'nowLabel',
    type: 'string',
    default: "'Just now'",
    description: '`createdAt` label for comments written now.',
  },
  {
    name: 'labels',
    type: 'CommentThreadLabels',
    description:
      'Every visible word and accessible name, for localization. Words with a count or a name are functions; any key left out keeps its English default.',
  },
  { name: 'ref', type: 'Ref<HTMLElement>', description: 'The section element.' },
  { name: 'className', type: 'string', description: 'Merged onto the section.' },
]

export function CommentThreadPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { title, maxDepth, width, startResolved, startEmpty } = settings.values
  const [run, setRun] = useState(0)

  const usage = toUsageSnippet({
    component: 'CommentThread',
    from: '@/components/ui/comment-thread',
    props: {
      title: title || undefined,
      currentUser: { expression: 'me' },
      people: { expression: 'team' },
      defaultComments: startEmpty ? undefined : { expression: 'comments' },
      maxDepth,
      defaultResolved: startResolved,
      onCommentsChange: { expression: '(next, event) => sync(event)' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / comment-thread"
      title="Comment Thread"
      description="A threaded discussion for a document or design. Replies nest and fold away behind a stack of faces, reactions toggle with a count that rolls, your own comments edit and delete in place, @mentions autocomplete from the keyboard, and resolving morphs the whole thread into a single chip that reopens it. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Title"
            value={title}
            onValueChange={(next) => settings.set('title', next)}
          />
          <DemoSlider
            label="Max depth"
            value={maxDepth}
            onValueChange={(next) => settings.set('maxDepth', next)}
            min={0}
            max={3}
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(next) => settings.set('width', next)}
            min={320}
            max={620}
            step={10}
            unit="px"
          />
          <DemoSwitch
            label="Start resolved"
            checked={startResolved}
            onCheckedChange={(next) => settings.set('startResolved', next)}
          />
          <DemoSwitch
            label="Start empty"
            checked={startEmpty}
            onCheckedChange={(next) => settings.set('startEmpty', next)}
          />
          <DemoAction onClick={() => setRun((value) => value + 1)}>Reset thread</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/comment-thread/'], usage, props: PROPS }}
    >
      <div className="w-full" style={{ maxWidth: width }}>
        <CommentThread
          key={`${run}-${startResolved}-${startEmpty}`}
          title={title || undefined}
          currentUser={ME}
          people={TEAM}
          defaultComments={startEmpty ? [] : COMMENTS}
          defaultResolved={startResolved}
          maxDepth={maxDepth}
        />
      </div>
    </DemoPage>
  )
}
