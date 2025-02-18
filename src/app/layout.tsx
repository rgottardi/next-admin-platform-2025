import { Analytics } from '@vercel/analytics/react'
import { Inter } from 'next/font/google'
import { type ReactNode } from 'react'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next.js Admin Platform',
  description: 'A robust admin platform built with Next.js 14+',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  )
} 