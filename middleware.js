import { NextResponse } from 'next/server'

// A simple shared-password gate for the private recovery map — not a real
// security boundary (Basic Auth over HTTPS is fine for this), just a way to
// keep the URL from being publicly browsable to anyone who finds/guesses it.
const PASSWORD = 'mma'
const REALM = 'Recovery Map'

export function middleware(request) {
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Basic ')) {
    const decoded = atob(authHeader.slice('Basic '.length))
    const password = decoded.slice(decoded.indexOf(':') + 1)
    if (password === PASSWORD) {
      return NextResponse.next()
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"` },
  })
}

export const config = {
  matcher: '/mma/map/:path*',
}
