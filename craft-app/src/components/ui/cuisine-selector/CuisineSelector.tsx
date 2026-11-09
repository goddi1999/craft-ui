import { CircleCheck } from 'lucide-react'
import { useId, useState, type FormEvent } from 'react'

import { cn } from '@/lib/utils'

import './cuisine-selector.css'

export const CUISINES = [
  'Italian',
  'Chinese',
  'Indian',
  'American',
  'Mexican',
  'Japanese',
  'Thai',
  'Turkish',
  'Greek',
  'Spanish',
  'Mediterranean',
  'British',
  'Korean',
  'Vietnamese',
  'French',
  'Caribbean',
  'Lebanese',
  'Brazilian',
  'Ethiopian',
  'German',
  'Cuban',
  'Moroccan',
  'Russian',
  'Argentinian',
  'Peruvian',
  'Filipino',
] as const

export type CuisineSelectorProps = {
  /** Chip labels. @default CUISINES */
  options?: readonly string[]
  /** Controlled selected values. */
  value?: string[]
  /** Initial selection when uncontrolled. @default [] */
  defaultValue?: string[]
  /** Called whenever the selection changes. */
  onChange?: (value: string[]) => void
  /** Fieldset legend text. @default 'What are your favorite cuisines?' */
  legend?: string
  /** Extra classes for the root form. */
  className?: string
}

export function CuisineSelector({
  options = CUISINES,
  value,
  defaultValue = [],
  onChange,
  legend = 'What are your favorite cuisines?',
  className,
}: CuisineSelectorProps) {
  const baseId = useId()
  const isControlled = value !== undefined
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const selected = isControlled ? value : uncontrolled

  const commit = (next: string[]) => {
    if (!isControlled) setUncontrolled(next)
    onChange?.(next)
  }

  const handleToggle = (option: string, checked: boolean) => {
    if (checked) {
      commit([...selected, option])
      return
    }
    commit(selected.filter((item) => item !== option))
  }

  const handleReset = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    commit([])
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <form
      data-slot="cuisine-selector"
      className={cn(className)}
      onSubmit={handleSubmit}
      onReset={handleReset}
    >
      <fieldset>
        <legend>{legend}</legend>
        <ul>
          {options.map((option) => {
            const inputId = `${baseId}-${option}`
            const checked = selected.includes(option)

            return (
              <li key={option}>
                <label htmlFor={inputId}>
                  <span>{option}</span>
                  <span aria-hidden="true">
                    <CircleCheck className="size-4" absoluteStrokeWidth />
                  </span>
                  <input
                    id={inputId}
                    className="sr-only"
                    type="checkbox"
                    name="cuisine"
                    value={option}
                    checked={checked}
                    onChange={(event) =>
                      handleToggle(option, event.target.checked)
                    }
                  />
                </label>
              </li>
            )
          })}
        </ul>
      </fieldset>
      <button type="reset">Reset</button>
    </form>
  )
}
