import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/app/components/ui/accordion';

interface SpeechVersion {
  formal?: string;
  directa?: string;
  amigable?: string;
}

interface SpeechCardProps extends SpeechVersion {
  title: string;
}

const SpeechCard: React.FC<SpeechCardProps> = ({ title, formal, directa, amigable }) => {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {formal && (
            <AccordionItem value="formal">
              <AccordionTrigger>Versión Formal</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm italic">{formal}</p>
              </AccordionContent>
            </AccordionItem>
          )}
          {directa && (
            <AccordionItem value="directa">
              <AccordionTrigger>Versión Directa</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm italic">{directa}</p>
              </AccordionContent>
            </AccordionItem>
          )}
          {amigable && (
            <AccordionItem value="amigable">
              <AccordionTrigger>Versión Amigable</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm italic">{amigable}</p>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </CardContent>
    </Card>
  );
};

const speeches: SpeechCardProps[] = [
  {
    title: "Asociado Agresivo",
    formal: "Entiendo que esta situación le genera malestar, pero para poder ayudarle, necesito que mantengamos un diálogo respetuoso. Si esta agresividad continúa, me veré obligado(a) a finalizar la llamada. ¿Podemos continuar de manera calmada?",
    directa: "Lamento que se sienta así, pero no puedo continuar la conversación si persiste el tono agresivo. Voy a colgar la llamada ahora. Le sugiero que nos contacte más tarde cuando esté en condiciones de dialogar calmadamente."
  },
  {
    title: "No Hay Más Información Disponible",
    formal: "Lamento no poder brindarle más información en este momento. Toda la información disponible ya ha sido proporcionada. Si necesita asistencia adicional en el futuro, no dude en contactarnos. Gracias por su comprensión y que tenga un buen día.",
    amigable: "Entiendo su necesidad de más detalles, pero en este momento no tengo más información para ofrecer. Si en el futuro hay algo más que podamos hacer, estamos a su disposición. Gracias por su llamada y que tenga un excelente día."
  },
  {
    title: "Cuando el Tema No Puede Ser Resuelto por Teléfono",
    formal: "Este tema requiere una revisión por parte de un área interna especializada. Ellos ya están trabajando en su caso y se pondrán en contacto con usted a la brevedad, ya sea por correo electrónico o por teléfono. Agradezco su paciencia y comprensión.",
    amigable: "Entiendo la importancia de este asunto, pero necesita ser revisado por un equipo interno. Ellos están revisando su caso y se comunicarán con usted pronto, ya sea por correo electrónico o por teléfono. Gracias por su paciencia."
  }
];

const SpeechCards: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow px-4 sm:px-6 md:px-8 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6 mt-8">Speechs de Cortes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {speeches.map((speech, index) => (
            <SpeechCard key={index} {...speech} />
          ))}
        </div>
      </div>
      
    </div>
  );
};

export default SpeechCards;