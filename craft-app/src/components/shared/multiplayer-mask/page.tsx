import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { MultiplayerMask } from './MultiplayerMask'
import { MultiplayerMaskItem } from './MultiplayerMaskItem'
import { MultiplayerMaskList } from './MultiplayerMaskList'
import { MultiplayerMaskOverflow } from './MultiplayerMaskOverflow'
import type {
  MultiplayerMaskDirection,
  MultiplayerMaskLabel,
  MultiplayerMaskMember,
  MultiplayerMaskSize,
  MultiplayerMaskTheme,
} from './multiplayer-mask.types'

const PORTRAIT = 'https://cdn.jsdelivr.net/gh/faker-js/assets-person-portrait'

const MEMBERS: MultiplayerMaskMember[] = [
  {
    name: 'Jhey',
    avatar:
      'https://assets.codepen.io/605876/cropped-headshot--saturated-low-res.jpg',
  },
  { name: 'Kelly', avatar: `${PORTRAIT}/female/512/22.jpg` },
  { name: 'Elias', avatar: `${PORTRAIT}/male/512/32.jpg` },
  { name: 'Drew', avatar: `${PORTRAIT}/male/512/76.jpg` },
  { name: 'Maxine', avatar: `${PORTRAIT}/female/512/36.jpg` },
  { name: 'Matt', avatar: `${PORTRAIT}/male/512/14.jpg` },
  { name: 'Vicky', avatar: `${PORTRAIT}/female/512/40.jpg` },
  { name: 'Marcos', avatar: `${PORTRAIT}/male/512/93.jpg` },
  { name: 'Constance', avatar: `${PORTRAIT}/female/512/64.jpg` },
  { name: 'Jill', avatar: `${PORTRAIT}/female/512/49.jpg` },
]

const SIZES: MultiplayerMaskSize[] = ['sm', 'default', 'lg']
const DIRECTIONS: MultiplayerMaskDirection[] = ['ltr', 'rtl']
const LABELS: MultiplayerMaskLabel[] = ['ring', 'above', 'none']
const THEMES: MultiplayerMaskTheme[] = ['system', 'light', 'dark']
const COUNTS = [2, 4, 6, 8, 10]

type ControlGroupProps<T extends string | number> = {
  title: string
  options: readonly T[]
  value: T
  onChange: (value: NoInfer<T>) => void
}

function ControlGroup<T extends string | number>({
  title,
  options,
  value,
  onChange,
}: ControlGroupProps<T>) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] opacity-60">
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={option === value ? 'default' : 'outline'}
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}

export function MultiplayerMaskPage() {
  const [size, setSize] = useState<MultiplayerMaskSize>('lg')
  const [direction, setDirection] = useState<MultiplayerMaskDirection>('ltr')
  const [label, setLabel] = useState<MultiplayerMaskLabel>('ring')
  const [theme, setTheme] = useState<MultiplayerMaskTheme>('system')
  const [count, setCount] = useState(4)
  const [glow, setGlow] = useState(false)
  const [debug, setDebug] = useState(false)

  const members = MEMBERS.slice(0, count)

  return (
    <div data-slot="multiplayer-mask-stage" data-theme={theme}>
      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-12 px-4 py-16">
        <header className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] opacity-50">
            shared / multiplayer-mask
          </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight">
            Multiplayer masking
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm opacity-70">
            An overlapping presence stack built from narrow grid columns, where
            each avatar carves a radial-gradient hole out of its neighbour so
            hovering lifts it cleanly out of the stack. Ported from{' '}
            <a
              href="https://codepen.io/jh3y/pen/yyLmmMW"
              className="underline underline-offset-2"
              target="_blank"
              rel="noreferrer"
            >
              jh3y&apos;s CodePen
            </a>
            .
          </p>
        </header>

        <section className="flex flex-col items-center gap-12 pt-32">
          <MultiplayerMask
            size={size}
            direction={direction}
            label={label}
            theme={theme}
            glow={glow}
            debug={debug}
          >
            <MultiplayerMaskList>
              {members.map((member) => (
                <MultiplayerMaskItem
                  key={member.name}
                  name={member.name}
                  avatar={member.avatar}
                />
              ))}
            </MultiplayerMaskList>
            <MultiplayerMaskOverflow
              label={`View all ${MEMBERS.length} members`}
            />
          </MultiplayerMask>

          <div className="w-full max-w-lg rounded-2xl border border-current/10 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-6">
              <ControlGroup
                title="members"
                options={COUNTS}
                value={count}
                onChange={setCount}
              />
              <ControlGroup
                title="size"
                options={SIZES}
                value={size}
                onChange={setSize}
              />
              <ControlGroup
                title="direction"
                options={DIRECTIONS}
                value={direction}
                onChange={setDirection}
              />
              <ControlGroup
                title="label"
                options={LABELS}
                value={label}
                onChange={setLabel}
              />
              <ControlGroup
                title="theme"
                options={THEMES}
                value={theme}
                onChange={setTheme}
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={glow ? 'default' : 'outline'}
                  onClick={() => setGlow((current) => !current)}
                >
                  glow
                </Button>
                <Button
                  size="sm"
                  variant={debug ? 'default' : 'outline'}
                  onClick={() => setDebug((current) => !current)}
                >
                  debug
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-[0.16em] opacity-50">
            Sizes
          </h2>
          <ul className="grid gap-4">
            {SIZES.map((variantSize) => (
              <li
                key={variantSize}
                className="flex items-center justify-center rounded-xl border border-current/10 p-8"
              >
                <MultiplayerMask size={variantSize} theme={theme} label="above">
                  <MultiplayerMaskList>
                    {MEMBERS.slice(0, 4).map((member) => (
                      <MultiplayerMaskItem
                        key={member.name}
                        name={member.name}
                        avatar={member.avatar}
                      />
                    ))}
                  </MultiplayerMaskList>
                </MultiplayerMask>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
