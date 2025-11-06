'use client'

import { useEffect, useMemo, useState } from 'react'
import { X, PencilLine, Check, XCircle } from 'lucide-react'
import { type Plugin, type Workspace } from '../../lib/workspace-context'

interface PluginDetailPanelProps {
  workspace?: Workspace
  plugin?: Plugin
  isAdmin?: boolean
  onClose?: () => void
  onUpdate?: (updates: Partial<Plugin>) => void
}

type EditableField = 'name' | 'description' | 'instructions' | null

export function PluginDetailPanel({
  workspace,
  plugin,
  isAdmin = false,
  onClose,
  onUpdate,
}: PluginDetailPanelProps) {
  const [editingField, setEditingField] = useState<EditableField>(null)
  const [draftValues, setDraftValues] = useState({
    name: plugin?.name ?? '',
    description: plugin?.description ?? '',
    instructions: plugin?.instructions ?? '',
  })

  useEffect(() => {
    setDraftValues({
      name: plugin?.name ?? '',
      description: plugin?.description ?? '',
      instructions: plugin?.instructions ?? '',
    })
    setEditingField(null)
  }, [plugin?.id, plugin?.name, plugin?.description, plugin?.instructions])

  const updatedLabel = useMemo(() => {
    if (!plugin?.updatedAt) return null
    const date = new Date(plugin.updatedAt)
    return `${date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })} at ${date.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    })}`
  }, [plugin?.updatedAt])

  if (!plugin || !workspace) {
    return (
      <div className="flex h-screen w-[420px] flex-col border-l border-border/60 bg-background">
        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
          Select a plugin to view configuration
        </div>
      </div>
    )
  }

  const startEditing = (field: EditableField) => {
    setEditingField(field)
  }

  const cancelEditing = () => {
    setDraftValues({
      name: plugin.name,
      description: plugin.description,
      instructions: plugin.instructions,
    })
    setEditingField(null)
  }

  const handleSave = (field: Exclude<EditableField, null>) => {
    if (!onUpdate) {
      setEditingField(null)
      return
    }
    const value = draftValues[field]
    onUpdate({
      [field]: value,
    })
    setEditingField(null)
  }

  const renderField = (
    field: Exclude<EditableField, null>,
    label: string,
    multiline = false,
    helper?: string,
  ) => {
    const isEditing = editingField === field
    const value = draftValues[field]
    const original =
      field === 'name'
        ? plugin.name
        : field === 'description'
        ? plugin.description
        : plugin.instructions

    return (
      <div className="rounded-lg border border-border/40 bg-background/60 p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {label}
            </span>
            {helper && (
              <p className="text-xs text-muted-foreground/80">{helper}</p>
            )}
          </div>
          {isAdmin && (
            <button
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/20"
              onClick={() => (isEditing ? cancelEditing() : startEditing(field))}
            >
              {isEditing ? (
                <>
                  <XCircle size={14} />
                  <span>Cancel</span>
                </>
              ) : (
                <>
                  <PencilLine size={14} />
                  <span>Edit</span>
                </>
              )}
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-3">
            {multiline ? (
              <textarea
                value={value}
                onChange={(event) =>
                  setDraftValues((prev) => ({ ...prev, [field]: event.target.value }))
                }
                rows={field === 'instructions' ? 8 : 4}
                className="w-full rounded-md border border-border/50 bg-muted/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            ) : (
              <input
                value={value}
                onChange={(event) =>
                  setDraftValues((prev) => ({ ...prev, [field]: event.target.value }))
                }
                className="w-full rounded-md border border-border/50 bg-muted/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={cancelEditing}
                className="rounded-md px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted/20"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(field)}
                className="inline-flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground hover:bg-accent/90"
              >
                <Check size={14} />
                Save
              </button>
            </div>
          </div>
        ) : field === 'instructions' ? (
          <div className="prose prose-sm max-w-none text-sm text-foreground">
            <pre className="whitespace-pre-wrap rounded-md border border-border/30 bg-muted/10 px-3 py-3 font-mono text-[13px] leading-relaxed text-foreground">
              {original}
            </pre>
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground">{original}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex h-screen w-[420px] flex-col border-l border-border/60 bg-[hsl(var(--sidebar-background))]">
      <div className="flex items-start justify-between gap-4 border-b border-border/50 px-5 py-4">
        <div className="space-y-1">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {workspace.name}
          </div>
          <div className="text-lg font-semibold text-foreground leading-tight">
            {plugin.name}
          </div>
          {updatedLabel && (
            <div className="text-xs text-muted-foreground">
              Last updated {updatedLabel}
              {plugin.updatedBy ? ` • ${plugin.updatedBy}` : ''}
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1.5 text-muted-foreground transition hover:bg-muted/20 hover:text-foreground"
          aria-label="Close plugin details"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
        {renderField('name', 'Plugin Name', false, 'Visible to teammates in launchers and selectors.')}
        {renderField('description', 'Description', true, 'What teammates should expect when they use this plugin.')}
        {renderField('instructions', 'Custom Instructions', true, 'Guidance the agent follows whenever this plugin is active.')}
      </div>
    </div>
  )
}
