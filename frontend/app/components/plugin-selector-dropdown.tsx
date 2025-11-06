'use client'

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react'
import { AppWindow, ChevronDown, ChevronRight, Puzzle, Search } from 'lucide-react'
import {
  WORKSPACE_PLUGIN_MAP,
  useWorkspaceContext,
  type Plugin,
  type Workspace,
} from '../../lib/workspace-context'

type IconProps = {
  size?: number
  className?: string
}

type IconComponent = ComponentType<IconProps>

interface PluginSelectorDropdownProps {
  selectedPlugin?: string | null
  onSelectPlugin?: (pluginId: string) => void
}

export function PluginSelectorDropdown({
  selectedPlugin,
  onSelectPlugin,
}: PluginSelectorDropdownProps) {
  const {
    workspaces,
    selectedWorkspaceId,
    selectWorkspace,
    selectedPluginId,
    selectPlugin,
  } = useWorkspaceContext()

  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedWorkspaceId, setFocusedWorkspaceId] = useState<string>(() => {
    return selectedWorkspaceId || workspaces[0]?.id || ''
  })
  const dropdownRef = useRef<HTMLDivElement>(null)

  const resolvedSelectedPluginId = selectedPlugin ?? selectedPluginId ?? null

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Reset search when menu closes
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('')
    }
  }, [isOpen])

  // Keep focused workspace aligned with current selection
  useEffect(() => {
    if (!workspaces.length) return
    setFocusedWorkspaceId((current) => {
      if (selectedWorkspaceId) return selectedWorkspaceId
      return current || workspaces[0].id
    })
  }, [selectedWorkspaceId, workspaces])

  const selectedSummary = useMemo(() => {
    if (!resolvedSelectedPluginId) {
      const workspace = workspaces.find((w) => w.id === selectedWorkspaceId) ?? workspaces[0]
      return workspace
        ? {
            workspace,
            plugin: WORKSPACE_PLUGIN_MAP[workspace.id]?.[0] ?? null,
          }
        : { workspace: null, plugin: null }
    }

    for (const workspace of workspaces) {
      const candidate = WORKSPACE_PLUGIN_MAP[workspace.id]?.find(
        (plugin) => plugin.id === resolvedSelectedPluginId,
      )
      if (candidate) {
        return { workspace, plugin: candidate }
      }
    }
    return { workspace: null, plugin: null }
  }, [resolvedSelectedPluginId, selectedWorkspaceId, workspaces])

  const normalizedSearch = searchTerm.trim().toLowerCase()

  const filteredWorkspaces = useMemo(() => {
    if (!normalizedSearch) return workspaces
    return workspaces.filter((workspace) => {
      const workspaceMatch = workspace.name.toLowerCase().includes(normalizedSearch)
      const pluginMatch = (WORKSPACE_PLUGIN_MAP[workspace.id] ?? []).some((plugin) =>
        plugin.name.toLowerCase().includes(normalizedSearch),
      )
      return workspaceMatch || pluginMatch
    })
  }, [normalizedSearch, workspaces])

  const workspacePlugins = useMemo(() => {
    return filteredWorkspaces.map((workspace) => ({
      workspace,
      plugins: (WORKSPACE_PLUGIN_MAP[workspace.id] ?? []).filter((plugin) =>
        normalizedSearch ? plugin.name.toLowerCase().includes(normalizedSearch) : true,
      ),
    }))
  }, [filteredWorkspaces, normalizedSearch])

  useEffect(() => {
    if (workspacePlugins.length === 0) return
    const isFocusedWorkspaceVisible = workspacePlugins.some(
      ({ workspace }) => workspace.id === focusedWorkspaceId,
    )
    if (!isFocusedWorkspaceVisible) {
      setFocusedWorkspaceId(workspacePlugins[0].workspace.id)
    }
  }, [workspacePlugins, focusedWorkspaceId])

  const activeWorkspaceEntry = workspacePlugins.find(
    ({ workspace }) => workspace.id === focusedWorkspaceId,
  )
  const activePlugins = activeWorkspaceEntry?.plugins ?? []
  const activeWorkspaceIdForList = activeWorkspaceEntry?.workspace.id ?? focusedWorkspaceId

  const handlePluginSelect = (workspaceId: string, pluginId: string) => {
    selectWorkspace(workspaceId)
    selectPlugin(pluginId)
    onSelectPlugin?.(pluginId)
    setIsOpen(false)
  }

  const renderWorkspaceButton = (workspace: Workspace) => {
    const Icon = (workspace.icon ?? AppWindow) as IconComponent
    const isFocused = focusedWorkspaceId === workspace.id
    const isActive = selectedWorkspaceId === workspace.id

    return (
      <button
        key={workspace.id}
        type="button"
        onClick={() => setFocusedWorkspaceId(workspace.id)}
        className={`w-full flex justify-between items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
          isFocused ? 'bg-muted/30 text-foreground' : 'text-foreground/70'
        }`}
        aria-current={isActive ? 'page' : undefined}
      >
        <span className="flex items-center gap-2">
          <Icon size={15} className={isFocused ? 'text-accent' : 'text-muted-foreground'} />
          <span className="truncate">{workspace.name}</span>
        </span>
        <ChevronRight size={15} className="text-muted-foreground" />
      </button>
    )
  }

  const renderPluginButton = (workspaceId: string, plugin: Plugin) => {
    const Icon = (plugin.icon ?? Puzzle) as IconComponent
    const isSelected =
      resolvedSelectedPluginId === plugin.id && selectedWorkspaceId === workspaceId

    return (
      <button
        key={`${workspaceId}-${plugin.id}`}
        type="button"
        onClick={() => handlePluginSelect(workspaceId, plugin.id)}
        className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-muted/30 rounded-md transition-colors text-left ${
          isSelected ? 'bg-muted/20' : ''
        }`}
      >
        <Icon
          size={15}
          className={isSelected ? 'text-accent' : 'text-muted-foreground'}
        />
        <span className={`truncate ${isSelected ? 'text-accent font-medium' : ''}`}>
          {plugin.name}
        </span>
      </button>
    )
  }

  const summaryWorkspace = selectedSummary.workspace
  const summaryPlugin = selectedSummary.plugin

  const WorkspaceIcon = (summaryWorkspace?.icon ?? AppWindow) as IconComponent
  const PluginIcon = (summaryPlugin?.icon ?? CompassIconFallback) as IconComponent
  const workspaceLabel = summaryWorkspace ? summaryWorkspace.name : 'Workspace'
  const pluginLabel = summaryPlugin ? summaryPlugin.name : 'Select AI assistant'

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 h-9 px-3 rounded-md transition-colors bg-background border border-border/50 hover:bg-muted/30 text-sm"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-1.5">
          <WorkspaceIcon size={14} className="text-muted-foreground" />
          <span className="font-medium text-sm">{workspaceLabel}</span>
          <span className="text-muted-foreground">/</span>
          <PluginIcon size={14} className="text-accent" />
          <span className="text-accent font-medium">{pluginLabel}</span>
        </div>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 min-h-64 rounded-md shadow-lg border border-border/10 z-50 overflow-hidden w-[480px]"
          style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}
        >
          <div className="border-b border-border/10 p-2 flex items-center">
            <div className="relative flex-1">
              <input
                placeholder="Search workspaces and plugins..."
                className="w-full h-8 text-xs pl-8 pr-3 py-2 rounded border border-border/20 bg-muted/10 focus:outline-none focus:ring-1 focus:ring-accent/30"
                type="text"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          <div
            className="grid grid-cols-2 divide-x divide-border/10"
            style={{ backgroundColor: 'hsl(var(--sidebar-background))' }}
          >
            <div className="overflow-hidden">
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-b border-border/10">
                Select AI Plugin
              </div>
              <div className="max-h-[320px] overflow-y-auto p-1 space-y-1">
                {workspacePlugins.length > 0 ? (
                  workspacePlugins.map(({ workspace }) => renderWorkspaceButton(workspace))
                ) : (
                  <div className="rounded-md bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground">
                    No workspaces found
                  </div>
                )}
              </div>
            </div>

            <div className="overflow-hidden">
              <div className="px-3 py-2 h-8 text-xs font-medium text-muted-foreground border-b border-border/10">
                {activeWorkspaceEntry?.workspace.name || ''}
              </div>
              <div className="max-h-[320px] overflow-y-auto p-1 space-y-1">
                {activePlugins.length > 0 ? (
                  activePlugins.map((plugin) =>
                    renderPluginButton(activeWorkspaceIdForList, plugin),
                  )
                ) : (
                  <div className="rounded-md bg-muted/20 px-3 py-6 text-center text-xs text-muted-foreground">
                    No plugins available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function CompassIconFallback({ size = 14, className }: IconProps) {
  return <AppWindow size={size} className={className} />
}
