'use client';

import { useAuth } from './AuthContext';
import Hero from './components/Hero';
import Frases from './components/Frases';
import Casos from './components/casos';
import Team from './components/Team';
import Faq from './components/Faq';

export default function Home() {
  const { isLoggedIn, userName } = useAuth();

  return (
    <main>
      <Hero />
      {isLoggedIn && <p className="text-center text-2xl my-4">Bienvenido, {userName}!</p>}
      <Frases />
      <Casos />
      <Team />
      <Faq />
    </main>
  )
}