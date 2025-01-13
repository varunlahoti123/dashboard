import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher(['/(.+)'])

export default clerkMiddleware(async (auth, req) => {
  // Skip auth for webhooks
  if (req.nextUrl.pathname.startsWith('/api/webhooks')) {
    return NextResponse.next()
  }

  // Check if user is on homepage
  if (req.nextUrl.pathname === '/') {
    const isAuthenticated = await auth.protect().catch(() => false)
    
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }
  
  // Existing protected routes logic
  if (isProtectedRoute(req)) {
    const isAuthenticated = await auth.protect().catch(() => false)
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|api/webhooks|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api(?!/webhooks))(.*)', // Match API routes except webhooks
  ],
}