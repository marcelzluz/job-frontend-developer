import type { Metadata } from 'next'
import { Nunito_Sans } from 'next/font/google'
import './globals.css'
import Home from './page';

const nunitoSans = Nunito_Sans({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '🎧 Melody Explorer 🎧',
  description: 'Conheça mais sobre seu artista favorito',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={nunitoSans.className}>
        <main className="min-h-screen w-full text-gray-800">
          {children}
        </main>
      </body>
    </html>
  )
};
