import { GeistSans } from "geist/font/sans"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  SignIn
} from '@clerk/nextjs'

export default function LoginPage() {
  return (
    <ClerkProvider>
      <div className={`flex min-h-screen flex-col items-center justify-center bg-gray-50 ${GeistSans.className}`}>
        <Card className="w-[450px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-left">Hermes Health</CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Welcome to Hermes Health. Please sign in to manage your medical record requests securely.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <SignedOut>
              <SignIn
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none",
                    header: "hidden",
                  }
                }}
              />
            </SignedOut>
            <SignedIn>
              <div className="flex justify-center p-6">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </CardContent>
        </Card>
      </div>
    </ClerkProvider>
  )
}
