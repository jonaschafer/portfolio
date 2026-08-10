'use client'

import { useState } from 'react'

export default function MmaRecoveryShareButton({ anchor }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#${anchor}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard unavailable — silently no-op, the anchor is still shareable manually
    }
  }

  return (
    <button
      onClick={copyLink}
      className="mma-btn-press text-[12px] px-[12px] py-[6px] rounded-full flex-shrink-0"
      style={{ border: '1px solid #e4dcc9', color: '#8a7c68' }}
    >
      {copied ? 'Link copied' : 'Copy link'}
    </button>
  )
}
