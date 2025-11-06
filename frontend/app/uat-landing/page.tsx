'use client'

import { useState } from 'react'
import { ThemeToggle } from '../components/theme-toggle'
import { Shield, Database, Code, AlertCircle, ArrowRight, Compass, ThumbsUp, ThumbsDown, MessageSquare } from 'lucide-react'

const teams = [
  {
    id: 'bluecard-its',
    name: 'BlueCard / ITS',
    description: 'Software Engineering Team',
    icon: Code,
  },
  {
    id: 'subrogation',
    name: 'Subrogation',
    description: 'Legal Team',
    icon: Shield,
  },
  {
    id: 'dscoe',
    name: 'DSCOE',
    description: 'Data Science Center of Excellence',
    icon: Database,
  }
]

export default function UATLandingPage() {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [accessCode, setAccessCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTeam || !accessCode.trim()) return
    
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    
    // This is where you'd handle the actual authentication
    console.log('Team:', selectedTeam, 'Access Code:', accessCode)
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-card border-r border-border/30 flex-col justify-center px-12">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <Compass size={28} className="text-accent" />
            <h1 className="text-3xl font-bold text-foreground">Compass</h1>
          </div>

          {/* Welcome Message */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Welcome to Compass
            </h2>
            
            <div className="space-y-8">
              <p className="text-lg text-foreground leading-relaxed">
                Compass is a BCBST MLOps proof-of-concept that brings AI chat capabilities to teams. 
                Think ChatGPT, but built specifically for your team's data and workflows.
              </p>
              
              <div className="space-y-5">
                <h3 className="text-lg font-semibold text-foreground">Getting started</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent text-sm font-bold">1</span>
                    </div>
                    <p className="text-base text-foreground leading-relaxed">Select your team and enter your access code</p>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent text-sm font-bold">2</span>
                    </div>
                    <p className="text-base text-foreground leading-relaxed">Choose your AI tool from the plugin selector in the header</p>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-accent text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-base text-foreground leading-relaxed mb-3">Chat with AI and rate responses using feedback buttons</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 text-foreground rounded-md border border-border/50">
                          <ThumbsUp className="w-3 h-3" />
                          <span className="text-xs">Helpful</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 text-foreground rounded-md border border-border/50">
                          <ThumbsDown className="w-3 h-3" />
                          <span className="text-xs">Not helpful</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 text-foreground rounded-md border border-border/50">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-xs">Tell us more</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-base text-muted-foreground pt-6 border-t border-border/30">
                Questions? <span className="text-accent font-medium">Parker_Hyde@bcbst.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication */}
      <div className="flex-1 md:w-1/2 flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 md:hidden">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-accent-foreground font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Compass</h1>
                <p className="text-xs text-muted-foreground">User Testing</p>
              </div>
            </div>
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">User Testing Environment</p>
            </div>
            <ThemeToggle />
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <div className="w-full max-w-sm space-y-8 my-auto">
            {/* Welcome Section */}
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-muted-foreground">
                Select your team and enter your access code to continue
              </p>
            </div>

            {/* UAT Disclaimer */}
            <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">Testing Environment</p>
                  <p className="text-xs text-muted-foreground">
                    This is a testing environment. Do not enter sensitive information.
                  </p>
                </div>
              </div>
            </div>

            {/* Team Selection */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Select Your Team
                </label>
                <div className="space-y-2">
                  {teams.map((team) => {
                    const Icon = team.icon
                    return (
                      <button
                        key={team.id}
                        type="button"
                        onClick={() => setSelectedTeam(team.id)}
                        className={`
                          w-full p-3 rounded-lg border transition-all duration-200 text-left
                          ${selectedTeam === team.id 
                            ? 'border-accent/50 bg-accent/5' 
                            : 'border-border/50 bg-card hover:border-border hover:bg-muted/20'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-md flex items-center justify-center ${
                            selectedTeam === team.id ? 'bg-accent text-accent-foreground' : 'bg-muted text-muted-foreground'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-medium text-foreground">{team.name}</h4>
                            <p className="text-xs text-muted-foreground">{team.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Access Code Input */}
              <div>
                <label htmlFor="accessCode" className="block text-sm font-medium text-foreground mb-3">
                  Access Code
                </label>
                <input
                  id="accessCode"
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="Enter your access code"
                  className="w-full px-3 py-2.5 border border-border/50 rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-200"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!selectedTeam || !accessCode.trim() || isLoading}
                className={`
                  w-full py-2.5 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                  ${!selectedTeam || !accessCode.trim() || isLoading
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-accent text-accent-foreground hover:bg-accent/90'
                  }
                `}
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  )
}