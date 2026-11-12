import { getAvatarUrl } from '@wq-org/avatars'
import { FileText } from 'lucide-react'
import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  RollingAvatarGroup,
  type RollingAvatarGroupMember,
  type RollingAvatarGroupSize,
} from '@/components/ui/rolling-avatar-group'

const photo = (id: string) => getAvatarUrl(id)?.imageUrl

// a few without photos, so the initials fallback shows too
const EVERYONE: RollingAvatarGroupMember[] = [
  { name: 'Sophie Laurent', src: photo('avatar_female_french_01'), status: 'online' },
  { name: 'Mateus Oliveira', src: photo('avatar_male_brazil_01') },
  { name: 'Ada Okafor', src: photo('avatar_female_nigerian_01'), status: 'online' },
  { name: 'Priya Nair' },
  { name: 'Lukas Becker', src: photo('avatar_male_german_01') },
  { name: 'Linh Tran', src: photo('avatar_female_vietnamese_01') },
  { name: 'Tom Hale' },
  { name: 'Camille Moreau', src: photo('avatar_female_french_02') },
  { name: 'Liam Byrne', src: photo('avatar_male_irland_01') },
  { name: 'Lucía Romero', src: photo('avatar_female_spanish_01') },
  { name: 'Elias Demir', src: photo('avatar_male_turkish_01') },
  { name: 'Felix Braun', src: photo('avatar_male_german_02') },
]
const START_COUNT = 7

const SIZES: readonly RollingAvatarGroupSize[] = ['sm', 'md', 'lg']

const DEFAULTS = {
  size: 'md' as RollingAvatarGroupSize,
  max: 4,
  label: 'Editors',
}

const COMPONENT_DEFAULTS = { size: 'md', max: 4, label: 'Team members' }

const PROPS: DemoPropDoc[] = [
  {
    name: 'members',
    type: "{ name: string; src?: string; status?: 'online' | 'offline' }[]",
    description:
      'Everyone, in display order. Names double as keys, so keep them unique. Pass the full list and let `max` truncate it, or the count is lost.',
  },
  {
    name: 'max',
    type: 'number',
    default: '4',
    description: 'Avatars shown before the rest collapse into the rolling +N chip.',
  },
  {
    name: 'size',
    type: "'sm' | 'md' | 'lg'",
    default: "'md'",
    description: 'Size of each avatar and the overflow chip: 28, 36 or 48px.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Team members'",
    description:
      'Accessible name of the group, also used in the overflow label, e.g. "3 more editors".',
  },
  { name: 'className', type: 'string', description: 'Merged onto the group.' },
]

export function RollingAvatarGroupPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { size, max, label } = settings.values
  const [members, setMembers] = useState(() => EVERYONE.slice(0, START_COUNT))

  const away = EVERYONE.filter((person) => !members.some((member) => member.name === person.name))

  // someone new opens the document: they slide in at the front and push the last face into the count
  const join = () => {
    const next = away[0]
    if (next) setMembers((current) => [{ ...next, status: 'online' }, ...current])
  }
  const leave = () => setMembers((current) => current.slice(1))

  const usage = toUsageSnippet({
    component: 'RollingAvatarGroup',
    from: '@/components/ui/rolling-avatar-group',
    props: { members: { expression: 'editors' }, max, size, label: label || undefined },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / rolling-avatar-group"
      title="Rolling Avatar Group"
      description="An overlapping stack of people with a +N chip for everyone past the limit. Someone joining or leaving opens or closes their slot, so the rest of the stack slides instead of jumping, and the count rolls up or down the way it moved. Hovering a face rings it and floats their name above without moving anything. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoSlider
            label="Max"
            value={max}
            onValueChange={(next) => settings.set('max', next)}
            min={1}
            max={8}
          />
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
          />
          <DemoAction onClick={join} disabled={away.length === 0}>
            Someone joins
          </DemoAction>
          <DemoAction onClick={leave} disabled={members.length === 0}>
            Someone leaves
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/rolling-avatar-group/'], usage, props: PROPS }}
    >
      <div className="flex w-full max-w-md items-center gap-3 rounded-[1.625rem] border border-border bg-card py-3 pr-4 pl-3">
        <span className="grid size-10 flex-none place-items-center rounded-2xl bg-muted text-muted-foreground">
          <FileText className="size-[18px]" strokeWidth={1.75} aria-hidden />
        </span>
        <span className="grid min-w-0 flex-1">
          <span className="truncate text-sm font-medium text-foreground">Q4 launch plan</span>
          <span className="truncate text-xs text-muted-foreground tabular-nums">
            {members.length} {members.length === 1 ? 'person' : 'people'} editing
          </span>
        </span>
        <RollingAvatarGroup
          members={members}
          max={max}
          size={size}
          label={label || 'Team members'}
        />
      </div>
    </DemoPage>
  )
}
