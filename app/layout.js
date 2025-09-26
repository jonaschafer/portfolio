import './globals.css'

export const metadata = {
  title: 'Jon Schafer - Creative Director',
  description: 'Portfolio of Jon Schafer, Creative Director at ClassDojo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
