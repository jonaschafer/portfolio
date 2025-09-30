import './globals.css'

export const metadata = {
  title: 'Jon Schafer - Creative Director',
  description: 'Portfolio of Jon Schafer, Creative Director at ClassDojo',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
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
