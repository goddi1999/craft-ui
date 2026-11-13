import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  StreakWidget,
  type StreakColor,
  type StreakSize,
  type StreakWidgetVariant,
} from '@/components/ui/streak-widget'

const SIZES: readonly StreakSize[] = ['xs', 'sm', 'md', 'lg', 'xl']
const VARIANTS: readonly StreakWidgetVariant[] = ['week', 'compact']
const COLORS: readonly StreakColor[] = ['pink', 'orange', 'violet', 'blue', 'green', 'teal']

const DEFAULTS = {
  variant: 'week' as StreakWidgetVariant,
  size: 'md' as StreakSize,
  color: 'pink' as StreakColor,
  days: 142,
  value: 5863,
  goal: 8000,
  met: 3,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'days',
    type: 'number',
    description: 'Days in a row the goal was met.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Steps streak'",
    description: 'Line under the day count.',
  },
  {
    name: 'variant',
    type: "'compact' | 'week'",
    default: "'week'",
    description: 'The streak tile alone, or beside today’s goal and the seven days.',
  },
  {
    name: 'size',
    type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
    default: "'md'",
    description: 'Size of the streak tile: flame, day count and label.',
  },
  {
    name: 'value',
    type: 'number',
    description: 'Today’s progress, e.g. steps walked (`week`).',
  },
  { name: 'goal', type: 'number', description: 'Today’s target (`week`).' },
  {
    name: 'week',
    type: 'boolean[]',
    description: 'Goal met per day, Monday first; missing days count as not yet (`week`).',
  },
  {
    name: 'weekdays',
    type: 'string[]',
    default: 'Mon–Sun',
    description: 'Day labels, Monday first.',
  },
  {
    name: 'color',
    type: "'pink' | 'orange' | 'violet' | 'blue' | 'green' | 'teal'",
    default: "'pink'",
    description: 'Theme accent token (`--oklch-*`) for the flame and the met days.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the card.' },
]

export function StreakWidgetPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { variant, size, color, days, value, goal, met } = settings.values
  const week = Array.from({ length: 7 }, (_, index) => index < met)

  const usage = toUsageSnippet({
    component: 'StreakWidget',
    from: '@/components/ui/streak-widget',
    props:
      variant === 'compact'
        ? { variant, size, days, color }
        : {
            size,
            days,
            value,
            goal,
            week: { expression: JSON.stringify(week) },
            color,
          },
    defaults: { variant: 'week', size: 'md', color: 'pink' },
  })

  return (
    <DemoPage
      eyebrow="ui / streak-widget"
      title="Streak Widget"
      description="A daily-goal streak in two sizes: the compact flame tile with the day count, or the full widget with today's progress toward the goal on a glowing bar and a check for each day of the week the goal was met."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Variant"
            options={VARIANTS}
            value={variant}
            onChange={(next) => settings.set('variant', next)}
          />
          <DemoControlGroup
            title="Size"
            options={SIZES}
            value={size}
            onChange={(next) => settings.set('size', next)}
          />
          <DemoControlGroup
            title="Colour"
            options={COLORS}
            value={color}
            onChange={(next) => settings.set('color', next)}
          />
          <DemoSlider
            label="Streak"
            value={days}
            onValueChange={(next) => settings.set('days', next)}
            min={0}
            max={365}
            step={1}
            unit=" days"
          />
          <DemoSlider
            label="Today"
            value={value}
            onValueChange={(next) => settings.set('value', next)}
            min={0}
            max={12000}
            step={1}
          />
          <DemoSlider
            label="Goal"
            value={goal}
            onValueChange={(next) => settings.set('goal', next)}
            min={1000}
            max={12000}
            step={500}
          />
          <DemoSlider
            label="Days met"
            value={met}
            onValueChange={(next) => settings.set('met', next)}
            min={0}
            max={7}
            step={1}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/streak-widget/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex w-full justify-center py-6">
        {variant === 'compact' ? (
          <StreakWidget variant="compact" size={size} days={days} color={color} />
        ) : (
          <StreakWidget
            size={size}
            days={days}
            value={value}
            goal={goal}
            week={week}
            color={color}
          />
        )}
      </div>
    </DemoPage>
  )
}
