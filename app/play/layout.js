'use client'

import Navigation from '../../components/Navigation'
import { usePathname } from 'next/navigation'
import { BUILD_PATHS } from '../../lib/builds'

export default function PlayLayout({ children }) {
  const pathname = usePathname()
  const isVibeWiki = pathname?.includes('/vibe-coding-setup')
  // The /play index renders its own themed nav (see components/PlayIndex.js).
  // So do the build write-ups (components/PlayArticle.js).
  const isIndex = pathname === '/play' || BUILD_PATHS.includes(pathname?.replace(/\/$/, ''))

  return (
    <div className="min-h-screen">
      {!isVibeWiki && !isIndex && (
        <Navigation backgroundColor="#FFFFFF" textColor="#2E2E2E" />
      )}
      {children}
    </div>
  )
}
