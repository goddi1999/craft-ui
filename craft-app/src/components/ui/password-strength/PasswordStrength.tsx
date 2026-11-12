import { useReducedMotion } from 'motion/react'
import { useId, useState, type ChangeEvent } from 'react'

import { cn } from '@/lib/utils'

import { LEVELS, WORDS } from './password-strength.constants'
import type { PasswordStrengthProps } from './password-strength.types'
import { scorePassword } from './password-strength.utils'
import { EyeToggle, StrengthBar, StrengthWord } from './password-strength-parts'

/**
 * A password field with four strength bars that fill one after another and walk from red
 * to green, a word that rises in with each new score, and an eye that draws its own slash.
 */
export function PasswordStrength({
  value: valueProp,
  defaultValue = '',
  onValueChange,
  visible: visibleProp,
  defaultVisible = false,
  onVisibleChange,
  label = 'Password',
  hint = '8+ chars, a number, a symbol',
  className,
  id,
  onChange,
  ...props
}: PasswordStrengthProps) {
  const [innerValue, setInnerValue] = useState(defaultValue)
  const [innerVisible, setInnerVisible] = useState(defaultVisible)
  const value = valueProp ?? innerValue
  const visible = visibleProp ?? innerVisible
  const reduced = useReducedMotion() === true
  const autoId = useId()
  const inputId = id ?? autoId
  const wordId = `${inputId}-strength`
  const hintId = `${inputId}-hint`

  const score = scorePassword(value)
  // every filled bar takes the colour of the current score; red while it is still too short
  const level = LEVELS[Math.max(0, score - 1)]
  const wordColor = score > 0 ? level.text : 'text-muted-foreground'

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event)
    if (valueProp === undefined) setInnerValue(event.target.value)
    onValueChange?.(event.target.value)
  }

  const handleToggle = () => {
    const next = !visible
    if (visibleProp === undefined) setInnerVisible(next)
    onVisibleChange?.(next)
  }

  return (
    <div data-slot="password-strength" className={cn('w-full max-w-80', className)}>
      <label htmlFor={inputId} className="mb-2 ml-1 block text-[13px] text-muted-foreground">
        {label}
      </label>
      <div className="flex h-[52px] items-center rounded-2xl bg-muted pr-1.5 pl-4 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring">
        <input
          autoComplete="new-password"
          spellCheck={false}
          {...props}
          id={inputId}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={handleChange}
          aria-describedby={`${wordId} ${hintId}`}
          className="min-w-0 flex-1 bg-transparent text-base tracking-[0.04em] text-foreground outline-none"
        />
        <EyeToggle
          visible={visible}
          controls={inputId}
          reduced={reduced}
          onToggle={handleToggle}
        />
      </div>
      <div className="mt-3 flex gap-1.5">
        {LEVELS.map((_, index) => (
          <StrengthBar
            key={index}
            index={index}
            filled={index < score}
            color={level.bar}
            reduced={reduced}
          />
        ))}
      </div>
      <div className="mt-2.5 flex justify-between gap-3 text-xs">
        <StrengthWord
          id={wordId}
          score={score}
          word={WORDS[score]}
          color={wordColor}
          reduced={reduced}
        />
        <span id={hintId} className="text-right text-muted-foreground">
          {hint}
        </span>
      </div>
    </div>
  )
}
