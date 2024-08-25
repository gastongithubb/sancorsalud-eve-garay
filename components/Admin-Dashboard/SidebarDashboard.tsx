'use client'
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { AdminDashboard } from './TeamDashboard';
import { MetricUploader } from './MetricUploader';
import EmployeeTable from './personal';
import BreaksDashboard from './braksDiarios';
import CustomerExperienceTable from './promotores';

type DashboardView = 'upload' | 'visualize' | 'personal' | 'breaks' | 'customerExperience';

const SidebarDashboard: React.FC = () => {
  const [view, setView] = useState<DashboardView>('upload');

  const renderView = () => {
    switch (view) {
      case 'upload':
        return <MetricUploader />;
      case 'visualize':
        return <AdminDashboard />;
      case 'personal':
        return <EmployeeTable />;
      case 'breaks':
        return <BreaksDashboard />;
      case 'customerExperience':
        return <CustomerExperienceTable />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setView={setView} />
      <main className="flex-1 p-6 overflow-y-auto">
        {renderView()}
      </main>
    </div>
  );
};

export default SidebarDashboard;