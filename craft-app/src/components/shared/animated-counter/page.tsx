import { useState } from 'react'

import { Button } from '@/components/ui/button'

import { DemoPage } from '../demo-page'

import { AnimatedCounter } from './AnimatedCounter'

const INITIAL_AMOUNT = 128_450
const DONATION = 2_500

export function AnimatedCounterPage() {
  const [amount, setAmount] = useState(INITIAL_AMOUNT)

  return (
    <DemoPage
      eyebrow="shared / animated-counter"
      title="Animated counter"
      description="A number that springs to each new value, counting up when it scrolls into view."
    >
      <div className="flex flex-col items-center gap-8 px-4">
        <AnimatedCounter label="Raised" value={amount} prefix="$" animateOnView />
        <Button
          variant="outline"
          onClick={() => setAmount((current) => current + DONATION)}
        >
          Donate $2,500
        </Button>
      </div>
    </DemoPage>
  )
}
