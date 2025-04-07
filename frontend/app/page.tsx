"use client";

import { useState } from "react";
import { Header } from "./components/header";
import { SideNavigation } from "./components/side-navigation";
import { ChatContainer } from "./components/chat-container";
import { EnabledPlugins } from "./components/enabled-plugins";

export default function Home() {
  const [selectedPlugin, setSelectedPlugin] = useState(null);
  const [showChat, setShowChat] = useState(false);
  
  const handlePluginSelect = (plugin) => {
    setSelectedPlugin(plugin);
    setShowChat(true);
  };
  
  const handleBackToPlugins = () => {
    setShowChat(false);
  };
  
  return (
    <div className="h-screen bg-background text-foreground overflow-hidden flex">
      {/* Side navigation - full height */}
      <SideNavigation />
      
      {/* Main content area with header and chat */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Fixed header at the top */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <Header />
        </div>
        
        {/* Top padding to push content below header + gradient */}
        <div className="pt-[4.5rem] flex-1 overflow-hidden">
          {showChat ? (
            <ChatContainer 
              initialPlugin={selectedPlugin} 
              onBack={handleBackToPlugins}
            />
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div className="max-w-4xl mx-auto px-4 py-8">
                <EnabledPlugins onSelect={handlePluginSelect} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}