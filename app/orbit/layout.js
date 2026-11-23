import './orbit.css'

export const metadata = {
  title: 'Orbit',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'Orbit', statusBarStyle: 'default' },
}

export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' }

export default function OrbitLayout({ children }) {
  return children
}
