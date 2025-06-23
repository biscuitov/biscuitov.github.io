import type { Metadata } from 'next'
import './globals.css'
import { LanguageProvider } from '@/contexts/language-context'
import { AnimatedCursor } from '@/components/animated-cursor'
import { BackgroundAnimation } from '@/components/background-animation'

export const metadata: Metadata = {
  title: 'Daytona - Fullstack Developer',
  description: 'Daytona - crafting beautiful frontend experiences',
  icons: {
    icon: 'https://github.com/biscuitov.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans text-primary overflow-x-hidden cursor-none bg-gradient-to-br from-gradient-1 via-gradient-2 to-gradient-3 bg-[length:600%_600%] animate-gradient">
        <LanguageProvider>
          <AnimatedCursor />
          <BackgroundAnimation />
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
}
