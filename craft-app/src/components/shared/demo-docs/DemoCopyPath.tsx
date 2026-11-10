import { Check, Copy, Folder } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const COPIED_MS = 1600

type DemoCopyPathProps = {
  path: string
  className?: string
}

/** A file path with a copy button, for the Installation section. */
export function DemoCopyPath({ path, className }: DemoCopyPathProps) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const timer = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(timer)
  }, [copied])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(path)
    setCopied(true)
  }

  return (
    <div
      data-slot="demo-copy-path"
      className={cn(
        'flex items-center gap-3 rounded-lg border bg-muted/40 py-1.5 pr-1.5 pl-3',
        className,
      )}
    >
      <Folder aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <code className="min-w-0 flex-1 truncate font-mono text-[13px]">{path}</code>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={copied ? 'Copied' : `Copy path ${path}`}
        onClick={handleCopy}
        className="shrink-0 active:scale-[0.97] transition-transform duration-150"
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
    </div>
  )
}
