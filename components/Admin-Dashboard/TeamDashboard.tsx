// components/AdminDashboard.tsx
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NpsIndividual from "@/components/nps-individual/Nps-individual"
import BalanceMensual from '@/components/balanceMensual/Balance-Mensual';
import NpsTrimestral from '@/components/nps-trimestral/Nps-trimestral';

const DashboardOption = {
  MENSUAL: 'balance-mensual',
  METRICAS_TRIMESTRALES: 'metricas-trimestrales',
  NPS_DIARIO: 'nps-diario'
} as const;

export const AdminDashboard: React.FC = () => {
  const [selectedDashboard, setSelectedDashboard] = useState<typeof DashboardOption[keyof typeof DashboardOption]>(DashboardOption.MENSUAL);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Visualizar Métricas</h2>
      <Tabs defaultValue={DashboardOption.MENSUAL} onValueChange={(value) => setSelectedDashboard(value as typeof DashboardOption[keyof typeof DashboardOption])}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={DashboardOption.MENSUAL}>Balance Mensual</TabsTrigger>
          <TabsTrigger value={DashboardOption.METRICAS_TRIMESTRALES}>Métricas Trimestrales</TabsTrigger>
          <TabsTrigger value={DashboardOption.NPS_DIARIO}>NPS Diario</TabsTrigger>
        </TabsList>
        <TabsContent value={DashboardOption.MENSUAL}>
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Balance Mensual</h3>
            <BalanceMensual />
          </div>
        </TabsContent>
        <TabsContent value={DashboardOption.METRICAS_TRIMESTRALES}>
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Métricas Trimestrales</h3>
            
            <NpsTrimestral />
          </div>
        </TabsContent>
        <TabsContent value={DashboardOption.NPS_DIARIO}>
          <div className="p-4 bg-gray-100 rounded-md">
            <h3 className="text-lg font-semibold mb-2">NPS Diario</h3>
            
            <NpsIndividual />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};