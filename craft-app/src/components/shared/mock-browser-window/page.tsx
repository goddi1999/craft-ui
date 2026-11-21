import { useState } from 'react'

import {
  DemoAction,
  DemoControlGroup,
  DemoSettings,
  DemoSwitch,
  DemoTextField,
} from '@/components/shared/demo-controls'
import { toUsageSnippet, type DemoPropDoc } from '@/components/shared/demo-docs'
import { DemoPage } from '@/components/shared/demo-page'
import {
  BrowserWindow,
  type BrowserHeaderStyle,
  type BrowserSidebarItem,
  type BrowserSidebarPosition,
  type BrowserSize,
  type BrowserVariant,
} from '@/components/ui/mock-browser-window'

const VARIANTS: BrowserVariant[] = ['chrome', 'safari']
const HEADER_STYLES: BrowserHeaderStyle[] = ['minimal', 'full']
const SIZES: BrowserSize[] = ['sm', 'md', 'lg', 'xl']
const POSITIONS: BrowserSidebarPosition[] = ['left', 'right']
const DEFAULT_URL = 'https://example.com/dashboard'

const SIDEBAR_ITEMS: BrowserSidebarItem[] = [
  { label: 'Overview', active: true },
  { label: 'Users', badge: 12 },
  { label: 'Analytics', badge: 'new' },
  { label: 'Settings' },
]

const HEADER_LABELS: Record<BrowserHeaderStyle, string> = { minimal: 'Minimal', full: 'Address Bar' }

const PROPS: DemoPropDoc[] = [
  { name: 'variant', type: "'chrome' | 'safari'", default: "'chrome'", description: 'Browser chrome style.' },
  { name: 'headerStyle', type: "'minimal' | 'full'", default: "'minimal'", description: 'Dots only, or dots plus address bar.' },
  { name: 'size', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Window height, max width and sidebar width.' },
  { name: 'showSidebar', type: 'boolean', default: 'false', description: 'Show the sidebar.' },
  { name: 'sidebarPosition', type: "'left' | 'right'", default: "'left'", description: 'Side the sidebar sits on.' },
  { name: 'url', type: 'string', default: "'https://example.com'", description: 'Text in the address bar.' },
  { name: 'sidebarItems', type: '{ label, active?, badge? }[]', description: 'Sidebar entries.' },
  { name: 'children', type: 'ReactNode', description: 'Page content; a dotted texture shows when omitted.' },
  { name: 'className', type: 'string', description: 'Merged onto the window.' },
]

export function MockBrowserWindowPage() {
  const [variant, setVariant] = useState<BrowserVariant>('chrome')
  const [headerStyle, setHeaderStyle] = useState<BrowserHeaderStyle>('full')
  const [size, setSize] = useState<BrowserSize>('lg')
  const [url, setUrl] = useState(DEFAULT_URL)
  const [showSidebar, setShowSidebar] = useState(true)
  const [sidebarPosition, setSidebarPosition] = useState<BrowserSidebarPosition>('left')

  const handleChromePreset = () => {
    setVariant('chrome')
    setHeaderStyle('full')
    setShowSidebar(true)
    setSize('lg')
  }

  const handleSafariPreset = () => {
    setVariant('safari')
    setHeaderStyle('minimal')
    setShowSidebar(false)
    setSize('md')
  }

  const usage = toUsageSnippet({
    component: 'BrowserWindow',
    from: '@/components/ui/mock-browser-window',
    props: { variant, headerStyle, size, showSidebar, sidebarPosition, url },
    defaults: {
      variant: 'chrome',
      headerStyle: 'minimal',
      size: 'md',
      showSidebar: false,
      sidebarPosition: 'left',
      url: 'https://example.com',
    },
  })

  return (
    <DemoPage
      eyebrow="ui / mock-browser-window"
      title="Mock Browser Window"
      description="A Chrome or Safari window frame with optional address bar and sidebar, for framing screenshots and demos. Adapted from cult-ui."
      settings={
        <DemoSettings>
          <DemoControlGroup title="Browser" options={VARIANTS} value={variant} onChange={setVariant} />
          <DemoControlGroup
            title="Header Style"
            options={HEADER_STYLES}
            value={headerStyle}
            onChange={setHeaderStyle}
            format={(value) => HEADER_LABELS[value]}
          />
          <DemoControlGroup title="Size" options={SIZES} value={size} onChange={setSize} />
          <DemoTextField label="URL" value={url} onValueChange={setUrl} placeholder={DEFAULT_URL} />
          <DemoSwitch label="Show Sidebar" checked={showSidebar} onCheckedChange={setShowSidebar} />
          {showSidebar && (
            <DemoControlGroup
              title="Sidebar Position"
              options={POSITIONS}
              value={sidebarPosition}
              onChange={setSidebarPosition}
            />
          )}
          <DemoAction onClick={handleChromePreset}>Chrome Dashboard</DemoAction>
          <DemoAction onClick={handleSafariPreset}>Safari Minimal</DemoAction>
        </DemoSettings>
      }
      docs={{ paths: ['src/components/ui/mock-browser-window/'], usage, props: PROPS }}
    >
      <BrowserWindow
        className="w-full max-w-4xl"
        variant={variant}
        headerStyle={headerStyle}
        size={size}
        url={url}
        showSidebar={showSidebar}
        sidebarPosition={sidebarPosition}
        sidebarItems={SIDEBAR_ITEMS}
      />
    </DemoPage>
  )
}
