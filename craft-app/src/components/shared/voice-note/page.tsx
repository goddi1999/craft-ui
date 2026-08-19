import { DemoPage } from '../demo-page'

import { VoiceNote } from './VoiceNote'

export function VoiceNotePage() {
  return (
    <DemoPage
      eyebrow="shared / voice-note"
      title="Voice note"
      description="A recorder pill that grows out of a mic button. The side actions slide in from behind it, an SVG stroke counts the take down, and the timer rolls one digit at a time."
    >
      <VoiceNote maxDuration={12} />
    </DemoPage>
  )
}
