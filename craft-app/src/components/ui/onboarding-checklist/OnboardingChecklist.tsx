import { ChevronUp } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Transition } from 'motion/react'
import {
  useEffect,
  useId,
  useReducer,
  useRef,
  useSyncExternalStore,
  type CSSProperties,
  type KeyboardEvent,
} from 'react'

import { cn } from '@/lib/utils'

import {
  DONE_TITLE,
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  ERROR_FALLBACK,
  SETTLE_MS,
  SPRING_EASE,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
} from './onboarding-checklist.constants'
import type { OnboardingChecklistProps, OnboardingStep } from './onboarding-checklist.types'
import { collapse, init, reducer } from './onboarding-checklist.utils'
import {
  CompletedItem,
  ProgressRing,
  RollingNumber,
  StepItem,
  SwapText,
} from './onboarding-checklist-parts'

const subscribe = () => () => {}
/** False on the server and during hydration, so reduced motion never changes the first client render. */
const useHydrated = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )

/**
 * A getting started checklist for a new account or workspace. The ring and count follow every check, finished steps
 * strike through and fold into a completed row that opens again, and the next step opens and takes focus.
 */
export function OnboardingChecklist({
  title,
  doneTitle = DONE_TITLE,
  steps,
  defaultCompleted = [],
  onCompletedChange,
  defaultHidden = false,
  onHiddenChange,
  className,
}: OnboardingChecklistProps) {
  const baseId = useId()
  const hydrated = useHydrated()
  const prefersReduced = useReducedMotion()
  const reduced = hydrated && !!prefersReduced
  const [state, dispatch] = useReducer(
    reducer,
    { steps, completed: defaultCompleted, hidden: defaultHidden },
    init,
  )
  const root = useRef<HTMLElement>(null)
  const timers = useRef(new Map<string, ReturnType<typeof setTimeout>>())
  const focusRequest = useRef<'next' | { id: string } | null>(null)
  const reportCompleted = useRef(onCompletedChange)
  const reported = useRef(state.done)

  useEffect(() => {
    reportCompleted.current = onCompletedChange
  })
  useEffect(() => {
    if (reported.current === state.done) return
    reported.current = state.done
    reportCompleted.current?.(state.done)
  }, [state.done])
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])
  // focus moves after the commit that mounts its target: the next step's action, or the step reopened from the completed row
  useEffect(() => {
    const request = focusRequest.current
    const node = root.current
    if (!request || !node) return
    focusRequest.current = null
    let target: HTMLElement | null = null
    if (request === 'next') {
      const next = state.expanded
        ? node.querySelector<HTMLElement>(`[data-step="${state.expanded}"]:not([data-leaving])`)
        : null
      target =
        next?.querySelector<HTMLElement>('[data-primary]') ??
        next?.querySelector<HTMLElement>('[data-title]') ??
        node.querySelector<HTMLElement>('[data-group-toggle]')
    } else {
      target = node.querySelector<HTMLElement>(
        `[data-step="${request.id}"]:not([data-leaving]) [data-check]`,
      )
    }
    target?.focus({ preventScroll: true })
  })

  function check(id: string) {
    dispatch({ type: 'check', id, steps })
    if (timers.current.has(id)) return
    timers.current.set(
      id,
      setTimeout(() => {
        timers.current.delete(id)
        if (root.current?.querySelector(`[data-step="${id}"]`)?.contains(document.activeElement)) {
          focusRequest.current = 'next'
        }
        dispatch({ type: 'settle', id, steps })
      }, SETTLE_MS),
    )
  }

  function uncheck(id: string, fromGroup: boolean) {
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
    if (fromGroup) focusRequest.current = { id }
    dispatch({ type: 'uncheck', id, steps })
  }

  async function run(step: OnboardingStep) {
    if (!step.onAction || state.pending.includes(step.id) || state.done.includes(step.id)) return
    dispatch({ type: 'start', id: step.id, steps })
    try {
      await step.onAction()
      check(step.id)
    } catch (error) {
      dispatch({
        type: 'fail',
        id: step.id,
        message: error instanceof Error && error.message ? error.message : ERROR_FALLBACK,
      })
    }
  }

  function toggleHidden() {
    dispatch({ type: 'hide' })
    onHiddenChange?.(!state.hidden)
  }

  /** Up and Down walk the step titles, Home and End jump to the first and last. */
  function navigate(event: KeyboardEvent<HTMLUListElement>) {
    const target = event.target as HTMLElement
    if (
      !target.matches('[data-title]') ||
      !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)
    ) {
      return
    }
    const titles = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>('li:not([data-leaving]) [data-title]'),
    )
    const index = titles.indexOf(target)
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? titles.length - 1
          : (index + (event.key === 'ArrowDown' ? 1 : -1) + titles.length) % titles.length
    event.preventDefault()
    titles[next]?.focus()
  }

  const total = steps.length
  const doneCount = state.done.length
  const allDone = total > 0 && doneCount === total
  const open = steps.filter((step) => !state.settled.includes(step.id))
  const completed = steps.filter((step) => state.settled.includes(step.id))
  const titleId = `${baseId}-title`
  const bodyId = `${baseId}-body`
  const groupId = `${baseId}-completed`
  const bodyTransition: Transition = reduced
    ? { duration: 0 }
    : state.hidden
      ? {
          height: { ...SPRING_SMOOTH, visualDuration: 0.34 },
          opacity: { duration: DURATION.fast, ease: EASE_STANDARD },
        }
      : {
          height: SPRING_SMOOTH,
          opacity: { duration: DURATION.standard, ease: EASE_ENTER, delay: 0.05 },
        }

  // the card holds no padding of its own: the header pads itself, so hiding the body leaves an evenly padded bar
  return (
    <section
      ref={root}
      data-slot="onboarding-checklist"
      aria-labelledby={titleId}
      data-complete={allDone || undefined}
      data-hidden={state.hidden || undefined}
      style={{ '--onboarding-spring': SPRING_EASE } as CSSProperties}
      className={cn(
        '@container w-full min-w-0 rounded-[2.125rem] border border-border bg-card text-card-foreground',
        className,
      )}
    >
      <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-x-3 p-5">
        <ProgressRing done={doneCount} total={total} reduced={reduced} />
        <div className="grid min-w-0 gap-px">
          <h3
            id={titleId}
            className="text-base leading-[1.4] font-medium tracking-[-0.01em] text-foreground"
          >
            <span className="sr-only">{allDone ? doneTitle : title}</span>
            <SwapText text={allDone ? doneTitle : title} options={[title, doneTitle]} reduced={reduced} />
          </h3>
          <p className="text-sm leading-[1.4] text-muted-foreground">
            <span className="sr-only">
              {doneCount} of {total} done
            </span>
            <span className="inline-flex items-baseline" aria-hidden="true">
              <RollingNumber value={doneCount} reduced={reduced} />
              &nbsp;of {total} done
            </span>
          </p>
        </div>
        {/* a quiet text button; narrow cards keep the header on one line by showing only the chevron */}
        <button
          type="button"
          aria-expanded={!state.hidden}
          aria-controls={bodyId}
          onClick={toggleHidden}
          className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1 rounded-[1.125rem] pr-2 pl-3 text-sm font-medium text-muted-foreground outline-none [-webkit-tap-highlight-color:transparent] transition-colors duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring active:bg-muted active:text-foreground motion-reduce:transition-none @max-[380px]:w-9 @max-[380px]:p-0"
        >
          <span className="@max-[380px]:hidden">
            <SwapText text={state.hidden ? 'Show' : 'Hide'} options={['Hide', 'Show']} reduced={reduced} />
          </span>
          <span className="sr-only">{state.hidden ? 'Show' : 'Hide'} checklist</span>
          <motion.span
            className="grid place-items-center"
            aria-hidden="true"
            initial={false}
            animate={{ rotate: state.hidden ? 180 : 0 }}
            transition={reduced ? { duration: 0 } : SPRING_SNAPPY}
          >
            <ChevronUp size={16} strokeWidth={1.75} />
          </motion.span>
        </button>
      </div>
      <motion.div
        id={bodyId}
        className="overflow-hidden"
        initial={false}
        animate={state.hidden ? { height: 0, opacity: 0 } : { height: 'auto', opacity: 1 }}
        transition={bodyTransition}
        inert={state.hidden}
      >
        <div className="border-t border-border p-2">
          <ul
            aria-label="Steps to do"
            aria-hidden={open.length ? undefined : true}
            onKeyDown={navigate}
          >
            <AnimatePresence initial={false}>
              {open.map((step) => (
                <StepItem
                  key={step.id}
                  step={step}
                  baseId={baseId}
                  done={state.done.includes(step.id)}
                  expanded={state.expanded === step.id}
                  pending={state.pending.includes(step.id)}
                  error={state.errors[step.id]}
                  reduced={reduced}
                  onToggle={() =>
                    state.done.includes(step.id) ? uncheck(step.id, false) : check(step.id)
                  }
                  onExpand={() => dispatch({ type: 'expand', id: step.id, steps })}
                  onRun={() => run(step)}
                />
              ))}
            </AnimatePresence>
          </ul>
          <AnimatePresence initial={false}>
            {completed.length ? (
              <motion.div key="completed" className="overflow-hidden" {...collapse(reduced)}>
                <button
                  type="button"
                  data-group-toggle=""
                  aria-expanded={state.groupOpen}
                  aria-controls={groupId}
                  onClick={() => dispatch({ type: 'group' })}
                  className="mt-0.5 grid min-h-11 w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 rounded-[1.625rem] pr-3 pl-16 text-left text-sm font-medium text-muted-foreground outline-none [-webkit-tap-highlight-color:transparent] transition-colors duration-160 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none"
                >
                  <span className="sr-only">{completed.length} completed</span>
                  <span className="inline-flex items-baseline" aria-hidden="true">
                    <RollingNumber value={completed.length} reduced={reduced} />
                    &nbsp;completed
                  </span>
                  <motion.span
                    className="grid place-items-center"
                    aria-hidden="true"
                    initial={false}
                    animate={{ rotate: state.groupOpen ? 0 : 180 }}
                    transition={reduced ? { duration: 0 } : SPRING_SNAPPY}
                  >
                    <ChevronUp size={16} strokeWidth={1.75} />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {state.groupOpen ? (
                    <motion.div
                      key="list"
                      id={groupId}
                      className="overflow-hidden"
                      {...collapse(reduced)}
                    >
                      <ul aria-label="Completed steps">
                        <AnimatePresence initial={false}>
                          {completed.map((step) => (
                            <CompletedItem
                              key={step.id}
                              step={step}
                              baseId={baseId}
                              reduced={reduced}
                              onToggle={() => uncheck(step.id, true)}
                            />
                          ))}
                        </AnimatePresence>
                      </ul>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </motion.div>
      <span className="sr-only" role="status">
        {state.message}
      </span>
    </section>
  )
}
