import type { BuiltInNodeIcon, DeployNode } from './deploy-globe.types'

export const VIEW_WIDTH = 800
export const VIEW_HEIGHT = 400
export const DEFAULT_ACCENT = '#45DEC4'
export const DEFAULT_DURATION = 4.5
export const ICON_SIZE = 16
export const DEFAULT_ICON_VIEWBOX = '0 0 16 16'

export const MERIDIANS = [-4, -3, -2, -1, 0, 1, 2, 3, 4]
export const ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

export const STATUS_LABELS = {
  deploying: 'deploying…',
  deployed: 'deployed',
  error: 'failed',
} as const

export const ICON_PATHS: Record<BuiltInNodeIcon, string> = {
  triangle: 'M8 1L15 14H1L8 1Z',
  server:
    'M2 3a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm0 6a1 1 0 011-1h10a1 1 0 011 1v2a1 1 0 01-1 1H3a1 1 0 01-1-1V9zm9-5.5a.75.75 0 100-1.5.75.75 0 000 1.5zM11 10.5a.75.75 0 100-1.5.75.75 0 000 1.5z',
  database:
    'M8 1C4.13 1 1 2.34 1 4v8c0 1.66 3.13 3 7 3s7-1.34 7-3V4c0-1.66-3.13-3-7-3zm0 2c3.31 0 5 .9 5 1s-1.69 1-5 1-5-.9-5-1 1.69-1 5-1zm5 9c0 .1-1.69 1-5 1s-5-.9-5-1V9.47C4.55 10.06 6.15 10.5 8 10.5s3.45-.44 5-1.03V12zm0-4c0 .1-1.69 1-5 1s-5-.9-5-1V5.47C4.55 6.06 6.15 6.5 8 6.5s3.45-.44 5-1.03V8z',
  globe:
    'M8 1a7 7 0 100 14A7 7 0 008 1zM6.53 2.66A5.5 5.5 0 002.6 7H5.1c.1-1.62.4-3.07.86-4.13a5.52 5.52 0 01.57-.21zm2.94 0c.2.06.39.13.57.21.46 1.06.76 2.51.87 4.13h2.49a5.5 5.5 0 00-3.93-4.34zM6.6 7c.1-1.46.38-2.73.77-3.6.26-.58.52-.9.63-.9.11 0 .37.32.63.9.39.87.67 2.14.77 3.6H6.6zm-4 2a5.5 5.5 0 003.93 4.34 5.43 5.43 0 01-.57-.21C5.5 12.07 5.2 10.62 5.1 9H2.6zm6.87 4.34A5.5 5.5 0 0013.4 9h-2.49c-.1 1.62-.41 3.07-.87 4.13.18-.06.37-.13.57-.21h-.24zM6.6 9c.1 1.46.38 2.73.77 3.6.26.58.52.9.63.9.11 0 .37-.32.63-.9.39-.87.67-2.14.77-3.6H6.6z',
  shield:
    'M8 1L2 4v4c0 3.33 2.56 6.44 6 7.15C11.44 14.44 14 11.33 14 8V4L8 1zm0 2.18L12 5.4v2.6c0 2.52-1.77 4.86-4 5.55-2.23-.69-4-3.03-4-5.55V5.4L8 3.18z',
  zap: 'M8.94 1.5L3 9h4.5l-.44 5.5L13 7H8.5l.44-5.5z',
  cloud:
    'M12.5 6.5A4.5 4.5 0 004 7.08 3.5 3.5 0 003.5 14h9a3 3 0 000-6 4.47 4.47 0 000-1.5zM8 4a3 3 0 00-2.83 2.02l-.23.67-.7.1A2 2 0 005.5 12.5h7a1.5 1.5 0 000-3h-.73l-.12-.72A3 3 0 008 4z',
  hexagon:
    'M8 1.5L14 5v6l-6 3.5L2 11V5l6-3.5zm0 1.73L3.5 6.04v4.92L8 13.77l4.5-2.81V6.04L8 3.23z',
}

export const DEFAULT_NODES: DeployNode[] = [
  { id: 'n1', trajectory: [[3, 0], [3, 1], [3, 2], [3, 3]] },
  { id: 'n2', trajectory: [[-3, 0], [-3, 1], [-3, 2], [-3, 3], [-3, 4]] },
  { id: 'n3', trajectory: [[1, 0], [1, 1], [1, 2]] },
  { id: 'n4', trajectory: [[-1, 0], [-1, 1], [-2, 1]] },
  { id: 'n5', trajectory: [[0, 0], [0, 1], [0, 2], [0, 3], [-1, 3]] },
  { id: 'n6', trajectory: [[2, 0], [2, 1]] },
]
