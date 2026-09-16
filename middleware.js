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

/*
 * Password gate for everything under /aleph (client material for Aleph).
 *
 * - The password lives in the ALEPH_PASSWORD env var (Vercel + .env.local).
 *   Changing it signs everyone out, because the cookie holds a salted hash of it.
 * - Checked server-side on every request: pages, RSC payloads, data and the
 *   images in public/aleph/. Nothing under /aleph is served without the cookie.
 * - If ALEPH_PASSWORD is unset the gate stays shut (fails closed).
 * - Future pages (/aleph/shader, /aleph/merch) are covered automatically.
 */

const COOKIE = 'aleph_gate'
const SALT = 'jonschafer.com/aleph:v1'
const MAX_AGE = 60 * 60 * 24 * 30
const ROBOTS = 'noindex, nofollow, noarchive'

const normalize = (pw) => String(pw || '').trim().toLowerCase()

async function tokenFor(password) {
  const bytes = new TextEncoder().encode(`${SALT}:${normalize(password)}`)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

function safeNext(value) {
  const next = String(value || '/aleph')
  return next.startsWith('/aleph') && !next.startsWith('/aleph/unlock') ? next : '/aleph'
}

function gatePage(next, failed) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="${ROBOTS}">
<title>Password required</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500&display=swap">
<style>
  :root { --paper:#F3F4F1; --sheet:#FFFFFF; --ink:#141617; --muted:#5B6166; --rule:#D5D9D3; --mark:#F5E15B; --bad:#9F2F22; color-scheme: light dark; }
  @media (prefers-color-scheme: dark) { :root { --paper:#101211; --sheet:#171A18; --ink:#E8EBE7; --muted:#9AA19C; --rule:#2B302D; --mark:#E9D54E; --bad:#F08B7B; } }
  * { box-sizing: border-box; }
  html, body { height: 100%; margin: 0; }
  body { background: var(--paper); color: var(--ink); display: grid; place-items: center; padding: 24px 16px;
    font: 15px/1.5 Geist, ui-sans-serif, -apple-system, "Segoe UI", sans-serif; }
  form { width: min(360px, 100%); }
  .eyebrow { font: 500 11px/1 ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
  h1 { font: 500 36px/1.05 Geist, ui-sans-serif, -apple-system, sans-serif; letter-spacing: -0.04em; margin: 14px 0 28px; }
  label { display: block; font: 500 11px/1 ui-monospace, "SF Mono", Menlo, monospace; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
  .row { display: flex; border: 1px solid var(--ink); background: var(--sheet); }
  input { flex: 1; min-width: 0; border: 0; background: transparent; color: var(--ink); font: 16px/1 ui-monospace, "SF Mono", Menlo, monospace; padding: 14px 14px; }
  input:focus { outline: none; }
  .row:focus-within { box-shadow: 0 0 0 3px var(--mark); }
  button { border: 0; border-left: 1px solid var(--ink); background: var(--ink); color: var(--paper); font: 500 13px/1 ui-monospace, "SF Mono", Menlo, monospace; padding: 0 18px; cursor: pointer; transition: transform 120ms cubic-bezier(.23,1,.32,1); }
  button:active { transform: scale(.97); }
  p.err { color: var(--bad); font-size: 13.5px; margin: 12px 0 0; }
  p.note { color: var(--muted); font-size: 13px; margin: 28px 0 0; border-top: 1px solid var(--rule); padding-top: 14px; }
</style>
</head>
<body>
<form method="post" action="/aleph/unlock">
  <div class="eyebrow">jonschafer.com / aleph</div>
  <h1>Aleph</h1>
  <input type="hidden" name="next" value="${escapeHtml(next)}">
  <label for="pw">Password</label>
  <div class="row">
    <input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
    <button type="submit">Open</button>
  </div>
  ${failed ? '<p class="err" role="alert">That password didn’t work. Check with Jon.</p>' : ''}
  <p class="note">Shared with the Aleph team. Please don’t forward the link.</p>
</form>
</body>
</html>`
  return new NextResponse(html, {
    status: 401,
    headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': ROBOTS },
  })
}

async function alephGate(req) {
  const { pathname, search, protocol } = req.nextUrl
  const password = process.env.ALEPH_PASSWORD
  if (!password && process.env.NODE_ENV !== 'production') {
    console.warn('[aleph gate] ALEPH_PASSWORD is not set; /aleph stays locked.')
  }

  if (pathname === '/aleph/unlock') {
    if (req.method !== 'POST') return NextResponse.redirect(new URL('/aleph', req.url))
    const form = await req.formData()
    const next = safeNext(form.get('next'))
    if (!password || normalize(form.get('password')) !== normalize(password)) {
      return gatePage(next, true)
    }
    const res = NextResponse.redirect(new URL(next, req.url), 303)
    res.cookies.set(COOKIE, await tokenFor(password), {
      httpOnly: true,
      secure: protocol === 'https:',
      sameSite: 'lax',
      path: '/aleph',
      maxAge: MAX_AGE,
    })
    return res
  }

  if (pathname === '/aleph/lock') {
    const res = NextResponse.redirect(new URL('/aleph', req.url), 303)
    res.cookies.set(COOKIE, '', { path: '/aleph', maxAge: 0 })
    return res
  }

  const cookie = req.cookies.get(COOKIE)?.value
  if (password && cookie && cookie === (await tokenFor(password))) {
    const res = NextResponse.next()
    res.headers.set('x-robots-tag', ROBOTS)
    return res
  }

  const wantsPage = req.method === 'GET' && (req.headers.get('accept') || '').includes('text/html') && !req.headers.get('rsc')
  if (wantsPage) return gatePage(pathname + search, false)
  return new NextResponse('Password required', {
    status: 401,
    headers: { 'cache-control': 'no-store', 'x-robots-tag': ROBOTS },
  })
}

export function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/mma/map')) return mmaGate(req)
  return alephGate(req)
}

export const config = {
  matcher: ['/mma/map/:path*', '/aleph', '/aleph/:path*'],
}
