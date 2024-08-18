'use client';

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { cn } from "@/lib/utils"

const LoadingIndicator = () => <div className="flex justify-center items-center h-screen">Cargando...</div>

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && pathname !== '/Login') {
        router.push('/Login')
      }
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  if (isLoading) {
    return <LoadingIndicator />
  }

  // Si no está logueado y no está en la página de login, no renderizamos nada
  if (!isLoggedIn && pathname !== '/Login') {
    return null;
  }

  return (
    <>
      {isLoggedIn && pathname !== '/Login' && <Navbar />}
      <main className={cn(
        "flex-grow",
        isLoggedIn && pathname !== '/Login' ? "pt-24 sm:pt-28 md:pt-32 lg:pt-36" : ""
      )}>
        {children}
      </main>
      {isLoggedIn && pathname !== '/Login' && <Footer />}
    </>
  )
}

// function DebugInfo() {
//   const { isLoggedIn, isLoading } = useAuth()
//   const pathname = usePathname()

//   return (
//     <div className="fixed bottom-0 left-0 bg-black text-white p-2 text-xs">
//       isLoggedIn: {String(isLoggedIn)}, isLoading: {String(isLoading)}, 
//       pathname: {pathname}
//     </div>
//   )
// }

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
            <AuthWrapper>
              {children}
            </AuthWrapper>
            {/* <DebugInfo /> */}
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}