'use client'

import Navigation from '../../components/Navigation'
import { usePathname } from 'next/navigation'

export default function PlayLayout({ children }) {
  const pathname = usePathname()
  const isVibeWiki = pathname?.includes('/vibe-coding-setup')
  
  return (
    <div className="min-h-screen">
      {!isVibeWiki && (
        <Navigation backgroundColor="white" textColor="black" underlineColor="black" arrowColor="black" />
      )}
      {children}
    </div>
  )
}
