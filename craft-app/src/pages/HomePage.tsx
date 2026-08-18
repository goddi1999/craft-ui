import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type ExampleEntry = {
  title: string
  description: string
  path: string
  tag: string
}

const EXAMPLES: ExampleEntry[] = [
  {
    title: 'Scroll-Driven Index',
    description:
      'Fixed bottom index popover with scroll-driven progress and in-page section anchors.',
    path: '/examples/scroll-driven-index',
    tag: 'CSS · Popover',
  },
  {
    title: 'Faux PiP Video',
    description:
      'Sticky video morphs into a picture-in-picture control using CSS container scroll-state.',
    path: '/examples/faux-pip-video',
    tag: 'CSS · Scroll-state',
  },
  {
    title: 'Playbook Scroll Animation',
    description:
      'A layered scroll demo that uses subgrid and scroll-linked animation to build a cinematic composition.',
    path: '/examples/the-craft-of-ui-playbook-css-scroll-animation-w-subgrid',
    tag: 'CSS · Subgrid',
  },
  {
    title: 'Styleable Select',
    description:
      'A stylable select demo inspired by the base-select interaction pattern.',
    path: '/examples/you-can-select-things-styleable-select',
    tag: 'CSS · Select',
  },
  {
    title: 'You Can Scroll',
    description:
      'A sticky phrase and chroma-scroll list driven by CSS view timelines and scroll-linked animation.',
    path: '/examples/you-can-scroll',
    tag: 'CSS · View Timeline',
  },
  {
    title: 'Line Path Animation',
    description:
      'A scroll-driven SVG path fill animation with sticky headline and progressive section reveals.',
    path: '/examples/line-path-animation',
    tag: 'CSS · SVG',
  },
  {
    title: 'Curved Scrollbar',
    description:
      'A reusable scroll panel with an SVG thumb that bends around rounded content corners.',
    path: '/examples/curved-scrollbar',
    tag: 'CSS · Scrollbar',
  },
  {
    title: 'Agent Computer Icon',
    description:
      'A 24px monitor face with GSAP-driven states — loading, success, failure, waiting — animated through eyes, screen, and base.',
    path: '/examples/agent-computer-icon',
    tag: 'GSAP · SVG',
  },
  {
    title: 'Sparkle Button',
    description:
      'A hover-activated pill button with conic spark, orbiting particles, and gradient label text.',
    path: '/examples/sparkle-button',
    tag: 'CSS · Button',
  },
  {
    title: 'Multiplayer Masking',
    description:
      'An overlapping presence stack where narrow grid columns and radial-gradient masks let each avatar lift cleanly out of its neighbour.',
    path: '/examples/multiplayer-masking-with-grid-mask',
    tag: 'CSS · Mask',
  },
  {
    title: 'Product Spotlight Cards',
    description:
      'A depth map relights a flat product photo in real time — normals, contact shadows and a tracked spotlight, all sharing one WebGL context.',
    path: '/examples/product-spotlight-cards',
    tag: 'WebGL · Depth',
  },
  {
    title: 'Pure CSS 3D Carousel',
    description:
      'Cards stacked in one grid cell, rotated around the Y axis and pushed back along Z to form a ring that spins with no JavaScript.',
    path: '/examples/pure-css-3d-animated-carousel',
    tag: 'CSS · 3D',
  },
  {
    title: 'Progressive Blur',
    description:
      'Stacked backdrop-filter layers with staggered masks composited using intersect, sliding in on the scroller’s own timeline.',
    path: '/examples/scroll-driven-progressive-blur-w-contrast',
    tag: 'CSS · Backdrop',
  },
  {
    title: 'CSS Number Animation',
    description:
      'A registered integer custom property feeds a CSS counter, making the number itself interpolable without a JavaScript tick.',
    path: '/examples/css-number-animation',
    tag: 'CSS · Counter',
  },
  {
    title: 'Scroll-Driven Text Reveals',
    description:
      'Three text-clipped gradients swept by a view timeline, so the fill re-flows at any size without measuring anything.',
    path: '/examples/css-responsive-scroll-driven-text-reveals',
    tag: 'CSS · View Timeline',
  },
  {
    title: 'Scroll to Type',
    description:
      'A stepped view-timeline animation turns scroll distance into a character index, typing a line out with a blinking caret.',
    path: '/examples/css-scroll-to-type',
    tag: 'CSS · Typing',
  },
  {
    title: 'Carousel Slider',
    description:
      'A draggable card stack with spring transitions and directional enter/exit variants.',
    path: '/examples/carousel-slider',
    tag: 'Motion · Drag',
  },
  {
    title: 'Option Wheel',
    description:
      'A curved, draggable picker that bends its options along an arc and blurs them as they fall from the centre.',
    path: '/examples/option-wheel',
    tag: 'React · Picker',
  },
  {
    title: 'Year in Dots',
    description:
      'One dot per day of the year, filled in proportion to that year’s share of activity.',
    path: '/examples/year-in-dots',
    tag: 'React · Dataviz',
  },
  {
    title: 'YouTube Embed',
    description:
      'A YouTube iframe wrapper that builds its own player URL and can mask the chrome so the video reads as background art.',
    path: '/examples/youtube-embed',
    tag: 'React · Media',
  },
]

export function HomePage() {
  return (
    <div className="min-h-svh bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-medium tracking-tight text-foreground">
            Craft UI
          </h1>
          <p className="mt-4 text-muted-foreground">
            Browse live examples. Each card opens a dedicated demo page.
          </p>
        </header>

        <ul className="grid gap-6 sm:grid-cols-1">
          {EXAMPLES.map((example) => (
            <li key={example.path}>
              <Card>
                <CardHeader>
                  <CardTitle>{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="inline-flex rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                    {example.tag}
                  </span>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link to={example.path}>Open live example</Link>
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
