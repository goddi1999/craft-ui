import type { ComponentProps } from 'react'

import { cn } from '@/lib/utils'

import type { EmojiData } from './emoji-reaction.types'

type EmojiProps = Omit<ComponentProps<'img'>, 'src' | 'width' | 'height'> & {
  name: string
  data: EmojiData
  size: number
}

/**
 * One Apple emoji as a plain image, built from `baseUrl` + the file map —
 * stands in for `react-apple-emojis` so the folder has no extra dependency.
 * Decorative by default: the button around it carries the label.
 */
export function Emoji({ name, data, size, alt = '', className, ...props }: EmojiProps) {
  const file = data.emojis[name]
  if (!file) return null

  return (
    <img
      data-slot="emoji"
      src={`${data.baseUrl}${file}`}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      decoding="async"
      className={cn('max-w-none select-none', className)}
      {...props}
    />
  )
}
