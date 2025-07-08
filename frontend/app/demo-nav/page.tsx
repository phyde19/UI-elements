'use client'

import Link from 'next/link'

export default function DemoNavigation() {
  const demoPages = [
    {
      title: 'UAT Landing Page',
      description: 'Professional landing page for user acceptance testing with team selection',
      href: '/uat-landing',
      status: 'New'
    },
    {
      title: 'Main Chat Interface',
      description: 'Primary chat interface with workspace and plugin selection',
      href: '/',
      status: 'Active'
    },
    {
      title: 'Workspace Plugin Design',
      description: 'Design exploration for workspace and plugin selection UI',
      href: '/workspace-plugin-design',
      status: 'Active'
    },
    {
      title: 'Enhanced Layout',
      description: 'Three-column selector design variation',
      href: '/workspace-plugin-design/enhanced',
      status: 'Active'
    },
    {
      title: 'Refined Layout',
      description: 'Streamlined design variation',
      href: '/workspace-plugin-design/refined',
      status: 'Active'
    },
    {
      title: 'Compact Layout',
      description: 'Space-efficient design variation',
      href: '/workspace-plugin-design/compact',
      status: 'Active'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Compass Demo Navigation</h1>
          <p className="text-slate-600 mb-8">Navigate between different UI/UX prototypes and iterations</p>
          
          <div className="grid gap-4">
            {demoPages.map((page) => (
              <Link 
                key={page.href}
                href={page.href}
                className="block p-6 border border-slate-200 rounded-lg hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">{page.title}</h3>
                    <p className="text-slate-600">{page.description}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    page.status === 'New' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {page.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}