'use client'

import { useEffect, useState } from 'react'
import { THEMES } from '../lib/themes'

const DECK_KEY = 'site-theme-deck'

// One pick per page view, so React's dev double-run doesn't deal twice.
const view = { path: null, pick: null }

// Deals the themes like a shuffled deck: each page load takes the next card,
// so six reloads show all six themes before any repeats. A new deck is
// shuffled when the last runs out, never starting on the theme just shown.
function nextIndex(n) {
  let deck = null
  try {
    deck = JSON.parse(localStorage.getItem(DECK_KEY) || 'null')
  } catch {}
  if (!deck || !Array.isArray(deck.order) || deck.order.length !== n || deck.pos >= n) {
    const last = deck?.order?.[n - 1]
    const order = [...Array(n).keys()]
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    if (order[0] === last) order.push(order.shift())
    deck = { order, pos: 0 }
  }
  const pick = deck.order[deck.pos]
  try {
    localStorage.setItem(DECK_KEY, JSON.stringify({ order: deck.order, pos: deck.pos + 1 }))
  } catch {}
  return pick
}

// `ready` stays false until the pick so callers can hide the default and
// avoid a color flash; `animate` turns on a beat later so hover transitions
// don't animate the swap itself.
// Pass `enabled = false` when a parent already picked, so the deck only
// advances once per page load.
export default function useRandomTheme(themes = THEMES, enabled = true) {
  const [i, setI] = useState(null)
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    if (enabled) {
      if (view.path !== window.location.pathname || view.pick === null) {
        view.path = window.location.pathname
        view.pick = nextIndex(themes.length)
      }
      setI(view.pick)
    }
    const t = setTimeout(() => setAnimate(true), 80)
    return () => clearTimeout(t)
  }, [themes, enabled])
  return { theme: themes[i ?? 0], ready: i !== null, animate }
}
