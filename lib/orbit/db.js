// Storage for /orbit. Supabase over PostgREST in production (tables orbit_people,
// orbit_hangs, orbit_invites, RLS on with no policies, so only the service role
// key can read them: friend data never touches the public repo or the anon key).
// Locally without that key it falls back to a gitignored JSON file, so the page
// can be worked on without production secrets.

import fs from 'fs/promises'
import path from 'path'

const base = () => process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const serviceKey = () => process.env.SUPABASE_SERVICE_ROLE_KEY
const useFile = () => !serviceKey() && process.env.NODE_ENV !== 'production'

export const dbConfigured = () => useFile() || Boolean(base() && serviceKey())

// ---------- Supabase ----------

async function rest(p, { method = 'GET', body, prefer } = {}) {
  const k = serviceKey()
  if (!base() || !k) throw new Error('Orbit store not configured')
  const res = await fetch(`${base()}/rest/v1/${p}`, {
    method,
    headers: {
      apikey: k,
      Authorization: `Bearer ${k}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(15000),
  })
  if (!res.ok) throw new Error(`Supabase ${method} ${p.split('?')[0]} ${res.status}: ${await res.text()}`)
  const text = await res.text()
  return text ? JSON.parse(text) : null
}

const eqQuery = (eq = {}) =>
  Object.entries(eq)
    .map(([k, v]) => `${k}=eq.${encodeURIComponent(v)}`)
    .join('&')

// ---------- Local file ----------

const FILE = path.join(process.cwd(), '.orbit-dev.local.json')
async function readFile() {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8'))
  } catch {
    return { orbit_people: [], orbit_hangs: [], orbit_invites: [] }
  }
}
const writeFile = (data) => fs.writeFile(FILE, JSON.stringify(data, null, 2))
const matches = (row, eq = {}) => Object.entries(eq).every(([k, v]) => String(row[k]) === String(v))

// ---------- Four operations, both backends ----------

export async function select(table, eq) {
  if (useFile()) return (await readFile())[table].filter((r) => matches(r, eq))
  return rest(`${table}?select=*&${eqQuery(eq)}`)
}

export async function insert(table, row) {
  if (useFile()) {
    const data = await readFile()
    const full = { created_at: new Date().toISOString(), ...row }
    if (table === 'orbit_hangs') full.id = Math.max(0, ...data[table].map((r) => r.id)) + 1
    data[table].push(full)
    await writeFile(data)
    return full
  }
  return (await rest(table, { method: 'POST', body: row, prefer: 'return=representation' }))[0]
}

export async function update(table, eq, patch) {
  if (useFile()) {
    const data = await readFile()
    data[table] = data[table].map((r) => (matches(r, eq) ? { ...r, ...patch } : r))
    await writeFile(data)
    return
  }
  await rest(`${table}?${eqQuery(eq)}`, { method: 'PATCH', body: patch, prefer: 'return=minimal' })
}

export async function remove(table, eq) {
  if (useFile()) {
    const data = await readFile()
    data[table] = data[table].filter((r) => !matches(r, eq))
    await writeFile(data)
    return
  }
  await rest(`${table}?${eqQuery(eq)}`, { method: 'DELETE', prefer: 'return=minimal' })
}
