import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Tandem',
  description: 'Web Projects 2',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
