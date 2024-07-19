import './globals.css'
import Navbar from './components/Navbar/index'
import Footer from './components/Footer/index'

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
    <html lang="es" >
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