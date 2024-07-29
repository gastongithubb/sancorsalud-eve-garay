'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Transition } from '@headlessui/react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const navLinks = [
  { 
    label: 'NPS', 
    dropdown: [
      { href: '/nps-individual', label: 'NPS Individual' },
      { href: '/nps-trimestral', label: 'NPS Trimestral' },
      { href: '/Balancemensual', label: 'Balance Mensual' },
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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState('/team/none.webp');
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  const fetchUserData = useCallback(async (token: string) => {
    try {
      const response = await fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUserName(userData.name);
        setProfilePicture(userData.profilePicture || '/team/none.webp');
        setIsAdmin(['prueba', 'admin', 'gaston'].includes(userData.name.toLowerCase()));
        setIsLoggedIn(true);
      } else {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error al cargar los datos del usuario. Por favor, inicia sesión de nuevo.');
      handleLogout();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchUserData]);

  const toggleDropdown = (label: string) => {
    setDropdownOpen(prev => prev === label ? null : label);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setProfilePicture('/team/none.webp');
    setIsAdmin(false);
    router.push('/');
    toast.success('Has cerrado sesión correctamente');
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('profilePicture', file);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/update-profile-picture', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          setProfilePicture(result.profilePictureUrl);
          toast.success('Imagen de perfil actualizada correctamente');
        } else {
          throw new Error('Failed to update profile picture');
        }
      } catch (error) {
        console.error('Error updating profile picture:', error);
        toast.error('Error al actualizar la imagen de perfil. Por favor, intenta de nuevo.');
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
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
                      <Transition
                        show={dropdownOpen === link.label}
                        enter="transition ease-out duration-100 transform"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition ease-in duration-75 transform"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <div className="absolute left-0 w-48 mt-2 bg-white rounded-md shadow-lg">
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
                      </Transition>
                    </>
                  ) : (
                    <Link href={link.href} className="text-gray-700 transition-colors duration-200 hover:text-blue-600">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-800">
                      Dashboard
                    </Link>
                  )}
                  <div className="relative group">
                    <button
                      onClick={() => toggleDropdown('profile')}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                    >
                      <Image src={profilePicture} alt="Profile" width={32} height={32} className="rounded-full" />
                      <span>{userName}</span>
                    </button>
                    <Transition
                      show={dropdownOpen === 'profile'}
                      enter="transition ease-out duration-100 transform"
                      enterFrom="opacity-0 scale-95"
                      enterTo="opacity-100 scale-100"
                      leave="transition ease-in duration-75 transform"
                      leaveFrom="opacity-100 scale-100"
                      leaveTo="opacity-0 scale-95"
                    >
                      <div className="absolute right-0 w-48 mt-2 bg-white rounded-md shadow-lg">
                        <label className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-blue-50">
                          Cambiar Foto
                          <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                        </label>
                        <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                          Editar Perfil
                        </Link>
                        <button onClick={handleLogout} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-blue-50">
                          Cerrar Sesión
                        </button>
                      </div>
                    </Transition>
                  </div>
                </>
              ) : (
                <Link href="/Login" className="px-4 py-2 transition-colors duration-200 bg-gray-900 rounded-md text-rose-400 hover:bg-gray-700">
                  Iniciar sesión
                </Link>
              )}
            </div>
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
          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="md:hidden mt-4">
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
                        <Transition
                          show={dropdownOpen === link.label}
                          enter="transition ease-out duration-100 transform"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="transition ease-in duration-75 transform"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
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
                        </Transition>
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
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <Link href="/dashboard" className="block px-3 py-2 text-base font-medium text-blue-600 rounded-md hover:text-blue-800 hover:bg-gray-50">
                        Dashboard
                      </Link>
                    )}
                    <div className="flex items-center px-3 py-2">
                      <div className="flex-shrink-0">
                        <Image src={profilePicture} alt="Profile" width={32} height={32} className="rounded-full" />
                      </div>
                      <div className="ml-3">
                        <div className="text-base font-medium text-gray-800">{userName}</div>
                      </div>
                    </div>
                    <div className="mt-3 space-y-1">
                      <label className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50 cursor-pointer">
                        Cambiar Foto
                        <input type="file" accept="image/*" className="hidden" onChange={handleProfilePictureChange} />
                      </label>
                      <Link href="/profile" className="block px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50">
                        Editar Perfil
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-3 py-2 text-base font-medium text-left text-gray-700 rounded-md hover:text-blue-600 hover:bg-gray-50"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                ) : (
                  <Link href="/Login" className="block px-3 py-2 text-base font-medium rounded-md text-rose-400 hover:text-blue-600 hover:bg-gray-50">
                    Iniciar sesión
                  </Link>
                )}
              </div>
            </div>
          </Transition>
        </nav>
      </header>
    </>
  );
};

export default Navbar;