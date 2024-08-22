'use client';

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import './globals.css'
import { Providers } from './providers'
import { AuthProvider, useAuth } from './AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { cn } from "@/lib/utils"

const LoadingIndicator = () => <div className="flex justify-center items-center h-screen">Cargando...</div>

const Skeleton = () => (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
  </div>
);

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isContentLoading, setIsContentLoading] = useState(true)

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn && pathname !== '/Login') {
        router.push('/Login')
      } else {
        // Simula una carga de contenido
        setTimeout(() => {
          setIsContentLoading(false)
        }, 1000)
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
        {isContentLoading ? <Skeleton /> : children}
      </main>
      {isLoggedIn && pathname !== '/Login' && <Footer />}
    </>
  )
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
            <AuthWrapper>
              {children}
            </AuthWrapper>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  )
}