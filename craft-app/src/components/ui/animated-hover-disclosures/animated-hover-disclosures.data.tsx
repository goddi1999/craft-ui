import {
  Film,
  Funnel,
  Gem,
  Hourglass,
  Palette,
  Scroll,
  WandSparkles,
} from 'lucide-react'

import type { HoverDisclosureItem } from './animated-hover-disclosures.types'

const iconProps = { size: 18, strokeWidth: 2, 'aria-hidden': true } as const

export const HOVER_DISCLOSURE_ITEMS: readonly HoverDisclosureItem[] = [
  {
    title: 'The Craft',
    description:
      'Gain the confidence to build anything you envision, transforming motion, interaction, and design principles into second nature.',
    icon: <Gem {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=12',
    href: '#',
  },
  {
    title: 'CSS Animation',
    description:
      'Master CSS animations from your very first set of @keyframes right through to things no one else ever teaches you.',
    icon: <Film {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=17',
    href: '#',
  },
  {
    title: 'SVG Filters',
    description:
      'Shaders on a budget. Learn how to use noise to your advantage whilst making flames and stickers.',
    icon: <Funnel {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=19',
    href: '#',
  },
  {
    title: 'Scroll Animation',
    description:
      'Take your users on a journey with the joy of tasteful scroll animation. You might not even need JavaScript.',
    icon: <Scroll {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=42',
    href: '#',
  },
  {
    title: 'Taming Canvas',
    description:
      'Grasp how to tame the pixel playground and when to do so. Whilst building with "Performance Driven Development".',
    icon: <Palette {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=128',
    href: '#',
  },
  {
    title: 'Layout Tricks',
    description:
      'Do you really need a library for that? Sometimes stepping back and rethinking the problem yields a nifty solution.',
    icon: <WandSparkles {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=56',
    href: '#',
  },
  {
    title: 'Mastering Time',
    description:
      "It's not all just easings and compositions. Time plays a crucial part in various UI patterns that might not seem obvious at first.",
    icon: <Hourglass {...iconProps} />,
    image: 'https://picsum.photos/720/720?random=39',
    href: '#',
  },
]
