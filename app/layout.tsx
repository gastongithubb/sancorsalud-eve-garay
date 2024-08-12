import { Suspense } from 'react'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider } from './AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Inter as FontSans } from "next/font/google"
import { cn } from "@/lib/utils"
 
const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

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
      <body className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}>
        <Providers>
          <AuthProvider>
            <Suspense fallback={<NavbarSkeleton />}>
              <Navbar />
            </Suspense>
            <main className="flex-grow pt-24 sm:pt-28 md:pt-32 lg:pt-36">
              {children}
            </main>
            <Suspense fallback={<FooterSkeleton />}>
              <Footer />
            </Suspense>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}