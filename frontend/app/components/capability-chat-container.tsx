'use client'

import React, { useState } from 'react'
import { useCapability } from './capability-context'
import { PlusCircle, Bot, Sparkles } from 'lucide-react'

export function CapabilityChatContainer() {
  const { activeWorkspaceId, workspaces, activePlugin } = useCapability()
  
  const activeWorkspace = workspaces.find(w => w.id === activeWorkspaceId)
  
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 max-w-4xl mx-auto">
      {/* Plugin selection state */}
      {!activePlugin ? (
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
            <Sparkles size={28} />
          </div>
          
          <h2 className="text-2xl font-medium mb-2">
            Select a plugin to get started
          </h2>
          
          <p className="text-muted-foreground mb-8">
            Choose a plugin from the {activeWorkspace?.name} workspace in the sidebar to start a new conversation
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {activeWorkspace?.plugins.slice(0, 4).map(plugin => (
              <button
                key={plugin.id}
                className="flex flex-col items-center justify-center border border-border rounded-lg p-4 hover:bg-muted/10 transition-colors text-center"
                onClick={() => {/* This would be handled by the capability context */}}
              >
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mb-3">
                  <plugin.icon size={20} className="text-accent" />
                </div>
                <span className="font-medium">{plugin.name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-6">
            <Bot size={28} />
          </div>
          
          <h2 className="text-2xl font-medium mb-2">
            {activePlugin.name}
          </h2>
          
          <p className="text-muted-foreground mb-8">
            {activePlugin.description}
          </p>
          
          <button className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-md hover:bg-accent/90 transition-colors">
            <PlusCircle size={18} />
            <span>Start new chat</span>
          </button>
        </div>
      )}
    </div>
  )
}