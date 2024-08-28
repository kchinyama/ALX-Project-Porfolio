import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { request } from 'https'

const protectedRoutes = createRouteMatcher([
  '/',
  '/upcoming',
  '/previous',
  '/personal-room',
  '/recordings',
  '/meeting(.*)'
])

export default clerkMiddleware((auth, request) => {
  if(protectedRoutes(request)) auth().protect();
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}