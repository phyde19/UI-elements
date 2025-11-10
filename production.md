# backend
from pydantic import BaseModel
from datetime import datetime

class Plugin(BaseModel):
    id: int
    name: str
    updated_at: datetime
    is_active: bool

class PluginResponse(BaseModel):
    id: str
    name: str
    description: str
    
class WorkspaceResponse(BaseModel):
    id: str
    name: str
    description: str
    plugins: list[PluginResponse]



from fastapi import APIRouter, Depends, HTTPException, status  
from typing import List, Annotated  
from schemas.plugins import WorkspaceResponse  
from config.settings import settings  
from db.connection import get_db  
from db.db import DB  
from schemas.auth import AccessGroup  
from routers.auth import get_current_user  
from ai.plugins.plugins_config import WorkspaceInfo  
from ai.plugins.plugins_routing import GROUP_WORKSPACE_MAP, WORKSPACES  
from functools import reduce  
  
def remove_dict_key(to_remove: str, dictionary: dict):  
    return { key: value for key, value in dictionary.items() if key != to_remove }  
  
def info_to_response(workspace_info: WorkspaceInfo) -> WorkspaceResponse:  
    args = remove_dict_key("enabled", workspace_info.model_dump())  
    args["plugins"] = [  
        remove_dict_key("enabled", plugin)  
        for plugin in args["plugins"]  
    ]  
    return WorkspaceResponse(**args)  
  
router = APIRouter(  
    prefix="/plugins",  
    responses={404: {"description": "Not found"}},  
)  
  
def get_workspace_info(groups: list[AccessGroup]) -> list[WorkspaceInfo]:  
    combined = [GROUP_WORKSPACE_MAP[group] for group in groups]  
    flattened = reduce(lambda curr, acc: curr + acc, combined, [])  
    user_workspace_ids = list(set(flattened))  
    return [  
        workspace.info()  
        for workspace in WORKSPACES  
        if workspace.id in user_workspace_ids  
    ]  
  
@router.get("/", response_model=list[WorkspaceResponse])  
async def get_all_plugins(  
    user: Annotated[dict, Depends(get_current_user)]  
) -> list[WorkspaceResponse]:  
    # If you store groups in Redis or session, fetch them here (modify get_current_user to return groups if needed)  
    # For now, just a placeholder -- you'll want to store groups in session_db at login and return them in get_current_user  
    groups = []  # Replace with actual group retrieval  
    user_workspaces = get_workspace_info(groups)  
    return [info_to_response(w) for w in user_workspaces]  
    
 
 
# frontend
import { ConversationsClient } from "./conversations-client";
import { FeedbackClient } from "./feedback-client";
import { PluginsClient } from "./plugins-client";

export class ApiClient {
  conversations: ConversationsClient;
  plugins: PluginsClient;
  feedback: FeedbackClient;

  constructor() {
    this.conversations = new ConversationsClient();
    this.plugins = new PluginsClient();
    this.feedback = new FeedbackClient();
  }
}

import { fetchApi } from "@/api/fetch-api";
import { Workspace } from "@/store/types";


type GroupByWorkspaceResponse = Workspace[]

export class PluginsClient {
  private readonly baseUrl: string;

  constructor() { 
    this.baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? ''
  }

  /** GET /plugins → list of plugins grouped by workspace */
  async groupByWorkspace(): Promise<GroupByWorkspaceResponse> {
    return await fetchApi<GroupByWorkspaceResponse>(
      `${this.baseUrl}/plugins/`
    )
  }
}

export type Plugin = {
  id: string;
  name: string;
  description: string;
}

export type Workspace = {
  id: string;
  name: string;
  description: string;
  plugins: Plugin[];
}



import { StateCreator } from 'zustand'  
import { CombinedSlices, PluginSlice, Workspace } from './types'  
  
export const createPluginSlice: StateCreator<  
  CombinedSlices,  
  [],  
  [],  
  PluginSlice  
> = (set) => ({  
  workspaces: [],  
  activeWorkspaceId: null,  
  activePluginId: null,  
  initPluginMenu: (workspaces: Workspace[]) => {  
    const firstWorkspace = workspaces && workspaces.length > 0 ? workspaces[0] : null;  
    const firstPlugin = firstWorkspace && firstWorkspace.plugins && firstWorkspace.plugins.length > 0  
      ? firstWorkspace.plugins[0]  
      : null;  
  
    set({  
      workspaces,  
      activeWorkspaceId: firstWorkspace ? firstWorkspace.id : null,  
      activePluginId: firstPlugin ? firstPlugin.id : null,  
    });  
  },  
  selectPlugin: (workspaceId: string, pluginId: string) => {  
    set({  
      activeWorkspaceId: workspaceId,  
      activePluginId: pluginId,  
    });  
  },  
});  

import { create } from 'zustand'
import { CombinedSlices } from './types'
import { createConversationSlice } from './conversationSlice'
import { createPluginSlice } from './pluginSlice'

export type CompassStore = ReturnType<typeof createCompassStore>

export const createCompassStore = () => {
  return create<CombinedSlices>()((set, get, api) => ({

    ...createConversationSlice(set, get, api),
    ...createPluginSlice(set, get, api)
  }))

}


"use client"

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompassStore } from '@/hooks/store-context';

import { 
  ChevronDown, 
  Check, 
  Zap, 
  Rocket, 
  Brain, 
  AppWindow,
  Users,
  Mountain,
  Wallet,
  Compass,
  ServerCog,
  SearchCode,
  Code2,
  FlaskConical,
  BadgeInfo,
  LogIn,
  Search,
  Handshake,
  ShieldCheck,
  SearchCheck,
  FileDiff,
  GraduationCap,
  FileBarChart,
  BarChart3,
  Gavel, 
  Database,
  MoveRight,
  X,
  Scale,
  ZapIcon,
  BrainCogIcon,
  ChevronRight,
  LucideIcon,
  CompassIcon,
  Notebook,
  NotebookPen,
  CodeXml,
  SearchIcon,
  BrainCog,
  Laugh,
  BookOpenCheck
} from 'lucide-react'
import { ThemeToggle } from '@/components/chat/theme-toggle';

const PLUGIN_METADATA: Record<string, any> = {
  'general:compass_assistant': {
    instructions:
      'Provide concise answers, cite internal sources, and recommend the most relevant workspace plugin when deeper support is needed.',
    updatedAt: '2025-04-08T13:42:00Z',
    updatedBy: 'Isha Gardner',
  },
  'general:compass_assistant_gemini': {
    instructions:
      'Flag that this is a preview experience. Provide structured reasoning steps and call out any confidence gaps.',
    updatedAt: '2025-04-09T18:20:00Z',
    updatedBy: 'Isha Gardner',
  },
  'general:career_development': {
    instructions:
      'Speak in a supportive tone. Suggest three concrete actions tied to Compass career competency models and provide timeline reminders.',
    updatedAt: '2025-04-07T15:20:00Z',
    updatedBy: 'Deandre Miles',
  },
  'general:hr_assistant': {
    instructions:
      'Reference the HR handbook and knowledge base articles for every response. Offer direct links to forms when possible and remind employees about escalation paths.',
    updatedAt: '2025-04-12T09:00:00Z',
    updatedBy: 'Nina Patel',
  },
  'general:journal': {
    instructions:
      'Ask one clarifying question, summarize key points in bullets, and remind the user where entries are stored.',
    updatedAt: '2025-04-10T07:30:00Z',
    updatedBy: 'Mara Lewis',
  },
  'general:my_benefits': {
    instructions:
      'Confirm eligibility before answering. Include relevant enrollment windows, and surface links to vendor portals.',
    updatedAt: '2025-04-05T11:05:00Z',
    updatedBy: 'Nina Patel',
  },
  'dscoe:code_writing_assistant': {
    instructions:
      'Adhere to the DSCOE style guide, include inline comments, and recommend unit tests when proposing new code.',
    updatedAt: '2025-04-06T16:10:00Z',
    updatedBy: 'Sasha Yuan',
  },
  'dscoe:dscoe_search_assistant': {
    instructions:
      'Always summarize findings with repository paths. Offer related notebooks or Slack channels for deeper support.',
    updatedAt: '2025-04-08T17:40:00Z',
    updatedBy: 'Sasha Yuan',
  },
  'dscoe:databricks_onboarding': {
    instructions:
      'Return step-by-step onboarding instructions with links to the Databricks playbook. Confirm completion before moving on.',
    updatedAt: '2025-04-11T09:12:00Z',
    updatedBy: 'Ian Donnelly',
  },
  'dscoe:sri_assistant': {
    instructions:
      'Request experiment context, propose hypotheses, and log recommended metrics in the initiative tracker.',
    updatedAt: '2025-04-04T12:05:00Z',
    updatedBy: 'Ian Donnelly',
  },
  'bluecard_its:onboarding': {
    instructions:
      'Provide a chronological checklist with completion tracking and link to ServiceNow for any access requests.',
    updatedAt: '2025-04-10T08:15:00Z',
    updatedBy: 'Kara James',
  },
  'bluecard_its:bluecard_search_assistant': {
    instructions:
      'Return the top three matches with snippets and reference IDs. Offer remediation steps if a known fix exists.',
    updatedAt: '2025-04-09T19:12:00Z',
    updatedBy: 'Kara James',
  },
  'bluecard_its:bcbsa_assistant': {
    instructions:
      'Keep responses diplomatic and policy-aligned. Include escalation tiers and partner contact groups.',
    updatedAt: '2025-04-07T13:20:00Z',
    updatedBy: 'Rafael Ortiz',
  },
  'subrogation:subrogation_assistant': {
    instructions:
      'Highlight liability outlook, cite source documents, and recommend next legal or negotiation steps.',
    updatedAt: '2025-04-05T16:12:00Z',
    updatedBy: 'Holly Nguyen',
  },
  'corporate_compliance:compliance_quiz_training': {
    instructions:
      'Ask three scenario-based questions, provide answer rationales, and log completion for LMS sync.',
    updatedAt: '2025-04-06T09:18:00Z',
    updatedBy: 'Reese Morgan',
  },
  'corporate_compliance:compliance_search_assistant': {
    instructions:
      'Always cite the controlling policy number. Provide a recommended reviewer or SME when uncertainty is high.',
    updatedAt: '2025-04-11T10:02:00Z',
    updatedBy: 'Liam Turner',
  },
  'corporate_compliance:contract_doc_compare': {
    instructions:
      'Deliver a three-part summary: key changes, risk assessment, and suggested redlines. Attach clause references.',
    updatedAt: '2025-04-08T12:30:00Z',
    updatedBy: 'Liam Turner',
  },
  'corporate_compliance:vendor_report': {
    instructions:
      'Include compliance status, outstanding actions, and trend analysis. Output a markdown summary and bullet recap.',
    updatedAt: '2025-04-04T14:44:00Z',
    updatedBy: 'Reese Morgan',
  },
  'marketing_research:marketing_search_assistant': {
    instructions:
      'Return results grouped by source type with insight summaries and recommended stakeholders.',
    updatedAt: '2025-04-10T10:48:00Z',
    updatedBy: 'Morgan Lee',
  },
  'marketing_research:nps_topic_modeling': {
    instructions:
      'Provide a ranked list of themes, include representative quotes, and flag emerging risks.',
    updatedAt: '2025-04-08T08:05:00Z',
    updatedBy: 'Morgan Lee',
  },
  'development:jokes': {
    instructions:
      'Produce short, workplace-friendly jokes. Add a brief safety disclaimer when humor might be misunderstood.',
    updatedAt: '2025-04-03T10:22:00Z',
    updatedBy: 'Dev Team',
  },
  'development:compass_plugin_guide': {
    instructions:
      'Walk engineers through scaffold commands, review checklists, and publishing steps for new plugins.',
    updatedAt: '2025-04-02T09:58:00Z',
    updatedBy: 'Dev Team',
  },
};

const workspaceIcons: Record<string, LucideIcon> = {
  general: AppWindow,
  dscoe: ServerCog,
  bluecard_its: BadgeInfo,
  corporate_compliance: ShieldCheck,
  marketing_research: BarChart3,
  subrogation: Scale,
  data_management: Database,
  development: CodeXml,
};

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
};

function getWorkspaceIcon(workspaceId: string): LucideIcon {
  return workspaceIcons[workspaceId] ?? AppWindow;
}

function getPluginIcon(workspaceId: string, pluginId: string): LucideIcon {
  return pluginIcons[workspaceId]?.[pluginId] ?? AppWindow;
}

function buildWorkspaceData(payload: WorkspacePayload[]) {
  const workspaces: Workspace[] = payload.map((workspace) => ({
    id: workspace.id,
    name: workspace.name,
    description: workspace.description,
    icon: getWorkspaceIcon(workspace.id),
  }));

  const pluginsByWorkspace: Record<string, any[]> = {};

  payload.forEach((workspace) => {
    pluginsByWorkspace[workspace.id] = workspace.plugins.map((plugin) => {
      const metadata = PLUGIN_METADATA[`${workspace.id}:${plugin.id}`] ?? {};
      return {
        ...plugin,
        icon: getPluginIcon(workspace.id, plugin.id),
        instructions: metadata.instructions,
        updatedAt: metadata.updatedAt,
        updatedBy: metadata.updatedBy,
      };
    });
  });

  return { workspaces, pluginsByWorkspace };
}


export default function PluginsPage() {
  const workspace_plugins = useCompassStore(s => s.workspaces)
  const { workspaces, pluginsByWorkspace } = buildWorkspaceData(workspace_plugins);

  const router = useRouter()

  const [activeWorkspaceFilter, setActiveWorkspaceFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const handleOpenDetails = (workspace: any, plugin: any) => {
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
            (plugin.instructions?.toLowerCase().includes(normalizedQuery) ?? false)
          )
        })

        return { workspace, plugins }
      })
      .filter((section) => section.plugins.length > 0)
  }, [filteredWorkspaces, pluginsByWorkspace, normalizedQuery])

  const renderPluginCard = (workspace: any, plugin: any) => {
    const Icon = plugin.icon
    return (
      <button
        key={plugin.id}
        onClick={() => handleOpenDetails(workspace, plugin)}
        className="group relative flex h-full min-h-[240px] flex-col rounded-2xl border border-border/50 bg-background/95 px-6 py-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:bg-background hover:shadow-[0_24px_48px_-28px_rgba(16,38,84,0.35)]"
      >
        <div className="flex items-center gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent ring-1 ring-accent/25 shadow-[0_12px_24px_-18px_rgba(16,111,210,0.45)] transition-colors group-hover:bg-accent/20">
            {Icon ? <Icon size={20} strokeWidth={1.6} /> : <PuzzleFallbackIcon />}
          </span>
          <h3 className="text-[1.05rem] font-semibold leading-snug text-foreground">
            {plugin.name}
          </h3>
        </div>

        <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-muted-foreground/70">
          {/* <span className="inline-flex items-center rounded-full bg-muted/25 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {workspace.name}
          </span> */}
          {plugin.updatedAt ? (
            <span>
              Updated {formatRelativeDate(plugin.updatedAt)}
              {plugin.updatedBy ? ` • ${plugin.updatedBy}` : ''}
            </span>
          ) : (
            <span className="text-muted-foreground/60">Not yet configured</span>
          )}
        </div>

        <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-4">
          {plugin.description}
        </p>

        <div className="mt-5 flex items-center justify-between text-[11px] font-medium text-muted-foreground/80">
          <span className="inline-flex items-center gap-1 text-muted-foreground/90">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-accent/70" />
            Configured
          </span>
          <span className="inline-flex items-center gap-1 text-accent">
            View details
            <span aria-hidden className="transition group-hover:translate-x-1">→</span>
          </span>
        </div>
      </button>
    )
  }

  return (

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
                Tip: search by plugin title, workspace, or any instructions that have been documented.
              </p>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">
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
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {plugins.map((plugin) => renderPluginCard(workspace, plugin))}
                    </div>
                  </section>
                ))}
              </div>
            )}
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



