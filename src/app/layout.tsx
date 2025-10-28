import { ClerkProvider } from '@clerk/nextjs'
import { SocketProvider } from '@/lib/socket/SocketContext'
import './globals.css'
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Tandem",
  description: "Share childcare with your community",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          {/* Omnes Pro from Adobe Fonts */}
          <link rel="stylesheet" href="https://use.typekit.net/pku8yek.css" />
          
          {/* Alan Sans from Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Alan+Sans:wght@300..900&display=swap" rel="stylesheet" />
        </head>
        <body className="antialiased">
          <SocketProvider>
            {children}
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}