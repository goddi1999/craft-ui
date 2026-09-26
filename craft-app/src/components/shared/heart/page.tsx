import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Heart } from '@/components/ui/heart'
import { HeartWithPicker } from '@/components/ui/heart-2'
import type { HeartVariantProps } from '@/components/ui/heart-variant'
import { DemoPage } from '@/components/shared/demo-page'

const VARIANTS: NonNullable<HeartVariantProps['variant']>[] = [
  'violet',
  'indigo',
  'blue',
  'cyan',
  'teal',
  'green',
  'lime',
  'orange',
  'pink',
  'darkblue',
]

const SIZES: NonNullable<HeartVariantProps['size']>[] = [
  'default',
  'lg',
  'xl',
  '2xl',
]

export function HeartPage() {
  const [variant, setVariant] =
    useState<NonNullable<HeartVariantProps['variant']>>('violet')
  const [size, setSize] =
    useState<NonNullable<HeartVariantProps['size']>>('2xl')
  const [replayKey, setReplayKey] = useState(0)

  return (
    <DemoPage
      eyebrow="ui / heart"
      title="Heart"
      description="Two like hearts: a CSS beat primitive with typed color variants, and a GSAP fill that expands from the center with particle burst."
      align="start"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 pb-20">
        <section className="overflow-hidden rounded-2xl border bg-card">
          <div className="grid gap-0 md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col items-center justify-center gap-6 border-b p-10 md:border-r md:border-b-0">
              <Heart
                key={replayKey}
                size={size}
                variant={variant}
                interactive
                liked
                triggerAnimation={replayKey}
                className="!size-20"
              />
              <p className="text-center text-sm text-muted-foreground">
                Click to like / unlike — CSS <code className="rounded bg-muted px-1">heart-beat</code>
              </p>
            </div>

            <div className="flex flex-col gap-6 p-6">
              <div>
                <p className="mb-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  variant
                </p>
                <div className="flex flex-wrap gap-2">
                  {VARIANTS.map((v) => (
                    <Button
                      key={v}
                      size="sm"
                      variant={variant === v ? 'default' : 'outline'}
                      onClick={() => setVariant(v)}
                    >
                      {v}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  size
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => (
                    <Button
                      key={s}
                      size="sm"
                      variant={size === s ? 'default' : 'outline'}
                      onClick={() => setSize(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setReplayKey((n) => n + 1)}
              >
                Replay beat
              </Button>
            </div>
          </div>
        </section>

        <section className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-10">
          <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
            heart-2 · GSAP fill + particles
          </p>
          <HeartWithPicker />
          <p className="max-w-md text-center text-sm text-muted-foreground">
            Tap the heart to fill from the center. Pick a swatch to remount with
            a new color.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Variants
          </h2>
          <ul className="flex flex-wrap items-center gap-4 rounded-xl border bg-card p-6">
            {VARIANTS.map((v) => (
              <li key={v} className="flex flex-col items-center gap-2" title={v}>
                <Heart size="xl" variant={v} liked interactive />
                <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DemoPage>
  )
}
