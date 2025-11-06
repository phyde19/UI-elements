 'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Compass, FileText, Database, Lock, Code2, GitMerge, BarChart, TrendingUp } from 'lucide-react';

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
   { id: 'engineering', name: 'Engineering', icon: Compass },
   { id: 'legal', name: 'Legal', icon: FileText },
   { id: 'data', name: 'Data Engineering', icon: Database },
   { id: 'marketing', name: 'Marketing', icon: BarChart },
 ];

 export const INITIAL_PLUGIN_CONFIG: Record<string, Plugin[]> = {
  engineering: [
    {
      id: 'doc-qa',
      name: 'Document QA',
      icon: FileText,
       description: 'Answer questions and surface citations from engineering specifications, ADRs, and product docs.',
       instructions: 'You are the Document QA assistant for the Engineering workspace. Provide concise answers with markdown, cite document titles when referencing content, and suggest follow-up queries that deepen understanding.',
       updatedAt: '2025-04-10T14:22:00Z',
      updatedBy: 'Alex Rivera',
    },
    {
      id: 'contract-review',
      name: 'Contract Review',
      icon: Code2,
      description: 'Summarize vendor contracts, highlight risk language, and compare against playbook clauses.',
      instructions: 'Act as a contract review analyst. When you identify risky language, reference the relevant clause and propose remediation steps. Keep summaries under 250 words.',
      updatedAt: '2025-04-04T09:12:00Z',
      updatedBy: 'Priya Desai',
    },
    {
      id: 'eng-standups',
      name: 'Standup Synthesizer',
      icon: Compass,
      description: 'Aggregate daily standup notes and surface blockers across squads.',
      instructions: 'Produce a succinct update grouped by squad with blockers called out in bold. Close with suggested follow-ups for the engineering manager.',
      updatedAt: '2025-04-12T07:32:00Z',
      updatedBy: 'Parker Chen',
    },
    {
      id: 'release-notes',
      name: 'Release Notes Assistant',
      icon: TrendingUp,
      description: 'Draft polished release notes from merged pull requests and Jira tickets.',
      instructions: 'Highlight customer-facing impact first. Reference ticket IDs inline and suggest a tweet-length summary.',
      updatedAt: '2025-04-11T18:10:00Z',
      updatedBy: 'Alex Rivera',
    },
  ],
  legal: [
    {
      id: 'legal-rag',
      name: 'Legal RAG',
       icon: FileText,
       description: 'Retrieve case law and policy precedents for the legal operations team.',
       instructions: 'Answer with neutral language. Always cite the governing policy number or case reference. Offer related precedents when available.',
       updatedAt: '2025-03-29T16:45:00Z',
      updatedBy: 'Jordan Matthews',
    },
    {
      id: 'compliance-check',
      name: 'Compliance Check',
      icon: Code2,
      description: 'Guide users through compliance questionnaires and validation steps.',
      instructions: 'Ask clarifying questions before providing compliance guidance. Reference the latest regulatory update linked in the workspace materials.',
      updatedAt: '2025-04-08T11:07:00Z',
      updatedBy: 'Jordan Matthews',
    },
    {
      id: 'case-summary',
      name: 'Case Summary Writer',
      icon: FileText,
      description: 'Transform lengthy case transcripts into board-ready briefs with risk assessments.',
      instructions: 'Deliver a bullet overview, risk score (0-5), and recommended counsel follow-up.',
      updatedAt: '2025-04-12T14:28:00Z',
      updatedBy: 'Sloane Abbott',
    },
  ],
  data: [
    {
      id: 'db-query',
      name: 'Database Query',
       icon: Database,
       description: 'Generate and validate SQL queries against the analytics warehouse.',
       instructions: 'Write ANSI SQL. Always provide a short summary of what the query returns and note any assumptions about filters or date ranges.',
       updatedAt: '2025-04-02T18:02:00Z',
      updatedBy: 'Lena Ortiz',
    },
    {
      id: 'pipeline-builder',
      name: 'Pipeline Builder',
      icon: GitMerge,
      description: 'Draft Airflow DAG snippets and transformation steps for data pipelines.',
      instructions: 'Return code snippets with inline comments. Highlight downstream impacts when altering existing pipelines.',
      updatedAt: '2025-04-06T13:55:00Z',
      updatedBy: 'Lena Ortiz',
    },
    {
      id: 'metric-digest',
      name: 'Metric Digest',
      icon: BarChart,
      description: 'Compile daily KPIs, flag anomalies, and suggest areas to investigate.',
      instructions: 'Surface the top three metric shifts with context, recommended queries, and owners to notify.',
      updatedAt: '2025-04-11T06:45:00Z',
      updatedBy: 'Lena Ortiz',
    },
    {
      id: 'schema-guardian',
      name: 'Schema Guardian',
      icon: Database,
      description: 'Monitor warehouse schemas for drift and document approved field changes.',
      instructions: 'When changes are detected, describe impacts, update the schema glossary entry, and notify the channel #data-changes.',
      updatedAt: '2025-04-10T21:18:00Z',
      updatedBy: 'Noah Patel',
    },
  ],
  marketing: [
    {
      id: 'content-analysis',
      name: 'Content Analysis',
      icon: BarChart,
      description: 'Evaluate campaign messaging and sentiment across customer touchpoints.',
      instructions: 'Summaries should call out sentiment shifts, audience segments impacted, and suggested next experiments.',
      updatedAt: '2025-03-31T10:25:00Z',
      updatedBy: 'Morgan Lee',
    },
    {
      id: 'trend-spotting',
      name: 'Trend Spotting',
      icon: TrendingUp,
      description: 'Surface emerging trends in market research, competitor updates, and social chatter.',
      instructions: 'Share the top three insights with confidence ratings. Suggest one proactive action for the marketing team.',
      updatedAt: '2025-04-09T08:40:00Z',
      updatedBy: 'Morgan Lee',
    },
    {
      id: 'campaign-architect',
      name: 'Campaign Architect',
      icon: Compass,
      description: 'Build omni-channel campaign briefs with audience, messaging, and budget guardrails.',
      instructions: 'Provide a three-phase plan with creative angles, target cohorts, and measurement strategy.',
      updatedAt: '2025-04-12T09:20:00Z',
      updatedBy: 'Morgan Lee',
    },
    {
      id: 'voice-polisher',
      name: 'Brand Voice Polisher',
      icon: BarChart,
      description: 'Rewrite copy to comply with the Compass brand guidelines and tone matrix.',
      instructions: 'Return two variants—“Confident” and “Warm”—along with rationale. Flag any off-brand phrasing.',
      updatedAt: '2025-04-07T15:44:00Z',
      updatedBy: 'Taylor Brooks',
    },
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
