import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fitness Plan Generator',
  description: 'Create professional workout plans in minutes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body>{children}</body>
    </html>
  )
}
