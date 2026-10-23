// Supabase access for /row, over PostgREST with plain fetch like the rest of
// the site (see app/api/sounds). Writes need the service role key; the page's
// read also works with the public key, since row_workouts is public-read.

const base = () => process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
const key = (write) =>
  process.env.SUPABASE_SERVICE_ROLE_KEY || (write ? null : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

export const storeConfigured = (write = false) => Boolean(base() && key(write))

async function rest(path, { method = 'GET', body, write = method !== 'GET', prefer } = {}) {
  const k = key(write)
  if (!base() || !k) throw new Error('Supabase not configured')
  const res = await fetch(`${base()}/rest/v1/${path}`, {
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
  if (!res.ok) throw new Error(`Supabase ${method} ${path.split('?')[0]} ${res.status}: ${await res.text()}`)
  return res.status === 204 || method === 'DELETE' ? null : res.json()
}

// Every workout, oldest first. Small table, so the page and the PR math read it whole.
export const listWorkouts = ({ withStream = true } = {}) =>
  rest(`row_workouts?select=${withStream ? '*' : 'id,name,start_local,distance,moving_time,avg_watts,avg_spm,calories,laps,notes,advice'}&order=start_local.asc`)

export const getWorkout = async (id) => (await rest(`row_workouts?id=eq.${Number(id)}&select=*`))[0] || null

export const upsertWorkout = (row) =>
  rest('row_workouts?on_conflict=id', {
    method: 'POST',
    body: { ...row, updated_at: new Date().toISOString() },
    prefer: 'resolution=merge-duplicates,return=minimal',
  })

export const updateWorkout = (id, patch) =>
  rest(`row_workouts?id=eq.${Number(id)}`, {
    method: 'PATCH',
    body: { ...patch, updated_at: new Date().toISOString() },
    prefer: 'return=minimal',
  })

export const deleteWorkout = (id) => rest(`row_workouts?id=eq.${Number(id)}`, { method: 'DELETE' })

export async function getState(k) {
  const rows = await rest(`row_state?key=eq.${encodeURIComponent(k)}&select=value`, { write: true })
  return rows[0]?.value ?? null
}

export const setState = (k, value) =>
  rest('row_state?on_conflict=key', {
    method: 'POST',
    body: { key: k, value, updated_at: new Date().toISOString() },
    prefer: 'resolution=merge-duplicates,return=minimal',
  })
