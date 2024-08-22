'use client';

import React, { useState, useEffect } from 'react';

// Frases motivacionales
const motivationalQuotes = [
    "El éxito es la suma de pequeños esfuerzos repetidos día tras día.",
    "La única forma de hacer un gran trabajo es amar lo que haces.",
    "No cuentes los días, haz que los días cuenten.",
    "El mejor momento para plantar un árbol era hace 20 años. El segundo mejor momento es ahora.",
    "Cree que puedes y ya estás a medio camino.",
    "La vida es 10% lo que te ocurre y 90% cómo reaccionas ante ello.",
    "El fracaso es la oportunidad de comenzar de nuevo, pero más inteligentemente.",
    "No te preocupes por los fracasos, preocúpate por las oportunidades que pierdes cuando ni siquiera lo intentas.",
    "La confianza en ti mismo es el primer secreto del éxito.",
    "El único modo de hacer un gran trabajo es amar lo que haces."
];

const MotivationalQuotesCarousel: React.FC = () => {
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setCurrentQuoteIndex((prevIndex) => 
                    prevIndex === motivationalQuotes.length - 1 ? 0 : prevIndex + 1
                );
                setFade(false);
            }, 500);
        }, 8000); // Cambia la frase cada 10 segundos

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className='text-center min-h-[200px] flex items-center justify-center border-t border-b '>
            <div className="max-w-2xl px-4 py-16 mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
                <div 
                    className={`text-2xl font-bold text-[#1e1e1e] transition-opacity duration-500 ease-in-out ${fade ? 'opacity-0' : 'opacity-100'}`}
                >
                    {motivationalQuotes[currentQuoteIndex]}
                </div>
            </div>
        </div>
    );
};

export default MotivationalQuotesCarousel;