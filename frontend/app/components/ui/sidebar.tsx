"use client"

import * as React from "react"
import { cn } from "../../../lib/utils"
import { cva } from "class-variance-authority"

// Context to track sidebar state
interface SidebarContextValue {
  isMobile: boolean
  isCollapsed: boolean
  toggleCollapse: () => void
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined)

// Hook to use sidebar context
export function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider")
  }
  return context
}

// Provider component for sidebar state
export function SidebarProvider({
  children,
  defaultCollapsed = false,
}: {
  children: React.ReactNode
  defaultCollapsed?: boolean
}) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [isMobile, setIsMobile] = React.useState(false)

  // Handle responsive behavior
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }
    
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <SidebarContext.Provider
      value={{
        isMobile,
        isCollapsed,
        toggleCollapse: () => setIsCollapsed(!isCollapsed),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

// Main sidebar component
export function Sidebar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const { isCollapsed } = useSidebar()
  
  return (
    <nav
      className={cn(
        "flex h-screen flex-col border-r border-border bg-sidebar-background transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[240px]",
        className
      )}
    >
      {children}
    </nav>
  )
}

// Sidebar section components
export function SidebarSection({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-3 py-2", className)}>
      {children}
    </div>
  )
}

// Sidebar menu components
export function SidebarMenu({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("px-3 py-2", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("my-1", className)}>
      {children}
    </div>
  )
}

// Button variants
const buttonVariants = cva(
  "flex items-center gap-2 w-full rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent hover:bg-secondary/80",
        active: "bg-accent/10 text-accent hover:bg-accent/20",
      },
      size: {
        default: "h-10 px-3 text-sm",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "active"
  size?: "default" | "sm" | "lg"
}

export const SidebarMenuButton = React.forwardRef<HTMLButtonElement, SidebarMenuButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    )
  }
)
SidebarMenuButton.displayName = "SidebarMenuButton"