import { PictureInPicture2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { FauxPipVideoToggleProps } from './faux-pip-video.types'

export function FauxPipVideoToggle({
  isPipEnabled,
  onToggle,
}: FauxPipVideoToggleProps) {
  return (
    <Button
      type="button"
      size="icon"
      variant={isPipEnabled ? 'default' : 'secondary'}
      className="rounded-full"
      data-slot="faux-pip-video-toggle"
      aria-label="Toggle picture-in-picture"
      aria-pressed={isPipEnabled}
      onClick={onToggle}
    >
      <PictureInPicture2 />
    </Button>
  )
}
