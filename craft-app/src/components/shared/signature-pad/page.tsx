import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { DemoPage } from '../demo-page'

import { SignaturePad } from './SignaturePad'
import { signatureToSvg } from './signature-pad.utils'
import type { InkStroke } from './signature-pad.utils'

export function SignaturePadPage() {
  const [strokes, setStrokes] = useState<InkStroke[]>([])
  const [signedSvg, setSignedSvg] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSignedSvg(signatureToSvg(strokes))
  }

  return (
    <DemoPage
      eyebrow="shared / signature-pad"
      title="Signature pad"
      description="Smooth ink that thins with speed, with undo, replay, and PNG or SVG export. Press Cmd/Ctrl+Z to undo, add Shift to redo, and Delete to clear."
    >
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl flex-col items-center gap-6 px-4"
      >
        <SignaturePad
          signer="Emma Collins"
          fileName="emma-signature"
          onChange={setStrokes}
          className="w-full"
        />
        <Button type="submit" disabled={!strokes.length}>
          Adopt and sign
        </Button>
        {signedSvg ? (
          <p className="text-sm text-muted-foreground">
            Signed: {strokes.length} strokes, {signedSvg.length} bytes of SVG.
          </p>
        ) : null}
      </form>
    </DemoPage>
  )
}
