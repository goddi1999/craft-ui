// TUFFUI (https://tuffui.com) · MIT License · Copyright (c) 2026 TUFFUI contributors
// Free to use. If it helps you, you can support it: https://ko-fi.com/yurigokoryan
import { DIGITS, EASE } from './rolling-number.utils'

type RollingNumberDigitProps = {
  digit: number
  delay: number
  instant: boolean
}

export function RollingNumberDigit({ digit, delay, instant }: RollingNumberDigitProps) {
  return (
    <span className="relative inline-block h-[1lh] overflow-hidden [mask-image:linear-gradient(transparent,black_22%,black_78%,transparent)]">
      {/* Sizes the wheel to one digit; tabular figures keep every digit equally wide. */}
      <span className="invisible">0</span>
      <span
        className="absolute inset-x-0 top-0 flex flex-col items-center"
        style={{
          transform: `translateY(${-digit * 10}%)`,
          transitionProperty: 'transform',
          transitionDuration: instant ? '0ms' : '600ms',
          transitionTimingFunction: EASE,
          transitionDelay: `${delay}ms`,
        }}
      >
        {Array.from(DIGITS, (d) => (
          <span key={d} className="h-[1lh]">
            {d}
          </span>
        ))}
      </span>
    </span>
  )
}
