import { NextResponse } from 'next/server'

// A simple shared-password gate for the private recovery map — not a real
// security boundary (Basic Auth over HTTPS is fine for this), just a way to
// keep the URL from being publicly browsable to anyone who finds/guesses it.
const MMA_PASSWORD = 'mma'
const MMA_REALM = 'Recovery Map'

function mmaGate(request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice('Basic '.length))
    const password = decoded.slice(decoded.indexOf(':') + 1)
    if (password === MMA_PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${MMA_REALM}", charset="UTF-8"` },
  })
}

// /orbit is Jon's friend list. A password sets a long-lived cookie so the
// home-screen web app stays signed in. The invite pages friends open
// (/orbit/i/*) and the daily cron (Bearer CRON_SECRET) stay outside the gate.
function orbitGate(req) {
  const { pathname } = req.nextUrl
  if (pathname.startsWith('/orbit/i/') || pathname.startsWith('/api/orbit/i/')) return NextResponse.next()
  if (pathname === '/orbit/login' || pathname === '/api/orbit/login' || pathname === '/api/orbit/nudge') return NextResponse.next()
  const pw = process.env.ORBIT_PASSWORD
  if (!pw && process.env.NODE_ENV !== 'production') return NextResponse.next()
  if (pw && req.cookies.get('orbit')?.value === pw) return NextResponse.next()
  if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  return NextResponse.redirect(new URL('/orbit/login', req.url))
}

export function middleware(req) {
  const p = req.nextUrl.pathname
  if (p.startsWith('/orbit') || p.startsWith('/api/orbit')) return orbitGate(req)
  return mmaGate(req)
}

export const config = {
  matcher: ['/mma/map/:path*', '/orbit', '/orbit/:path*', '/api/orbit/:path*'],
}
