import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';

const Error404: React.FC = () => {
  return (
    <>
      <Head>
        <title>404 - Página no encontrada</title>
      </Head>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
              ¡Oops! Página no encontrada
            </h2>
            <p className="text-center text-gray-600 mb-4">
              Parece que nuestro sistema está un poco... acalorado.
            </p>
            <div className="relative w-full h-64 mb-4">
              <Image
                src="/this-is-fine.webp"
                alt="Dog in burning room saying 'This is fine'"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <p className="text-center text-gray-700 mb-6">
              No te preocupes, nuestra lider está en camino para apagar este error 404.
            </p>
            <div className="flex flex-col space-y-4">
              <Link href="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-center transition duration-300">
                Volver a la página de inicio
              </Link>
              
            </div>
          </div>
          <div className="bg-gray-100 px-4 py-3 sm:px-6">
            <p className="text-sm text-gray-600 text-center">
              Recuerda: mantén la calma y toma un sorbo de tu bebida favorita. ¡Estaremos contigo en un momento!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error404;