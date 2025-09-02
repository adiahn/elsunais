import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './views/DashboardView';
import WorkplanView from './views/WorkplanView';
import DriversView from './views/DriversView';
import AccountantView from './views/AccountantView';
import SettingsView from './views/SettingsView';
import UserManagementView from './views/UserManagementView';

interface DashboardProps {
  onLogout: () => void;
}

export type ViewType = 'dashboard' | 'workplan' | 'drivers' | 'accountant' | 'settings' | 'user-management';

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'workplan':
        return <WorkplanView />;
      case 'drivers':
        return <DriversView />;
      case 'accountant':
        return <AccountantView />;
      case 'settings':
        return <SettingsView />;
      case 'user-management':
        return <UserManagementView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Sidebar 
        currentView={currentView}
        onViewChange={setCurrentView}
        onLogout={onLogout}
      />
      <div className="flex-1 ml-80 p-6">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/30 shadow-2xl min-h-full">
          {renderView()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;