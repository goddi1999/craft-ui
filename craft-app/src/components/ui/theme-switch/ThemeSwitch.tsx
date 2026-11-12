import { motion, useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'

import {
  BUTTON,
  ICON_ONLY,
  LABELLED,
  NUDGE,
  PRESS,
  PRESS_SCALE,
  SPRING_EASE,
  SPRING_SNAPPY,
} from './theme-switch.constants'
import type { ThemeSwitchProps } from './theme-switch.types'
import { ThemeIcon } from './theme-switch-parts'
import { useSettled } from './use-settled'

/**
 * A secondary button that swaps a sun and moon and reports the next theme. The caller applies
 * it, usually inside a view transition named by `variant`; the icon leans the way that
 * transition travels. Adapted from uiarc.
 */
export function ThemeSwitch({
  theme,
  variant = 'reveal',
  onThemeChange,
  label,
  iconOnly = false,
  className,
}: ThemeSwitchProps) {
  const reduced = useReducedMotion() === true
  const settled = useSettled()
  const next = theme === 'light' ? 'dark' : 'light'
  const press = iconOnly ? PRESS_SCALE.icon : PRESS_SCALE.label

  return (
    <motion.button
      type="button"
      data-slot="theme-switch"
      data-theme={theme}
      data-variant={variant}
      aria-label={label ?? `Switch to ${next} mode`}
      aria-pressed={theme === 'dark'}
      onClick={(event) => onThemeChange(next, variant, event.currentTarget)}
      whileTap={reduced ? undefined : { scale: press, transition: PRESS }}
      transition={SPRING_SNAPPY}
      style={{ '--theme-switch-spring': SPRING_EASE } as CSSProperties}
      className={cn(BUTTON, iconOnly ? ICON_ONLY : LABELLED, className)}
    >
      {/* the nudge only eases once settled, so a theme that lands on mount moves nothing */}
      <span
        className={cn(
          'relative inline-grid size-5 flex-none place-items-center',
          settled &&
            'transition-[scale,translate] duration-580 ease-(--theme-switch-spring) motion-reduce:transition-none',
          theme === 'dark' && NUDGE[variant],
        )}
      >
        <ThemeIcon theme={theme} reduced={reduced} settled={settled} />
      </span>
      {iconOnly ? null : <span className="whitespace-nowrap">Switch theme</span>}
    </motion.button>
  )
}
