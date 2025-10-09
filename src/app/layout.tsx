  import type { Metadata } from 'next';
  import './globals.css';
  import { MessageProvider } from '@/context/MessageContext';

  export const metadata: Metadata = {
    title: 'Tandem - Childcare Message Generator',
    description: 'Generate professional messages for childcare providers',
  };

  export default function RootLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <html lang="en">
        <body>
          <MessageProvider>{children}</MessageProvider>
        </body>
      </html>
    );
  }