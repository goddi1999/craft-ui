import { motion } from 'motion/react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

import { cn } from '@/lib/utils'

import {
  switchModeIconVariants,
  switchModeKnobVariants,
  switchModeVariants,
} from './switch-mode-variants'
import type { SwitchModeProps } from './switch-mode.types'

/**
 * A day/night toggle whose knob slides between the two ends as a layout
 * animation, so it stays put regardless of the size variant in play.
 */
export function SwitchMode({ size = 'default', className }: SwitchModeProps) {
  const { resolvedTheme, setTheme } = useTheme()

  // next-themes resolves the active theme after mount, so the first paint gets
  // a same-size placeholder rather than a switch pointing the wrong way.
  if (!resolvedTheme) {
    return (
      <div
        aria-hidden
        className={cn(
          switchModeVariants({ size }),
          'border-transparent bg-transparent dark:border-transparent dark:bg-transparent',
          className,
        )}
      />
    )
  }

  const isDark = resolvedTheme === 'dark'
  const handleToggleTheme = () => setTheme(isDark ? 'light' : 'dark')

  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Toggle dark mode"
      onClick={handleToggleTheme}
      className={cn(switchModeVariants({ size }), className)}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={switchModeKnobVariants({ side: isDark ? 'right' : 'left' })}
      />

      <motion.span
        className={switchModeIconVariants({ size })}
        animate={{ rotate: isDark ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <Sun
          className={cn(
            'transition-colors duration-200',
            isDark ? 'text-[#8A8A8F]' : 'fill-[#686771] text-[#686771]',
          )}
        />
      </motion.span>

      <motion.span
        className={switchModeIconVariants({ size })}
        animate={{ rotate: isDark ? 0 : 15 }}
        transition={{ type: 'spring', stiffness: 120, damping: 14 }}
      >
        <Moon
          className={cn(
            'transition-colors duration-200',
            isDark ? 'fill-[#F4F4FB] text-[#F4F4FB]' : 'text-[#ABABB4]',
          )}
        />
      </motion.span>
    </motion.button>
  )
}
