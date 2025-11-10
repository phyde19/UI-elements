'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { LucideIcon } from 'lucide-react';
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
} from 'lucide-react';

export interface Workspace {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
}

export interface Plugin {
  id: string;
  name: string;
  description: string;
  icon?: LucideIcon;
  instructions?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export interface Chat {
  id: string;
  title: string;
  lastActive: string;
}

interface WorkspaceContextValue {
  workspaces: Workspace[];
  selectedWorkspaceId: string;
  selectWorkspace: (id: string) => void;
  plugins: Plugin[];
  pluginsByWorkspace: Record<string, Plugin[]>;
  selectedPluginId: string;
  selectPlugin: (id: string) => void;
  updatePluginConfig: (workspaceId: string, pluginId: string, updates: Partial<Plugin>) => void;
  chats: Chat[];
  isAdmin: boolean;
}

interface PluginPayload {
  id: string;
  name: string;
  description: string;
}

interface WorkspacePayload {
  id: string;
  name: string;
  description: string;
  plugins: PluginPayload[];
}

interface PluginMetadata {
  instructions?: string;
  updatedAt?: string;
  updatedBy?: string;
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
        description: 'Compass Plugin development guide for developers',
      },
    ],
  },
];

const PLUGIN_METADATA: Record<string, PluginMetadata> = {
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

  const pluginsByWorkspace: Record<string, Plugin[]> = {};

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

const { workspaces: INITIAL_WORKSPACES, pluginsByWorkspace: INITIAL_PLUGINS_BY_WORKSPACE } =
  buildWorkspaceData(WORKSPACE_PAYLOAD);

const DEFAULT_WORKSPACE_ID = INITIAL_WORKSPACES[0]?.id ?? '';
const DEFAULT_PLUGIN_ID =
  (DEFAULT_WORKSPACE_ID && INITIAL_PLUGINS_BY_WORKSPACE[DEFAULT_WORKSPACE_ID]?.[0]?.id) || '';

const DUMMY_CHATS: Record<string, Chat[]> = {
  compass_assistant: [
    { id: 'chat1', title: 'Team meeting prep notes', lastActive: '30m ago' },
  ],
  compass_assistant_gemini: [
    { id: 'chat2', title: 'Scenario planning (preview)', lastActive: '3h ago' },
  ],
  career_development: [
    { id: 'chat3', title: 'Q2 growth plan draft', lastActive: '4h ago' },
  ],
  hr_assistant: [
    { id: 'chat4', title: 'Leave policy clarification', lastActive: '2h ago' },
  ],
  journal: [
    { id: 'chat5', title: 'Daily reflection – Apr 12', lastActive: 'Last night' },
  ],
  my_benefits: [
    { id: 'chat6', title: 'HSA contribution changes', lastActive: '6h ago' },
  ],
  databricks_onboarding: [
    { id: 'chat7', title: 'Cluster setup checklist', lastActive: 'Yesterday' },
  ],
  dscoe_search_assistant: [
    { id: 'chat8', title: 'Feature store lookup', lastActive: '3h ago' },
  ],
  code_writing_assistant: [
    { id: 'chat9', title: 'PySpark window logic', lastActive: '40m ago' },
  ],
  sri_assistant: [
    { id: 'chat10', title: 'Experiment 219 follow-up', lastActive: '2d ago' },
  ],
  onboarding: [
    { id: 'chat11', title: 'New analyst setup', lastActive: 'Today' },
  ],
  bluecard_search_assistant: [
    { id: 'chat12', title: 'Claims workflow fix', lastActive: '5h ago' },
  ],
  bcbsa_assistant: [
    { id: 'chat13', title: 'Partner escalation template', lastActive: 'Yesterday' },
  ],
  subrogation_assistant: [
    { id: 'chat14', title: 'Motor vehicle recovery', lastActive: '1h ago' },
  ],
  compliance_quiz_training: [
    { id: 'chat15', title: 'AML refresher drill', lastActive: '3d ago' },
  ],
  compliance_search_assistant: [
    { id: 'chat16', title: 'Third-party policy lookup', lastActive: '2h ago' },
  ],
  contract_doc_compare: [
    { id: 'chat17', title: 'MSA redlines summary', lastActive: '5h ago' },
  ],
  vendor_report: [
    { id: 'chat18', title: 'Vendor compliance snapshot', lastActive: 'Today' },
  ],
  marketing_search_assistant: [
    { id: 'chat19', title: 'Campaign brief digest', lastActive: '2h ago' },
  ],
  nps_topic_modeling: [
    { id: 'chat20', title: 'Q1 feedback themes', lastActive: '8h ago' },
  ],
  jokes: [
    { id: 'chat21', title: 'Stand-up bits', lastActive: '45m ago' },
  ],
  compass_plugin_guide: [
    { id: 'chat22', title: 'Scaffold walkthrough', lastActive: 'Today' },
  ],
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(DEFAULT_WORKSPACE_ID);
  const [pluginsByWorkspace, setPluginsByWorkspace] = useState<Record<string, Plugin[]>>(
    INITIAL_PLUGINS_BY_WORKSPACE,
  );
  const [selectedPluginId, setSelectedPluginId] = useState(DEFAULT_PLUGIN_ID);

  useEffect(() => {
    const pluginsForWorkspace = pluginsByWorkspace[selectedWorkspaceId] || [];
    if (pluginsForWorkspace.length > 0) {
      setSelectedPluginId((current) => {
        if (pluginsForWorkspace.some((plugin) => plugin.id === current)) {
          return current;
        }
        return pluginsForWorkspace[0].id;
      });
    } else {
      setSelectedPluginId('');
    }
  }, [selectedWorkspaceId, pluginsByWorkspace]);

  const updatePluginConfig = (workspaceId: string, pluginId: string, updates: Partial<Plugin>) => {
    setPluginsByWorkspace((prev) => {
      const workspacePlugins = prev[workspaceId] || [];
      const updatedPlugins = workspacePlugins.map((plugin) =>
        plugin.id === pluginId ? { ...plugin, ...updates } : plugin,
      );
      return {
        ...prev,
        [workspaceId]: updatedPlugins,
      };
    });
  };

  const value: WorkspaceContextValue = {
    workspaces: INITIAL_WORKSPACES,
    selectedWorkspaceId,
    selectWorkspace: setSelectedWorkspaceId,
    plugins: pluginsByWorkspace[selectedWorkspaceId] || [],
    pluginsByWorkspace,
    selectedPluginId,
    selectPlugin: setSelectedPluginId,
    updatePluginConfig,
    chats: selectedPluginId ? DUMMY_CHATS[selectedPluginId] || [] : [],
    isAdmin: true,
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}
