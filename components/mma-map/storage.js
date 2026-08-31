'use client'

import { useCallback, useEffect, useState } from 'react'

const PREFIX = 'mma-map:'

export function readJSON(key, fallback) {
  try {
    const raw = window.localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch (e) {
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch (e) {}
}

// Client-only persisted state. Starts at `initial` during SSR/first paint, then
// hydrates from localStorage on mount — avoids a server/client markup mismatch.
export function useLocalState(key, initial) {
  const [value, setValue] = useState(initial)

  useEffect(() => {
    setValue(readJSON(key, initial))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

  const update = useCallback(
    (updater) => {
      setValue((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater
        writeJSON(key, next)
        return next
      })
    },
    [key]
  )

  return [value, update]
}

// { checked: { [itemId]: true }, notes: { [itemId]: string } }
export function useChecklist(key) {
  const [state, update] = useLocalState(key, { checked: {}, notes: {} })

  const toggle = useCallback(
    (id) => {
      update((prev) => ({ ...prev, checked: { ...prev.checked, [id]: !prev.checked?.[id] } }))
    },
    [update]
  )

  const setNote = useCallback(
    (id, text) => {
      update((prev) => ({ ...prev, notes: { ...prev.notes, [id]: text } }))
    },
    [update]
  )

  return { checked: state.checked || {}, notes: state.notes || {}, toggle, setNote }
}

export function unresolvedCount(checklistState, items) {
  const checked = checklistState?.checked || {}
  return items.filter((item) => !checked[item.id]).length
}

export const JOURNAL_ENTRIES_KEY = 'journal-entries'
export const JOURNAL_WEEKLY_KEY = 'journal-weekly'

export function downloadJSON(filename, obj) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function exportAllData() {
  const out = {}
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i)
    if (!k || !k.startsWith(PREFIX)) continue
    try {
      out[k] = JSON.parse(window.localStorage.getItem(k))
    } catch (e) {
      out[k] = window.localStorage.getItem(k)
    }
  }
  return { app: 'mma-recovery-map', version: 1, exportedAt: new Date().toISOString(), data: out }
}

export function importAllData(payload) {
  if (!payload || typeof payload !== 'object' || !payload.data) {
    throw new Error('That file doesn’t look like a Recovery Map export.')
  }
  for (const [k, v] of Object.entries(payload.data)) {
    if (!k.startsWith(PREFIX)) continue
    window.localStorage.setItem(k, JSON.stringify(v))
  }
}

export function dateKey(date) {
  const d = date instanceof Date ? date : new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
