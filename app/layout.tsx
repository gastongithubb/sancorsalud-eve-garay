// RootLayout.js
import { Suspense } from 'react'
import './globals.css'

// Import components normally
import Navbar from './components/Navbar/index'
import Footer from './components/Footer/index'

// Skeleton components (if still needed)
const NavbarSkeleton = () => <div className="h-16 bg-gray-200 animate-pulse"></div>
const FooterSkeleton = () => <div className="h-16 bg-gray-200 animate-pulse"></div>

export const metadata = {
  title: 'Sancor Equipo Garay',
  description: 'Pagina creada para equipo sancor salud de CX para el equipo de Evelin Garay',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <Navbar />
        <main className="flex-grow pt-24 sm:pt-28 md:pt-32 lg:pt-36">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}