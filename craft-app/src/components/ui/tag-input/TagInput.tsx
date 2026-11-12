import { AnimatePresence, useReducedMotion } from 'motion/react'
import { useId, useRef, useState, type KeyboardEvent } from 'react'

import { cn } from '@/lib/utils'

import { TagChip } from './tag-input-parts'
import type { TagInputProps } from './tag-input.types'

/**
 * A field that turns words into chips. Enter or a comma adds one: it grows from
 * nothing to the width of its word and pops in. The x shrinks a chip away and
 * the chips after it slide over.
 */
export function TagInput({
  value,
  defaultValue = [],
  onValueChange,
  label,
  description,
  placeholder = 'Add a tag',
  className,
  ...props
}: TagInputProps) {
  const reduced = useReducedMotion() ?? false
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const isControlled = value !== undefined
  const tags = isControlled ? value : uncontrolled
  // chips there at first render just sit there; any chip mounted later pops in
  const [firstTags] = useState(tags)
  const [draft, setDraft] = useState('')
  const [status, setStatus] = useState('')
  const input = useRef<HTMLInputElement>(null)
  const inputId = useId()
  const descriptionId = useId()

  const commit = (next: string[]) => {
    if (!isControlled) setUncontrolled(next)
    onValueChange?.(next)
  }

  const handleAdd = () => {
    const tag = draft.trim()
    if (!tag) {
      setDraft('')
      return
    }
    if (tags.some((existing) => existing.toLowerCase() === tag.toLowerCase())) {
      setStatus(`${tag} is already added`)
      return
    }
    commit([...tags, tag])
    setDraft('')
    setStatus(`Added ${tag}`)
  }

  const handleRemove = (tag: string, fromKeyboard: boolean) => {
    commit(tags.filter((existing) => existing !== tag))
    setStatus(`Removed ${tag}`)
    // the x button is gone, so keep keyboard focus in the field
    if (fromKeyboard) input.current?.focus()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      handleAdd()
    } else if (event.key === 'Backspace' && draft === '' && tags.length > 0) {
      handleRemove(tags[tags.length - 1], false)
    }
  }

  return (
    <div data-slot="tag-input" className={cn('w-full max-w-80', className)} {...props}>
      {label ? (
        <label htmlFor={inputId} className="mb-2 ml-1 block text-[13px] text-muted-foreground">
          {label}
        </label>
      ) : null}
      <div
        onClick={() => input.current?.focus()}
        className="flex min-h-[52px] cursor-text flex-wrap items-center gap-1.5 rounded-2xl bg-muted p-2 has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-ring"
      >
        <AnimatePresence initial={false}>
          {tags.map((tag) => (
            <TagChip
              key={tag}
              tag={tag}
              appear={tags !== firstTags}
              reduced={reduced}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
        <input
          ref={input}
          id={inputId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label={label ? undefined : placeholder}
          aria-describedby={description ? descriptionId : undefined}
          autoComplete="off"
          spellCheck={false}
          // 16px on phones so iOS does not zoom into the field
          className="h-8 min-w-[90px] flex-1 bg-transparent px-1.5 text-base text-foreground outline-none placeholder:text-muted-foreground sm:text-[15px]"
        />
      </div>
      {description ? (
        <p id={descriptionId} className="mt-2 ml-1 text-xs text-muted-foreground">
          {description}
        </p>
      ) : null}
      <p role="status" aria-live="polite" className="sr-only">
        {status}
      </p>
    </div>
  )
}
