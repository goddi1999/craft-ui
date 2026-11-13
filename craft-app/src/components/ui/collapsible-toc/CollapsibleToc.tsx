import { useReducedMotion } from 'motion/react'
import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  CLOSED_WIDTH,
  DEFAULT_LABELS,
  WIDE_QUERY,
  EASE_OUT,
  OPEN_WIDTH,
  SLIDE_MS,
} from './collapsible-toc.constants'
import type { CollapsibleTocProps } from './collapsible-toc.types'
import { MorphLabel, PanelGlyph } from './collapsible-toc-parts'
import { useScrollSpy } from './use-scroll-spy'

/**
 * An article with an "On this page" list beside it. Hide the list and it slides out behind
 * its own left edge while the article glides over to re-centre; the toggle's label morphs
 * letter by letter. On narrow containers the list folds above the article instead.
 */
export function CollapsibleToc({
  items,
  open: openProp,
  defaultOpen,
  onOpenChange,
  title = 'On this page',
  labels = DEFAULT_LABELS,
  children,
  className,
  style,
  ...props
}: CollapsibleTocProps) {
  const reduced = useReducedMotion() ?? false
  const root = useRef<HTMLDivElement>(null)
  const listId = useId()
  // unset, it opens beside the article on wide screens and starts folded on phones,
  // where an open list would push the article a screen down
  const [innerOpen, setInnerOpen] = useState(
    () => defaultOpen ?? window.matchMedia(WIDE_QUERY).matches,
  )
  const open = openProp ?? innerOpen
  const [active, setActive] = useScrollSpy(
    items.map((item) => item.id),
    root,
  )

  const activeLabel = items.find((item) => item.id === active)?.label

  // the columns change in one step and the article glides over from where it was (FLIP),
  // so the slide runs on transforms and the text never re-wraps mid-way
  const column = useRef<HTMLDivElement>(null)
  const body = useRef<HTMLDivElement>(null)
  const flights = useRef<Animation[]>([])
  const shown = useRef(open)
  useLayoutEffect(() => {
    const was = shown.current
    shown.current = open
    const node = root.current
    const col = column.current
    const text = body.current
    if (was === open || !node || !col || !text) return
    const lefts = () => [col.getBoundingClientRect().left, text.getBoundingClientRect().left]

    // lay out the previous state for a moment to read where the article sits on screen,
    // mid-glide included, then restore it before anything paints
    node.dataset.state = was ? 'open' : 'closed'
    const [colFrom, textFrom] = lefts()
    node.dataset.state = open ? 'open' : 'closed'
    flights.current.forEach((flight) => flight.cancel())
    flights.current = []
    if (reduced) return

    const [colTo, textTo] = lefts()
    if (Math.abs(colFrom - colTo) < 0.5 && Math.abs(textFrom - textTo) < 0.5) return
    const shift = colFrom - colTo
    const timing = { duration: SLIDE_MS, easing: EASE_OUT }
    flights.current = [
      col.animate([{ transform: `translateX(${shift}px)` }, { transform: 'none' }], timing),
      // nested in the column, so it only adds what the column's own shift leaves out
      text.animate([{ transform: `translateX(${textFrom - textTo - shift}px)` }, { transform: 'none' }], timing),
    ]
  }, [open, reduced])

  const toggle = () => {
    setInnerOpen(!open)
    onOpenChange?.(!open)
  }

  const jump = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    event.preventDefault()
    setActive(id)
    target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  }

  const motionStyle = {
    '--toc-open': OPEN_WIDTH,
    '--toc-closed': CLOSED_WIDTH,
    '--toc-ms': reduced ? '0ms' : `${SLIDE_MS}ms`,
    '--toc-ease': EASE_OUT,
    ...style,
  } as CSSProperties

  return (
    <div
      ref={root}
      data-slot="collapsible-toc"
      data-state={open ? 'open' : 'closed'}
      // clips the article's glide so it never adds a sideways scrollbar
      className={cn('@container w-full overflow-x-clip', className)}
      style={motionStyle}
      {...props}
    >
      <div
        className={cn(
          'grid grid-cols-1 gap-y-6',
          '@3xl:grid-cols-[var(--toc-open)_minmax(0,1fr)] @3xl:gap-y-0 @3xl:in-data-[state=closed]:grid-cols-[var(--toc-closed)_minmax(0,1fr)]',
        )}
      >
        <aside className="relative min-w-0">
          {/* clips only the left edge, so the list slides out behind it like the reference */}
          <div className="@3xl:sticky @3xl:top-6 @3xl:[clip-path:inset(-100vh_-100vw_-100vh_0)]">
            <div
              className={cn(
                'grid transition-[grid-template-rows] duration-(--toc-ms) ease-(--toc-ease) @3xl:block',
                open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <nav
                id={listId}
                aria-label={title}
                inert={!open}
                className={cn(
                  'min-h-0 w-full overflow-hidden transition-[opacity,translate] duration-(--toc-ms) ease-(--toc-ease) @3xl:w-(--toc-open) @3xl:overflow-visible @3xl:pr-6',
                  open ? 'opacity-100' : 'opacity-0 @3xl:-translate-x-full',
                )}
              >
                <p className="pb-3 text-xs font-medium text-muted-foreground">{title}</p>
                <ul className="flex flex-col gap-0.5 text-sm">
                  {items.map((item) => {
                    const current = item.id === active
                    return (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          aria-current={current ? 'location' : undefined}
                          onClick={(event) => jump(event, item.id)}
                          className={cn(
                            'block truncate rounded-md py-3 outline-none @3xl:py-1.5 transition-colors duration-150 [-webkit-tap-highlight-color:transparent] focus-visible:ring-2 focus-visible:ring-ring',
                            item.depth === 1 && 'pl-3',
                            current
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground hover:text-foreground',
                          )}
                        >
                          {item.label}
                        </a>
                      </li>
                    )
                  })}
                </ul>
                <hr className="my-5 border-border" />
              </nav>
            </div>

            <button
              type="button"
              aria-expanded={open}
              aria-controls={listId}
              onClick={toggle}
              className="flex min-h-11 max-w-full items-center gap-2.5 rounded-md py-1 text-sm @3xl:min-h-0 font-medium text-foreground outline-none select-none [-webkit-tap-highlight-color:transparent] [touch-action:manipulation] focus-visible:ring-2 focus-visible:ring-ring active:opacity-70"
            >
              <span className="text-muted-foreground/70">
                <PanelGlyph />
              </span>
              <span className="sr-only">{open ? labels.hide : labels.show}</span>
              <MorphLabel text={open ? labels.hide : labels.show} reduced={reduced} />
              {/* folded above the article, the toggle still says where you are */}
              {!open && activeLabel && (
                <span className="truncate font-normal text-muted-foreground @3xl:hidden">· {activeLabel}</span>
              )}
            </button>
          </div>
        </aside>

        <div
          ref={column}
          className="min-w-0 @3xl:border-l @3xl:border-dashed @3xl:border-border @3xl:pl-8"
        >
          <div ref={body} className="mx-auto max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
