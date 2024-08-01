"use client"

import { useState } from 'react';
import Image from "next/legacy/image";
import { motion, AnimatePresence } from 'framer-motion';

interface FaqItem {
    heading: string;
    subheading: string;
}

const faqData: FaqItem[] = [
    {
        heading: "1. ¿Cómo puedo agendar una cita médica?",
        subheading: 'Puede agendar una cita médica a través de nuestro portal en línea, llamando a nuestro centro de atención telefónica, o visitando directamente nuestras instalaciones. Asegúrese de tener a mano su información de seguro y cualquier referencia médica necesaria.'
    },
    {
        heading: "2. ¿Qué debo hacer en caso de una emergencia médica?",
        subheading: 'En caso de una emergencia médica grave, llame inmediatamente al número de emergencias local. Para situaciones menos críticas, pero que requieren atención urgente, puede acudir a nuestro servicio de urgencias 24/7 o contactar a nuestro servicio de telemedicina.'
    },
    {
        heading: "3. ¿Cómo puedo acceder a mis registros médicos?",
        subheading: 'Puede acceder a sus registros médicos a través de nuestro portal de pacientes en línea. Si necesita asistencia o prefiere obtener una copia física, puede solicitarla en nuestro departamento de registros médicos con una identificación válida.'
    },
]

const Faq = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <div className="px-6 py-20 bg-darkblue" id="faq-section">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
            >
                <h2 className="mb-4 text-3xl font-bold text-[#1e1e1e] lg:text-5xl">Preguntas Frecuentes</h2>
                <p className="max-w-3xl mx-auto text-lg font-normal text-[#262626]">Encuentre respuestas rápidas a las preguntas más comunes sobre nuestros servicios de salud y procedimientos.</p>
            </motion.div>

            <div className="mx-auto max-w-7xl">
                <div className="grid items-start gap-8 lg:grid-cols-2">
                    {/* FAQ Items */}
                    <div className="space-y-6">
                        {faqData.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="overflow-hidden shadow-lg bg-navyblue rounded-2xl"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                                >
                                    <span className="text-xl font-medium text-black">{item.heading}</span>
                                    <svg
                                        className={`w-6 h-6 text-bluish transform transition-transform duration-200 ${activeIndex === index ? 'rotate-180' : ''}`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <AnimatePresence>
                                    {activeIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="px-6 pb-4"
                                        >
                                            <p className="text-bluish">{item.subheading}</p>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>

                    {/* Health-related Image */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-12 lg:mt-0"
                    >
                        <Image
                            src="/health-professional.png"
                            alt="Profesional de la salud atendiendo a un paciente"
                            width={600}
                            height={400}
                            className="w-full h-auto rounded-lg shadow-xl"
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default Faq;