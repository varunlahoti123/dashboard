import "@/styles/globals.css"
import { GeistSans } from "geist/font/sans"
import { Button } from "@/components/ui/button"
import { Home, FileText, Users, BarChart3, Settings } from 'lucide-react'
import Link from 'next/link'
import { ClerkProvider, UserButton } from "@clerk/nextjs"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`light ${GeistSans.className}`}>
      <body>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          {/* Sidebar */}
          <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md flex flex-col">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 mr-2"></div>
              <Link href="/">
                <h1 className="text-xl font-bold">Hermes Health</h1>
              </Link>
            </div>
            
            {/* Navigation section */}
            <nav className="flex-1">
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <Link href="/dashboard">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <Link href="/projects">
                  <FileText className="mr-2 h-4 w-4" />
                  Projects
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <Link href="/requests">
                  <Users className="mr-2 h-4 w-4" />
                  Requests
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <a>
                  <FileText className="mr-2 h-4 w-4" />
                  Providers
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <Link href="/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </a>
              </Button>
            </nav>

            {/* User profile section */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
              <ClerkProvider>
                <UserButton afterSignOutUrl="/" />
              </ClerkProvider>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

