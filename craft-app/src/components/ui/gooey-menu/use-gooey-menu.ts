import { useEffect, useEffectEvent, useState, type KeyboardEvent, type RefObject } from 'react'

import { wrapIndex } from './gooey-menu.utils'

type UseGooeyMenuOptions = {
  rootRef: RefObject<HTMLDivElement | null>
  options: readonly string[]
  value?: string
  defaultValue?: string
  open?: boolean
  defaultOpen: boolean
  onOpenChange?: (open: boolean) => void
  onSelect?: (option: string, index: number) => void
}

/** Open state, selection, highlight and keyboard for the menu; open and value can be controlled. */
export function useGooeyMenu({
  rootRef,
  options,
  value,
  defaultValue,
  open: openProp,
  defaultOpen,
  onOpenChange,
  onSelect,
}: UseGooeyMenuOptions) {
  const [ownOpen, setOwnOpen] = useState(defaultOpen)
  const open = openProp ?? ownOpen

  const [ownSelected, setOwnSelected] = useState(() => defaultValue ?? options[0] ?? '')
  const selected = value ?? ownSelected
  const [activeIndex, setActiveIndex] = useState(() => Math.max(0, options.indexOf(selected)))

  // a new controlled value moves the highlight onto it
  const [syncedValue, setSyncedValue] = useState(value)
  if (value !== syncedValue) {
    setSyncedValue(value)
    const index = value === undefined ? -1 : options.indexOf(value)
    if (index !== -1) setActiveIndex(index)
  }

  const setOpen = (next: boolean) => {
    if (openProp === undefined) setOwnOpen(next)
    onOpenChange?.(next)
  }

  const choose = (index: number) => {
    const option = options[index]
    if (option !== undefined) {
      setOwnSelected(option)
      setActiveIndex(index)
      onSelect?.(option, index)
    }
    setOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const { key } = event
    if (!open) {
      if (key === 'Enter' || key === ' ' || key === 'ArrowDown') {
        event.preventDefault()
        setOpen(true)
      }
      return
    }

    if (key === 'Escape') {
      event.preventDefault()
      setOpen(false)
    } else if (options.length === 0) {
      return
    } else if (key === 'ArrowDown' || key === 'ArrowUp') {
      event.preventDefault()
      const step = key === 'ArrowDown' ? 1 : -1
      setActiveIndex((index) => wrapIndex(index, step, options.length))
    } else if (key === 'Enter' || key === ' ') {
      event.preventDefault()
      choose(activeIndex)
    }
  }

  const closeOutside = useEffectEvent((event: PointerEvent) => {
    if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
  })

  useEffect(() => {
    if (!open) return
    const listener = (event: PointerEvent) => closeOutside(event)
    window.addEventListener('pointerdown', listener)
    return () => window.removeEventListener('pointerdown', listener)
  }, [open])

  return {
    open,
    setOpen,
    selected,
    activeIndex,
    setActiveIndex,
    choose,
    handleKeyDown,
  }
}
