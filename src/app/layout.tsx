import type { Metadata } from 'next'
import { Provider } from '@/components/ui/provider'
import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from '@/components/ui/toaster'
import '@/App.css'

export const metadata: Metadata = {
  title: 'Wishlist',
  description: 'View this wishlist',
  openGraph: {
    title: 'Wishlist',
    description: 'View this wishlist',
    images: ['/favicon.png'],
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <Provider>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  )
}
