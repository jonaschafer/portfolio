'use client'

import { useEffect } from 'react'
import { THEMES } from '../lib/themes'

// The six site themes as highlight pairs. A pair whose background matches the
// field the link sits on is skipped, and the same pair never shows twice in a row.
const PAIRS = THEMES.map((t) => [t.bg, t.ink])

function fieldColor(el) {
  for (let n = el.parentElement; n; n = n.parentElement) {
    const bg = getComputedStyle(n).backgroundColor
    if (bg && bg !== 'transparent' && !bg.endsWith(', 0)')) return bg
  }
  return 'rgb(255, 255, 255)'
}

function toRgb(hex) {
  const v = parseInt(hex.slice(1), 16)
  return `rgb(${(v >> 16) & 255}, ${(v >> 8) & 255}, ${v & 255})`
}

export default function HoverHighlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let last = -1
    const over = (e) => {
      const el = e.target.closest?.('.hl, .hl-row')
      if (!el || el.contains(e.relatedTarget)) return
      const field = fieldColor(el)
      const options = PAIRS.map((p, i) => i).filter((i) => i !== last && toRgb(PAIRS[i][0]) !== field)
      const pick = options[Math.floor(Math.random() * options.length)]
      last = pick
      el.style.setProperty('--hl-bg', PAIRS[pick][0])
      el.style.setProperty('--hl-fg', PAIRS[pick][1])
      el.dataset.hl = 'on'
    }
    const out = (e) => {
      const el = e.target.closest?.('.hl, .hl-row')
      if (!el || el.contains(e.relatedTarget)) return
      el.dataset.hl = 'off'
    }
    document.addEventListener('mouseover', over)
    document.addEventListener('mouseout', out)
    return () => {
      document.removeEventListener('mouseover', over)
      document.removeEventListener('mouseout', out)
    }
  }, [])
  return null
}
