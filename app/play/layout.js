'use client'

import Navigation from '../../components/Navigation'
import { usePathname } from 'next/navigation'

export default function PlayLayout({ children }) {
  const pathname = usePathname()
  const isVibeWiki = pathname?.includes('/vibe-coding-setup')
  // The /play index renders its own themed nav (see components/PlayIndex.js).
  const isIndex = pathname === '/play'

  return (
    <div className="min-h-screen">
      {!isVibeWiki && !isIndex && (
        <Navigation backgroundColor="#FFFFFF" textColor="#2E2E2E" />
      )}
      {children}
    </div>
  )
}
