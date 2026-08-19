import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, type Variants } from 'motion/react'

import { cn } from '@/lib/utils'

type AnimatedNumberProps = {
  value: number
  className?: string
}

const digitVariants: Variants = {
  initial: (direction: number) => ({
    y: direction > 0 ? 8 : -8,
    opacity: 0,
    scale: 0.5,
    filter: 'blur(2px)',
  }),
  animate: { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)' },
  exit: (direction: number) => ({
    y: direction > 0 ? -8 : 8,
    opacity: 0,
    scale: 0.5,
    filter: 'blur(2px)',
  }),
}

/**
 * Rolls each digit independently. A digit only re-animates when its own
 * character changes, so `19 -> 20` moves the tens and units, `18 -> 19` only
 * the units.
 */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const [direction, setDirection] = useState(0)
  const previousValueRef = useRef(value)

  useEffect(() => {
    const previous = previousValueRef.current
    if (value > previous) setDirection(1)
    else if (value < previous) setDirection(-1)
    previousValueRef.current = value
  }, [value])

  const digits = value.toString().split('')

  const [previousDigits, setPreviousDigits] = useState<string[]>([])
  const [digitTicks, setDigitTicks] = useState<number[]>([])

  // Digits are aligned from the right, so a number growing a place doesn't
  // make every existing digit look like it changed.
  const lengthDiff = digits.length - previousDigits.length
  const nextTicks = digits.map((digit, index) => {
    const previousIndex = index - lengthDiff
    const previousDigit =
      previousIndex >= 0 ? previousDigits[previousIndex] : undefined
    const previousTick = previousIndex >= 0 ? (digitTicks[previousIndex] ?? 0) : 0
    return digit === previousDigit ? previousTick : previousTick + 1
  })

  if (previousDigits.join('') !== digits.join('')) {
    setPreviousDigits(digits)
    setDigitTicks(nextTicks)
  }

  return (
    <div
      className={cn(
        'relative flex items-center justify-center gap-1 tabular-nums',
        className,
      )}
    >
      {digits.map((digit, index) => (
        <div key={`${index}-${digits.length}`} className="relative w-3">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.span
              layout
              key={nextTicks[index]}
              custom={direction}
              variants={digitVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 16,
                mass: 1.2,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {digit}
            </motion.span>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
