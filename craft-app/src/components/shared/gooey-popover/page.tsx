import {
  DemoSettings,
  DemoSlider,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { GooeyPopover } from '@/components/ui/gooey-popover'

const DEFAULTS = {
  label: 'Stats',
  duration: 0.2,
  width: 200,
  height: 88,
  size: 44,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode',
    description: 'Content revealed inside the panel.',
  },
  {
    name: 'icon',
    type: 'ReactNode',
    default: '<RocketIcon />',
    description: 'Glyph on the round trigger and on the blob that closes it.',
  },
  {
    name: 'label',
    type: 'string',
    default: "'Stats'",
    description: 'Accessible name for the trigger and the panel.',
  },
  {
    name: 'width',
    type: 'number',
    default: '200',
    description: 'Panel width in px once open.',
  },
  {
    name: 'height',
    type: 'number',
    default: '88',
    description: 'Panel height in px once open.',
  },
  {
    name: 'size',
    type: 'number',
    default: '44',
    description: 'Trigger diameter in px.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '0.2',
    description: 'Base morph duration in seconds.',
  },
  {
    name: 'onOpenChange',
    type: '(open: boolean) => void',
    description: 'Called when the native popover opens or closes.',
  },
  {
    name: 'className',
    type: 'string',
    description: 'Extra classes for the root element.',
  },
]

export function GooeyPopoverPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, duration, width, height, size } = settings.values

  const usage = toUsageSnippet({
    component: 'GooeyPopover',
    from: '@/components/ui/gooey-popover',
    props: { label: label || undefined, duration, width, height, size },
    defaults: DEFAULTS,
    children: '<p>Anything you like</p>',
  })

  return (
    <DemoPage
      eyebrow="ui / gooey-popover"
      title="Gooey Popover"
      description={
        <>
          A native [popover] that oozes out of its round trigger — an SVG goo
          filter melts the blob and panel together, anchored with CSS anchor
          positioning. Ported from{' '}
          <a href="https://codepen.io/jh3y/pen/QWXoGVx" target="_blank" rel="noreferrer">
            jh3y&apos;s CodePen
          </a>
          .
        </>
      }
      align="stretch"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(value) => settings.set('label', value)}
            maxLength={24}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(value) => settings.set('duration', value)}
            min={0.1}
            max={1}
            step={0.05}
            unit="s"
          />
          <DemoSlider
            label="Width"
            value={width}
            onValueChange={(value) => settings.set('width', value)}
            min={160}
            max={280}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Height"
            value={height}
            onValueChange={(value) => settings.set('height', value)}
            min={72}
            max={160}
            step={4}
            unit="px"
          />
          <DemoSlider
            label="Trigger size"
            value={size}
            onValueChange={(value) => settings.set('size', value)}
            min={36}
            max={64}
            step={2}
            unit="px"
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/ui/gooey-popover/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="mx-auto flex h-56 w-full max-w-sm items-end justify-start">
        <GooeyPopover
          label={label || DEFAULTS.label}
          duration={duration}
          width={width}
          height={height}
          size={size}
        >
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
            <dt className="font-semibold opacity-60">CSS</dt>
            <dd className="text-right opacity-60">v3.0</dd>
            <dt className="font-semibold">API</dt>
            <dd className="text-right">
              <span className="rounded-xs bg-current/15 p-0.5 text-(--gooey-blue)">
                Popover
              </span>
            </dd>
            <dt className="font-semibold">JavaScript</dt>
            <dd className="text-right">
              <span className="rounded-xs bg-current/15 p-0.5 text-(--gooey-green)">
                0
              </span>
            </dd>
          </dl>
        </GooeyPopover>
      </div>
    </DemoPage>
  )
}
