import { Moon, Sun } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'

import {
  DURATION,
  ICON_ANGLE,
  ICON_BLUR,
  ICON_EXIT,
  ICON_SCALE,
  ICON_SPRING,
} from './theme-switch.constants'
import type { ThemeSwitchTheme } from './theme-switch.types'

/** The sun and moon swap as one rotation rather than two fades. */
export function ThemeIcon({
  theme,
  reduced,
  settled,
}: {
  theme: ThemeSwitchTheme
  reduced: boolean
  settled: boolean
}) {
  const Icon = theme === 'light' ? Sun : Moon
  const angle = theme === 'light' ? ICON_ANGLE : -ICON_ANGLE
  const hidden = { opacity: 0, scale: ICON_SCALE, rotate: angle, filter: ICON_BLUR }

  return (
    <AnimatePresence initial={false} mode="popLayout">
      <motion.span
        key={theme}
        aria-hidden="true"
        className="absolute grid size-[18px] place-items-center"
        initial={!settled ? false : reduced ? { opacity: 0 } : hidden}
        animate={{ opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)' }}
        exit={
          !settled
            ? { opacity: 0, transition: { duration: 0 } }
            : reduced
              ? { opacity: 0, transition: { duration: DURATION.instant } }
              : { ...hidden, transition: ICON_EXIT }
        }
        transition={reduced ? { duration: DURATION.instant } : ICON_SPRING}
      >
        <Icon size={16} strokeWidth={1.75} />
      </motion.span>
    </AnimatePresence>
  )
}
