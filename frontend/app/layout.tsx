import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { LayoutProvider } from "../lib/layout-context";
import { WorkspaceProvider } from "../lib/workspace-context";
import { CompassStoreProvider } from "../hooks/store-context";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Compass",
  description: "Corporate AI assistant for teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutProvider>
            <CompassStoreProvider>
              <WorkspaceProvider>{children}</WorkspaceProvider>
            </CompassStoreProvider>
          </LayoutProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
