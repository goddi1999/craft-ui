import { useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { ProfileCard } from '@/components/ui/profile-card'

const AVATARS = ['mark', 'initials'] as const
type Avatar = (typeof AVATARS)[number]

const DEFAULTS = {
  name: 'Suraj',
  username: '@surajmaurya_m',
  description: 'Building EasyUI. Engineer.',
  followers: '200K',
  posts: '72',
  website: 'easyui.site',
  avatar: 'mark' as Avatar,
  verified: true,
}

const COMPONENT_DEFAULTS = {
  name: 'Suraj',
  username: '@surajmaurya_m',
  description: 'Building EasyUI. Engineer.',
  followers: '200K',
  posts: '72',
  website: 'easyui.site',
  verified: true,
  actionLabel: 'Follow',
}

const INITIALS = 'text-4xl font-semibold tracking-tight'

const initialsOf = (name: string) =>
  name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join('')

const PROPS: DemoPropDoc[] = [
  { name: 'name', type: 'string', default: "'Suraj'", description: "The card's heading." },
  {
    name: 'username',
    type: 'string',
    default: "'@surajmaurya_m'",
    description: 'Handle under the name. Also where the X button points, unless `xHref` is set.',
  },
  {
    name: 'description',
    type: 'string',
    default: "'Building EasyUI. Engineer.'",
    description: 'Bio under the handle.',
  },
  {
    name: 'followers',
    type: 'string',
    default: "'200K'",
    description: 'Pre-formatted follower count.',
  },
  { name: 'posts', type: 'string', default: "'72'", description: 'Pre-formatted post count.' },
  {
    name: 'website',
    type: 'string',
    default: "'easyui.site'",
    description: 'Domain or URL; `https://` is added when missing. Empty hides the link.',
  },
  {
    name: 'avatar',
    type: 'ReactNode',
    description: 'Fills the avatar tile; an `<img>` is sized to cover it. Defaults to a mark.',
  },
  {
    name: 'xHref',
    type: 'string',
    description: "Where the X button goes. Defaults to the username's x.com profile; empty hides it.",
  },
  {
    name: 'verified',
    type: 'boolean',
    default: 'true',
    description: 'Show the blue verified badge after the name.',
  },
  {
    name: 'actionLabel',
    type: 'string',
    default: "'Follow'",
    description: 'Text of the main button. It gives a small spring on press.',
  },
  { name: 'onAction', type: '() => void', description: 'Called when the main button is pressed.' },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

export function ProfileCardPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { name, username, description, followers, posts, website, avatar, verified } =
    settings.values
  const [following, setFollowing] = useState(false)
  const actionLabel = following ? 'Following' : 'Follow'

  const usage = toUsageSnippet({
    component: 'ProfileCard',
    from: '@/components/ui/profile-card',
    props: {
      name,
      username,
      description,
      followers,
      posts,
      website,
      avatar:
        avatar === 'initials'
          ? { expression: `<span className="${INITIALS}">${initialsOf(name)}</span>` }
          : undefined,
      verified,
      actionLabel,
      onAction: { expression: 'toggleFollow' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / profile-card"
      title="Profile Card"
      description="A dark social profile card. Painted blue cover art made only of gradients holds the X link and a follow button that springs on press; below it sit the avatar, verified name, bio, follower stats and a website link. Press Follow to toggle it. Adapted from EasyUI."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Name"
            value={name}
            onValueChange={(next) => settings.set('name', next)}
            maxLength={28}
          />
          <DemoTextField
            label="Handle"
            value={username}
            onValueChange={(next) => settings.set('username', next)}
            maxLength={28}
          />
          <DemoTextField
            label="Bio"
            value={description}
            onValueChange={(next) => settings.set('description', next)}
            maxLength={140}
          />
          <DemoTextField
            label="Website"
            value={website}
            onValueChange={(next) => settings.set('website', next)}
            maxLength={40}
          />
          <DemoTextField
            label="Followers"
            value={followers}
            onValueChange={(next) => settings.set('followers', next)}
            maxLength={8}
          />
          <DemoTextField
            label="Posts"
            value={posts}
            onValueChange={(next) => settings.set('posts', next)}
            maxLength={8}
          />
          <DemoControlGroup
            title="Avatar"
            options={AVATARS}
            value={avatar}
            onChange={(next) => settings.set('avatar', next)}
          />
          <DemoSwitch
            label="Verified"
            checked={verified}
            onCheckedChange={(next) => settings.set('verified', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/profile-card/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-md">
        <ProfileCard
          name={name}
          username={username}
          description={description}
          followers={followers}
          posts={posts}
          website={website}
          avatar={
            avatar === 'initials' ? <span className={INITIALS}>{initialsOf(name)}</span> : undefined
          }
          verified={verified}
          actionLabel={actionLabel}
          onAction={() => setFollowing((value) => !value)}
        />
      </div>
    </DemoPage>
  )
}
