'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
} from 'lucide-react';

export interface Workspace {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

export interface Plugin {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
  description: string;
  instructions: string;
  updatedAt: string;
  updatedBy: string;
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

const DUMMY_WORKSPACES: Workspace[] = [
  { id: 'general', name: 'General', icon: AppWindow },
  { id: 'dscoe', name: 'Data Science COE', icon: ServerCog },
  { id: 'bluecard_its', name: 'BlueCard ITS', icon: BadgeInfo },
  { id: 'subrogation', name: 'Subrogation', icon: Scale },
  { id: 'corporate_compliance', name: 'Corporate Compliance', icon: ShieldCheck },
  { id: 'data_management', name: 'Data Management', icon: Database },
  { id: 'marketing_research', name: 'Marketing Research', icon: BarChart3 },
  { id: 'development', name: 'Development', icon: CodeXml },
];

export const INITIAL_PLUGIN_CONFIG: Record<string, Plugin[]> = {
  general: [
    {
      id: 'hr_assistant',
      name: 'HR Assistant',
      icon: Users,
      description: 'Answers HR policy questions, routes employees to the right forms, and summarizes handbook guidance.',
      instructions: 'Reference the HR handbook and knowledge base articles for every response. Offer direct links to forms when possible and remind employees about escalation paths.',
      updatedAt: '2025-04-12T09:00:00Z',
      updatedBy: 'Nina Patel',
    },
    {
      id: 'career_development',
      name: 'Career Development Coach',
      icon: Mountain,
      description: 'Helps teammates plan development goals, recommend courses, and capture growth check-ins.',
      instructions: 'Speak in a supportive tone. Suggest three concrete actions tied to Compass career competency models and provide timeline reminders.',
      updatedAt: '2025-04-07T15:20:00Z',
      updatedBy: 'Deandre Miles',
    },
    {
      id: 'my_benefits',
      name: 'My Benefits Navigator',
      icon: Wallet,
      description: 'Explains medical, dental, retirement, and wellness benefits tailored to the employee’s profile.',
      instructions: 'Confirm eligibility before answering. Include relevant enrollment windows, and surface links to vendor portals.',
      updatedAt: '2025-04-05T11:05:00Z',
      updatedBy: 'Nina Patel',
    },
    {
      id: 'compass_assistant',
      name: 'Compass Assistant',
      icon: Compass,
      description: 'General-purpose companion for quick answers, internal search, and meeting prep across workspaces.',
      instructions: 'Provide concise answers, cite internal sources, and recommend the most relevant workspace plugin when deeper support is needed.',
      updatedAt: '2025-04-08T13:42:00Z',
      updatedBy: 'Isha Gardner',
    },
    {
      id: 'compass_assistant_gemini',
      name: 'Compass Assistant (Gemini)',
      icon: Compass,
      description: 'Experimental Gemini-backed assistant for long-form reasoning and exploratory analysis.',
      instructions: 'Flag that this is a preview experience. Provide structured reasoning steps and call out any confidence gaps.',
      updatedAt: '2025-04-09T18:20:00Z',
      updatedBy: 'Isha Gardner',
    },
    {
      id: 'journal',
      name: 'Daily Journal',
      icon: NotebookPen,
      description: 'Captures feedback, meeting notes, and reflections with gentle prompts.',
      instructions: 'Ask one clarifying question, summarize key points in bullets, and remind the user where entries are stored.',
      updatedAt: '2025-04-10T07:30:00Z',
      updatedBy: 'Mara Lewis',
    },
  ],
  dscoe: [
    {
      id: 'databricks_onboarding',
      name: 'Databricks Onboarding',
      icon: Rocket,
      description: 'Guides new DSCOE teammates through workspace access, clusters, and project templates.',
      instructions: 'Return step-by-step onboarding instructions with links to the Databricks playbook. Confirm completion before moving on.',
      updatedAt: '2025-04-11T09:12:00Z',
      updatedBy: 'Ian Donnelly',
    },
    {
      id: 'dscoe_search_assistant',
      name: 'DSCOE Search Assistant',
      icon: SearchCode,
      description: 'Searches notebooks, feature stores, and knowledge wikis across DSCOE projects.',
      instructions: 'Always summarize findings with repository paths. Offer related notebooks or Slack channels for deeper support.',
      updatedAt: '2025-04-08T17:40:00Z',
      updatedBy: 'Sasha Yuan',
    },
    {
      id: 'code_writing_assistant',
      name: 'Code Writing Assistant',
      icon: Code2,
      description: 'Drafts PySpark, SQL, and Python snippets following DSCOE patterns and lint rules.',
      instructions: 'Adhere to the DSCOE style guide, include inline comments, and recommend unit tests when proposing new code.',
      updatedAt: '2025-04-06T16:10:00Z',
      updatedBy: 'Sasha Yuan',
    },
    {
      id: 'sri_assistant',
      name: 'SRI Assistant',
      icon: FlaskConical,
      description: 'Supports Strategic Research Initiatives with experiment design and metric tracking.',
      instructions: 'Request experiment context, propose hypotheses, and log recommended metrics in the initiative tracker.',
      updatedAt: '2025-04-04T12:05:00Z',
      updatedBy: 'Ian Donnelly',
    },
  ],
  bluecard_its: [
    {
      id: 'onboarding',
      name: 'BlueCard Onboarding',
      icon: LogIn,
      description: 'Walks new BlueCard ITS analysts through setup, system permissions, and required training.',
      instructions: 'Provide a chronological checklist with completion tracking and link to ServiceNow for any access requests.',
      updatedAt: '2025-04-10T08:15:00Z',
      updatedBy: 'Kara James',
    },
    {
      id: 'bluecard_search_assistant',
      name: 'BlueCard Search Assistant',
      icon: SearchIcon,
      description: 'Searches ITS doc libraries, runbooks, and known issues to speed case resolution.',
      instructions: 'Return the top three matches with snippets and reference IDs. Offer remediation steps if a known fix exists.',
      updatedAt: '2025-04-09T19:12:00Z',
      updatedBy: 'Kara James',
    },
    {
      id: 'bcbsa_assistant',
      name: 'BCBSA Assistant',
      icon: Handshake,
      description: 'Provides BCBSA program guidance, partner updates, and escalation templates.',
      instructions: 'Keep responses diplomatic and policy-aligned. Include escalation tiers and partner contact groups.',
      updatedAt: '2025-04-07T13:20:00Z',
      updatedBy: 'Rafael Ortiz',
    },
  ],
  subrogation: [
    {
      id: 'subrogation_assistant',
      name: 'Subrogation Assistant',
      icon: Scale,
      description: 'Summarizes case files, identifies recovery opportunities, and drafts follow-up actions.',
      instructions: 'Highlight liability outlook, cite source documents, and recommend next legal or negotiation steps.',
      updatedAt: '2025-04-05T16:12:00Z',
      updatedBy: 'Holly Nguyen',
    },
  ],
  corporate_compliance: [
    {
      id: 'compliance_search_assistant',
      name: 'Compliance Search Assistant',
      icon: SearchCheck,
      description: 'Searches compliance policies, audit findings, and regulatory updates.',
      instructions: 'Always cite the controlling policy number. Provide a recommended reviewer or SME when uncertainty is high.',
      updatedAt: '2025-04-11T10:02:00Z',
      updatedBy: 'Liam Turner',
    },
    {
      id: 'contract_doc_compare',
      name: 'Contract Doc Compare',
      icon: FileDiff,
      description: 'Compares contract drafts, highlights deviations, and flags risky clauses.',
      instructions: 'Deliver a three-part summary: key changes, risk assessment, and suggested redlines. Attach clause references.',
      updatedAt: '2025-04-08T12:30:00Z',
      updatedBy: 'Liam Turner',
    },
    {
      id: 'compliance_quiz_training',
      name: 'Compliance Quiz & Training',
      icon: GraduationCap,
      description: 'Generates quizzes and refresher drills aligned to compliance curricula.',
      instructions: 'Ask three scenario-based questions, provide answer rationales, and log completion for LMS sync.',
      updatedAt: '2025-04-06T09:18:00Z',
      updatedBy: 'Reese Morgan',
    },
    {
      id: 'vendor_report',
      name: 'Vendor Report',
      icon: FileBarChart,
      description: 'Builds vendor compliance summaries, scorecards, and executive-ready briefs.',
      instructions: 'Include compliance status, outstanding actions, and trend analysis. Output a markdown summary and bullet recap.',
      updatedAt: '2025-04-04T14:44:00Z',
      updatedBy: 'Reese Morgan',
    },
  ],
  data_management: [
    {
      id: 'data_management_assistant',
      name: 'Data Management Assistant',
      icon: Database,
      description: 'Answers data governance questions and outlines approved ingestion patterns.',
      instructions: 'Reference the data governance catalog. Provide ownership contacts and compliance considerations.',
      updatedAt: '2025-04-09T11:35:00Z',
      updatedBy: 'Noah Patel',
    },
    {
      id: 'big_query_migration_assistant',
      name: 'BigQuery Migration Assistant',
      icon: MoveRight,
      description: 'Guides teams migrating workloads from SAS or on-prem systems to BigQuery.',
      instructions: 'Gather workload context, outline migration steps, and provide code scaffolding or checklist templates.',
      updatedAt: '2025-04-07T17:22:00Z',
      updatedBy: 'Noah Patel',
    },
  ],
  marketing_research: [
    {
      id: 'marketing_search_assistant',
      name: 'Marketing Search Assistant',
      icon: SearchIcon,
      description: 'Searches campaign briefs, customer insights, and research decks.',
      instructions: 'Return results grouped by source type with insight summaries and recommended stakeholders.',
      updatedAt: '2025-04-10T10:48:00Z',
      updatedBy: 'Morgan Lee',
    },
    {
      id: 'nps_topic_modeling',
      name: 'NPS Topic Modeling',
      icon: BrainCog,
      description: 'Analyzes NPS verbatims to surface themes, sentiment, and opportunity areas.',
      instructions: 'Provide a ranked list of themes, include representative quotes, and flag emerging risks.',
      updatedAt: '2025-04-08T08:05:00Z',
      updatedBy: 'Morgan Lee',
    },
  ],
  development: [
    {
      id: 'dev_scratchpad',
      name: 'Dev Scratchpad',
      icon: Code2,
      description: 'Sandbox agent for experimenting with prompts, personas, and UI behaviors.',
      instructions: 'Note responses are not production-safe. Log any successful patterns to the developer wiki.',
      updatedAt: '2025-04-03T18:55:00Z',
      updatedBy: 'Dev Team',
    },
    {
      id: 'mock_service_assistant',
      name: 'Mock Service Assistant',
      icon: Compass,
      description: 'Stubs backend integrations and returns deterministic responses for demo flows.',
      instructions: 'Always prepend “[Demo Mode]” and describe the mocked data source and assumptions.',
      updatedAt: '2025-04-02T12:11:00Z',
      updatedBy: 'Dev Team',
    },
  ],
};

const DUMMY_CHATS: Record<string, Chat[]> = {
  hr_assistant: [
    { id: 'chat1', title: 'Leave policy clarification', lastActive: '2h ago' },
    { id: 'chat2', title: 'Parental leave options', lastActive: '1d ago' },
  ],
  career_development: [
    { id: 'chat3', title: 'Q2 growth plan draft', lastActive: '4h ago' },
  ],
  my_benefits: [
    { id: 'chat4', title: 'HSA contribution changes', lastActive: '6h ago' },
  ],
  compass_assistant: [
    { id: 'chat5', title: 'Team meeting prep notes', lastActive: '30m ago' },
  ],
  compass_assistant_gemini: [
    { id: 'chat6', title: 'Scenario planning (preview)', lastActive: '3h ago' },
  ],
  journal: [
    { id: 'chat7', title: 'Daily reflection – Apr 12', lastActive: 'Last night' },
  ],
  databricks_onboarding: [
    { id: 'chat8', title: 'Cluster setup checklist', lastActive: 'Yesterday' },
  ],
  dscoe_search_assistant: [
    { id: 'chat9', title: 'Feature store lookup', lastActive: '3h ago' },
  ],
  code_writing_assistant: [
    { id: 'chat10', title: 'PySpark window logic', lastActive: '40m ago' },
  ],
  sri_assistant: [
    { id: 'chat11', title: 'Experiment 219 follow-up', lastActive: '2d ago' },
  ],
  onboarding: [
    { id: 'chat12', title: 'BlueCard new analyst setup', lastActive: 'Today' },
  ],
  bluecard_search_assistant: [
    { id: 'chat13', title: 'Claims workflow fix', lastActive: '5h ago' },
  ],
  bcbsa_assistant: [
    { id: 'chat14', title: 'Partner escalation template', lastActive: 'Yesterday' },
  ],
  subrogation_assistant: [
    { id: 'chat15', title: 'Motor vehicle recovery', lastActive: '1h ago' },
  ],
  compliance_search_assistant: [
    { id: 'chat16', title: 'Third-party policy lookup', lastActive: '2h ago' },
  ],
  contract_doc_compare: [
    { id: 'chat17', title: 'MSA redlines summary', lastActive: '5h ago' },
  ],
  compliance_quiz_training: [
    { id: 'chat18', title: 'AML refresher drill', lastActive: '3d ago' },
  ],
  vendor_report: [
    { id: 'chat19', title: 'Vendor X compliance snapshot', lastActive: 'Today' },
  ],
  data_management_assistant: [
    { id: 'chat20', title: 'PII classification guidance', lastActive: 'Yesterday' },
  ],
  big_query_migration_assistant: [
    { id: 'chat21', title: 'SAS to BigQuery checklist', lastActive: '4h ago' },
  ],
  marketing_search_assistant: [
    { id: 'chat22', title: 'Campaign brief digest', lastActive: '2h ago' },
  ],
  nps_topic_modeling: [
    { id: 'chat23', title: 'Q1 feedback themes', lastActive: '8h ago' },
  ],
  dev_scratchpad: [
    { id: 'chat24', title: 'Prompt sandbox', lastActive: '1h ago' },
  ],
  mock_service_assistant: [
    { id: 'chat25', title: 'Demo API response', lastActive: 'Today' },
  ],
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(DUMMY_WORKSPACES[0].id);
  const [pluginsByWorkspace, setPluginsByWorkspace] = useState<Record<string, Plugin[]>>(INITIAL_PLUGIN_CONFIG);
  const [selectedPluginId, setSelectedPluginId] = useState(() => {
    const initialPlugins = INITIAL_PLUGIN_CONFIG[DUMMY_WORKSPACES[0].id] || [];
    return initialPlugins[0]?.id || '';
  });

  useEffect(() => {
    const pluginsForWorkspace = pluginsByWorkspace[selectedWorkspaceId] || [];
    if (pluginsForWorkspace.length > 0) {
      setSelectedPluginId((current) => {
        if (pluginsForWorkspace.some(plugin => plugin.id === current)) {
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
    workspaces: DUMMY_WORKSPACES,
    selectedWorkspaceId,
    selectWorkspace: setSelectedWorkspaceId,
    plugins: pluginsByWorkspace[selectedWorkspaceId] || [],
    pluginsByWorkspace,
    selectedPluginId,
    selectPlugin: setSelectedPluginId,
    updatePluginConfig,
    chats: DUMMY_CHATS[selectedPluginId] || [],
    isAdmin: true,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext(): WorkspaceContextValue {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}
