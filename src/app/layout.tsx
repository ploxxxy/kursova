import Providers from '@/components/Providers'
import Navbar from '@/components/ui/Navbar'
import { Toaster } from '@/components/ui/Toaster'
import { cn } from '@/lib/utils'
import '@/styles/globals.css'
import type { Metadata } from 'next'
import { Wix_Madefor_Text } from 'next/font/google'

const font = Wix_Madefor_Text({
  subsets: ['latin', 'cyrillic'],
})

export const metadata: Metadata = {
  title: 'Веб-форум ЄУ',
  description:
    'Онлайн-платформа, де студенти, викладачі та співробітники університету можуть спілкуватися, обмінюватися інформацією та ідеями',
  keywords: 'форум, ЄУ, Європейський університет, портал, спілкування',
}

export default function RootLayout({
  children,
  authModal,
}: Readonly<{
  children: React.ReactNode
  authModal: React.ReactNode
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="uk"
      className={cn('antialiased', font.className)}
    >
      <body className="min-h-screen">
        <Providers>
          <Navbar />

          {authModal}

          <div className="container mx-auto h-full max-w-7xl pt-24">
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
