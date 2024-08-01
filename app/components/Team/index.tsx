'use client';

import React, { useState } from 'react';
import Image from "next/legacy/image";
import Link from 'next/link';
import teamData from '../../Data/team.json';
import { motion } from 'framer-motion';

const Topic: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <motion.div 
        className="mb-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <h2 className="mb-3 text-4xl font-bold text-[#1e1e1e]">{title}</h2>
        <p className="text-xl text-[#626262]">{description}</p>
    </motion.div>
);

const Collapse: React.FC<{ label: string; index: number; children: React.ReactNode }> = ({ label, index, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div 
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <button 
                className={`w-full p-5 text-left font-bold cursor-pointer rounded-lg transition-all duration-300 ${
                    isOpen ? 'bg-blue-600 text-white' : 'bg-blue-900 text-offwhite hover:bg-blue-500'
                }`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="mr-2">{index}.</span>
                {label}
                <svg 
                    className={`float-right w-6 h-6 transition-transform duration-300 ${isOpen ? 'transform rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {isOpen && (
                <motion.div 
                    className="p-5 mt-2 rounded-lg bg-blue-950 text-neutral-300"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                >
                    {children}
                </motion.div>
            )}
        </motion.div>
    );
};

const TeamMember: React.FC<{ member: any; index: number }> = ({ member, index }) => (
    <motion.div 
        className="flex flex-col p-6 transition-all duration-300 border border-blue-200 shadow-lg bg-slate-600 rounded-2xl hover:border-blue-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
    >
        <div className="flex items-center mb-4">
            <div className="relative w-20 h-20 mr-4 overflow-hidden rounded-full">
                <Image className="object-cover" src={member.profile} alt={member.name} layout="fill" />
            </div>
            <div>
                <h3 className="text-xl font-semibold text-white">{member.name}</h3>
                <p className="text-bluish">{member.title}</p>
            </div>
        </div>
        <p className="mb-4 text-sm text-slate-100">{member.description}</p>
    </motion.div>
);

const ProcessAndTeam: React.FC = () => {
    const firstThreeMembers = teamData.team.slice(0, 3);

    return (
        <div className="container px-4 py-16 mx-auto text-stone-200">
            <Topic title="Nuestro Proceso" description="Guía paso a paso para alcanzar tus objetivos" />

            <div className="mb-16 space-y-6">
                {teamData.process.map((process, key) => (
                    <Collapse key={key} label={process.label} index={key + 1}>
                        {process.content}
                    </Collapse>
                ))}
            </div>

            <Topic title="Nuestro Equipo" description="Conoce nuestro equipo" />

            <div className="grid grid-cols-1 gap-8 mb-16 sm:grid-cols-2 lg:grid-cols-3" id="team">
                {firstThreeMembers.map((member, index) => (
                    <TeamMember key={index} member={member} index={index} />
                ))}
            </div>

            <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <Link href="/team" className="inline-block px-8 py-4 text-lg font-semibold text-white transition-colors duration-300 bg-blue-600 rounded-full hover:bg-blue-700">
                    Ver todo el equipo
                </Link>
            </motion.div>
        </div>
    );
};

export default ProcessAndTeam;