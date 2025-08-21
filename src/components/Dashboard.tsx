import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardView from './views/DashboardView';
import WorkplanView from './views/WorkplanView';
import SettingsView from './views/SettingsView';
import UserManagementView from './views/UserManagementView';

interface UserData {
  message: string;
  token: string;
  role: string;
  organizationName: string;
  email: string;
  rcNumber: string;
  status: string;
}

interface DashboardProps {
  onLogout: () => void;
  userData: UserData;
}

export type ViewType = 'dashboard' | 'workplan' | 'settings' | 'user-management';

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userData }) => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView />;
      case 'workplan':
        return <WorkplanView />;
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
        userData={userData}
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