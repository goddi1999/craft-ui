import { useState } from 'react'

import { DemoPage } from '../demo-page'

import { FolderFloat } from './FolderFloat'

const NOTES = ['Roadmap', 'Q3 goals', 'Design review', 'Launch plan', 'Retro']

export function FolderFloatPage() {
  const [picked, setPicked] = useState<string | null>(null)

  return (
    <DemoPage
      eyebrow="shared / folder-float"
      title="Folder float"
      description="Hover the folder and its notes float out, drifting on a soft physics sim. Drag them around, then pick one."
    >
      <div className="flex flex-col items-center gap-10 px-4 pt-40">
        <FolderFloat
          items={NOTES}
          label="Notes"
          onSelect={(value) => setPicked(value)}
        />
        <p className="text-sm text-muted-foreground">
          {picked ? `Opened: ${picked}` : 'Hover or click the folder.'}
        </p>
      </div>
    </DemoPage>
  )
}
