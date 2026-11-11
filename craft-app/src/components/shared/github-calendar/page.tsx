import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { GithubActivityCard, type GithubColorScheme } from './GithubCalendar'

const SCHEMES: GithubColorScheme[] = [
  'green',
  'blue',
  'purple',
  'orange',
  'pink',
  'dracula',
  'halloween',
]

const USERS = ['torvalds', 'gaearon', 'sindresorhus'] as const
type User = (typeof USERS)[number]

const DEFAULTS = {
  username: 'torvalds' as User,
  colorScheme: 'green' as GithubColorScheme,
  cellSize: 11,
  months: 12,
  showMonthLabels: true,
  showRepos: true,
  defaultReposOpen: false,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'username',
    type: 'string',
    description: 'GitHub login whose public contributions are fetched.',
  },
  {
    name: 'colorScheme',
    type: "'green' | 'blue' | 'purple' | 'orange' | 'pink' | 'dracula' | 'halloween'",
    default: "'green'",
    description: 'Palette for the five contribution levels.',
  },
  {
    name: 'cellSize',
    type: 'number',
    default: '11',
    description: 'Side of each day square in px; capped smaller on narrow screens.',
  },
  {
    name: 'months',
    type: 'number',
    default: '12',
    description: 'How many recent months of weeks to show.',
  },
  {
    name: 'showMonthLabels',
    type: 'boolean',
    default: 'true',
    description: 'Show month names above the grid.',
  },
  {
    name: 'showRepos',
    type: 'boolean',
    default: 'true',
    description: 'Show the collapsible list of most active repositories.',
  },
  {
    name: 'defaultReposOpen',
    type: 'boolean',
    default: 'false',
    description: 'Start with the repository list expanded.',
  },
  {
    name: '...props',
    type: "ComponentProps<'div'>",
    description: 'Any native div attribute — className, style, id…',
  },
]

export function GithubCalendarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const {
    username,
    colorScheme,
    cellSize,
    months,
    showMonthLabels,
    showRepos,
    defaultReposOpen,
  } = settings.values

  const usage = toUsageSnippet({
    component: 'GithubActivityCard',
    from: '@/components/shared/github-calendar',
    props: {
      username,
      colorScheme,
      cellSize,
      months,
      showMonthLabels,
      showRepos,
      defaultReposOpen,
    },
    defaults: { ...DEFAULTS, username: undefined },
  })

  return (
    <DemoPage
      eyebrow="shared / github-calendar"
      title="GitHub activity card"
      description="A contribution heatmap built from the public contributions API, with month labels and a collapsible list of recently pushed repos. Data is fetched live, so it may rate-limit."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="User"
            options={USERS}
            value={username}
            onChange={(value) => settings.set('username', value)}
          />
          <DemoControlGroup
            title="Color scheme"
            options={SCHEMES}
            value={colorScheme}
            onChange={(value) => settings.set('colorScheme', value)}
          />
          <DemoSlider
            label="Months"
            value={months}
            onValueChange={(value) => settings.set('months', value)}
            min={1}
            max={12}
          />
          <DemoSlider
            label="Cell size"
            value={cellSize}
            onValueChange={(value) => settings.set('cellSize', value)}
            min={7}
            max={14}
            unit="px"
          />
          <DemoSwitch
            label="Month labels"
            checked={showMonthLabels}
            onCheckedChange={(value) => settings.set('showMonthLabels', value)}
          />
          <DemoSwitch
            label="Repositories"
            checked={showRepos}
            onCheckedChange={(value) => settings.set('showRepos', value)}
          />
          <DemoSwitch
            label="Repositories open"
            checked={defaultReposOpen}
            onCheckedChange={(value) => settings.set('defaultReposOpen', value)}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/github-calendar/'],
        usage,
        props: PROPS,
      }}
    >
      <GithubActivityCard
        key={`${username}-${defaultReposOpen}`}
        username={username}
        colorScheme={colorScheme}
        cellSize={cellSize}
        months={months}
        showMonthLabels={showMonthLabels}
        showRepos={showRepos}
        defaultReposOpen={defaultReposOpen}
      />
    </DemoPage>
  )
}
