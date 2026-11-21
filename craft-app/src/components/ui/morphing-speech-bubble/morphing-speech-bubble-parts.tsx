import { ChevronDown, ChevronUp } from 'lucide-react'

import { STEP_BUTTON, STEPPER } from './morphing-speech-bubble.constants'

type MessageStepperProps = {
  onPrevious?: () => void
  onNext?: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

/** Vertical previous / next pair: round, ghost, always neutral so it never competes with the bubble colour. */
export function MessageStepper({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: MessageStepperProps) {
  return (
    <div data-slot="morphing-speech-bubble-stepper" className={STEPPER}>
      <button
        type="button"
        aria-label="Previous message"
        onClick={onPrevious}
        disabled={!onPrevious || !canGoPrevious}
        className={STEP_BUTTON}
      >
        <ChevronUp className="size-4" aria-hidden />
      </button>
      <button
        type="button"
        aria-label="Next message"
        onClick={onNext}
        disabled={!onNext || !canGoNext}
        className={STEP_BUTTON}
      >
        <ChevronDown className="size-4" aria-hidden />
      </button>
    </div>
  )
}
