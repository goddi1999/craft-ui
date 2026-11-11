import type { MatchItem } from '@/components/ui/match-field'

export const CANDIDATE_SECTORS = ['Design systems', 'Fintech', 'Consumer apps', 'Agency']

export const CANDIDATES: MatchItem[] = [
  { id: 'lh', name: 'Lena Hoffmann', sector: 0, score: 0.96 },
  { id: 'dp', name: 'Dev Patel', sector: 0, score: 0.62 },
  { id: 'mk', name: 'Malik Kaya', sector: 1, score: 0.91 },
  { id: 'sn', name: 'Sara Nilsson', sector: 1, score: 0.6 },
  { id: 'ab', name: 'Ana Bento', sector: 2, score: 0.77 },
  { id: 'tw', name: 'Tom Walsh', sector: 2, score: 0.52 },
  { id: 'jr', name: 'Julia Roth', sector: 3, score: 0.78 },
  { id: 'yo', name: 'Yuki Ono', sector: 2, score: 0.58 },
]

export const BOT_SECTORS = ['Billing', 'Support', 'Risk', 'Sales']

export const BOTS: MatchItem[] = [
  { id: 'billing', name: 'billing-agent', initials: 'BA', sector: 0, score: 0.94 },
  { id: 'refunds', name: 'refunds-bot', initials: 'RF', sector: 0, score: 0.71 },
  { id: 'triage', name: 'support-triage', initials: 'ST', sector: 1, score: 0.88 },
  { id: 'faq', name: 'help-center', initials: 'HC', sector: 1, score: 0.58 },
  { id: 'fraud', name: 'risk-review', initials: 'RR', sector: 2, score: 0.76 },
  { id: 'sdr', name: 'sales-assist', initials: 'SA', sector: 3, score: 0.46 },
]
