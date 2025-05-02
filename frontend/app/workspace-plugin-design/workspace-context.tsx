'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Compass, FileText, Database, BarChart } from 'lucide-react';

export interface Workspace {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
}

export interface Plugin {
  id: string;
  name: string;
  icon?: React.ComponentType<any>;
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
  selectedPluginId: string;
  selectPlugin: (id: string) => void;
  chats: Chat[];
}

const DUMMY_WORKSPACES: Workspace[] = [
  { id: 'engineering', name: 'Engineering', icon: Compass },
  { id: 'legal', name: 'Legal', icon: FileText },
  { id: 'data', name: 'Data Engineering', icon: Database },
  { id: 'marketing', name: 'Marketing', icon: BarChart },
];

const DUMMY_PLUGINS: Record<string, Plugin[]> = {
  engineering: [
    { id: 'doc-qa', name: 'Document QA', icon: FileText },
    { id: 'contract-review', name: 'Contract Review' },
  ],
  legal: [
    { id: 'legal-rag', name: 'Legal RAG', icon: FileText },
    { id: 'compliance-check', name: 'Compliance Check' },
  ],
  data: [
    { id: 'db-query', name: 'Database Query', icon: Database },
    { id: 'pipeline-builder', name: 'Pipeline Builder' },
  ],
  marketing: [
    { id: 'content-analysis', name: 'Content Analysis', icon: BarChart },
    { id: 'trend-spotting', name: 'Trend Spotting' },
  ],
};

const DUMMY_CHATS: Record<string, Chat[]> = {
  'doc-qa': [
    { id: 'chat1', title: 'Doc QA: NDA Tables', lastActive: '2h ago' },
    { id: 'chat2', title: 'Doc QA: Policy Update', lastActive: '1d ago' },
  ],
  'contract-review': [
    { id: 'chat3', title: 'Contract: Vendor A', lastActive: '3h ago' },
    { id: 'chat4', title: 'Contract: Vendor B', lastActive: '2d ago' },
  ],
  'legal-rag': [
    { id: 'chat5', title: 'Legal RAG: IP Docs', lastActive: '4h ago' },
  ],
  'compliance-check': [
    { id: 'chat6', title: 'Compliance Check: GDPR', lastActive: '5h ago' },
  ],
  'db-query': [
    { id: 'chat7', title: 'DB: Sales Data', lastActive: '1h ago' },
  ],
  'pipeline-builder': [
    { id: 'chat8', title: 'Pipeline: ETL Build', lastActive: '2d ago' },
  ],
  'content-analysis': [
    { id: 'chat9', title: 'Content: Blog Draft', lastActive: '3h ago' },
  ],
  'trend-spotting': [
    { id: 'chat10', title: 'Trends: Market Analysis', lastActive: '4d ago' },
  ],
};

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState(DUMMY_WORKSPACES[0].id);
  const [selectedPluginId, setSelectedPluginId] = useState(() => {
    const initialPlugins = DUMMY_PLUGINS[DUMMY_WORKSPACES[0].id] || [];
    return initialPlugins[0]?.id || '';
  });

  useEffect(() => {
    const pluginsForWorkspace = DUMMY_PLUGINS[selectedWorkspaceId] || [];
    if (pluginsForWorkspace.length > 0) {
      setSelectedPluginId(pluginsForWorkspace[0].id);
    } else {
      setSelectedPluginId('');
    }
  }, [selectedWorkspaceId]);

  const value: WorkspaceContextValue = {
    workspaces: DUMMY_WORKSPACES,
    selectedWorkspaceId,
    selectWorkspace: setSelectedWorkspaceId,
    plugins: DUMMY_PLUGINS[selectedWorkspaceId] || [],
    selectedPluginId,
    selectPlugin: setSelectedPluginId,
    chats: DUMMY_CHATS[selectedPluginId] || [],
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