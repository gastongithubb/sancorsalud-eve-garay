'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import Hero from './components/Hero';
import Frases from './components/Frases';
import Casos from './components/casos';
import Team from './components/Team';
import Faq from './components/Faq';

export default function ClientHome() {
  const { isLoggedIn } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/Login')
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null // or a loading indicator
  }

  return (
    <main>
      <Hero />
      <Frases />
      <Casos />
      <Team />
      <Faq />
    </main>
  );
}