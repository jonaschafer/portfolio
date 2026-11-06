import { readdirSync, readFileSync, existsSync, statSync } from 'fs'
import path from 'path'
import { BUILDS } from './builds'

// Every live URL on the site, for /urls. Read from the filesystem at build
// time (the page is force-static), so new pages show up without editing a list.
//
// Sources:
//   app/**/page.js                 Next routes (dynamic segments expanded or skipped)
//   public/**/index.html           static pages reachable through the rewrites in next.config.js
//
// /aleph pages are listed and flagged as gated (the password still applies).
// Left out on purpose: /api, routes
// that only redirect (next.config.js or a page.js that just calls redirect()),
// and /urls itself.

const ROOT = process.cwd()
const SKIP_PREFIXES = ['/api', '/urls']
// Live but behind the password gate in middleware.js.
const GATED_PREFIXES = ['/aleph']
// Sources that exist on disk but only redirect, so they aren't live pages.
const REDIRECTED = new Set(['/mma', '/mma/map', '/v2', '/dana-plan', '/work'])

function walk(dir, file) {
  const out = []
  if (!existsSync(dir)) return out
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name)
    if (statSync(full).isDirectory()) out.push(...walk(full, file))
    else if (name === file) out.push(full)
  }
  return out
}

// A page.js that only calls redirect() isn't a page of its own.
function isRedirectOnly(file) {
  const src = readFileSync(file, 'utf8')
  return /from 'next\/navigation'/.test(src) && /\{\s*redirect\([^)]*\)\s*;?\s*\}/.test(src) && !/return\s*[(<]/.test(src)
}

function appRoutes() {
  const appDir = path.join(ROOT, 'app')
  const routes = []
  for (const file of walk(appDir, 'page.js')) {
    const rel = path.relative(appDir, path.dirname(file))
    const segs = rel ? rel.split(path.sep).filter((s) => !/^\(.*\)$/.test(s)) : []
    const url = '/' + segs.join('/')
    if (url === '/play/[slug]') {
      for (const b of BUILDS) routes.push({ url: `/play/${b.slug}` })
      continue
    }
    if (segs.some((s) => s.startsWith('['))) continue // needs an id, not a browsable page
    if (isRedirectOnly(file)) continue
    routes.push({ url })
  }
  return routes
}

function staticRoutes() {
  const pub = path.join(ROOT, 'public')
  return walk(pub, 'index.html').map((file) => {
    const url = '/' + path.relative(pub, path.dirname(file)).split(path.sep).join('/')
    return { url }
  })
}

export function getSiteUrls() {
  const seen = new Map()
  for (const r of [...appRoutes(), ...staticRoutes()]) {
    if (SKIP_PREFIXES.some((p) => r.url === p || r.url.startsWith(p + '/'))) continue
    if (REDIRECTED.has(r.url)) continue
    r.gated = GATED_PREFIXES.some((p) => r.url === p || r.url.startsWith(p + '/'))
    if (!seen.has(r.url)) seen.set(r.url, r)
  }
  const urls = [...seen.values()].sort((a, b) => a.url.localeCompare(b.url))

  // Group by first path segment.
  const groups = new Map()
  for (const u of urls) {
    const key = u.url === '/' ? '/' : '/' + u.url.split('/')[1]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(u)
  }
  return { total: urls.length, groups: [...groups.entries()].map(([section, items]) => ({ section, items })) }
}
