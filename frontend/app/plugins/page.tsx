'use client'

import { useMemo, useState } from 'react'
import { SideNavigation } from '../components/side-navigation'
import { ThemeToggle } from '../components/theme-toggle'
import {
  useWorkspaceContext,
  type Plugin,
  type Workspace,
} from '../../lib/workspace-context'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function PluginsPage() {
  const {
    workspaces,
    pluginsByWorkspace,
    isAdmin,
  } = useWorkspaceContext()
  const router = useRouter()

  const [activeWorkspaceFilter, setActiveWorkspaceFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpenDetails = (workspace: Workspace, plugin: Plugin) => {
    router.push(`/plugins/${workspace.id}/${plugin.id}`)
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
        className="group relative flex h-full flex-col rounded-2xl border border-border/40 bg-background/80 px-5 py-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-accent/40 hover:bg-background/95 hover:shadow-[0_22px_45px_-25px_rgba(16,38,84,0.45)]"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-accent">
              {Icon ? <Icon size={20} /> : <PuzzleFallbackIcon />}
            </span>
            <div className="space-y-1">
              <div className="text-base font-semibold text-foreground">{plugin.name}</div>
              <div className="text-xs text-muted-foreground/70">
                Updated {formatRelativeDate(plugin.updatedAt)}
              </div>
            </div>
          </div>
          {isAdmin && (
            <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent/90">
              Editable
            </span>
          )}
        </div>
        <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-muted-foreground">
          {plugin.description}
        </p>
        <div className="mt-6 flex items-center justify-between text-[11px] font-medium text-muted-foreground/80">
          <span className="rounded-full bg-muted/40 px-2 py-1 text-xs">{plugin.updatedBy}</span>
          <span className="inline-flex items-center gap-1 text-accent">
            View details
            <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </span>
        </div>
      </button>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SideNavigation />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="relative border-b border-border/10 bg-[radial-gradient(circle_at_top,_rgba(10,112,182,0.12),_transparent_55%)] px-6 py-6 lg:px-10">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-border/50 bg-accent/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
                  Plugin Studio
                </div>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                  View plugins & Configure custom abilities.
                </h1>
                {/* <p className="max-w-2xl text-sm text-foreground">
                
                </p> */}
              </div>
              <ThemeToggle />
            </div>

            <div className="mx-auto mt-6 flex w-full max-w-6xl flex-col gap-4 rounded-2xl border border-border/40 bg-background/95 p-5 shadow-[0_25px_45px_-30px_rgba(15,23,42,0.25)]">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full max-w-lg">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search by plugin or instruction"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full rounded-xl border border-border/40 bg-muted/10 py-2.5 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent/40"
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
              <p className="text-xs text-muted-foreground/80">
                Tip: hover a plugin to see the exact agent instructions your teammates will rely on.
              </p>
            </div>
          </header>

          <div
            className="flex-1 overflow-y-auto px-6 py-8 lg:px-10"
          >
            {sections.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-sm text-slate-200/70">
                <div className="rounded-2xl border border-dashed border-border/50 bg-muted/20 px-8 py-12 text-center">
                  <p className="text-lg font-medium text-foreground">No plugins match your filters</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try clearing the workspace filter or adjusting your search query.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
                {sections.map(({ workspace, plugins }) => (
                  <section key={workspace.id} className="space-y-4">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex h-6 w-1 rounded-full bg-accent/50" />
                        <h2 className="text-base font-semibold text-foreground">
                          {workspace.name}
                        </h2>
                      </div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                        {plugins.length} plugin{plugins.length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                      {plugins.map((plugin) => renderPluginCard(workspace, plugin))}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
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
          : 'border border-border/40 bg-muted/30 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground'
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
