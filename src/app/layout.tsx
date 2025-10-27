import { ClerkProvider } from '@clerk/nextjs'
import { SocketProvider } from '@/lib/socket/SocketContext'
import './globals.css'

export const metadata = {
  title: 'Tandem',
  description: 'Web Projects 2',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SocketProvider>
            {children}
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
