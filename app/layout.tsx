import { Suspense } from 'react'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider } from './AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
// Comentamos temporalmente la importación de la fuente
// import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"

// Comentamos temporalmente la configuración de la fuente
// const inter = Inter({
//   subsets: ["latin"],
//   display: 'swap',
// })

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
      <body className={cn(
  "min-h-screen bg-background antialiased",
  "font-sans text-gray-900",
  "font-['system-ui','-apple-system','BlinkMacSystemFont','Segoe_UI','Roboto','Oxygen','Ubuntu','Cantarell','Fira_Sans','Droid_Sans','Helvetica_Neue',sans-serif]"
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