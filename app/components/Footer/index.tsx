'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Footer: React.FC = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());

    const handleScroll = () => {
      if (window.scrollY > 300 && !showWhatsAppPopup) {
        setShowWhatsAppPopup(true);
        setTimeout(() => setShowWhatsAppPopup(false), 5000);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showWhatsAppPopup]);

  return (
    <>
      <footer className="bg-[#f5f5f5] text-zinc-900 font-SpaceGrotesk">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-6">
            <div>
              <Image src="/Logo.webp" alt="Logo" width={176} height={40} className="w-44" />
            </div>
            <div className="text-right">
              <p>@ {currentYear} Administracion y Soporte <em>Gaston Alvarez</em></p>
              <p>Made with <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="underline transition-colors duration-300 hover:text-white">Next.js</a></p>
            </div>
          </div>
        </div>
      </footer>

      <div id="whatsapp-container" className="fixed z-50 bottom-4 right-4">
        <a href="https://api.whatsapp.com/send?phone=5493513818385" target="_blank" rel="noopener noreferrer" className="block" aria-label="Chat on WhatsApp">
          <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 39 39">
            <path fill="#00E676" d="M10.7 32.8l.6.3c2.5 1.5 5.3 2.2 8.1 2.2 8.8 0 16-7.2 16-16 0-4.2-1.7-8.3-4.7-11.3s-7-4.7-11.3-4.7c-8.8 0-16 7.2-15.9 16.1 0 3 .9 5.9 2.4 8.4l.4.6-1.6 5.9 6-1.5z"></path>
            <path fill="#FFF" d="M32.4 6.4C29 2.9 24.3 1 19.5 1 9.3 1 1.1 9.3 1.2 19.4c0 3.2.9 6.3 2.4 9.1L1 38l9.7-2.5c2.7 1.5 5.7 2.2 8.7 2.2 10.1 0 18.3-8.3 18.3-18.4 0-4.9-1.9-9.5-5.3-12.9zM19.5 34.6c-2.7 0-5.4-.7-7.7-2.1l-.6-.3-5.8 1.5L6.9 28l-.4-.6c-4.4-7.1-2.3-16.5 4.9-20.9s16.5-2.3 20.9 4.9 2.3 16.5-4.9 20.9c-2.3 1.5-5.1 2.3-7.9 2.3zm8.8-11.1l-1.1-.5s-1.6-.7-2.6-1.2c-.1 0-.2-.1-.3-.1-.3 0-.5.1-.7.2 0 0-.1.1-1.5 1.7-.1.2-.3.3-.5.3h-.1c-.1 0-.3-.1-.4-.2l-.5-.2c-1.1-.5-2.1-1.1-2.9-1.9-.2-.2-.5-.4-.7-.6-.7-.7-1.4-1.5-1.9-2.4l-.1-.2c-.1-.1-.1-.2-.2-.4 0-.2 0-.4.1-.5 0 0 .4-.5.7-.8.2-.2.3-.5.5-.7.2-.3.3-.7.2-1-.1-.5-1.3-3.2-1.6-3.8-.2-.3-.4-.4-.7-.5h-1.1c-.2 0-.4.1-.6.1l-.1.1c-.2.1-.4.3-.6.4-.2.2-.3.4-.5.6-.7.9-1.1 2-1.1 3.1 0 .8.2 1.6.5 2.3l.1.3c.9 1.9 2.1 3.6 3.7 5.1l.4.4c.3.3.6.5.8.8 2.1 1.8 4.5 3.1 7.2 3.8.3.1.7.1 1 .2h1c.5 0 1.1-.2 1.5-.4.3-.2.5-.2.7-.4l.2-.2c.2-.2.4-.3.6-.5s.4-.4.5-.6c.2-.4.3-.9.4-1.4v-.7s-.1-.1-.3-.2z"></path>
          </svg>
        </a>
        <div 
          className={`absolute right-0 w-64 p-4 bg-black rounded-lg shadow-xl bottom-16 transition-opacity duration-300 ${
            showWhatsAppPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <p className="text-sm text-white">Hola, soy Eve, cualquier duda que tengas, porfa consultame asi te puedo ayudar 😊</p>
        </div>
      </div>

      <style jsx>{`
        #whatsapp-container {
          transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default Footer;