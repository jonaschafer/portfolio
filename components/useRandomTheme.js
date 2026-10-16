'use client'

import { useEffect, useState } from 'react'

// Picks one theme at random per page load, never the same one twice in a row
// (remembered per `key` in sessionStorage). `ready` stays false until the pick
// so callers can hide the default and avoid a color flash; `animate` turns on
// a beat later so hover transitions don't animate the swap itself.
export default function useRandomTheme(themes, key) {
  const [i, setI] = useState(null)
  const [animate, setAnimate] = useState(false)
  useEffect(() => {
    let last = -1
    try {
      last = Number(sessionStorage.getItem(key) ?? -1)
    } catch {}
    const options = themes.map((_, k) => k).filter((k) => k !== last)
    const pick = options[Math.floor(Math.random() * options.length)]
    setI(pick)
    try {
      sessionStorage.setItem(key, String(pick))
    } catch {}
    const t = setTimeout(() => setAnimate(true), 80)
    return () => clearTimeout(t)
  }, [themes, key])
  return { theme: themes[i ?? 0], ready: i !== null, animate }
}
