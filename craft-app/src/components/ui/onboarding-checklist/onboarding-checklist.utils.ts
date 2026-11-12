import {
  BLUR_SUBTLE,
  DURATION,
  EASE_ENTER,
  EASE_STANDARD,
  SPRING_SMOOTH,
  SPRING_SNAPPY,
} from './onboarding-checklist.constants'
import type {
  ChecklistAction,
  ChecklistState,
  OnboardingStep,
} from './onboarding-checklist.types'

const ordered = (ids: string[], steps: OnboardingStep[]) =>
  steps.map((step) => step.id).filter((id) => ids.includes(id))
const without = (ids: string[], id: string) => ids.filter((item) => item !== id)
const omit = (errors: Record<string, string>, id: string) =>
  Object.fromEntries(Object.entries(errors).filter(([key]) => key !== id))
const titleOf = (steps: OnboardingStep[], id: string) =>
  steps.find((step) => step.id === id)?.title ?? 'Step'

export function init({
  steps,
  completed,
  hidden,
}: {
  steps: OnboardingStep[]
  completed: string[]
  hidden: boolean
}): ChecklistState {
  const done = ordered(completed, steps)
  return {
    done,
    settled: done,
    expanded: steps.find((step) => !done.includes(step.id))?.id ?? null,
    pending: [],
    errors: {},
    groupOpen: false,
    hidden,
    message: '',
  }
}

export function reducer(state: ChecklistState, action: ChecklistAction): ChecklistState {
  switch (action.type) {
    case 'check': {
      if (state.done.includes(action.id)) return state
      const done = ordered([...state.done, action.id], action.steps)
      const total = action.steps.length
      return {
        ...state,
        done,
        pending: without(state.pending, action.id),
        errors: omit(state.errors, action.id),
        message:
          done.length === total
            ? `All ${total} steps done.`
            : `${titleOf(action.steps, action.id)} done. ${done.length} of ${total} complete.`,
      }
    }
    case 'uncheck': {
      if (!state.done.includes(action.id)) return state
      const done = without(state.done, action.id)
      return {
        ...state,
        done,
        settled: without(state.settled, action.id),
        expanded: state.expanded ?? action.id,
        message: `${titleOf(action.steps, action.id)} marked as not done. ${done.length} of ${action.steps.length} complete.`,
      }
    }
    case 'settle': {
      if (!state.done.includes(action.id) || state.settled.includes(action.id)) return state
      let expanded = state.expanded
      // the step that just finished hands the open panel to the next unfinished step, wrapping to the top
      if (expanded === action.id) {
        const order = action.steps.map((step) => step.id)
        const start = order.indexOf(action.id)
        expanded =
          order
            .map((_, offset) => order[(start + offset + 1) % order.length]!)
            .find((id) => !state.done.includes(id)) ?? null
      }
      return { ...state, settled: ordered([...state.settled, action.id], action.steps), expanded }
    }
    case 'expand':
      return { ...state, expanded: state.expanded === action.id ? null : action.id }
    case 'start':
      return {
        ...state,
        pending: [...without(state.pending, action.id), action.id],
        errors: omit(state.errors, action.id),
      }
    case 'fail':
      return {
        ...state,
        pending: without(state.pending, action.id),
        errors: { ...state.errors, [action.id]: action.message },
        message: action.message,
      }
    case 'group':
      return { ...state, groupOpen: !state.groupOpen }
    case 'hide':
      return { ...state, hidden: !state.hidden }
  }
}

/** Rows open and close their height on a spring that never overshoots; closing is a little quicker than opening. */
export const collapse = (reduced: boolean) => ({
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: reduced
      ? { height: { duration: 0 }, opacity: { duration: 0.15 } }
      : {
          height: SPRING_SMOOTH,
          opacity: { duration: DURATION.standard, ease: EASE_ENTER, delay: 0.04 },
        },
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: reduced
      ? { duration: 0 }
      : {
          height: { ...SPRING_SMOOTH, visualDuration: 0.32 },
          opacity: { duration: DURATION.fast, ease: EASE_STANDARD },
        },
  },
})

/** Icons swap by shrinking out of a blur and popping back in on a spring. */
export const iconSwap = (reduced: boolean) =>
  reduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.15 } },
        exit: { opacity: 0, transition: { duration: 0.1 } },
      }
    : {
        initial: { opacity: 0, scale: 0.6, filter: `blur(${BLUR_SUBTLE}px)` },
        animate: {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            scale: SPRING_SNAPPY,
            opacity: { duration: DURATION.fast, ease: EASE_ENTER },
            filter: { duration: DURATION.fast, ease: EASE_ENTER },
          },
        },
        exit: {
          opacity: 0,
          scale: 0.6,
          filter: `blur(${BLUR_SUBTLE}px)`,
          transition: { duration: 0.12, ease: EASE_STANDARD },
        },
      }
