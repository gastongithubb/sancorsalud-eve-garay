'use client'
// components/SidebarDashboard.tsx
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminDashboard } from './TeamDashboard';
import { MetricUploader } from './MetricUploader';

type DashboardView = 'upload' | 'visualize';

const SidebarDashboard: React.FC = () => {
  const [view, setView] = useState<DashboardView>('upload');

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setView={setView} />
      <main className="flex-1 p-6 overflow-y-auto">
        {view === 'upload' ? <MetricUploader /> : <AdminDashboard />}
      </main>
    </div>
  );
};

export default SidebarDashboard;