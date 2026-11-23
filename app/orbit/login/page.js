'use client'

import { useState } from 'react'

export default function OrbitLogin() {
  const [pw, setPw] = useState('')
  const [bad, setBad] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/orbit/login', { method: 'POST', body: JSON.stringify({ password: pw }) })
    if (res.ok) window.location.href = '/orbit'
    else setBad(true)
  }
  return (
    <main className="ob" style={{ '--ob-bg': '#F2F2F2', '--ob-ink': '#130EA8' }}>
      <form className="ob-wrap" onSubmit={submit}>
        <h1 className="ob-title">Orbit</h1>
        <p className="ob-statement">Password, please.</p>
        <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus autoComplete="current-password" />
        <div className="ob-row">
          <button className="ob-btn solid">Go</button>
          {bad && <span className="ob-small">Not it.</span>}
        </div>
      </form>
    </main>
  )
}
