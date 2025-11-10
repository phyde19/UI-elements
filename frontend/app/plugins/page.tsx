'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'

// Replace these imports with your production components
import { SideNavigation } from '../components/side-navigation'
import { ThemeToggle } from '../components/theme-toggle'
import { useCompassStore } from '@/hooks/store-context'
import {
  buildWorkspaceData,
  type PluginWithMetadata,
  type WorkspaceWithIcon,
} from '@/lib/workspace-data'

type SortColumn = 'plugin' | 'workspace' | 'status' | 'updated'
type SortDirection = 'asc' | 'desc'

export default function PluginsPage() {
  const workspacePayload = useCompassStore((state) => state.workspaces)
  const router = useRouter()
  const { workspaces, pluginsByWorkspace } = useMemo(
    () => buildWorkspaceData(workspacePayload),
    [workspacePayload],
  )
  const [activeWorkspaceFilter, setActiveWorkspaceFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<SortColumn>('plugin')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleOpenDetails = (workspace: WorkspaceWithIcon, plugin: PluginWithMetadata) => {
    router.push(`/plugins/${workspace.id}/${plugin.id}`)
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const filteredRows = useMemo(() => {
    const rows: Array<{ workspace: WorkspaceWithIcon; plugin: PluginWithMetadata }> = []
    workspaces.forEach((workspace) => {
      if (activeWorkspaceFilter !== 'all' && workspace.id !== activeWorkspaceFilter) return
      const plugins = pluginsByWorkspace[workspace.id] ?? []
      plugins.forEach((plugin) => {
        const haystack = [
          plugin.name,
          plugin.description,
          plugin.instructions ?? '',
          workspace.name,
        ]
          .join(' ')
          .toLowerCase()
        if (!normalizedQuery || haystack.includes(normalizedQuery)) {
          rows.push({ workspace, plugin })
        }
      })
    })
    return rows
  }, [activeWorkspaceFilter, normalizedQuery, pluginsByWorkspace, workspaces])

  const sortedRows = useMemo(() => {
    const next = [...filteredRows]
    const directionFactor = sortDirection === 'asc' ? 1 : -1
    next.sort((a, b) => {
      switch (sortColumn) {
        case 'plugin':
          return a.plugin.name.localeCompare(b.plugin.name) * directionFactor
        case 'workspace':
          return a.workspace.name.localeCompare(b.workspace.name) * directionFactor
        case 'status': {
          const aConfigured = Boolean(a.plugin.updatedAt)
          const bConfigured = Boolean(b.plugin.updatedAt)
          if (aConfigured === bConfigured) return a.plugin.name.localeCompare(b.plugin.name) * directionFactor
          return (aConfigured ? 1 : -1) * directionFactor
        }
        case 'updated': {
          const aTime = a.plugin.updatedAt ? new Date(a.plugin.updatedAt).getTime() : 0
          const bTime = b.plugin.updatedAt ? new Date(b.plugin.updatedAt).getTime() : 0
          return (aTime - bTime) * directionFactor
        }
        default:
          return 0
      }
    })
    return next
  }, [filteredRows, sortColumn, sortDirection])

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SideNavigation />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex flex-1 flex-col overflow-y-auto">
            <header className="border-b border-border/10 bg-background px-6 py-5 lg:px-10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-xl font-semibold text-foreground">Plugin administration</h1>
                  <p className="text-sm text-muted-foreground">
                    Review every workspace plugin, confirm ownership, and jump into edits without navigating away.
                  </p>
                </div>
                <ThemeToggle />
              </div>
              <div className="mt-5 flex flex-col gap-3 lg:flex-row">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Search
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <input
                      type="text"
                      placeholder="Search plugin name, description, or instructions"
                      value={searchQuery}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      className="h-11 w-full rounded-lg border border-border/40 bg-background/90 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent/30"
                    />
                  </div>
                </div>
                <WorkspaceSelect
                  value={activeWorkspaceFilter}
                  onChange={(value) => setActiveWorkspaceFilter(value)}
                  options={workspaces}
                />
              </div>
            </header>

            <section className="flex-1 overflow-y-auto px-6 py-6 lg:px-10">
              <div className="rounded-xl border border-border/30 bg-background shadow-sm">
                <header className="grid grid-cols-[1.5fr,.9fr,.9fr,.9fr,130px] items-center gap-3 border-b border-border/20 px-5 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  <SortableHeader
                    label="Plugin"
                    column="plugin"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Workspace"
                    column="workspace"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Status"
                    column="status"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <SortableHeader
                    label="Last update"
                    column="updated"
                    sortColumn={sortColumn}
                    sortDirection={sortDirection}
                    onSort={handleSort}
                  />
                  <span className="text-right">Actions</span>
                </header>
                {sortedRows.length === 0 ? (
                  <div className="px-5 py-12 text-center text-sm text-muted-foreground">
                    No plugins match your filters. Adjust the workspace filter or search query.
                  </div>
                ) : (
                  <div className="divide-y divide-border/20">
                    {sortedRows.map(({ workspace, plugin }) => (
                      <PluginRow
                        key={`${workspace.id}-${plugin.id}`}
                        workspace={workspace}
                        plugin={plugin}
                        onOpenDetails={() => handleOpenDetails(workspace, plugin)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}

function PluginRow({
  workspace,
  plugin,
  onOpenDetails,
}: {
  workspace: WorkspaceWithIcon
  plugin: PluginWithMetadata
  onOpenDetails: () => void
}) {
  const Icon = plugin.icon
  return (
    <div className="grid grid-cols-[1.5fr,.9fr,.9fr,.9fr,120px] items-center gap-3 px-5 py-4 text-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/20 bg-muted/30 text-accent">
          {Icon ? <Icon size={18} /> : <PuzzleFallbackIcon />}
        </div>
        <div>
          <p className="font-semibold text-foreground">{plugin.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{plugin.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-md border border-border/40 px-2 py-0.5 text-xs">
          {workspace.name}
        </span>
      </div>
      <div className="text-xs font-medium text-muted-foreground">
        {plugin.updatedAt ? 'Configured' : 'Not configured'}
      </div>
      <div className="text-xs text-muted-foreground">
        {plugin.updatedAt ? (
          <>
            {formatRelativeDate(plugin.updatedAt)}
            {plugin.updatedBy ? ` · ${plugin.updatedBy}` : ''}
          </>
        ) : (
          <span className="text-muted-foreground/70">—</span>
        )}
      </div>
      <div className="flex justify-end">
        <button
          onClick={onOpenDetails}
          className="inline-flex items-center gap-1 rounded-md border border-border/50 px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-border hover:bg-muted/30"
        >
          View / Edit
          <span aria-hidden>→</span>
        </button>
      </div>
    </div>
  )
}

function WorkspaceSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (next: string) => void
  options: WorkspaceWithIcon[]
}) {
  return (
    <div className="flex w-full flex-col gap-1 lg:max-w-[240px]">
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Workspace</label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-border/40 bg-background/90 pl-3 pr-8 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
        >
          <option value="all">All workspaces</option>
          {options.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          ▾
        </span>
      </div>
    </div>
  )
}

function SortableHeader({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
}: {
  label: string
  column: SortColumn
  sortColumn: SortColumn
  sortDirection: SortDirection
  onSort: (column: SortColumn) => void
}) {
  const isActive = sortColumn === column
  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`flex items-center gap-1 text-left ${
        isActive ? 'text-foreground' : 'text-muted-foreground'
      }`}
    >
      {label}
      {isActive && <span>{sortDirection === 'asc' ? '▴' : '▾'}</span>}
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
      width="20"
      height="20"
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
