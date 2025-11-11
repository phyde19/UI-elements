'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  ChevronDown,
  AppWindow,
  ServerCog,
  BadgeInfo,
  ShieldCheck,
  BarChart3,
  Scale,
  Database,
  CodeXml,
  Users,
  Mountain,
  Wallet,
  Compass,
  NotebookPen,
  Rocket,
  Search as SearchIcon,
  SearchCode,
  Code2,
  FlaskConical,
  LogIn,
  Handshake,
  SearchCheck,
  FileDiff,
  GraduationCap,
  FileBarChart,
  BrainCog,
  MoveRight,
  Laugh,
  BookOpenCheck,
  type LucideIcon,
} from 'lucide-react'

// Replace these imports with your production components
import { SideNavigation } from '../components/side-navigation'
import { ThemeToggle } from '../components/theme-toggle'
import { useCompassStore } from '@/hooks/store-context'

type SortColumn = 'plugin' | 'workspace' | 'status' | 'updated'
type SortDirection = 'asc' | 'desc'
type PluginInput =
  | {
      id: string
      label: string
      type: 'text' | 'number' | 'date'
      placeholder?: string
      helper?: string
      required?: boolean
      defaultValue?: string
    }
  | {
      id: string
      label: string
      type: 'select'
      options: { value: string; label: string }[]
      placeholder?: string
      helper?: string
      required?: boolean
      defaultValue?: string
    }
  | {
      id: string
      label: string
      type: 'textarea'
      placeholder?: string
      helper?: string
      required?: boolean
      defaultValue?: string
    }
  | {
      id: string
      label: string
      type: 'toggle'
      helper?: string
      defaultValue?: boolean
    }

type PluginPayload = {
  id: string
  name: string
  description: string
  inputs?: PluginInput[]
}
type WorkspacePayload = {
  id: string
  name: string
  description: string
  plugins: PluginPayload[]
}
type PluginMetadata = {
  instructions?: string
  updatedAt?: string
  updatedBy?: string
}
type PluginWithMetadata = PluginPayload &
  PluginMetadata & {
    icon?: LucideIcon
  }
type WorkspaceWithIcon = WorkspacePayload & {
  icon: LucideIcon
}

const WORKSPACE_PAYLOAD: WorkspacePayload[] = [
  {
    id: 'general',
    name: 'General',
    description: 'Common AI capabilities for general use',
    plugins: [
      {
        id: 'compass_assistant',
        name: 'Compass (GPT-4.1)',
        description: 'Help with using the Compass platform',
        inputs: [
          {
            id: 'context',
            label: 'Context summary',
            type: 'textarea',
            placeholder: 'Optional background to bias the assistant',
          },
        ],
      },
      {
        id: 'compass_assistant_gemini',
        name: 'Compass (Gemini Flash 2.5)',
        description: 'Help with using the Compass platform',
      },
      {
        id: 'career_development',
        name: 'Career development',
        description: 'Career growth and development assistance',
      },
      {
        id: 'hr_assistant',
        name: 'HR assistant',
        description: 'Help with HR-related questions and policies',
      },
      {
        id: 'journal',
        name: 'Notes',
        description: 'Log and manage personal notes with Compass',
      },
      {
        id: 'my_benefits',
        name: 'My Benefits',
        description: 'Information about employee benefits',
      },
    ],
  },
  {
    id: 'dscoe',
    name: 'DSCOE',
    description: 'Data Science Center of Excellence tools',
    plugins: [
      {
        id: 'code_writing_assistant',
        name: 'Code writing assistant',
        description: 'Help with writing and debugging code',
      },
      {
        id: 'dscoe_search_assistant',
        name: 'DSCOE Search assistant',
        description: 'Search through DSCOE documentation',
      },
      {
        id: 'databricks_onboarding',
        name: 'Databricks Onboarding',
        description: 'Get started with Databricks platform',
      },
      {
        id: 'sri_assistant',
        name: 'SRI assistant',
        description: 'Support for scientific research initiatives',
      },
      {
        id: 'clarity_member_lookup',
        name: 'Clarity Member Lookup',
        description: 'Care managers can query member utilization details.',
        inputs: [
          {
            id: 'member_id',
            label: 'Member number',
            type: 'text',
            placeholder: 'e.g. 76391234',
            required: true,
          },
        ],
      },
    ],
  },
  {
    id: 'bluecard_its',
    name: 'BlueCard ITS',
    description: 'BlueCard Information Technology Services',
    plugins: [
      {
        id: 'onboarding',
        name: 'Onboarding',
        description: 'Onboarding process for new employees',
      },
      {
        id: 'bluecard_search_assistant',
        name: 'BlueCard Search assistant',
        description: 'Search through BlueCard documentation',
        inputs: [
          {
            id: 'case_id',
            label: 'Case ID',
            type: 'text',
            placeholder: 'Optional – limit search results to a case',
          },
        ],
      },
      {
        id: 'bcbsa_assistant',
        name: 'BCBSA assistant',
        description: 'Help with BCBSA-related inquiries',
      },
    ],
  },
  {
    id: 'subrogation',
    name: 'Subrogation',
    description: 'Subrogation claims and processing',
    plugins: [
      {
        id: 'subrogation_assistant',
        name: 'Subrogation assistant',
        description: 'Help with subrogation processes',
      },
    ],
  },
  {
    id: 'corporate_compliance',
    name: 'Corporate Compliance',
    description: 'Compliance and regulatory resources',
    plugins: [
      {
        id: 'compliance_quiz_training',
        name: 'Compliance quiz/training',
        description: 'Interactive compliance training and quizzes',
      },
      {
        id: 'compliance_search_assistant',
        name: 'Compliance Search assistant',
        description: 'Search through compliance documentation',
      },
      {
        id: 'contract_doc_compare',
        name: 'Contract/Doc compare',
        description: 'Compare and analyze contract documents',
      },
      {
        id: 'vendor_report',
        name: 'Vendor report',
        description: 'Generate and analyze vendor reports',
      },
    ],
  },
  {
    id: 'marketing_research',
    name: 'Marketing Research',
    description: 'Marketing analysis and research tools',
    plugins: [
      {
        id: 'marketing_search_assistant',
        name: 'Marketing Search assistant',
        description: 'Search through marketing resources',
      },
      {
        id: 'nps_topic_modeling',
        name: 'NPS topic modeling',
        description: 'Analyze Net Promoter Score feedback',
      },
    ],
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Plugins in development / testing',
    plugins: [
      {
        id: 'jokes',
        name: 'Jokes Assistant',
        description: 'Demo Jokes Assistant',
      },
      {
        id: 'compass_plugin_guide',
        name: 'Compass Plugin Guide',
        description: 'Compass Plugin Development guide for developers',
      },
    ],
  },
]

const PLUGIN_METADATA: Record<string, PluginMetadata> = {
  'general:compass_assistant': {
    instructions:
      'Provide concise answers, cite internal sources, and recommend the most relevant workspace plugin when deeper support is needed.',
    updatedAt: '2025-04-08T13:42:00Z',
    updatedBy: 'admin_1',
  },
  'general:compass_assistant_gemini': {
    instructions:
      'Flag that this is a preview experience. Provide structured reasoning steps and call out any confidence gaps.',
    updatedAt: '2025-04-09T18:20:00Z',
    updatedBy: 'admin_2',
  },
  'general:career_development': {
    instructions:
      'Speak in a supportive tone. Suggest three concrete actions tied to Compass career competency models and provide timeline reminders.',
    updatedAt: '2025-04-07T15:20:00Z',
    updatedBy: 'admin_3',
  },
  'general:hr_assistant': {
    instructions:
      'Reference the HR handbook and knowledge base articles for every response. Offer direct links to forms when possible and remind employees about escalation paths.',
    updatedAt: '2025-04-12T09:00:00Z',
    updatedBy: 'admin_4',
  },
  'general:journal': {
    instructions:
      'Ask one clarifying question, summarize key points in bullets, and remind the user where entries are stored.',
    updatedAt: '2025-04-10T07:30:00Z',
    updatedBy: 'admin_5',
  },
  'general:my_benefits': {
    instructions:
      'Confirm eligibility before answering. Include relevant enrollment windows, and surface links to vendor portals.',
    updatedAt: '2025-04-05T11:05:00Z',
    updatedBy: 'admin_6',
  },
  'dscoe:code_writing_assistant': {
    instructions:
      'Adhere to the DSCOE style guide, include inline comments, and recommend unit tests when proposing new code.',
    updatedAt: '2025-04-06T16:10:00Z',
    updatedBy: 'admin_7',
  },
  'dscoe:dscoe_search_assistant': {
    instructions:
      'Always summarize findings with repository paths. Offer related notebooks or Slack channels for deeper support.',
    updatedAt: '2025-04-08T17:40:00Z',
    updatedBy: 'admin_8',
  },
  'dscoe:databricks_onboarding': {
    instructions:
      'Return step-by-step onboarding instructions with links to the Databricks playbook. Confirm completion before moving on.',
    updatedAt: '2025-04-11T09:12:00Z',
    updatedBy: 'admin_9',
  },
  'dscoe:sri_assistant': {
    instructions:
      'Request experiment context, propose hypotheses, and log recommended metrics in the initiative tracker.',
    updatedAt: '2025-04-04T12:05:00Z',
    updatedBy: 'admin_10',
  },
  'bluecard_its:onboarding': {
    instructions:
      'Provide a chronological checklist with completion tracking and link to ServiceNow for any access requests.',
    updatedAt: '2025-04-10T08:15:00Z',
    updatedBy: 'admin_11',
  },
  'bluecard_its:bluecard_search_assistant': {
    instructions:
      'Return the top three matches with snippets and reference IDs. Offer remediation steps if a known fix exists.',
    updatedAt: '2025-04-09T19:12:00Z',
    updatedBy: 'admin_12',
  },
  'bluecard_its:bcbsa_assistant': {
    instructions:
      'Keep responses diplomatic and policy-aligned. Include escalation tiers and partner contact groups.',
    updatedAt: '2025-04-07T13:20:00Z',
    updatedBy: 'admin_13',
  },
  'subrogation:subrogation_assistant': {
    instructions:
      'Highlight liability outlook, cite source documents, and recommend next legal or negotiation steps.',
    updatedAt: '2025-04-05T16:12:00Z',
    updatedBy: 'admin_14',
  },
  'corporate_compliance:compliance_quiz_training': {
    instructions:
      'Ask three scenario-based questions, provide answer rationales, and log completion for LMS sync.',
    updatedAt: '2025-04-06T09:18:00Z',
    updatedBy: 'admin_15',
  },
  'corporate_compliance:compliance_search_assistant': {
    instructions:
      'Always cite the controlling policy number. Provide a recommended reviewer or SME when uncertainty is high.',
    updatedAt: '2025-04-11T10:02:00Z',
    updatedBy: 'admin_16',
  },
  'corporate_compliance:contract_doc_compare': {
    instructions:
      'Deliver a three-part summary: key changes, risk assessment, and suggested redlines. Attach clause references.',
    updatedAt: '2025-04-08T12:30:00Z',
    updatedBy: 'admin_17',
  },
  'corporate_compliance:vendor_report': {
    instructions:
      'Include compliance status, outstanding actions, and trend analysis. Output a markdown summary and bullet recap.',
    updatedAt: '2025-04-04T14:44:00Z',
    updatedBy: 'admin_18',
  },
  'marketing_research:marketing_search_assistant': {
    instructions:
      'Return results grouped by source type with insight summaries and recommended stakeholders.',
    updatedAt: '2025-04-10T10:48:00Z',
    updatedBy: 'admin_19',
  },
  'marketing_research:nps_topic_modeling': {
    instructions:
      'Provide a ranked list of themes, include representative quotes, and flag emerging risks.',
    updatedAt: '2025-04-08T08:05:00Z',
    updatedBy: 'admin_20',
  },
  'development:jokes': {
    instructions:
      'Produce short, workplace-friendly jokes. Add a brief safety disclaimer when humor might be misunderstood.',
    updatedAt: '2025-04-03T10:22:00Z',
    updatedBy: 'admin_21',
  },
  'development:compass_plugin_guide': {
    instructions:
      'Walk engineers through scaffold commands, review checklists, and publishing steps for new plugins.',
    updatedAt: '2025-04-02T09:58:00Z',
    updatedBy: 'admin_22',
  },
}

const workspaceIcons: Record<string, LucideIcon> = {
  general: AppWindow,
  dscoe: ServerCog,
  bluecard_its: BadgeInfo,
  corporate_compliance: ShieldCheck,
  marketing_research: BarChart3,
  subrogation: Scale,
  data_management: Database,
  development: CodeXml,
}

const pluginIcons: Record<string, Record<string, LucideIcon>> = {
  general: {
    hr_assistant: Users,
    career_development: Mountain,
    my_benefits: Wallet,
    compass_assistant: Compass,
    compass_assistant_gemini: Compass,
    journal: NotebookPen,
  },
  dscoe: {
    databricks_onboarding: Rocket,
    dscoe_search_assistant: SearchCode,
    code_writing_assistant: Code2,
    sri_assistant: FlaskConical,
  },
  bluecard_its: {
    onboarding: LogIn,
    bluecard_search_assistant: SearchIcon,
    bcbsa_assistant: Handshake,
  },
  corporate_compliance: {
    compliance_search_assistant: SearchCheck,
    contract_doc_compare: FileDiff,
    compliance_quiz_training: GraduationCap,
    vendor_report: FileBarChart,
  },
  marketing_research: {
    marketing_search_assistant: SearchIcon,
    nps_topic_modeling: BrainCog,
  },
  subrogation: {
    subrogation_assistant: Scale,
  },
  data_management: {
    data_management_assistant: Database,
    big_query_migration_assistant: MoveRight,
  },
  development: {
    jokes: Laugh,
    compass_plugin_guide: BookOpenCheck,
  },
}

function getWorkspaceIcon(workspaceId: string): LucideIcon {
  return workspaceIcons[workspaceId] ?? AppWindow
}

function getPluginIcon(workspaceId: string, pluginId: string): LucideIcon {
  return pluginIcons[workspaceId]?.[pluginId] ?? AppWindow
}

function buildWorkspaceData(payload: WorkspacePayload[]) {
  const workspaces: WorkspaceWithIcon[] = payload.map((workspace) => ({
    ...workspace,
    icon: getWorkspaceIcon(workspace.id),
  }))

  const pluginsByWorkspace: Record<string, PluginWithMetadata[]> = {}

  payload.forEach((workspace) => {
    pluginsByWorkspace[workspace.id] = workspace.plugins.map((plugin) => {
      const metadata = PLUGIN_METADATA[`${workspace.id}:${plugin.id}`] ?? {}
      return {
        ...plugin,
        icon: getPluginIcon(workspace.id, plugin.id),
        ...metadata,
      }
    })
  })

  return { workspaces, pluginsByWorkspace }
}

export default function PluginsPage() {
  const workspacePayload = useCompassStore((state) => state.workspaces)
  const router = useRouter()
  const { workspaces, pluginsByWorkspace } = useMemo(
    () => {
      const payload =
        workspacePayload && workspacePayload.length > 0 ? workspacePayload : WORKSPACE_PAYLOAD
      return buildWorkspaceData(payload as WorkspacePayload[])
    },
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
        <div className="flex flex-1 flex-col overflow-hidden bg-muted/10">
          <main className="flex flex-1 flex-col overflow-y-auto">
            <header className="border-b border-border/15 bg-gradient-to-b from-background via-background/95 to-background/90 px-6 py-5 shadow-[0_12px_24px_-18px_rgba(15,23,42,0.65)] lg:px-10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground/80">
                    Admin dashboard
                  </p>
                  <h1 className="text-2xl font-semibold text-foreground">Plugin administration</h1>
                  <p className="text-sm text-muted-foreground/90">
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
                      className="h-11 w-full rounded-lg border border-border/50 bg-[rgba(15,23,42,0.04)] pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-accent/30 dark:bg-white/5"
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
                <header className="grid grid-cols-[1.5fr,.9fr,.9fr,.9fr,120px] items-center gap-3 border-b border-border/15 bg-muted/10 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
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
                  <div className="divide-y divide-border/10">
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
    <div className="grid grid-cols-[1.5fr,.9fr,.9fr,.9fr,120px] items-center gap-3 px-5 py-4 text-sm transition hover:bg-muted/20">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border/30 bg-muted/30 text-accent">
          {Icon ? <Icon size={18} /> : <PuzzleFallbackIcon />}
        </div>
        <div>
          <p className="font-semibold text-foreground">{plugin.name}</p>
          <p className="text-xs text-muted-foreground line-clamp-1">{plugin.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-md border border-border/40 bg-muted/20 px-2 py-0.5 text-xs">
          {workspace.name}
        </span>
      </div>
      <div className="text-xs font-medium">
        {plugin.updatedAt ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-amber-500">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Needs setup
          </span>
        )}
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
          Configure
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
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    window.addEventListener('mousedown', handleClick)
    return () => window.removeEventListener('mousedown', handleClick)
  }, [])

  const selected =
    value === 'all' ? { id: 'all', name: 'All workspaces' } : options.find((option) => option.id === value)

  const handleSelect = (id: string) => {
    onChange(id)
    setIsOpen(false)
  }

  return (
    <div className="relative flex w-full flex-col gap-1 lg:max-w-[240px]" ref={containerRef}>
      <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Workspace</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex h-11 w-full items-center justify-between rounded-lg border border-border/40 bg-[rgba(15,23,42,0.04)] px-3 text-sm font-medium text-foreground shadow-inner shadow-black/5 transition hover:border-border/60 focus:outline-none focus:ring-2 focus:ring-accent/30 dark:border-white/20 dark:bg-[rgba(255,255,255,0.08)]"
        >
          <span className="truncate">{selected?.name ?? 'Select workspace'}</span>
          <ChevronDown size={14} className={`transition ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 origin-top overflow-auto rounded-lg border border-border/40 bg-background shadow-2xl shadow-black/40">
            <OptionRow label="All workspaces" active={value === 'all'} onSelect={() => handleSelect('all')} />
            <div className="border-t border-border/20" />
            {options.map((workspace) => (
              <OptionRow
                key={workspace.id}
                label={workspace.name}
                active={workspace.id === value}
                onSelect={() => handleSelect(workspace.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function OptionRow({
  label,
  active,
  onSelect,
}: {
  label: string
  active: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm ${
        active
          ? 'bg-accent/10 text-accent'
          : 'text-muted-foreground hover:bg-muted/20 hover:text-foreground'
      }`}
    >
      <span className="truncate">{label}</span>
    </button>
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
