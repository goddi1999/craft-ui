import type { TocItem } from '@/components/ui/collapsible-toc'

export type DemoSection = TocItem & { body: string[]; list?: string[] }

// an invented setup guide, long enough to scroll through
export const DEMO_SECTIONS: DemoSection[] = [
  {
    id: 'toc-overview',
    label: 'Overview',
    body: [
      'This guide walks through wiring a basic keypad door controller so it accepts phone-based passes. The same setup works with any reader that speaks a standard card format.',
      'You will mount a small relay controller, power it and the reader from one supply, set the card number range, then swap the old keypad for an NFC reader without touching the rest of the door.',
    ],
  },
  {
    id: 'toc-prerequisites',
    label: 'Prerequisites',
    body: ['Before you start, have these within reach:'],
    list: [
      'A relay door controller with two inputs',
      'An NFC reader with a standard card output',
      'A 12V supply rated for both devices',
      'A pass issued to your phone',
      'Basic wiring tools and a multimeter',
    ],
  },
  {
    id: 'toc-power',
    label: 'Getting Power Wired',
    body: [
      'Both the controller and the reader need a stable 12V feed. Run one supply into the controller first, then branch a second pair to the reader so they share a ground.',
      'Check the polarity twice with the multimeter. A reversed reader usually survives; a reversed controller usually does not.',
    ],
  },
  {
    id: 'toc-mounting',
    label: 'Mounting the Reader',
    body: [
      'Fit the reader where the keypad was, using the old cable run. Most readers ship with a spacer that hides the larger keypad footprint.',
      'Keep the reader at least a hand-width away from metal frames; a steel door can halve its read range.',
    ],
  },
  {
    id: 'toc-programming',
    label: 'Programming the Controller',
    body: [
      'Put the controller in learning mode and set the card number range your passes will use. Write the range down; you will need it when you issue passes.',
      'Set the relay to pulse for three seconds. Longer pulses drain magnetic locks for no benefit.',
    ],
  },
  {
    id: 'toc-reader',
    label: 'Configuring Your Reader',
    body: [
      'Switch the reader to the 26-bit output and turn off its own beeper if the controller already chirps. Two beeps for one tap confuses people at the door.',
    ],
  },
  {
    id: 'toc-credentials',
    label: 'Issuing Credentials',
    body: [
      'Issue a pass inside the range you set, add it to your phone, and hold it to the reader. The relay should click on the first tap.',
      'If nothing happens, read the number the controller logged and compare it with the pass; an off-by-one range is the usual culprit.',
    ],
  },
  {
    id: 'toc-conclusion',
    label: 'Conclusion',
    body: [
      'That is the whole swap: one supply, one reader, one range. Keep the old keypad in a drawer for a while, just in case.',
    ],
  },
]
