'use client'

import { useState } from 'react'
import { CapabilityInterface } from '../components/capability-interface'

export default function CapabilitySelectorPage() {
  return (
    <div className="h-screen bg-background text-foreground flex flex-col">
      <CapabilityInterface />
    </div>
  )
}