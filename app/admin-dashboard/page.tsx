'use client'
import React, { useState } from 'react';
import AdminDashboard from '../components/Admin-Dashboard/mensual';
import MetricasTrimestralDashboard from '../components/Admin-Dashboard/trimestral-admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

const DashboardOption = {
  MENSUAL: 'balance-mensual',
  METRICAS_TRIMESTRALES: 'metricas-trimestrales',
};

export default function TeamPage() {
  const [selectedDashboard, setSelectedDashboard] = useState(DashboardOption.MENSUAL);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>
      
      <Tabs defaultValue={DashboardOption.MENSUAL} onValueChange={(value) => setSelectedDashboard(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={DashboardOption.MENSUAL}>Balance Mensual</TabsTrigger>
          <TabsTrigger value={DashboardOption.METRICAS_TRIMESTRALES}>Métricas Trimestrales</TabsTrigger>
        </TabsList>
        <TabsContent value={DashboardOption.MENSUAL}>
          <AdminDashboard />
        </TabsContent>
        <TabsContent value={DashboardOption.METRICAS_TRIMESTRALES}>
          <MetricasTrimestralDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}