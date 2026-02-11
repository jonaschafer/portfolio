import './globals.css'

export const metadata = {
  title: 'Wall of Sound',
  description: 'A curated collection of music tracks',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
