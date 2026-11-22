import { useId } from 'react'

import {
  DemoControlGroup,
  DemoControlLabel,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  PULSE_HEART_COLORS,
  PulseHeart,
  type PulseHeartColor,
  type PulseHeartIcon,
} from '@/components/ui/pulse-heart'
import { cn } from '@/lib/utils'

const ICONS: PulseHeartIcon[] = ['heart', 'star', 'thumb', 'chat']

const DEFAULTS = {
  count: 1248,
  icon: 'heart' as PulseHeartIcon,
  color: undefined as PulseHeartColor | undefined,
  showCount: true,
  idleOutline: true,
  disabled: false,
  likedColor: '#ff4d4d',
  idleColor: '#8b8b93',
  pillColor: '#232326',
  textColor: '#ffffff',
  size: 40,
  corner: 32,
  duration: 560,
  dotSize: 0.3,
  overshoot: 1.7,
  beat: 3,
  rollDuration: 350,
}

const COMPONENT_DEFAULTS = { ...DEFAULTS, count: 0 }

type ColorKey = 'likedColor' | 'idleColor' | 'pillColor' | 'textColor'

const COLORS: { key: ColorKey; label: string }[] = [
  { key: 'likedColor', label: 'Liked' },
  { key: 'idleColor', label: 'Idle' },
  { key: 'pillColor', label: 'Pill' },
  { key: 'textColor', label: 'Text' },
]

/** Slider steps like 0.1 drift (0.30000000000000004); keep the read-out clean. */
const round = (value: number, places: number) =>
  Math.round(value * 10 ** places) / 10 ** places

const PROPS: DemoPropDoc[] = [
  {
    name: 'liked',
    type: 'boolean',
    description: 'Controlled state. Changes from outside apply without the animation.',
  },
  {
    name: 'defaultLiked',
    type: 'boolean',
    default: 'false',
    description: 'Starting state when uncontrolled.',
  },
  {
    name: 'count',
    type: 'number',
    default: '0',
    description: 'Number shown; each press adds or removes one.',
  },
  {
    name: 'onChange',
    type: '(liked: boolean, count: number) => void',
    description: 'Called on every press with the new state and count.',
  },
  {
    name: 'showCount',
    type: 'boolean',
    default: 'true',
    description: 'Show the count; off collapses the pill to a circle.',
  },
  {
    name: 'icon',
    type: "'heart' | 'star' | 'thumb' | 'chat' | ReactNode",
    default: "'heart'",
    description: 'Built-in glyph, or your own element.',
  },
  {
    name: 'idleOutline',
    type: 'boolean',
    default: 'true',
    description: 'Draw the idle glyph as an outline; off draws a muted solid.',
  },
  {
    name: 'size',
    type: 'number',
    default: '40',
    description: 'Glyph size in px; padding, gap and count size follow it.',
  },
  {
    name: 'corner',
    type: 'number',
    default: '32',
    description: 'Pill corner radius in px.',
  },
  {
    name: 'color',
    type: "'ink' | 'brown' | 'red' | … | 'slate' | 'sand'",
    description: 'One of the 24 palette colours for the liked state. likedColor wins when both are set.',
  },
  {
    name: 'likedColor',
    type: 'string',
    default: "'#ff4d4d'",
    description: 'Colour after the flip, and of the hover tint and focus ring.',
  },
  {
    name: 'idleColor',
    type: 'string',
    default: "'#8b8b93'",
    description: 'Colour before the flip.',
  },
  {
    name: 'pillColor',
    type: 'string',
    default: "'#232326'",
    description: 'Background of the pill.',
  },
  {
    name: 'textColor',
    type: 'string',
    default: "'#ffffff'",
    description: 'Colour of the count.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '560',
    description: 'Length of the whole run in ms; the flip lands at 40% of it.',
  },
  {
    name: 'dotSize',
    type: 'number',
    default: '0.3',
    description: 'How small the glyph gets at the flip, as a fraction of its size.',
  },
  {
    name: 'overshoot',
    type: 'number',
    default: '1.7',
    description: 'How far the glyph rebounds past rest; 0 lands without a rebound.',
  },
  {
    name: 'beat',
    type: 'number',
    default: '3',
    description: 'Percent the pill dips at the flip.',
  },
  {
    name: 'rollDuration',
    type: 'number',
    default: '350',
    description: 'How long the changed digit of the count rolls, in ms.',
  },
  {
    name: 'disabled',
    type: 'boolean',
    default: 'false',
    description: 'Dim the button and ignore input.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Like'",
    description: 'Accessible name; the count is appended to it.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the button.',
  },
]

type ColorFieldProps = {
  label: string
  value: string
  onValueChange: (value: string) => void
}

/** Exception control: a colour swatch — the four standard kinds cannot pick a colour. */
function ColorField({ label, value, onValueChange }: ColorFieldProps) {
  const id = useId()

  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border bg-muted/40 py-1.5 pr-1.5 pl-3">
      <DemoControlLabel htmlFor={id}>{label}</DemoControlLabel>
      <span className="flex items-center gap-2">
        <span className="font-mono text-xs text-muted-foreground uppercase">
          {value}
        </span>
        <input
          id={id}
          type="color"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          className="size-7 cursor-pointer rounded-md border bg-transparent p-0.5"
        />
      </span>
    </div>
  )
}

export function PulseHeartPage() {
  const settings = useDemoSettings(DEFAULTS)
  const values = settings.values
  const { count, icon, showCount, idleOutline, disabled, color } = values
  // a palette colour replaces the custom liked colour
  const props = color ? { ...values, likedColor: undefined } : values

  const usage = toUsageSnippet({
    component: 'PulseHeart',
    from: '@/components/ui/pulse-heart',
    props,
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / pulse-heart"
      title="Pulse Heart"
      description="A like pill that swells through a bezier overshoot on toggle, while its count rolls like an odometer digit. Click it."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoSlider
            label="Count"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={0}
            max={9999}
          />
          <DemoControlGroup
            title="Icon"
            options={ICONS}
            value={icon}
            onChange={(value) => settings.set('icon', value)}
          />
          <div className="flex flex-col gap-2.5 sm:col-span-2">
            <DemoControlLabel>Colour</DemoControlLabel>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Colour">
              {(Object.keys(PULSE_HEART_COLORS) as PulseHeartColor[]).map((tone) => (
                <button
                  key={tone}
                  type="button"
                  title={tone}
                  aria-label={tone}
                  aria-pressed={tone === color}
                  onClick={() => settings.set('color', tone === color ? undefined : tone)}
                  style={{ background: PULSE_HEART_COLORS[tone] }}
                  className={cn(
                    'size-7 rounded-full ring-1 ring-border transition-transform active:scale-95',
                    'outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    tone === color && 'ring-2 ring-primary ring-offset-2 ring-offset-background',
                  )}
                />
              ))}
            </div>
          </div>
          <DemoSwitch
            label="Show count"
            checked={showCount}
            onCheckedChange={(value) => settings.set('showCount', value)}
          />
          <DemoSwitch
            label="Idle outline"
            checked={idleOutline}
            onCheckedChange={(value) => settings.set('idleOutline', value)}
          />
          <DemoSlider
            label="Size"
            value={values.size}
            onValueChange={(value) => settings.set('size', value)}
            min={24}
            max={72}
            unit="px"
          />
          <DemoSlider
            label="Corner"
            value={values.corner}
            onValueChange={(value) => settings.set('corner', value)}
            min={0}
            max={40}
            unit="px"
          />
          <DemoSlider
            label="Duration"
            value={values.duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={200}
            max={1200}
            step={10}
            unit="ms"
          />
          <DemoSlider
            label="Roll duration"
            value={values.rollDuration}
            onValueChange={(value) => settings.set('rollDuration', value)}
            min={100}
            max={800}
            step={10}
            unit="ms"
          />
          <DemoSlider
            label="Dot size"
            value={values.dotSize}
            onValueChange={(value) => settings.set('dotSize', round(value, 2))}
            min={0.1}
            max={0.8}
            step={0.05}
          />
          <DemoSlider
            label="Overshoot"
            value={values.overshoot}
            onValueChange={(value) => settings.set('overshoot', round(value, 1))}
            min={0}
            max={3}
            step={0.1}
          />
          <DemoSlider
            label="Beat"
            value={values.beat}
            onValueChange={(value) => settings.set('beat', value)}
            min={0}
            max={12}
            step={0.5}
            unit="%"
          />
          <DemoSwitch
            label="Disabled"
            checked={disabled}
            onCheckedChange={(value) => settings.set('disabled', value)}
          />
          <div className="grid gap-2 sm:col-span-2 sm:grid-cols-2">
            {COLORS.map((field) => (
              <ColorField
                key={field.key}
                label={`${field.label} colour`}
                value={values[field.key]}
                onValueChange={(value) => {
                  settings.set(field.key, value)
                  if (field.key === 'likedColor') settings.set('color', undefined)
                }}
              />
            ))}
          </div>
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/pulse-heart/'],
        usage,
        props: PROPS,
      }}
    >
      {/* The default palette is tuned for a dark surface. */}
      <div className="flex min-h-[22rem] items-center justify-center bg-zinc-950 p-10">
        <PulseHeart
          key={`${icon}-${idleOutline}-${showCount}-${disabled}`}
          {...props}
          defaultLiked={false}
          onChange={(_liked, next) => settings.set('count', next)}
        />
      </div>
    </DemoPage>
  )
}
