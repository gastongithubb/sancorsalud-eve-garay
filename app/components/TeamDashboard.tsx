// components/TeamDashboard.tsx
'use client'
import React, { useState } from 'react';
import AdminDashboard from './Admin-Dashboard/mensual';
import MetricasTrimestralDashboard from './Admin-Dashboard/trimestral-admin';
import NPSDiarioDashboard from './Admin-Dashboard/nps-diario';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

const DashboardOption = {
  MENSUAL: 'balance-mensual',
  METRICAS_TRIMESTRALES: 'metricas-trimestrales',
  NPS_DIARIO: 'nps-diario'
};

export default function TeamDashboard() {
  const [selectedDashboard, setSelectedDashboard] = useState(DashboardOption.MENSUAL);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>
      
      <Tabs defaultValue={DashboardOption.MENSUAL} onValueChange={(value) => setSelectedDashboard(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={DashboardOption.MENSUAL}>Balance Mensual</TabsTrigger>
          <TabsTrigger value={DashboardOption.METRICAS_TRIMESTRALES}>Métricas Trimestrales</TabsTrigger>
          <TabsTrigger value={DashboardOption.NPS_DIARIO}>NPS Diario</TabsTrigger>
        </TabsList>
        <TabsContent value={DashboardOption.MENSUAL}>
          <AdminDashboard />
        </TabsContent>
        <TabsContent value={DashboardOption.METRICAS_TRIMESTRALES}>
          <MetricasTrimestralDashboard />
        </TabsContent>
        <TabsContent value={DashboardOption.NPS_DIARIO}>
          <NPSDiarioDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}