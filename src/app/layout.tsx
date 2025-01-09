import "@/styles/globals.css"
import { GeistSans } from "geist/font/sans"
import { Button } from "../components/ui/button"
import { Home, FileText, Users, BarChart3, Settings } from 'lucide-react'

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
          <aside className="w-64 bg-white dark:bg-gray-800 p-4 shadow-md">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 mr-2"></div>
              <h1 className="text-xl font-bold">Hermes Health</h1>
            </div>
            <nav>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <a href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <a href="/requests">
                  <FileText className="mr-2 h-4 w-4" />
                  Requests
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <a>
                  <Users className="mr-2 h-4 w-4" />
                  Providers
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start mb-2" asChild>
                <a href="/analytics">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Analytics
                </a>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <a>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </a>
              </Button>
            </nav>
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

