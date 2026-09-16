import { Martian_Mono } from 'next/font/google'
import './aleph.css'

// Everything under /aleph is gated by middleware.js and kept out of search.
// Geist loads from Google Fonts (Next 14.0's next/font list predates it);
// Martian Mono is self-hosted through next/font.
const mono = Martian_Mono({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--f-mono',
  display: 'swap',
})

export const metadata = {
  title: { default: 'Aleph', template: '%s · Aleph' },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
}

export default function AlephLayout({ children }) {
  return (
    <div className={`aa ${mono.variable}`}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&display=swap" />
      {children}
    </div>
  )
}
