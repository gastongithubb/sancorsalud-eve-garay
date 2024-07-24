'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { 
    label: 'NPS', 
    dropdown: [
      { href: '/nps-individual', label: 'NPS Individual' },
      { href: '/nps-trimestral', label: 'NPS Trimestral' },
      { href: '/balanceMensual', label: 'Balance Mensual' },
      { href: '/metricas-equipo', label: 'Métricas Equipo' },
      { href: '/promotores', label: 'Promotores' }
    ]
  },
  { 
    label: 'Herramientas', 
    dropdown: [
      { href: '/reclamos', label: 'Reclamos de F4' },
      { href: '/sla', label: 'SLA' },
      { href: 'https://docs.google.com/spreadsheets/d/10dZhGPjLzw4XxZQ3uZdNmQtUo64clE9jNnWBkkUKezQ/edit#gid=0', label: 'Protesis en Ambulatorio', target: '_blank' },
      { href: 'https://drive.google.com/file/d/1WrBLlnFoTYoWQhGw8ez83VCpn3d5h4-o/view?usp=sharing', label: 'Carga de CUD (Proceso)', target: '_blank'},
      { href: '/NomencladorNU', label: 'Practicas por codigo NU y NB' },
      { href: '/NomencladorNM', label: 'Practicas por codigo NM' }
    ]
  },
  {
    label: 'Vademecum',
    dropdown: [
      { 
        href: 'https://docs.google.com/spreadsheets/d/1720VTYilXZxEHKnWYpq5R7x2hkswnGfd/edit?rtpof=true&sd=true&gid=2119192922#gid=2119192922', 
        label: 'PMI Sustentable, C y OS',
        target: '_blank'
      },
      { 
        href: 'https://docs.google.com/spreadsheets/d/1GDfmi_CBvcmeJZKWyKFtx6eGZqppraUOyFSqe0SBExE/edit?gid=1182941618#gid=1182941618', 
        label: 'Salud Reproductiva',
        target: '_blank'
      },
      { 
        href: 'https://docs.google.com/spreadsheets/d/13R6tt3O36BfMeSDuSwfwzwi9dYP4FHhDEtj8rIBZ_Gw/edit?gid=2095242313#gid=2095242313', 
        label: 'Cronicos',
        target: '_blank'
      },
      { 
        href: 'https://docs.google.com/spreadsheets/d/1aj5NU2iU4NeIiLdhIcBAKUY4xMfhNrqm/edit?gid=1202509401#gid=1202509401', 
        label: 'Sustentable',
        target: '_blank'
      },
    ]
  },
  { href: '/#casos', label: 'Casos derivar / cerrar' },
  { href: '/foro', label: 'Pizarra' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDropdown = (label: string) => {
    if (dropdownOpen === label) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(label);
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#f5f5f5] shadow-lg' : 'bg-transparent'}`}>
      <nav className={`container mx-auto px-4 py-3 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <Image src="/Logo.webp" alt="Logo" width={176} height={40} className="transition-all duration-300 transform hover:scale-105" />
          </Link>
          <div className="items-center hidden space-x-8 md:flex">
            {navLinks.map((link, index) => (
              <div key={index} className="relative group">
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="flex items-center text-gray-700 transition-colors duration-200 hover:text-blue-600"
                    >
                      {link.label}
                      <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="absolute left-0 invisible w-48 mt-2 transition-all duration-200 transform translate-y-1 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                      {link.dropdown.map((item, itemIndex) => (
                        item.target === '_blank' ? (
                          <a 
                            key={itemIndex} 
                            href={item.href} 
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-4 py-2 text-sm text-gray-950 hover:bg-blue-50 hover:text-cyan-900"
                          >
                            {item.label}
                          </a>
                        ) : (
                          <Link 
                            key={itemIndex} 
                            href={item.href} 
                            className="block px-4 py-2 text-sm text-gray-950 hover:bg-blue-50 hover:text-cyan-900"
                          >
                            {item.label}
                          </Link>
                        )
                      ))}
                    </div>
                  </>
                ) : (
                  <Link href={link.href} className="text-gray-700 transition-colors duration-200 hover:text-blue-600">
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <Link href="/Login" className="items-center hidden px-4 py-2 transition-colors duration-200 bg-gray-900 rounded-md text-rose-400 md:inline-flex hover:bg-gray-700">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
            Iniciar sesión
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md md:hidden hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className={`${isOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <div key={index}>
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => toggleDropdown(link.label)}
                      className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
                    >
                      {link.label}
                    </button>
                    {dropdownOpen === link.label && (
                      <div className="pl-4">
                        {link.dropdown.map((item, itemIndex) => (
                          item.target === '_blank' ? (
                            <a 
                              key={itemIndex} 
                              href={item.href} 
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
                            >
                              {item.label}
                            </a>
                          ) : (
                            <Link 
                              key={itemIndex} 
                              href={item.href} 
                              className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
                            >
                              {item.label}
                            </Link>
                          )
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link href={link.href} className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50">
                    {link.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="pt-4 pb-3 border-t border-pink-200">
            <Link href="/login" className="block px-3 py-2 text-base font-medium rounded-md text-rose-400 hover:text-blue-600 hover:bg-gray-50">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;