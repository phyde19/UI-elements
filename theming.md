Next.js
Adding dark mode to your next app.

Dark mode
Install next-themes
Start by installing next-themes:

pnpm
npm
yarn
bun
npm install next-themes
Copy
Create a theme provider
components/theme-provider.tsx
"use client"
 
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
 
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
Copy
Wrap your root layout
Add the ThemeProvider to your root layout and add the suppressHydrationWarning prop to the html tag.

app/layout.tsx
import { ThemeProvider } from "@/components/theme-provider"
 
export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  )
}