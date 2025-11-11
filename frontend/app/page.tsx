"use client";

import { SideNavigation } from "./components/side-navigation";
import { ChatInput } from "./components/chat-input";
import { MessageDisplay } from "./components/message-display";
import { RightPanel } from "./components/right-panel";
import { useLayout } from "../lib/layout-context";
import { ThemeToggle } from "./components/theme-toggle";
import { PluginSelectorDropdown } from "./components/plugin-selector-dropdown";
import { SlidersHorizontal } from "lucide-react";
import { useWorkspaceContext } from "../lib/workspace-context";

export default function Home() {
  const { isRightPanelOpen, toggleRightPanel } = useLayout();
  const { selectPlugin, selectedPluginId } = useWorkspaceContext();
  
  const handleSendMessage = (message) => {
    // Reference to the message display component to start streaming
    const messageDisplayRef = document.getElementById('message-display');
    if (messageDisplayRef) {
      // This is a temporary solution - in a real app, you'd use React refs or state management
      const event = new CustomEvent('start-streaming', { 
        detail: { message }
      });
      messageDisplayRef.dispatchEvent(event);
    }
  };
  
  const handleSelectPlugin = (pluginId: string) => {
    selectPlugin(pluginId);
  };
  
  const handleTogglePluginSettings = () => {
    toggleRightPanel('plugin-settings');
  };

  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left side with header and chat - flexible width that maintains reasonable reading area */}
        <div className={`${isRightPanelOpen ? 'flex-1 min-w-[550px]' : 'flex-1'} flex flex-col overflow-hidden relative transition-all duration-300`}>
          {/* Fixed header at the top */}
          <div className="h-[4.5rem] flex items-center justify-between px-4 border-b border-border/20 bg-background z-20">
            <div className="flex-1 max-w-xl">
              <PluginSelectorDropdown 
                selectedPlugin={selectedPluginId}
                onSelectPlugin={handleSelectPlugin}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleTogglePluginSettings}
                aria-label="Toggle plugin controls"
                className={`inline-flex h-9 w-9 items-center justify-center rounded-full border transition ${
                  isRightPanelOpen
                    ? 'border-accent/60 bg-accent/10 text-accent'
                    : 'border-border/40 text-muted-foreground hover:border-border hover:text-foreground'
                }`}
              >
                <SlidersHorizontal size={16} />
                <span className="sr-only">Plugin controls</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
          
          {/* Chat content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable message area */}
            <div id="chat-scroll-container" className="flex-1 scrollbar-stable overflow-y-auto">
              <div className="px-4 py-4 max-w-4xl w-full mx-auto">
                <MessageDisplay />
              </div>
            </div>
            
            {/* Chat input area */}
            <div className="bg-background py-2">
              <div className="px-4 pb-4 max-w-4xl w-full mx-auto">
                <ChatInput onSend={handleSendMessage} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right panel - dynamically rendered based on panel type */}
        {isRightPanelOpen && <RightPanel />}
      </div>
      
      {/* Feedback modal intentionally omitted by default; toggle locally if needed for testing */}
    </div>
  );
}
