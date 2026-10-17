import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { DemoPage } from '../demo-page'

import { RefineFrame } from './RefineFrame'
import type { RefineFrameStatus } from './RefineFrame'

const STATUSES: RefineFrameStatus[] = [
  'queued',
  'generating',
  'refining',
  'complete',
  'error',
]

export function RefineFramePage() {
  const [status, setStatus] = useState<RefineFrameStatus>('generating')

  return (
    <DemoPage
      eyebrow="shared / refine-frame"
      title="Refine frame"
      description="A placeholder for generated media that resolves from a coarse mosaic to the finished image, with a status chip for each stage."
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 px-4">
        <RefineFrame
          status={status}
          width={360}
          onRetry={() => setStatus('generating')}
        >
          <img
            src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=720&q=80"
            alt="Mountain valley at sunrise"
            className="h-full w-full object-cover"
          />
        </RefineFrame>
        <div className="flex flex-wrap justify-center gap-2">
          {STATUSES.map((option) => (
            <Button
              key={option}
              size="sm"
              variant={option === status ? 'default' : 'outline'}
              onClick={() => setStatus(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    </DemoPage>
  )
}
