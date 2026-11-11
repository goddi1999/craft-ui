import { motion, type Variants } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import {
  DemoControlGroup,
  DemoSettings,
  DemoSlider,
  useDemoSettings,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'

import { BounceSidebar } from './BounceSidebar'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (order: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + order * 0.04,
      duration: 0.35,
      ease: 'easeOut',
    },
  }),
}

const LOREM_A =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'

const LOREM_B =
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'

const LOREM_C =
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'

const SECTIONS = [
  {
    title: 'Introduction',
    blocks: [
      { text: LOREM_A },
      { heading: 'Background', text: LOREM_B },
      { heading: 'Etymology', text: LOREM_C },
    ],
  },
  {
    title: 'History',
    blocks: [
      { text: LOREM_C },
      { heading: 'Early period', text: LOREM_A },
      { heading: 'Modern era', text: LOREM_B },
    ],
  },
  {
    title: 'Overview',
    blocks: [
      { text: LOREM_B },
      { heading: 'Principles', text: LOREM_C },
      { heading: 'Structure', text: LOREM_A },
    ],
  },
  {
    title: 'Architecture',
    blocks: [
      { text: LOREM_A },
      { heading: 'Components', text: LOREM_B },
      { heading: 'Data flow', text: LOREM_C },
    ],
  },
  {
    title: 'References',
    blocks: [{ text: LOREM_C }, { heading: 'Further reading', text: LOREM_A }],
  },
]

const DOT_COLORS = ['#fcd601', '#f97316', '#ec4899', '#8b5cf6', '#0ea5e9'] as const
const DOT_COLOR_NAMES: Record<(typeof DOT_COLORS)[number], string> = {
  '#fcd601': 'yellow',
  '#f97316': 'orange',
  '#ec4899': 'pink',
  '#8b5cf6': 'violet',
  '#0ea5e9': 'sky',
}

const DEFAULTS = {
  dotColor: '#fcd601' as (typeof DOT_COLORS)[number],
  count: SECTIONS.length,
}

const PROPS: DemoPropDoc[] = [
  {
    name: 'items',
    type: 'BounceSidebarItem[]',
    description: 'Labels, or `{ label, href }` to render router links instead of buttons.',
  },
  {
    name: 'value',
    type: 'number',
    description: 'Controlled active index — drive it from your scroll spy.',
  },
  {
    name: 'defaultValue',
    type: 'number',
    default: '0',
    description: 'Initial active index when uncontrolled.',
  },
  {
    name: 'onChange',
    type: '(index: number) => void',
    description: 'Called with the index of the item that was clicked.',
  },
  {
    name: 'dotColor',
    type: 'string',
    default: "'#fcd601'",
    description: 'Color of the travelling marker dot.',
  },
  {
    name: '...props',
    type: "ComponentProps<'ul'>",
    description: 'Any other list attribute — className, aria-label…',
  },
]

export function BounceSidebarPage() {
  const settings = useDemoSettings(DEFAULTS)
  const { dotColor, count } = settings.values
  const sections = SECTIONS.slice(0, count)

  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const lockUntil = useRef(0)
  const activeIndex = Math.min(active, count - 1)

  const handleGoTo = (index: number) => {
    const container = scrollRef.current
    const element = sectionRefs.current[index]
    if (!container || !element) return
    setActive(index)
    lockUntil.current = Date.now() + 800
    const top =
      element.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop
    container.scrollTo({ top: top - 8, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const handleScroll = () => {
      if (Date.now() < lockUntil.current) return
      const sectionElements = sectionRefs.current.slice(0, count)
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 4
      ) {
        setActive(sectionElements.length - 1)
        return
      }
      const containerTop = container.getBoundingClientRect().top
      let current = 0
      sectionElements.forEach((element, index) => {
        if (element && element.getBoundingClientRect().top - containerTop <= 80) {
          current = index
        }
      })
      setActive(current)
    }
    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [count])

  const usage = toUsageSnippet({
    component: 'BounceSidebar',
    from: '@/components/shared/bounce-sidebar',
    props: {
      items: '{headings}',
      value: '{active}',
      onChange: '{scrollToSection}',
      dotColor,
    },
    defaults: { dotColor: '#fcd601' },
  }).replace(/"\{(\w+)\}"/g, '{$1}')

  let order = 0

  return (
    <DemoPage
      eyebrow="shared / bounce-sidebar"
      title="Bounce Sidebar"
      description="A contents rail whose marker dot curves between items. Click a heading or scroll the article to send it along the arc."
      align="stretch"
      bleed
      settings={
        <DemoSettings onReset={settings.reset} canReset={settings.isDirty}>
          <DemoControlGroup
            title="Dot color"
            options={DOT_COLORS}
            value={dotColor}
            onChange={(value) => settings.set('dotColor', value)}
            format={(value) => DOT_COLOR_NAMES[value]}
          />
          <DemoSlider
            label="Sections"
            value={count}
            onValueChange={(value) => settings.set('count', value)}
            min={2}
            max={SECTIONS.length}
          />
        </DemoSettings>
      }
      docs={{
        paths: ['src/components/shared/bounce-sidebar/'],
        usage,
        props: PROPS,
      }}
    >
      <div className="flex h-[36rem] flex-col gap-6 overflow-hidden p-6 sm:flex-row sm:gap-10">
        <aside className="shrink-0 sm:w-52">
          <p className="mt-2 mb-3 pl-2 text-sm font-medium tracking-wide uppercase">
            Contents
          </p>
          <BounceSidebar
            items={sections.map((section) => section.title)}
            value={activeIndex}
            onChange={handleGoTo}
            dotColor={dotColor}
          />
        </aside>

        <div
          ref={scrollRef}
          className="min-h-0 flex-1 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <motion.article className="max-w-2xl" initial="hidden" animate="visible">
            <motion.h2
              variants={fadeUp}
              custom={order++}
              className="text-4xl font-medium tracking-wider sm:text-5xl"
            >
              Arise UI
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={order++}
              className="mt-2 text-lg text-foreground/80 dark:text-foreground/60"
            >
              From Arise UI, the free component encyclopedia
            </motion.p>

            {sections.map((section, index) => (
              <section
                key={section.title}
                ref={(element) => {
                  sectionRefs.current[index] = element
                }}
                className="mt-10"
              >
                <motion.h3
                  variants={fadeUp}
                  custom={order++}
                  className="border-b pb-2 text-2xl font-medium tracking-wide text-foreground/90 sm:text-3xl"
                >
                  {section.title}
                </motion.h3>

                {section.blocks.map((block, blockIndex) => (
                  <motion.div
                    key={blockIndex}
                    variants={fadeUp}
                    custom={order++}
                    className="mt-6"
                  >
                    {'heading' in block && block.heading ? (
                      <h4 className="text-lg font-normal tracking-wide text-foreground/80">
                        {block.heading}
                      </h4>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-foreground/75 dark:text-foreground/50">
                      {block.text}
                    </p>
                  </motion.div>
                ))}
              </section>
            ))}
          </motion.article>
        </div>
      </div>
    </DemoPage>
  )
}
