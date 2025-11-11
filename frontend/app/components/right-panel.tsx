'use client'

import { useLayout } from '../../lib/layout-context'
import { PluginSettingsPanel } from './plugin-settings-panel'

export function RightPanel() {
  const { currentPanel, isRightPanelOpen } = useLayout()

  if (!isRightPanelOpen || currentPanel !== 'plugin-settings') return null

  return <PluginSettingsPanel />
}
