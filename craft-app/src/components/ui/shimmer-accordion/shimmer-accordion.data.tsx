import {
  BookOpen,
  CreditCard,
  GraduationCap,
  Layers,
  Sparkles,
  Users,
} from 'lucide-react'

import type { ShimmerAccordionItem } from './shimmer-accordion.types'

const iconProps = { size: 20, 'aria-hidden': true, className: 'opacity-70' } as const

export const SHIMMER_ACCORDION_ITEMS: readonly ShimmerAccordionItem[] = [
  {
    question: 'Is this a course?',
    answer:
      'No. There are no lessons to complete, no progress tracking, and no linear path. This is a playbook and reference you return to when you need it — whether that’s to explore a specific idea or to see how a problem was approached end to end.',
    icon: <GraduationCap {...iconProps} />,
  },
  {
    question: 'Is this just prototype breakdowns?',
    answer:
      'No. Some entries are deep studio explorations of real builds and prototypes, while others focus on foundations like animation, interactions, layout systems, web platform features, and breaking down complex interfaces. It’s structured to teach both mechanics and application.',
    icon: <Layers {...iconProps} />,
  },
  {
    question: 'What’s the format?',
    answer:
      'Each entry combines video walkthroughs, written breakdowns, embedded demos, and downloadable source code so you can watch, read, explore, or jump between them depending on how you prefer to learn.',
    icon: <BookOpen {...iconProps} />,
  },
  {
    question: 'Who is this for?',
    answer:
      'Anyone who builds interfaces and cares about doing it well. Whether you’re early in your journey or already the person others rely on, the focus is on sharpening how you think about UI work, not just what you ship.',
    icon: <Users {...iconProps} />,
  },
  {
    question: 'Do you use AI?',
    answer:
      'Yes, where it makes sense. Modern workflows are part of the craft, and you’ll see how tools like AI can accelerate exploration and prototyping without replacing judgement or decision-making.',
    icon: <Sparkles {...iconProps} />,
  },
  {
    question: 'Do I get the source code?',
    answer:
      'Yes. All examples include full source code that you can download, run locally, inspect, and adapt. The goal isn’t just to see the result, it’s to understand how it works and experiment with it yourself.',
  },
  {
    question: 'Is there a community?',
    answer:
      'Yes. You’ll get access to a private Discord for discussion, feedback, and deeper dives with others using the playbook.',
  },
  {
    question: 'Can I request topics?',
    answer:
      'Yes. You can request topics, demos, or breakdowns directly inside the platform. Many entries exist because someone asked.',
  },
  {
    question: 'Is this a one-time purchase?',
    answer:
      'Yes. You pay once and get lifetime access, including all future updates. Pricing reflects the depth of the material today and will increase as the playbook grows.',
    icon: <CreditCard {...iconProps} />,
  },
]
