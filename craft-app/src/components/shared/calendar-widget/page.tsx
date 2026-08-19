import { DemoPage } from '../demo-page'

import { CalendarWidget } from './CalendarWidget'
import type { CalendarEventMap } from './calendar-widget.types'

const START_DATE = '2024-09-01'

const EVENTS: CalendarEventMap = {
  '2024-09-02': [
    { title: 'Design review', time: '9:00 — 10:00 AM' },
    { title: 'Standup', time: '10:30 AM' },
  ],
  '2024-09-05': [{ title: 'Ship the release', time: 'All day' }],
  '2024-09-09': [
    { title: 'Onboarding call', time: '11:00 AM' },
    { title: 'Pairing session', time: '2:00 — 4:00 PM' },
    { title: 'Retro', time: '5:00 PM' },
  ],
  '2024-09-14': [{ title: 'Conference talk', time: '1:00 PM' }],
  '2024-09-21': [{ title: 'Team offsite', time: 'All day' }],
}

export function CalendarWidgetPage() {
  return (
    <DemoPage
      eyebrow="shared / calendar-widget"
      title="Calendar widget"
      description="A draggable date strip over an agenda pane. The selection pill travels between days as a shared layout element, and the month label re-animates whenever the strip crosses into a new one."
    >
      <CalendarWidget
        events={EVENTS}
        startDate={START_DATE}
        defaultSelectedDate="2024-09-02"
      />
    </DemoPage>
  )
}
