'use client'

import { useMemo, useState } from 'react'
import { SideNavigation } from '../components/side-navigation'
import { RightPanel } from '../components/right-panel'
import { ThemeToggle } from '../components/theme-toggle'
import { useLayout } from '../../lib/layout-context'
import {
  useWorkspaceContext,
  type Plugin,
  type Workspace,
} from '../../lib/workspace-context'
import { Search } from 'lucide-react'

export default function PluginsPage() {
  const {
    workspaces,
    pluginsByWorkspace,
    updatePluginConfig,
    isAdmin,
  } = useWorkspaceContext()
  const { isRightPanelOpen, openRightPanel, closeRightPanel } = useLayout()

  const [activeWorkspaceFilter, setActiveWorkspaceFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpenDetails = (workspace: Workspace, plugin: Plugin) => {
    openRightPanel('plugin-detail', {
      workspace,
      plugin,
      isAdmin,
      onClose: () => closeRightPanel(),
      onUpdate: (updates: Partial<Plugin>) =>
        handleUpdate(workspace.id, plugin.id, updates),
    })
  }

  const handleUpdate = (
    workspaceId: string,
    pluginId: string,
    updates: Partial<Plugin>,
  ) => {
    const workspace = workspaces.find((w) => w.id === workspaceId)
    const currentPlugin =
      pluginsByWorkspace[workspaceId]?.find((plugin) => plugin.id === pluginId) ?? null

    if (!workspace || !currentPlugin) return

    const enrichedUpdates: Partial<Plugin> = {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: isAdmin ? 'You' : currentPlugin.updatedBy,
    }

    updatePluginConfig(workspaceId, pluginId, enrichedUpdates)

    const nextPlugin: Plugin = {
      ...currentPlugin,
      ...enrichedUpdates,
    }

    openRightPanel('plugin-detail', {
      workspace,
      plugin: nextPlugin,
      isAdmin,
      onClose: () => closeRightPanel(),
      onUpdate: (nextUpdates: Partial<Plugin>) =>
        handleUpdate(workspaceId, pluginId, nextUpdates),
    })
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredWorkspaces = useMemo(() => {
    if (activeWorkspaceFilter === 'all') return workspaces
    return workspaces.filter((workspace) => workspace.id === activeWorkspaceFilter)
  }, [activeWorkspaceFilter, workspaces])

  const sections = useMemo(() => {
    return filteredWorkspaces
      .map((workspace) => {
        const plugins = (pluginsByWorkspace[workspace.id] ?? []).filter((plugin) => {
          if (!normalizedQuery) return true
          return (
            plugin.name.toLowerCase().includes(normalizedQuery) ||
            plugin.description.toLowerCase().includes(normalizedQuery) ||
            plugin.instructions.toLowerCase().includes(normalizedQuery)
          )
        })

        return {
          workspace,
          plugins,
        }
      })
      .filter((section) => section.plugins.length > 0)
  }, [filteredWorkspaces, pluginsByWorkspace, normalizedQuery])

  const renderPluginCard = (workspace: Workspace, plugin: Plugin) => {
    const Icon = plugin.icon
    return (
      <button
        key={plugin.id}
        onClick={() => handleOpenDetails(workspace, plugin)}
        className="group flex h-full flex-col rounded-xl border border-border/40 bg-card/70 p-4 text-left transition hover:border-border hover:bg-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              {Icon ? <Icon size={18} /> : <PuzzleFallbackIcon />}
            </span>
            <div>
              <div className="text-sm font-semibold text-foreground">{plugin.name}</div>
              <div className="text-xs text-muted-foreground/80">
                Updated {formatRelativeDate(plugin.updatedAt)}
              </div>
            </div>
          </div>
          {isAdmin && (
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
              Edit
            </span>
          )}
        </div>
        <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
          {plugin.description}
        </p>
        <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
          <span>{plugin.updatedBy}</span>
          <span className="inline-flex items-center gap-1 text-accent">
            View details
            <span aria-hidden className="transition group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SideNavigation />

      <div className="flex flex-1 overflow-hidden">
        <div
          className={`${isRightPanelOpen ? 'flex-1 min-w-[560px]' : 'flex-1'} flex flex-col overflow-hidden transition-all duration-300`}
        >
          <header className="border-b border-border/20 bg-background/95 px-8 py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  Plugin configurations
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Review plugin behavior across workspaces and fine-tune custom instructions
                  for the team.
                </p>
              </div>
              <ThemeToggle />
            </div>

            <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-center">
              <div className="relative w-full max-w-md">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search plugins..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-lg border border-border/40 bg-muted/10 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <FilterPill
                  label="All workspaces"
                  active={activeWorkspaceFilter === 'all'}
                  onClick={() => setActiveWorkspaceFilter('all')}
                />
                {workspaces.map((workspace) => (
                  <FilterPill
                    key={workspace.id}
                    label={workspace.name}
                    active={activeWorkspaceFilter === workspace.id}
                    onClick={() => setActiveWorkspaceFilter(workspace.id)}
                  />
                ))}
              </div>
            </div>
          </header>

          <div
            className={`flex-1 overflow-y-auto px-8 py-6 ${
              isRightPanelOpen ? 'lg:pr-12' : ''
            }`}
          >
            {sections.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-sm text-muted-foreground">
                <div className="rounded-lg border border-dashed border-border/50 px-6 py-10 text-center">
                  <p className="font-medium text-foreground">No plugins match your filters</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try clearing the workspace filter or adjusting your search query.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {sections.map(({ workspace, plugins }) => (
                  <section key={workspace.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {workspace.name}
                      </h2>
                      <span className="text-xs text-muted-foreground/70">
                        {plugins.length} plugin{plugins.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                      {plugins.map((plugin) => renderPluginCard(workspace, plugin))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>

        {isRightPanelOpen && <RightPanel />}
      </div>
    </div>
  )
}

interface FilterPillProps {
  label: string
  active: boolean
  onClick: () => void
}

function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
        active
          ? 'bg-accent text-accent-foreground shadow-sm'
          : 'border border-border/50 text-muted-foreground hover:border-border hover:text-foreground'
      }`}
    >
      {label}
    </button>
  )
}

function formatRelativeDate(value?: string) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function PuzzleFallbackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-current"
    >
      <path
        d="M5 3h4a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v1h1a2 2 0 0 1 0 4h-1v1a3 3 0 0 1-3 3h-1v1a3 3 0 0 1-3 3H5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 21V3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
