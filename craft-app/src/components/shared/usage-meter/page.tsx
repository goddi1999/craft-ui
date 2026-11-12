import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  DemoTextField,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { UsageMeter, type UsageMeterSegment } from '@/components/ui/usage-meter'

const DECIMALS = [0, 1, 2] as const
// the slider ranges, so the upload button stops where the slider does
const MAX_SEGMENT = 40
const UPLOAD = 6.2
const MAIL = 3.6

const DEFAULTS = {
  label: 'Workspace storage',
  documents: 21.4,
  media: 14.2,
  backups: 6.8,
  mail: false,
  limit: 50,
  warnAt: 90,
  decimals: 1 as (typeof DECIMALS)[number],
}

const COMPONENT_DEFAULTS = {
  unit: '',
  decimals: 1,
  warnAt: 0.9,
  freeLabel: 'Free',
  overLabel: 'Over limit',
}

const PROPS: DemoPropDoc[] = [
  { name: 'label', type: 'string', description: 'What is measured, such as "Workspace storage".' },
  {
    name: 'segments',
    type: 'UsageMeterSegment[]',
    description:
      '`{ id, label, value }` in display order. Keep ids stable so a changed value re-flows instead of remounting. Up to four read clearly.',
  },
  { name: 'limit', type: 'number', description: 'The plan limit, in the same unit as the segments.' },
  { name: 'unit', type: 'string', default: "''", description: 'Unit after every number, such as `GB`.' },
  { name: 'decimals', type: 'number', default: '1', description: 'Digits after the decimal point.' },
  {
    name: 'warnAt',
    type: 'number',
    default: '0.9',
    description: 'Share of the limit at which the badge says the meter is almost full.',
  },
  { name: 'freeLabel', type: 'string', default: "'Free'", description: 'Legend label for the space left.' },
  {
    name: 'overLabel',
    type: 'string',
    default: "'Over limit'",
    description: 'Legend label for the overage once usage passes the limit.',
  },
  { name: 'className', type: 'string', description: 'Merged onto the root.' },
]

export function UsageMeterPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { label, documents, media, backups, mail, limit, warnAt, decimals } = settings.values

  const segments: UsageMeterSegment[] = [
    { id: 'documents', label: 'Documents', value: documents },
    { id: 'media', label: 'Media', value: media },
    { id: 'backups', label: 'Backups', value: backups },
    ...(mail ? [{ id: 'mail', label: 'Mail', value: MAIL }] : []),
  ]

  const usage = toUsageSnippet({
    component: 'UsageMeter',
    from: '@/components/ui/usage-meter',
    props: {
      label,
      unit: 'GB',
      limit,
      decimals,
      warnAt: warnAt / 100,
      segments: { expression: 'segments' },
    },
    defaults: COMPONENT_DEFAULTS,
  })

  return (
    <DemoPage
      eyebrow="ui / usage-meter"
      title="Usage Meter"
      description="A segmented bar for a fixed allowance like storage or seats. Segments grow in once the meter scrolls into view, then spring to new values while every number rolls the way it moved. Hover, focus or tap a category to read it out; past the limit the overflow is hatched and the badge turns to a warning. Adapted from uiarc."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoTextField
            label="Label"
            value={label}
            onValueChange={(next) => settings.set('label', next)}
            maxLength={40}
          />
          <DemoSlider
            label="Documents"
            value={documents}
            onValueChange={(next) => settings.set('documents', next)}
            min={0}
            max={MAX_SEGMENT}
            step={0.1}
            unit=" GB"
          />
          <DemoSlider
            label="Media"
            value={media}
            onValueChange={(next) => settings.set('media', next)}
            min={0}
            max={MAX_SEGMENT}
            step={0.1}
            unit=" GB"
          />
          <DemoSlider
            label="Backups"
            value={backups}
            onValueChange={(next) => settings.set('backups', next)}
            min={0}
            max={MAX_SEGMENT}
            step={0.1}
            unit=" GB"
          />
          <DemoSlider
            label="Plan limit"
            value={limit}
            onValueChange={(next) => settings.set('limit', next)}
            min={20}
            max={100}
            step={5}
            unit=" GB"
          />
          <DemoSlider
            label="Warn at"
            value={warnAt}
            onValueChange={(next) => settings.set('warnAt', next)}
            min={50}
            max={100}
            step={5}
            unit="%"
          />
          <DemoControlGroup
            title="Decimals"
            options={DECIMALS}
            value={decimals}
            onChange={(next) => settings.set('decimals', next)}
          />
          <DemoSwitch
            label="Mail archive"
            checked={mail}
            onCheckedChange={(next) => settings.set('mail', next)}
          />
          <DemoAction
            onClick={() =>
              settings.set('media', Math.min(MAX_SEGMENT, Math.round((media + UPLOAD) * 10) / 10))
            }
            disabled={media >= MAX_SEGMENT}
          >
            Upload a {UPLOAD} GB video
          </DemoAction>
          <DemoAction onClick={() => settings.set('backups', 0.8)} disabled={backups <= 0.8}>
            Clear old backups
          </DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/usage-meter/'], usage, props: PROPS }}
    >
      <div className="w-full max-w-md">
        <UsageMeter
          label={label}
          unit="GB"
          limit={limit}
          decimals={decimals}
          warnAt={warnAt / 100}
          segments={segments}
        />
      </div>
    </DemoPage>
  )
}
