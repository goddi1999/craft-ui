import type { ToasterProps as SonnerToasterProps } from 'sonner'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  DemoSwitch,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Button } from '@/components/ui/button'
import { ToastCard, Toaster, toast } from '@/components/ui/toast'

type Position = NonNullable<SonnerToasterProps['position']>

const POSITIONS: Position[] = [
  'top-left',
  'top-center',
  'top-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
]
const OUTCOMES = ['resolve', 'reject'] as const

const DEFAULTS = {
  position: 'top-center' as Position,
  expand: false,
  duration: 4,
  dismissible: true,
  outcome: 'resolve' as (typeof OUTCOMES)[number],
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'toast(title, options)',
    type: '(title: ReactNode, options?: ToastOptions) => string | number',
    description:
      'Shows a plain toast and returns its id. toast.success, .error, .warning, .info and .loading take the same arguments and add a status tile.',
  },
  {
    name: 'toast.promise',
    type: '(task: Promise<T> | (() => Promise<T>), messages, options?) => Promise<T>',
    description:
      'Shows messages.loading until the task settles, then swaps to messages.success or messages.error in the same toast. Either can be a function of the result.',
  },
  { name: 'description', type: 'ReactNode', description: 'Muted second line under the title.' },
  {
    name: 'action',
    type: '{ label: string; onClick: () => void }',
    description: 'A pill button on the right. Clicking it runs onClick and closes the toast.',
  },
  {
    name: 'duration',
    type: 'number',
    default: '4000',
    description: 'Milliseconds before the toast closes. Loading toasts stay until updated or dismissed.',
  },
  {
    name: 'id',
    type: 'string | number',
    description: 'Reuse an id to update a toast already showing instead of adding a new one.',
  },
  {
    name: 'dismissible',
    type: 'boolean',
    default: 'true',
    description: 'Shows the hover close button and allows swiping the toast away.',
  },
  {
    name: 'position',
    type: "'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'",
    default: "'bottom-right'",
    description:
      "Toaster: where the stack sits. Toaster takes the rest of Sonner's props too — expand, visibleToasts, offset, duration, hotkey.",
  },
  { name: 'gap', type: 'number', default: '10', description: 'Toaster: space in pixels between expanded toasts.' },
]

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// how long the demo's loading toast spins before it clears itself
const LOADING_DEMO_MS = 4000

export function ToastPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { position, expand, duration, dismissible, outcome } = settings.values

  const options = { dismissible }

  const triggers = [
    {
      label: 'Default',
      run: () =>
        toast('Event created', { ...options, description: 'Friday, 10:00 — Design review.' }),
    },
    {
      label: 'Success',
      run: () =>
        toast.success('Changes saved', { ...options, description: 'Your profile is up to date.' }),
    },
    {
      label: 'Error',
      run: () =>
        toast.error('Upload failed', {
          ...options,
          description: 'The file is over 10 MB.',
          action: { label: 'Retry', onClick: () => toast.success('Uploaded', options) },
        }),
    },
    {
      label: 'Warning',
      run: () =>
        toast.warning('Storage almost full', {
          ...options,
          description: 'You have used 92% of your 5 GB.',
        }),
    },
    {
      label: 'Info',
      run: () =>
        toast.info('Update ready', { ...options, description: 'Version 2.4 installs on restart.' }),
    },
    {
      label: 'Loading',
      run: () => {
        const id = toast.loading('Syncing your library', {
          ...options,
          description: 'Stays up until it is updated or dismissed.',
        })
        window.setTimeout(() => toast.dismiss(id), LOADING_DEMO_MS)
      },
    },
    {
      label: 'Promise',
      run: () =>
        toast
          .promise(
            wait(2000).then(() => {
              if (outcome === 'reject') throw new Error('Network error')
            }),
            {
              loading: 'Publishing your post',
              success: 'Post published',
              error: (error) => `Couldn't publish: ${(error as Error).message}`,
            },
            options,
          )
          // the toast shows the failure; the demo has nothing else to do with it
          .catch(() => {}),
    },
    {
      label: 'Action',
      run: () =>
        toast('Message archived', {
          ...options,
          action: { label: 'Undo', onClick: () => toast('Message restored', options) },
        }),
    },
  ]

  const usage = `${toUsageSnippet({
    component: 'Toaster',
    from: '@/components/ui/toast',
    imports: ['toast'],
    props: { position, expand, duration: duration * 1000 },
    defaults: { position: 'bottom-right', expand: false, duration: 4000 },
  })}

// mount Toaster once, then call toast from anywhere
toast.success('Changes saved', { description: 'Your profile is up to date.' })
toast.promise(save(), { loading: 'Saving', success: 'Saved', error: "Couldn't save" })`

  return (
    <DemoPage
      eyebrow="ui / toast"
      title="Toast"
      description={
        <>
          Squircle toasts on Sonner. Each status pops in with its own drawn icon, a promise toast morphs
          from a spinner into a check or a cross in place, and the stack fans out on hover. Ported from{' '}
          <a href="https://github.com/swamimalode07/rare-ui" target="_blank" rel="noreferrer">
            rare-ui
          </a>
          .
        </>
      }
      previewClassName="flex-col gap-8"
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Position"
            options={POSITIONS}
            value={position}
            onChange={(next) => settings.set('position', next)}
          />
          <DemoControlGroup
            title="Promise"
            options={OUTCOMES}
            value={outcome}
            onChange={(next) => settings.set('outcome', next)}
          />
          <DemoSlider
            label="Duration"
            value={duration}
            onValueChange={(next) => settings.set('duration', next)}
            min={2}
            max={10}
            step={1}
            unit="s"
          />
          <DemoSwitch
            label="Expand stack"
            checked={expand}
            onCheckedChange={(next) => settings.set('expand', next)}
          />
          <DemoSwitch
            label="Dismissible"
            checked={dismissible}
            onCheckedChange={(next) => settings.set('dismissible', next)}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/toast/'], usage, props: PROPS }}
    >
      {/* static cards, so the stage (and its thumbnail) shows the toast before anything is pressed */}
      <div inert className="flex w-[356px] max-w-full flex-col gap-2.5">
        <ToastCard
          toastId="preview-success"
          type="success"
          title="Changes saved"
          description="Your profile is up to date."
          dismissible={false}
        />
        <ToastCard
          toastId="preview-loading"
          type="loading"
          title="Publishing your post"
          dismissible={false}
        />
        <ToastCard
          toastId="preview-action"
          type="default"
          title="Message archived"
          action={{ label: 'Undo', onClick: () => {} }}
          dismissible={false}
        />
      </div>

      <div className="flex max-w-md flex-wrap justify-center gap-2">
        {triggers.map((trigger) => (
          <Button
            key={trigger.label}
            variant="secondary"
            size="sm"
            className="rounded-full transition-transform active:scale-95"
            onClick={trigger.run}
          >
            {trigger.label}
          </Button>
        ))}
      </div>

      <Toaster position={position} expand={expand} duration={duration * 1000} />
    </DemoPage>
  )
}
