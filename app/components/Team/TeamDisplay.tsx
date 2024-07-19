import React from 'react';
import Image from 'next/image';

// Definición del tipo para un miembro del equipo
type TeamMember = {
  title: string;
  name: string;
  description: string;
  contrato: string;
  email: string;
  profile: string;
  link: string;
  cumpleaños: string;
};

// Datos completos del equipo
const teamData: TeamMember[] = [
    {
        "title": "Supervisora",
        "name": "Evelin Garay",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 8 hs",
        "email": "mail: eve-garay@sancor.konecta.ar",
        "profile": "/team/eve.jpg",
        "link": "/",
        "cumpleaños": "1980-05-15"
    },
    {
        "title": "CX Agent",
        "name": "Abigail Veyga",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: maria.veyga@sancor.konecta.ar",
        "profile": "/team/abi.jpg",
        "link": "/",
        "cumpleaños": "31 de Agosto"
    },
    {
        "title": "CX Agent",
        "name": "Agustin Suarez",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: agustin.suarez@sancor.konecta.ar",
        "profile": "/team/agustin.jpg",
        "link": "/",
        "cumpleaños": "08 de Marzo"
    },
    {
        "title": "CX Agent",
        "name": "Antonella Casas",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: antonella.casas@sancor.konecta.ar",
        "profile": "/team/none.webp",
        "link": "/",
        "cumpleaños": "15 de Julio"
    },
    {
        "title": "CX Agent",
        "name": "Auca Heil",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: auca.heil@sancor.konecta.ar",
        "profile": "/team/auca.jpg",
        "link": "/",
        "cumpleaños": "27 de Febrero"
    },
    {
        "title": "CX Agent",
        "name": "Maria Laura Carrizo Tula",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: maria.carrizo@sancor.konecta.ar",
        "profile": "/team/tula.jpg",
        "link": "/",
        "cumpleaños": "26 de Enero"
    },
    {
        "title": "CX Agent",
        "name": "Danna Cruz",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: danna.cruz@sancor.konecta.ar",
        "profile": "/team/none.webp",
        "link": "/",
        "cumpleaños": "02 de Junio"
    },
    {
        "title": "CX Agent",
        "name": "Franco Alvarez",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 5 hs",
        "email": "mail: franco.alvarez@sancor.konecta.ar",
        "profile": "/team/franco.jpg",
        "link": "/",
        "cumpleaños": "05 de Julio"
    },
    {
        "title": "CX Agent",
        "name": "Gaston Alvarez",
        "description": "Sancor Salud -  mail: gaston.alvarez@sancor.konecta.ar",
        "contrato": "Contrato: 5 hs",
        "email": "mail: eve-garay@sancor.konecta.ar",
        "profile": "/team/gaston.jpeg",
        "link": "/",
        "cumpleaños": "29 de Diciembre"
    },
    {
        "title": "CX Agent",
        "name": "Javier Rodriguez",
        "description": "Sancor Salud - Konecta ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: angel.rodriguez@sancor.konecta.ar",
        "profile": "/team/none.webp",
        "link": "/",
        "cumpleaños": "18 de Noviembre"
    },
    {
        "title": "CX Agent",
        "name": "Jeremías Flores",
        "description": "Sancor Salud - Konecta ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: jeremias.britos@sancor.konecta.ar",
        "profile": "/team/jeremias.jpg",
        "link": "/",
        "cumpleaños": "10 de Abril"
    },
    {
        "title": "CX Agent",
        "name": "Karen Aranda",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: karen.aranda@sancor.konecta.ar",
        "profile": "/team/none.webp",
        "link": "/",
        "cumpleaños": "07 de Julio"
    },
    {
        "title": "CX Agent",
        "name": "Karen Chavez",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 5 hs",
        "email": "mail: karen.chavez@sancor.konecta.ar",
        "profile": "/team/karenj.jpg",
        "link": "/",
        "cumpleaños": "25 de Octubre"
    },
    {
        "title": "CX Agent",
        "name": "Lautaro Brocal",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: lautaro.brocal@sancor.konecta.arr",
        "profile": "/team/lauta.jpg",
        "link": "/",
        "cumpleaños": "03 de Septiembre"
    },
    {
        "title": "CX Agent",
        "name": "Macarena Gomez",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: macarena.gomez@sancor.konecta.ar",
        "profile": "/team/maca.jpg",
        "link": "/",
        "cumpleaños": "15 de Enero"
    },
    {
        "title": "CX Agent",
        "name": "Marcos Montenegro",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: marcos.montenegro@sancor.konecta.ar",
        "profile": "/team/marcos.jpg",
        "link": "/",
        "cumpleaños": "31 de Diciembre"
    },
    {
        "title": "CX Agent",
        "name": "Milagros Juncos",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: milagros.juncos@sancor.konecta.ar",
        "profile": "/team/mili.jpg",
        "link": "/",
        "cumpleaños": "23 de Enero"
    },
    {
        "title": "CX Agent",
        "name": "Nicolas Macagno",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 6 hs",
        "email": "mail: leonardo.macagno@sancor.konecta.ar",
        "profile": "/team/lean.jpg",
        "link": "/",
        "cumpleaños": "05 de Marzo"
    },
    {
        "title": "CX Agent",
        "name": "Victoria Martinez",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: victoria.martinez@sancor.konecta.ar",
        "profile": "/team/vicky.jpg",
        "link": "/",
        "cumpleaños": "14 de Mayo"
    },
    {
        "title": "CX Agent",
        "name": "Ismael Irirarte",
        "description": "Sancor Salud - Konecta ",
        "contrato": "Contrato: 5 hs",
        "email": " mail: ismael.iriarte@sancor.konecta.ar",
        "profile": "/team/ismael.jpg",
        "link": "/",
        "cumpleaños": "15 de Septiembre"
    },
    {
        "title": "CX Agent",
        "name": "Zaida Abregu",
        "description": "Sancor Salud - Konecta  ",
        "contrato": "Contrato: 7 hs",
        "email": "mail: zaida.abregu@sancor.konecta.ar",
        "profile": "/team/zaida.jpeg",
        "link": "/",
        "cumpleaños": "26 de Abril"
    }
];

const TeamDisplay: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Nuestro Equipo</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {teamData.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-32 h-32 relative mb-4">
              <Image
                src={member.profile}
                alt={member.name}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div className="bg-white rounded-lg shadow-md p-4 w-full text-center hover:shadow-lg transition-shadow duration-300">
              <h2 className="text-xl font-semibold">{member.name}</h2>
              <p className="text-gray-600">{member.title}</p>
              <p className="text-sm text-gray-500 mt-2">{member.description}</p>
              <p className="text-sm mt-1">{member.contrato}</p>
              <p className="text-sm mt-1">{member.email}</p>
              <p className="text-sm mt-1">Cumpleaños: {member.cumpleaños}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDisplay;