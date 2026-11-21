import { DemoControlLabel } from '@/components/shared/demo-controls'
import {
  SPEECH_BUBBLE_TONES,
  speechBubbleVariants,
  type SpeechBubbleTone,
} from '@/components/ui/speech-bubble'
import { cn } from '@/lib/utils'

type ToneSwatchesProps = {
  value: SpeechBubbleTone
  onChange: (tone: SpeechBubbleTone) => void
}

/** Demo-only colour picker: one swatch per speech-bubble tone, drawn from the variant itself. */
export function ToneSwatches({ value, onChange }: ToneSwatchesProps) {
  return (
    <div className="flex flex-col gap-2">
      <DemoControlLabel>Colour · {value}</DemoControlLabel>
      <div role="radiogroup" aria-label="Colour" className="grid grid-cols-8 gap-2">
        {SPEECH_BUBBLE_TONES.map((tone) => (
          <button
            key={tone}
            type="button"
            role="radio"
            aria-checked={tone === value}
            aria-label={tone}
            title={tone}
            onClick={() => onChange(tone)}
            className={cn(
              speechBubbleVariants({ tone }),
              'size-6 rounded-full bg-(--speech-bubble-bg) ring-1 ring-black/10 ring-inset transition-transform duration-150 ease-out outline-none active:scale-90 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:active:scale-100',
              tone === value && 'outline-2 outline-offset-2 outline-foreground',
            )}
          />
        ))}
      </div>
    </div>
  )
}
