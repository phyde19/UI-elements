'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  buildWorkspaceData,
  MOCK_WORKSPACES,
  type PluginWithMetadata,
  type WorkspaceWithIcon,
} from './workspace-data';

export type Workspace = WorkspaceWithIcon;
export type Plugin = PluginWithMetadata;

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

const { workspaces: INITIAL_WORKSPACES, pluginsByWorkspace: INITIAL_PLUGINS_BY_WORKSPACE } =
  buildWorkspaceData(MOCK_WORKSPACES);

const DEFAULT_WORKSPACE_ID = INITIAL_WORKSPACES[0]?.id ?? '';
const DEFAULT_PLUGIN_ID =
  (DEFAULT_WORKSPACE_ID && INITIAL_PLUGINS_BY_WORKSPACE[DEFAULT_WORKSPACE_ID]?.[0]?.id) || '';

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

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

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspaces] = useState<Workspace[]>(INITIAL_WORKSPACES);
  const [pluginsByWorkspace, setPluginsByWorkspace] = useState<Record<string, Plugin[]>>(
    INITIAL_PLUGINS_BY_WORKSPACE,
  );
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(DEFAULT_WORKSPACE_ID);
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
    workspaces,
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
