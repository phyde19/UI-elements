'use client'

import { useEffect, useMemo, useState } from 'react'
import { useWorkspaceContext } from '../../lib/workspace-context'
import { useLayout } from '../../lib/layout-context'
import { X } from 'lucide-react'

export function PluginSettingsPanel() {
  const { workspaces, selectedWorkspaceId, pluginsByWorkspace, selectedPluginId } = useWorkspaceContext()
  const { closeRightPanel } = useLayout()

  const workspace = useMemo(
    () => workspaces.find((ws) => ws.id === selectedWorkspaceId) ?? workspaces[0],
    [selectedWorkspaceId, workspaces],
  )

  const plugin = useMemo(() => {
    if (!workspace) return undefined
    const candidates = pluginsByWorkspace[workspace.id] ?? []
    if (selectedPluginId) {
      return candidates.find((plg) => plg.id === selectedPluginId) ?? candidates[0]
    }
    return candidates[0]
  }, [pluginsByWorkspace, workspace, selectedPluginId])

  const [inputValues, setInputValues] = useState<Record<string, string | boolean>>({})

  useEffect(() => {
    const defaults = (plugin?.inputs ?? []).reduce<Record<string, string | boolean>>((acc, input) => {
      if (input.type === 'toggle') {
        acc[input.id] = input.defaultValue ?? false
      } else {
        acc[input.id] = input.defaultValue ?? ''
      }
      return acc
    }, {})
    setInputValues(defaults)
  }, [plugin?.id, plugin?.inputs])

  if (!workspace || !plugin) {
    return (
      <aside className="mt-4 mb-4 mr-4 flex h-[calc(100vh-32px)] w-[380px] flex-col overflow-hidden rounded-xl border border-border/50 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900/95">
        <PanelHeader title="No plugin selected" subtitle="Choose a workspace plugin to manage inputs." onClose={closeRightPanel} />
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-muted-foreground">
          Nothing to configure yet.
        </div>
      </aside>
    )
  }

  const handleInputChange = (id: string, value: string | boolean) => {
    setInputValues((prev) => ({ ...prev, [id]: value }))
  }

  return (
    <aside className="mt-4 mb-4 mr-4 flex h-[calc(100vh-32px)] w-[380px] flex-col overflow-hidden rounded-xl border border-border/50 bg-white shadow-xl dark:border-neutral-800 dark:bg-neutral-900/95">
      <PanelHeader
        title={plugin.name}
        subtitle={`${workspace.name} workspace`}
        onClose={closeRightPanel}
      />

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {(plugin.inputs ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No additional inputs are required for this plugin.</p>
        ) : (
          <div className="space-y-5">
            {(plugin.inputs ?? []).map((input) => (
              <div
                key={input.id}
                className="space-y-2 rounded-md border border-border/40 bg-white px-4 py-3 shadow-sm dark:border-neutral-800 dark:bg-[#1b1b1d]"
              >
                <label className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                  {input.label}
                  {input.required && (
                    <span className="ml-2 text-xs font-medium uppercase tracking-wide text-destructive">Required</span>
                  )}
                </label>
                {input.helper && (
                  <p className="text-xs text-muted-foreground text-gray-500 dark:text-neutral-300">{input.helper}</p>
                )}
                {renderInputControl(input, inputValues[input.id], (value) => handleInputChange(input.id, value))}
              </div>
            ))}
          </div>
        )}
      </div>

    </aside>
  )
}

function renderInputControl(
  input: NonNullable<typeof plugin>[] extends never ? never : any,
  value: string | boolean | undefined,
  onChange: (value: string | boolean) => void,
) {
  switch (input.type) {
    case 'text':
    case 'number':
    case 'date':
      return (
        <input
          type={input.type}
          value={(value as string) ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={input.placeholder}
          className="h-11 w-full rounded-md border border-border/40 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-border dark:border-neutral-700 dark:bg-[#1f1f21] dark:text-neutral-50"
        />
      )
    case 'textarea':
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={(event) => onChange(event.target.value)}
          placeholder={input.placeholder}
          rows={4}
          className="w-full resize-none rounded-md border border-border/40 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-border dark:border-neutral-700 dark:bg-[#1f1f21] dark:text-neutral-50"
        />
      )
    case 'select':
      return (
        <select
          value={(value as string) ?? input.defaultValue ?? ''}
          onChange={(event) => onChange(event.target.value)}
          className="h-11 w-full rounded-md border border-border/40 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-border dark:border-neutral-700 dark:bg-[#1f1f21] dark:text-neutral-50"
        >
          <option value="" disabled={Boolean(input.defaultValue)}>
            {input.placeholder || 'Select an option'}
          </option>
          {input.options.map((option: { value: string; label: string }) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )
    case 'toggle':
      return (
        <button
          type="button"
          onClick={() => onChange(!(value as boolean))}
          className={`h-6 w-11 rounded-full border border-border/40 p-0.5 transition ${
            value ? 'bg-foreground border-foreground' : 'bg-border/40'
          }`}
        >
          <span
            className={`block h-5 w-5 rounded-full bg-background shadow-sm transition dark:bg-[#1f1f21] ${
              value ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      )
    default:
      return null
  }
}

function PanelHeader({
  title,
  subtitle,
  onClose,
}: {
  title: string
  subtitle?: string
  onClose: () => void
}) {
  return (
    <header className="flex items-center justify-between border-b border-border/40 bg-white px-6 py-5 dark:border-neutral-800 dark:bg-[#181819]">
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">Plugin inputs</p>
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-xs text-gray-600 dark:text-gray-400">{subtitle}</p>}
      </div>
      <button
        onClick={onClose}
        className="rounded-full p-1.5 text-muted-foreground transition hover:bg-muted/20 hover:text-foreground"
        aria-label="Close plugin settings"
      >
        <X size={15} />
      </button>
    </header>
  )
}
