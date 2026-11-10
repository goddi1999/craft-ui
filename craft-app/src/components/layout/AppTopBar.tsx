import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

import { SwitchMode } from '@/components/shared'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type AppTopBarProps = {
  /** Where the back button goes. Omit to hide it (the home page). */
  backTo?: string
  backLabel?: string
  className?: string
}

/**
 * Fixed chrome on every page: an icon-only back button on the left, the
 * light/dark switch on the right. Blurred so it reads over any demo stage.
 */
export function AppTopBar({
  backTo,
  backLabel = 'All examples',
  className,
}: AppTopBarProps) {
  return (
    <div
      data-slot="app-top-bar"
      className={cn(
        'pointer-events-none fixed inset-x-0 top-0 z-[100000001] flex items-center justify-between p-4',
        className,
      )}
    >
      {backTo ? (
        <Button
          variant="outline"
          size="icon"
          asChild
          className="pointer-events-auto rounded-full bg-background/60 shadow-sm backdrop-blur-xl transition-transform duration-150 active:scale-[0.97]"
        >
          <Link to={backTo} aria-label={backLabel} title={backLabel}>
            <ArrowLeft aria-hidden="true" />
          </Link>
        </Button>
      ) : (
        <span />
      )}
      <SwitchMode
        size="xs"
        className="pointer-events-auto shadow-sm backdrop-blur-xl"
      />
    </div>
  )
}
