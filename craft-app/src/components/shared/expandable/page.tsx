import {
  Battery,
  Bluetooth,
  Calendar,
  Clock,
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Headphones,
  MapPin,
  Sun,
  Thermometer,
  Users,
  Video,
  Wind,
} from 'lucide-react'

import { DemoControlGroup, DemoSettings, useDemoSettings } from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTrigger,
} from '@/components/ui/expandable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

const EXAMPLES = ['meeting', 'product', 'weather'] as const
type Example = (typeof EXAMPLES)[number]

const DEFAULTS = { example: 'meeting' as Example }

const LABELS: Record<Example, string> = { meeting: 'Meeting', product: 'Product', weather: 'Weather' }

const ATTENDEES = ['Alice', 'Bob', 'Charlie', 'David']

const FORECAST = [
  { day: 'Mon', temp: 22, Icon: Sun },
  { day: 'Tue', temp: 25, Icon: CloudSun },
  { day: 'Wed', temp: 20, Icon: CloudRain },
  { day: 'Thu', temp: 18, Icon: CloudDrizzle },
  { day: 'Fri', temp: 23, Icon: CloudLightning },
]

const PROPS: DemoPropDoc[] = [
  {
    name: 'children',
    type: 'ReactNode | ({ isExpanded }) => ReactNode',
    description: 'Expandable: content, or a render function that receives the open state.',
  },
  {
    name: 'expandDirection',
    type: "'vertical' | 'horizontal' | 'both'",
    default: "'vertical'",
    description: 'Expandable: which axes the card grows along.',
  },
  { name: 'expandBehavior', type: "'replace' | 'push'", default: "'replace'", description: 'Expandable: how the card affects its surroundings.' },
  { name: 'initialDelay', type: 'number', default: '0', description: 'Expandable: seconds before the first transition.' },
  { name: 'onExpandStart / onExpandEnd', type: '() => void', description: 'Expandable: fired when opening starts and when the content finishes animating in.' },
  { name: 'collapsedSize / expandedSize', type: '{ width?, height? }', description: 'ExpandableCard: px sizes; a missing side follows the content.' },
  { name: 'hoverToExpand', type: 'boolean', default: 'false', description: 'ExpandableCard: open on hover, close on leave.' },
  { name: 'expandDelay / collapseDelay', type: 'number', default: '0', description: 'ExpandableCard: ms delays for hover open and close.' },
  { name: 'preset', type: "'fade' | 'slide-up' | 'scale' | 'blur-sm' | …", description: 'ExpandableContent: entrance animation. Reduced motion turns every preset into a fade.' },
  { name: 'stagger / staggerChildren', type: 'boolean / number', default: 'false / 0.1', description: 'ExpandableContent: reveal children one after another.' },
  { name: 'keepMounted', type: 'boolean', default: 'false', description: 'ExpandableContent: keep children mounted while collapsed.' },
  { name: 'animateIn', type: '{ initial, animate, transition }', description: 'ExpandableContent: custom entrance overriding the preset.' },
]

function MeetingCard() {
  return (
    <Expandable expandDirection="both" expandBehavior="replace" initialDelay={0.2}>
      {({ isExpanded }) => (
        <ExpandableTrigger>
          <ExpandableCard
            className="relative w-full"
            collapsedSize={{ width: 320, height: 240 }}
            expandedSize={{ width: 420, height: 480 }}
            hoverToExpand={false}
            expandDelay={200}
            collapseDelay={500}
          >
            <ExpandableCardHeader>
              <div className="flex w-full items-start justify-between">
                <div>
                  <Badge className="mb-2 bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-300">
                    In 15 mins
                  </Badge>
                  <h3 className="text-xl font-semibold">Design Sync</h3>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="outline" className="size-8" onClick={(e) => e.stopPropagation()}>
                        <Calendar className="size-4" aria-hidden />
                        <span className="sr-only">Add to calendar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add to calendar</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </ExpandableCardHeader>

            <ExpandableCardContent>
              <div className="mb-4 flex flex-col items-start justify-between">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="mr-1 size-4" aria-hidden />
                  <span>1:30PM → 2:30PM</span>
                </div>
                <ExpandableContent preset="blur-md">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 size-4" aria-hidden />
                    <span>Conference Room A</span>
                  </div>
                </ExpandableContent>
              </div>
              <ExpandableContent preset="blur-md" stagger staggerChildren={0.2}>
                <p className="mb-4 text-sm text-muted-foreground">
                  Weekly design sync to discuss ongoing projects, share updates, and address any design-related
                  challenges.
                </p>
                <div className="mb-4">
                  <h4 className="mb-2 flex items-center text-sm font-medium">
                    <Users className="mr-2 size-4" aria-hidden />
                    Attendees:
                  </h4>
                  <div className="flex -space-x-2 overflow-hidden">
                    {ATTENDEES.map((name) => (
                      <Tooltip key={name}>
                        <TooltipTrigger asChild>
                          <Avatar className="border-2 border-background">
                            <AvatarFallback>{name[0]}</AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>{name}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <Button className="w-full" onClick={(e) => e.stopPropagation()}>
                    <Video className="size-4" aria-hidden />
                    Join Meeting
                  </Button>
                  {isExpanded && (
                    <Button variant="outline" className="w-full" onClick={(e) => e.stopPropagation()}>
                      Open Chat
                    </Button>
                  )}
                </div>
              </ExpandableContent>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-up">
              <ExpandableCardFooter>
                <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                  <span>Weekly</span>
                  <span>Next: Mon, 10:00 AM</span>
                </div>
              </ExpandableCardFooter>
            </ExpandableContent>
          </ExpandableCard>
        </ExpandableTrigger>
      )}
    </Expandable>
  )
}

function ProductCard() {
  return (
    <Expandable expandDirection="both" expandBehavior="replace">
      <ExpandableTrigger>
        <ExpandableCard
          className="relative w-full"
          collapsedSize={{ width: 330, height: 220 }}
          expandedSize={{ width: 500, height: 520 }}
        >
          <ExpandableCardHeader>
            <div className="flex w-full items-center justify-between">
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">New Arrival</Badge>
              <Badge variant="outline" className="ml-2">
                In stock
              </Badge>
            </div>
          </ExpandableCardHeader>

          <ExpandableCardContent>
            <div className="mb-4 flex items-start">
              <ExpandableContent preset="fade" keepMounted animateIn={{ initial: { opacity: 0 }, animate: { opacity: 1 } }}>
                <div className="mr-4 grid size-20 place-items-center rounded-2xl bg-muted text-foreground">
                  <Headphones className="size-10" aria-hidden />
                </div>
              </ExpandableContent>
              <div className="flex-1">
                <h3 className="text-lg font-medium tracking-tight">Wireless Headphones</h3>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground line-through">$349.99</span>
                  <span className="text-sm font-semibold">$299.99</span>
                </div>
              </div>
            </div>
            <ExpandableContent preset="blur-md" stagger staggerChildren={0.2}>
              <p className="mb-4 text-sm text-muted-foreground">
                Industry-leading noise cancellation, exceptional sound quality and up to 30 hours of battery life.
              </p>
              <div className="mb-4 space-y-2 text-sm">
                {[
                  { Icon: Battery, label: '30-hour battery life' },
                  { Icon: Bluetooth, label: 'Bluetooth 5.0' },
                  { Icon: Headphones, label: 'Adaptive noise cancellation' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center">
                    <Icon className="mr-2 size-4 text-muted-foreground" aria-hidden />
                    <span>{label}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full" onClick={(e) => e.stopPropagation()}>
                Add to cart
              </Button>
            </ExpandableContent>
          </ExpandableCardContent>
          <ExpandableContent preset="slide-up">
            <ExpandableCardFooter>
              <div className="flex w-full items-center justify-between text-sm text-muted-foreground">
                <span>Free shipping</span>
                <span>30-day return policy</span>
              </div>
            </ExpandableCardFooter>
          </ExpandableContent>
        </ExpandableCard>
      </ExpandableTrigger>
    </Expandable>
  )
}

function WeatherCard() {
  return (
    <Expandable expandDirection="both" expandBehavior="replace">
      <ExpandableTrigger>
        <ExpandableCard
          className="relative w-full"
          collapsedSize={{ width: 320, height: 220 }}
          expandedSize={{ width: 480, height: 480 }}
        >
          <ExpandableCardHeader>
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center">
                <Sun className="mr-2 size-8 text-yellow-500" aria-hidden />
                <ExpandableContent preset="blur-sm" keepMounted>
                  <h3 className="text-lg font-medium">Today's Weather</h3>
                  <p className="text-sm text-muted-foreground">Sunny, 25°C</p>
                </ExpandableContent>
              </div>
              <Badge variant="outline">
                <Thermometer className="size-3" aria-hidden /> 25°C
              </Badge>
            </div>
          </ExpandableCardHeader>

          <ExpandableCardContent>
            <ExpandableContent preset="blur-md" stagger staggerChildren={0.1}>
              <div className="mb-4 grid grid-cols-2 gap-4">
                {[
                  { Icon: Cloud, label: 'Humidity: 60%' },
                  { Icon: Wind, label: 'Wind: 10 km/h' },
                  { Icon: Droplets, label: 'Rain: 0%' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center">
                    <Icon className="mr-2 size-5 text-muted-foreground" aria-hidden />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <h4 className="mb-2 text-sm font-medium">5-Day Forecast</h4>
                {FORECAST.map(({ day, temp, Icon }) => (
                  <div key={day} className="flex items-center justify-between py-1 text-sm">
                    <span>{day}</span>
                    <Icon className="size-4 text-muted-foreground" aria-hidden />
                    <span className="tabular-nums">{temp}°C</span>
                  </div>
                ))}
              </div>
            </ExpandableContent>
          </ExpandableCardContent>
          <ExpandableCardFooter>
            <p className="text-xs text-muted-foreground">Last updated: 5 minutes ago</p>
          </ExpandableCardFooter>
        </ExpandableCard>
      </ExpandableTrigger>
    </Expandable>
  )
}

const CARDS: Record<Example, () => React.JSX.Element> = {
  meeting: MeetingCard,
  product: ProductCard,
  weather: WeatherCard,
}

export function ExpandablePage() {
  const settings = useDemoSettings(DEFAULTS)
  const { example } = settings.values
  const Card = CARDS[example]

  const usage = toUsageSnippet({
    component: 'Expandable',
    from: '@/components/ui/expandable',
    props: { expandDirection: 'both', expandBehavior: 'replace' },
    defaults: {},
  })

  return (
    <DemoPage
      eyebrow="ui / expandable"
      title="Expandable"
      description="A card that springs from a collapsed size to an expanded one and reveals its content with fade, slide, scale or blur presets, optionally staggered. Click or press Enter on a card to toggle it. Adapted from cult-ui."
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Example"
            options={EXAMPLES}
            value={example}
            onChange={(next) => settings.set('example', next)}
            format={(value) => LABELS[value]}
          />
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/expandable/'], usage, props: PROPS }}
    >
      <TooltipProvider>
        <div className="flex min-h-[540px] w-full items-start justify-center">
          <Card key={example} />
        </div>
      </TooltipProvider>
    </DemoPage>
  )
}
