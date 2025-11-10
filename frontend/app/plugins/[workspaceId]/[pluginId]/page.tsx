'use client'

import Link from 'next/link'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Link as LinkIcon } from 'lucide-react'

// Replace these imports with your production components
import { SideNavigation } from '../../../components/side-navigation'
import { ThemeToggle } from '../../../components/theme-toggle'
import { PluginDetailPanel } from '../../../components/plugin-detail-panel'
import { useWorkspaceContext, type Plugin } from '../../../../lib/workspace-context'

interface PluginDetailPageProps {
  params: {
    workspaceId: string
    pluginId: string
  }
}

export default function PluginDetailPage({ params }: PluginDetailPageProps) {
  const { workspaceId, pluginId } = params
  const { workspaces, pluginsByWorkspace, updatePluginConfig, isAdmin } = useWorkspaceContext()
  const router = useRouter()

  const workspace = workspaces.find((w) => w.id === workspaceId)
  const plugin = pluginsByWorkspace[workspaceId]?.find((p) => p.id === pluginId)

  if (!workspace || !plugin) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-muted-foreground">
        <div className="space-y-3 text-center">
          <p className="text-sm">We couldn’t find that plugin configuration.</p>
          <Link
            href="/plugins"
            className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground transition hover:bg-muted/40"
          >
            <ChevronLeft size={14} />
            Back to plugins
          </Link>
        </div>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<Plugin>) => {
    const enrichedUpdates: Partial<Plugin> = {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: isAdmin ? 'You' : plugin.updatedBy,
    }
    updatePluginConfig(workspaceId, pluginId, enrichedUpdates)
  }

  const canonicalPath = useMemo(
    () => `/plugins/${workspaceId}/${pluginId}`,
    [workspaceId, pluginId],
  )

  const lastUpdatedLabel = useMemo(() => {
    if (!plugin.updatedAt) return null
    const date = new Date(plugin.updatedAt)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [plugin.updatedAt])

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(`${window.location.origin}${canonicalPath}`)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <SideNavigation />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-border/20 bg-background/95 px-6 py-5 lg:px-12">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-muted/20 px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:bg-muted/30 hover:text-foreground"
            >
              <ChevronLeft size={14} />
              Back
            </button>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-muted/15">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-10 lg:px-12">
            <section className="rounded-3xl border border-border/40 bg-background/95 p-8 shadow-2xl shadow-black/5">
              <div className="flex flex-col gap-6 lg:flex-row lg:justify-between">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                    {workspace.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-semibold text-foreground">{plugin.name}</h1>
                    <span className="rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground">
                      Configuration
                    </span>
                  </div>
                  <p className="max-w-3xl text-sm text-muted-foreground">
                    Keep this capability aligned with policy and practice. Update the labels your colleagues see, refine the guardrails the agent follows, and review every edit before it reaches production.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                    <div>
                      {lastUpdatedLabel ? (
                        <>
                          Last updated{' '}
                          <span className="font-medium text-foreground">{lastUpdatedLabel}</span>
                          {plugin.updatedBy ? ` by ${plugin.updatedBy}` : ''}
                        </>
                      ) : (
                        <span className="text-muted-foreground/70">No updates captured yet</span>
                      )}
                    </div>
                    <span className="hidden h-4 w-px bg-border/60 md:inline-block" />
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1 rounded-full border border-border/40 bg-muted/30 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-muted/40 hover:text-foreground"
                    >
                      <Copy size={12} />
                      Copy link
                    </button>
                    <Link
                      href="/plugins"
                      className="inline-flex items-center gap-1 text-xs font-medium text-accent transition hover:text-accent/80"
                    >
                      <LinkIcon size={12} />
                      View catalog
                    </Link>
                  </div>
                </div>

                <aside className="grid w-full max-w-xs gap-3 rounded-2xl border border-border/30 bg-muted/30 p-5 text-sm text-muted-foreground">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Plugin slug
                    </span>
                    <p className="mt-1 font-medium text-foreground">{`${workspace.name} / ${plugin.name}`}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Workspace
                    </span>
                    <p className="mt-1">{workspace.name}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground/80">
                      Admin access
                    </span>
                    <p className="mt-1">{isAdmin ? 'Granted' : 'Read only'}</p>
                  </div>
                </aside>
              </div>
            </section>

            <PluginDetailPanel
              workspace={workspace}
              plugin={plugin}
              isAdmin={isAdmin}
              onUpdate={handleUpdate}
              layout="page"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
