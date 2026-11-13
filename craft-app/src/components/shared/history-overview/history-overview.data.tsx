import type { HistoryPage } from '@/components/ui/history-overview'

import { MockSite } from './MockSite'

const dot = (color: string) => <span className="size-3 rounded-[4px]" style={{ background: color }} />

// invented sites, oldest first; the last one is where the visitor is now
export const DEMO_PAGES: HistoryPage[] = [
  {
    id: 'harbor',
    title: 'Harbor — Deploy anywhere',
    icon: dot('#22C55E'),
    content: (
      <MockSite
        brand="harbor"
        headline="Deploy anywhere, sleep everywhere."
        body="Push a branch and get a preview on every continent in under a minute."
        wash="radial-gradient(60% 80% at 90% 10%, #bbf7d0 0%, transparent 60%)"
        accent="#16A34A"
      />
    ),
  },
  {
    id: 'fieldnote',
    title: 'Fieldnote — Notes that think',
    icon: dot('#F59E0B'),
    content: (
      <MockSite
        brand="fieldnote"
        headline="Notes that think with you."
        body="Capture anything, link it to everything, and find it again without trying."
        wash="radial-gradient(70% 90% at 100% 0%, #fde68a 0%, transparent 60%)"
        accent="#D97706"
      />
    ),
  },
  {
    id: 'tessellate',
    title: 'Tessellate — Design systems',
    icon: dot('#A78BFA'),
    content: (
      <MockSite
        dark
        brand="tessellate"
        headline="Design systems that scale with you."
        body="Tokens, components and docs that stay in sync from Figma to production."
        wash="radial-gradient(60% 70% at 85% 20%, #4c1d95 0%, transparent 70%)"
        accent="#7C3AED"
      />
    ),
  },
  {
    id: 'orbit',
    title: 'Orbit — Billing for ambitious teams',
    icon: dot('#0EA5E9'),
    content: (
      <MockSite
        brand="orbit"
        headline="Billing for ambitious teams."
        body="Subscriptions, invoices and usage pricing, with the edge cases already handled."
        wash="radial-gradient(70% 80% at 95% 5%, #bae6fd 0%, transparent 55%), radial-gradient(50% 60% at 70% 100%, #e0e7ff 0%, transparent 60%)"
        accent="#0284C7"
      />
    ),
  },
  {
    id: 'lumen',
    title: 'Lumen — Interfaces that feel right',
    icon: dot('#F43F5E'),
    content: (
      <MockSite
        brand="lumen"
        headline="Interfaces that feel right."
        body="A field guide to motion, touch and the small details people notice without knowing why."
        wash="linear-gradient(120deg, #fecdd3 0%, #fbcfe8 30%, #ddd6fe 60%, #ffffff 85%)"
        accent="#E11D48"
      />
    ),
  },
]
