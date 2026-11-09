import { Globe, Puzzle, Sparkles, Users, Wrench } from 'lucide-react'

import type { MorphingDisclosureItem } from './morphing-disclosure.types'

const iconProps = { 'aria-hidden': true } as const

export const MORPHING_DISCLOSURE_ITEMS: readonly MorphingDisclosureItem[] = [
  {
    title: 'What is design engineering?',
    content:
      'Where design intuition meets code execution — enabling you to see UI problems and build solutions from the ground up.',
    icon: <Wrench {...iconProps} />,
  },
  {
    title: 'What is the craft of UI?',
    content: (
      <>
        A course about building things <em>well</em> — mastering the web
        platform so you’re not limited by tools or libraries.
      </>
    ),
    icon: <Puzzle {...iconProps} />,
  },
  {
    title: 'Why focus on the web platform?',
    content: (
      <>
        Because when you work <em>with</em> the web — not fight it — you unlock
        performance, accessibility, and durability that last.
      </>
    ),
    icon: <Globe {...iconProps} />,
  },
  {
    title: 'Why does craft matter?',
    content:
      'Because it’s more than making something work — it’s making something feel right: inclusive, resilient, and scalable.',
    icon: <Sparkles {...iconProps} />,
  },
  {
    title: 'Who is this for?',
    content: (
      <>
        Designers who code, developers who design — anyone ready to stop
        chasing snippets and become the person who <em>can build anything</em>.
      </>
    ),
    icon: <Users {...iconProps} />,
  },
]
