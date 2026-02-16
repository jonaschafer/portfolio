import './globals.css'

export const metadata = {
  title: 'Jon Schafer - Creative Director',
  description: 'Portfolio of Jon Schafer, Creative Director at ClassDojo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><text y='.9em' font-size='28' font-family='system-ui'>J</text></svg>" />
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
      <body>{children}</body>
    </html>
  )
}
