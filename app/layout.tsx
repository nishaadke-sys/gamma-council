import type { Metadata } from "next"
import { Analytics } from '@vercel/analytics/react'
import { Inter, Geist_Mono } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ variable: '--font-inter', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Gamma Council',
  description: 'Six AI minds debate your hardest decisions.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${geistMono.variable} bg-background`}>
      <body className="font-sans antialiased">
        <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center gap-1 px-5 py-2 sm:px-6">
            <div className="flex items-center gap-2 mr-4">
              <span className="size-2 rounded-full bg-primary" />
              <span className="text-sm font-semibold tracking-tight text-foreground">Gamma</span>
            </div>
            <Link href="/" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Council
            </Link>
            <Link href="/funding" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">Funding</Link>
            <Link href="/legal" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">Legal</Link>
            <Link href="/knowledge" className="rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Knowledge
            </Link>
          </div>
        </nav>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
