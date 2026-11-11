import type { VariantProps } from 'class-variance-authority'
import type { ComponentPropsWithoutRef } from 'react'

import type { avatarRingsVariants } from './avatar-rings.variants'

export type RingTone = 'purple' | 'teal' | 'red' | 'indigo' | 'blue' | 'green' | 'orange' | 'pink'

export type AvatarRingItem = {
  id: string
  src: string
  name: string
  /** Ring colour; omitted items cycle through the tones in order. */
  ring?: RingTone
}

export type AvatarRingsProps = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> &
  VariantProps<typeof avatarRingsVariants> & {
    items: AvatarRingItem[]
    /** Ring thickness in px. Default 4. */
    ringWidth?: number
    /** Px each avatar tucks under the previous one; 0 = tight touching row. */
    overlap?: number
    /** Show at most this many avatars, then a "+N" chip. */
    max?: number
    /** Controlled selection. Passing `onSelectedChange` makes the row a picker. */
    selectedId?: string | null
    defaultSelectedId?: string | null
    onSelectedChange?: (id: string) => void
    /** Makes the row a radiogroup even without a selection handler. */
    selectable?: boolean
    /** Accessible name for the group. */
    label?: string
  }
