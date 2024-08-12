import React, { useState } from 'react';
import AdminDashboard from '../components/Admin-Dashboard/admin';
import MetricasTrimestralDashboard from '../components/Admin-Dashboard/trimestral-admin';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"

const DashboardOption = {
  ADMIN: 'admin',
  METRICAS_TRIMESTRALES: 'metricas-trimestrales',
};

export default function TeamPage() {
  const [selectedDashboard, setSelectedDashboard] = useState(DashboardOption.ADMIN);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>
      
      <Tabs defaultValue={DashboardOption.ADMIN} onValueChange={(value) => setSelectedDashboard(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={DashboardOption.ADMIN}>Admin Dashboard</TabsTrigger>
          <TabsTrigger value={DashboardOption.METRICAS_TRIMESTRALES}>Métricas Trimestrales</TabsTrigger>
        </TabsList>
        <TabsContent value={DashboardOption.ADMIN}>
          <AdminDashboard />
        </TabsContent>
        <TabsContent value={DashboardOption.METRICAS_TRIMESTRALES}>
          <MetricasTrimestralDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}