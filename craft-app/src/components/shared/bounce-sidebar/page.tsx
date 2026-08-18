import { useEffect, useRef, useState } from 'react'
import { motion, type Variants } from 'motion/react'

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

const sections = [
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

export function BounceSidebarPage() {
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const lockUntil = useRef(0)

  const goTo = (index: number) => {
    const container = scrollRef.current
    const el = sectionRefs.current[index]
    if (!container || !el) return
    setActive(index)
    lockUntil.current = Date.now() + 800
    const top =
      el.getBoundingClientRect().top -
      container.getBoundingClientRect().top +
      container.scrollTop
    container.scrollTo({ top: top - 8, behavior: 'smooth' })
  }

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      if (Date.now() < lockUntil.current) return
      if (
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 4
      ) {
        setActive(sectionRefs.current.length - 1)
        return
      }
      const containerTop = container.getBoundingClientRect().top
      let current = 0
      sectionRefs.current.forEach((el, index) => {
        if (el && el.getBoundingClientRect().top - containerTop <= 80) {
          current = index
        }
      })
      setActive(current)
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  let order = 0

  return (
    <div className="flex min-h-svh flex-col bg-background px-4 pb-10 pt-16 text-foreground">
      <header className="mx-auto mb-8 w-full max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
          shared / bounce-sidebar
        </p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight">
          Bounce sidebar
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          A contents rail whose yellow marker curves between items. Click a
          heading or scroll the article to send it along the arc.
        </p>
      </header>

      <div className="mx-auto h-[min(44rem,calc(100svh-11rem))] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex h-full gap-10 overflow-hidden p-6">
          <aside className="w-52 shrink-0">
            <p className="mb-3 mt-2 pl-2 text-sm font-medium uppercase tracking-wide text-foreground">
              Contents
            </p>
            <BounceSidebar
              items={sections.map((s) => s.title)}
              value={active}
              onChange={goTo}
              dotColor="#fcd601"
            />
          </aside>

          <div
            ref={scrollRef}
            className="min-h-0 flex-1 overflow-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <motion.article
              className="max-w-2xl"
              initial="hidden"
              animate="visible"
            >
              <motion.h2
                variants={fadeUp}
                custom={order++}
                className="text-5xl font-medium tracking-wider text-foreground"
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
                  ref={(el) => {
                    sectionRefs.current[index] = el
                  }}
                  className="mt-10"
                >
                  <motion.h3
                    variants={fadeUp}
                    custom={order++}
                    className="border-b pb-2 text-3xl font-medium tracking-wide text-foreground/90"
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
                      {'heading' in block && block.heading && (
                        <h4 className="text-lg font-normal tracking-wide text-foreground/80">
                          {block.heading}
                        </h4>
                      )}
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
      </div>
    </div>
  )
}
