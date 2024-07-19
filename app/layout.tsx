import './globals.css'
import { Suspense, lazy } from 'react'
import './globals.css'

// Lazy load components
const Navbar = lazy(() => import('./components/Navbar/index'))
const Footer = lazy(() => import('./components/Footer/index'))

// Skeleton components
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
      <body className="flex flex-col min-h-screen font-sans">
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar />
        </Suspense>
        <main className="flex-grow pt-24 sm:pt-28 md:pt-32 lg:pt-36">
          {children}
        </main>
        <Suspense fallback={<FooterSkeleton />}>
          <Footer />
        </Suspense>
      </body>
    </html>
  )
}