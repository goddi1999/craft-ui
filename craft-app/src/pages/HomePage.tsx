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
