'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Copy, Link as LinkIcon } from 'lucide-react'

// Replace these imports with your production components
import { SideNavigation } from '../../../components/side-navigation'
import { ThemeToggle } from '../../../components/theme-toggle'

import { PluginDetailPanel } from '../../../components/plugin-detail-panel'
import { useCompassStore } from '@/hooks/store-context'
import {
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

interface PluginDetailPageProps {
  params: {
    workspaceId: string
    pluginId: string
  }
}

type PluginOverrideMap = Record<string, Partial<PluginWithMetadata>>

type PluginPayload = { id: string; name: string; description: string }
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
      { id: 'compass_assistant', name: 'Compass (GPT-4.1)', description: 'Help with using the Compass platform' },
      { id: 'compass_assistant_gemini', name: 'Compass (Gemini Flash 2.5)', description: 'Help with using the Compass platform' },
      { id: 'career_development', name: 'Career development', description: 'Career growth and development assistance' },
      { id: 'hr_assistant', name: 'HR assistant', description: 'Help with HR-related questions and policies' },
      { id: 'journal', name: 'Notes', description: 'Log and manage personal notes with Compass' },
      { id: 'my_benefits', name: 'My Benefits', description: 'Information about employee benefits' },
    ],
  },
  {
    id: 'dscoe',
    name: 'DSCOE',
    description: 'Data Science Center of Excellence tools',
    plugins: [
      { id: 'code_writing_assistant', name: 'Code writing assistant', description: 'Help with writing and debugging code' },
      { id: 'dscoe_search_assistant', name: 'DSCOE Search assistant', description: 'Search through DSCOE documentation' },
      { id: 'databricks_onboarding', name: 'Databricks Onboarding', description: 'Get started with Databricks platform' },
      { id: 'sri_assistant', name: 'SRI assistant', description: 'Support for scientific research initiatives' },
    ],
  },
  {
    id: 'bluecard_its',
    name: 'BlueCard ITS',
    description: 'BlueCard Information Technology Services',
    plugins: [
      { id: 'onboarding', name: 'Onboarding', description: 'Onboarding process for new employees' },
      { id: 'bluecard_search_assistant', name: 'BlueCard Search assistant', description: 'Search through BlueCard documentation' },
      { id: 'bcbsa_assistant', name: 'BCBSA assistant', description: 'Help with BCBSA-related inquiries' },
    ],
  },
  {
    id: 'subrogation',
    name: 'Subrogation',
    description: 'Subrogation claims and processing',
    plugins: [{ id: 'subrogation_assistant', name: 'Subrogation assistant', description: 'Help with subrogation processes' }],
  },
  {
    id: 'corporate_compliance',
    name: 'Corporate Compliance',
    description: 'Compliance and regulatory resources',
    plugins: [
      { id: 'compliance_quiz_training', name: 'Compliance quiz/training', description: 'Interactive compliance training and quizzes' },
      { id: 'compliance_search_assistant', name: 'Compliance Search assistant', description: 'Search through compliance documentation' },
      { id: 'contract_doc_compare', name: 'Contract/Doc compare', description: 'Compare and analyze contract documents' },
      { id: 'vendor_report', name: 'Vendor report', description: 'Generate and analyze vendor reports' },
    ],
  },
  {
    id: 'marketing_research',
    name: 'Marketing Research',
    description: 'Marketing analysis and research tools',
    plugins: [
      { id: 'marketing_search_assistant', name: 'Marketing Search assistant', description: 'Search through marketing resources' },
      { id: 'nps_topic_modeling', name: 'NPS topic modeling', description: 'Analyze Net Promoter Score feedback' },
    ],
  },
  {
    id: 'development',
    name: 'Development',
    description: 'Plugins in development / testing',
    plugins: [
      { id: 'jokes', name: 'Jokes Assistant', description: 'Demo Jokes Assistant' },
      { id: 'compass_plugin_guide', name: 'Compass Plugin Guide', description: 'Compass Plugin Development guide for developers' },
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

export default function PluginDetailPage({ params }: PluginDetailPageProps) {
  const { workspaceId, pluginId } = params
  const router = useRouter()
  const workspacePayload = useCompassStore((state) => state.workspaces)
  const { workspaces, pluginsByWorkspace } = useMemo(() => {
    const payload =
      workspacePayload && workspacePayload.length > 0 ? workspacePayload : WORKSPACE_PAYLOAD
    return buildWorkspaceData(payload as WorkspacePayload[])
  }, [workspacePayload])
  const [overrides, setOverrides] = useState<PluginOverrideMap>({})

  const workspace = workspaces.find((candidate) => candidate.id === workspaceId)
  const plugin = pluginsByWorkspace[workspaceId]?.find((candidate) => candidate.id === pluginId)
  const metadataKey = workspace && plugin ? `${workspace.id}:${plugin.id}` : null

  const resolvedPlugin = useMemo<PluginWithMetadata | null>(() => {
    if (!plugin) return null
    if (!metadataKey) return plugin
    const override = overrides[metadataKey]
    return override ? { ...plugin, ...override } : plugin
  }, [metadataKey, overrides, plugin])

  const lastUpdatedLabel = useMemo(() => {
    if (!resolvedPlugin?.updatedAt) return null
    const date = new Date(resolvedPlugin.updatedAt)
    if (Number.isNaN(date.getTime())) return null
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }, [resolvedPlugin?.updatedAt])

  const handleUpdate = (updates: Partial<PluginWithMetadata>) => {
    if (!metadataKey) return
    const enrichedUpdates: Partial<PluginWithMetadata> = {
      ...updates,
      updatedAt: new Date().toISOString(),
      updatedBy: 'You',
    }
    setOverrides((prev) => ({
      ...prev,
      [metadataKey]: {
        ...prev[metadataKey],
        ...enrichedUpdates,
      },
    }))
  }

  const handleCopyLink = () => {
    if (typeof window === 'undefined') return
    navigator.clipboard.writeText(`${window.location.origin}/plugins/${workspaceId}/${pluginId}`)
  }

  if (!workspace || !resolvedPlugin) {
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
                    <h1 className="text-3xl font-semibold text-foreground">{resolvedPlugin.name}</h1>
                    <span className="rounded-full border border-border/40 bg-muted/20 px-3 py-1 text-xs font-medium text-muted-foreground">
                      Configuration
                    </span>
                  </div>
                  <p className="max-w-3xl text-sm text-muted-foreground">
                    Keep this capability aligned with policy and practice. Update the labels your colleagues see,
                    refine the guardrails the agent follows, and review every edit before it reaches production.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground/80">
                    <div>
                      {lastUpdatedLabel ? (
                        <>
                          Last updated{' '}
                          <span className="font-medium text-foreground">{lastUpdatedLabel}</span>
                          {resolvedPlugin.updatedBy ? ` by ${resolvedPlugin.updatedBy}` : ''}
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
                    <p className="mt-1 font-medium text-foreground">{`${workspace.name} / ${resolvedPlugin.name}`}</p>
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
                    <p className="mt-1">Granted</p>
                  </div>
                </aside>
              </div>
            </section>

            <PluginDetailPanel
              workspace={workspace}
              plugin={resolvedPlugin}
              isAdmin
              onUpdate={handleUpdate}
              layout="page"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
