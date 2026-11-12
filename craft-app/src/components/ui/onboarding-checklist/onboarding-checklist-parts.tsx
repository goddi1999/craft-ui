import { ArrowRight } from 'lucide-react'
import { AnimatePresence, motion, useIsPresent } from 'motion/react'
import type { Transition } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { cn } from '@/lib/utils'

import {
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  FADE,
  RISE,
  ROLL,
  SPRING_MORPH,
  SPRING_SNAPPY,
} from './onboarding-checklist.constants'
import type { OnboardingStep } from './onboarding-checklist.types'
import { collapse, iconSwap } from './onboarding-checklist.utils'

const FOCUS = 'outline-none focus-visible:ring-2 focus-visible:ring-ring'
const NO_TAP = '[-webkit-tap-highlight-color:transparent]'

/** Every label the slot can show sits invisibly underneath, so a swap never changes the slot's size. */
export function SwapText({
  text,
  options,
  reduced,
}: {
  text: string
  options: string[]
  reduced: boolean
}) {
  return (
    <span className="relative inline-grid max-w-full align-top" aria-hidden="true">
      {options.map((option) => (
        <span key={option} className="invisible col-start-1 row-start-1">
          {option}
        </span>
      ))}
      <AnimatePresence mode="popLayout" initial={false} custom={1}>
        <motion.span
          key={text}
          className="col-start-1 row-start-1"
          custom={1}
          variants={reduced ? FADE : RISE}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {text}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** Digits turn in the direction the count moved, one column per place value. */
export function RollingNumber({ value, reduced }: { value: number; reduced: boolean }) {
  const [track, setTrack] = useState({ value, direction: 1 })
  if (track.value !== value) setTrack({ value, direction: value > track.value ? 1 : -1 })
  const digits = String(value).split('')

  return (
    <span className="inline-flex tabular-nums" aria-hidden="true">
      <AnimatePresence initial={false} custom={track.direction}>
        {digits.map((digit, index) => (
          // places clip sideways only, so a narrowing column never shows half a digit and a turning digit is never cut
          <motion.span
            key={digits.length - 1 - index}
            className="relative inline-block overflow-x-clip"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { width: SPRING_MORPH, opacity: { duration: DURATION.fast } }
            }
          >
            <AnimatePresence mode="popLayout" initial={false} custom={track.direction}>
              <motion.span
                key={digit}
                className="inline-block"
                custom={track.direction}
                variants={reduced ? FADE : ROLL}
                initial="enter"
                animate="center"
                exit="exit"
              >
                {digit}
              </motion.span>
            </AnimatePresence>
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  )
}

/** The arc fills on a spring as steps are checked; once every step is done a tick draws in its center. */
export function ProgressRing({
  done,
  total,
  reduced,
}: {
  done: number
  total: number
  reduced: boolean
}) {
  const ratio = total ? done / total : 0
  const complete = total > 0 && done === total

  return (
    <span
      className="relative grid size-10 text-primary"
      role="progressbar"
      aria-label="Setup progress"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-valuetext={`${done} of ${total} steps done`}
    >
      <svg
        className="col-start-1 row-start-1 size-10"
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
      >
        <circle className="stroke-border" cx="20" cy="20" r="17" strokeWidth={3} />
        <g transform="rotate(-90 20 20)">
          <motion.circle
            className="stroke-primary"
            cx="20"
            cy="20"
            r="17"
            strokeWidth={3}
            strokeLinecap="round"
            initial={false}
            animate={{ pathLength: ratio, opacity: ratio > 0 ? 1 : 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : { pathLength: SPRING_MORPH, opacity: { duration: DURATION.instant } }
            }
          />
        </g>
      </svg>
      <AnimatePresence initial={false}>
        {complete ? (
          <motion.svg
            key="tick"
            className="col-start-1 row-start-1 size-10"
            viewBox="0 0 40 40"
            fill="none"
            aria-hidden="true"
            {...iconSwap(reduced)}
          >
            <motion.path
              d="M13.5 20.5 18 25l8.5-9.5"
              stroke="currentColor"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduced ? false : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: DURATION.standard, ease: EASE_ENTER, delay: 0.12 }}
            />
          </motion.svg>
        ) : null}
      </AnimatePresence>
    </span>
  )
}

/** The fill grows from the center while the tick draws from its short stroke; unchecking retracts both quickly. */
export function CheckButton({
  checked,
  labelledBy,
  onToggle,
  reduced,
}: {
  checked: boolean
  labelledBy: string
  onToggle: () => void
  reduced: boolean
}) {
  const quick: Transition = { duration: DURATION.fast, ease: EASE_STANDARD }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      data-check=""
      onClick={onToggle}
      className={cn(
        'group/check grid size-10 cursor-pointer place-items-center rounded-full text-primary-foreground',
        FOCUS,
        NO_TAP,
      )}
    >
      {/* only the circle answers a press, so the row and its label never move */}
      <span
        aria-hidden="true"
        className={cn(
          'relative block size-[22px] rounded-full border-[1.5px] bg-card [transition:border-color_160ms_cubic-bezier(.22,1,.36,1),scale_580ms_var(--onboarding-spring)] group-active/check:scale-[.92] group-active/check:[transition:border-color_160ms_cubic-bezier(.22,1,.36,1),scale_110ms_cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none motion-reduce:group-active/check:scale-100',
          checked ? 'border-primary' : 'border-foreground/20 group-hover/check:border-muted-foreground',
        )}
      >
        <motion.span
          className="absolute -inset-[1.5px] rounded-[inherit] bg-primary"
          initial={false}
          animate={{ scale: checked ? 1 : 0.6, opacity: checked ? 1 : 0 }}
          transition={
            reduced
              ? { duration: 0 }
              : {
                  scale: SPRING_SNAPPY,
                  opacity: { duration: checked ? DURATION.instant : DURATION.fast },
                }
          }
        />
        <svg className="absolute -inset-[1.5px] size-[22px]" viewBox="0 0 22 22" fill="none">
          <motion.path
            d="M6.75 11.25 9.75 14.25 15.25 8.25"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={false}
            animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
            transition={
              reduced
                ? { duration: 0 }
                : checked
                  ? {
                      pathLength: { duration: DURATION.standard, ease: EASE_ENTER, delay: 0.05 },
                      opacity: { duration: 0.05, delay: 0.05 },
                    }
                  : { pathLength: quick, opacity: quick }
            }
          />
        </svg>
      </span>
    </button>
  )
}

function ActionIcon({ state, reduced }: { state: 'idle' | 'pending' | 'done'; reduced: boolean }) {
  const icon: ReactNode =
    state === 'pending' ? (
      <span className="size-3.5 animate-spin rounded-full border-[1.5px] border-current border-r-transparent [animation-duration:700ms] motion-reduce:animate-none" />
    ) : state === 'done' ? (
      <svg
        width={16}
        height={16}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <motion.path
          d="M5 12.5l4.5 4.5L19 7.5"
          initial={reduced ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: DURATION.standard, ease: EASE_ENTER, delay: 0.05 }}
        />
      </svg>
    ) : (
      <ArrowRight size={16} strokeWidth={1.75} />
    )

  return (
    <span className="grid size-4 place-items-center" aria-hidden="true">
      <AnimatePresence initial={false}>
        <motion.span
          key={state}
          className="col-start-1 row-start-1 grid size-4 place-items-center"
          {...iconSwap(reduced)}
        >
          {icon}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/** The strike is a one pixel line of the text colour that draws across, line by line when a title wraps; unchecking wipes it back quickly. */
function TitleText({ id, done, children }: { id: string; done: boolean; children: ReactNode }) {
  return (
    <span
      id={id}
      className={cn(
        'bg-[linear-gradient(currentColor,currentColor)] bg-[position:0_60%] bg-no-repeat motion-reduce:transition-none',
        done
          ? 'bg-[length:100%_1px] text-muted-foreground [transition:background-size_480ms_cubic-bezier(.16,1,.3,1)_80ms,color_240ms_cubic-bezier(.22,1,.36,1)]'
          : 'bg-[length:0%_1px] [transition:background-size_160ms_cubic-bezier(.22,1,.36,1),color_240ms_cubic-bezier(.22,1,.36,1)]',
      )}
    >
      {children}
    </span>
  )
}

type StepItemProps = {
  step: OnboardingStep
  baseId: string
  done: boolean
  expanded: boolean
  pending: boolean
  error?: string
  reduced: boolean
  onToggle: () => void
  onExpand: () => void
  onRun: () => void
}

export function StepItem({
  step,
  baseId,
  done,
  expanded,
  pending,
  error,
  reduced,
  onToggle,
  onExpand,
  onRun,
}: StepItemProps) {
  const present = useIsPresent()
  const titleId = `${baseId}-${step.id}-title`
  const panelId = `${baseId}-${step.id}-panel`
  const actionState = done ? 'done' : pending ? 'pending' : 'idle'

  // a leaving step is inert, so neither Tab nor the arrow keys land on it while it folds away
  return (
    <motion.li
      className="overflow-hidden"
      data-step={step.id}
      data-done={done || undefined}
      data-current={expanded || undefined}
      data-leaving={present ? undefined : ''}
      inert={!present}
      {...collapse(reduced)}
    >
      <div
        className={cn(
          'grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 rounded-[1.625rem] px-3 py-1 transition-colors duration-240 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none',
          expanded ? 'bg-muted' : 'hover:bg-muted/60',
        )}
      >
        <CheckButton checked={done} labelledBy={titleId} onToggle={onToggle} reduced={reduced} />
        <div className="grid min-w-0">
          <button
            type="button"
            data-title=""
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={onExpand}
            className={cn(
              'flex min-h-10 w-full cursor-pointer items-center rounded-[10px] text-left text-sm leading-[1.4] font-medium text-foreground',
              FOCUS,
              NO_TAP,
            )}
          >
            <TitleText id={titleId} done={done}>
              {step.title}
            </TitleText>
          </button>
          <AnimatePresence initial={false}>
            {expanded ? (
              <motion.div
                key="panel"
                id={panelId}
                role="region"
                aria-labelledby={titleId}
                className="overflow-hidden"
                {...collapse(reduced)}
              >
                <div className="pb-3">
                  {step.description ? (
                    <p className="-mt-1 max-w-[46ch] text-sm leading-[1.4] text-muted-foreground">
                      {step.description}
                    </p>
                  ) : null}
                  <AnimatePresence initial={false}>
                    {error ? (
                      <motion.div key="error" className="overflow-hidden" {...collapse(reduced)}>
                        <p className="pt-2 text-sm leading-[1.4] text-destructive" role="alert">
                          {error}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                  {step.actionLabel ? (
                    <button
                      type="button"
                      data-primary=""
                      data-state={actionState}
                      aria-disabled={actionState !== 'idle' || undefined}
                      aria-busy={pending || undefined}
                      onClick={onRun}
                      className={cn(
                        'mt-3 inline-flex min-h-9 items-center gap-2 rounded-[1.125rem] bg-primary pr-3 pl-4 text-sm font-medium whitespace-nowrap text-primary-foreground [transition:box-shadow_160ms_cubic-bezier(.22,1,.36,1),scale_580ms_var(--onboarding-spring)] motion-reduce:transition-none',
                        FOCUS,
                        NO_TAP,
                        actionState === 'idle' &&
                          'cursor-pointer hover:shadow-xs active:scale-[.97] active:[transition:box-shadow_160ms_cubic-bezier(.22,1,.36,1),scale_100ms_cubic-bezier(.22,1,.36,1)] motion-reduce:active:scale-100',
                        actionState === 'pending' && 'cursor-progress',
                        actionState === 'done' && 'cursor-default',
                      )}
                    >
                      {step.actionLabel}
                      <ActionIcon state={actionState} reduced={reduced} />
                    </button>
                  ) : null}
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.li>
  )
}

export function CompletedItem({
  step,
  baseId,
  reduced,
  onToggle,
}: {
  step: OnboardingStep
  baseId: string
  reduced: boolean
  onToggle: () => void
}) {
  const present = useIsPresent()
  const titleId = `${baseId}-${step.id}-done`

  return (
    <motion.li
      className="overflow-hidden"
      data-completed-step={step.id}
      data-done=""
      inert={!present}
      {...collapse(reduced)}
    >
      <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 rounded-[1.625rem] px-3 py-1 transition-colors duration-240 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-muted/60 motion-reduce:transition-none">
        <CheckButton checked labelledBy={titleId} onToggle={onToggle} reduced={reduced} />
        <span className="flex min-h-10 min-w-0 items-center text-sm leading-[1.4] font-medium">
          <TitleText id={titleId} done>
            {step.title}
          </TitleText>
        </span>
      </div>
    </motion.li>
  )
}
