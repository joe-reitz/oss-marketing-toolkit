import './globals.css'
import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import Navigation from '@/components/Navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { brandConfig } from '@/config/brand'

export const metadata: Metadata = {
  title: brandConfig.company.name,
  description: 'A comprehensive toolkit for marketing operations - UTM generator, image generator, QR codes, and more',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased`}>
        <ThemeProvider defaultTheme="dark" storageKey="marketing-toolkit-theme">
          <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Navigation />
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}