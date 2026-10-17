import './globals.css'
import HoverHighlight from '../components/HoverHighlight'
import { themeBootScript } from '../lib/themes'

export const metadata = {
  // Lets the opengraph/twitter images in app/ resolve to absolute URLs.
  metadataBase: new URL('https://www.jonschafer.com'),
  title: 'Jon Schafer',
  description: 'Jon leads brand at ClassDojo. Brand strategy, identity systems, and creative direction.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Deals the page theme before first paint so the old body color never flashes. */}
        <script dangerouslySetInnerHTML={{ __html: themeBootScript() }} />
        <script id="made-with-claude" type="text/plain" dangerouslySetInnerHTML={{
          __html: ` __  __           _                 _ _   _     
|  \\/  | __ _  __| | ___  __      _(_) |_| |__  
| |\\/| |/ _\` |/ _\` |/ _ \\ \\ \\ /\\ / / | __| '_ \\ 
| |  | | (_| | (_| |  __/  \\ V  V /| | |_| | | |
|_|__|_|\\__,_|\\__,_|\\___|_  \\_/\\_/ |_|\\__|_| |_|
 / ___| | __ _ _   _  __| | ___                 
| |   | |/ _\` | | | |/ _\` |/ _ \\                
| |___| | (_| | |_| | (_| |  __/                
 \\____|_|\\__,_|\\__,_|\\__,_|\\___|                `
        }} />
      </head>
      <body>
        {children}
        <HoverHighlight />
      </body>
    </html>
  )
}
