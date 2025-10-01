import React from 'react';
import { LayoutDashboard, Calendar, Settings, Users, LogOut, Users as UsersIcon, Car, Calculator, Wrench, Package, Shield } from 'lucide-react';
import { ViewType } from './Dashboard';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard', badge: null },
    { id: 'workplan' as ViewType, icon: Calendar, label: 'Workplan', badge: '3' },
    { id: 'drivers' as ViewType, icon: Car, label: 'Drivers', badge: '5' },
    { id: 'accountant' as ViewType, icon: Calculator, label: 'Accountant', badge: '2' },
    { id: 'maintenance' as ViewType, icon: Wrench, label: 'Maintenance', badge: '4' },
    { id: 'store-manager' as ViewType, icon: Package, label: 'Store Manager', badge: '1' },
    { id: 'admin' as ViewType, icon: Shield, label: 'Admin', badge: '8' },
    { id: 'settings' as ViewType, icon: Settings, label: 'Settings', badge: null },
    { id: 'user-management' as ViewType, icon: Users, label: 'User Management', badge: '12' },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-green-800 to-green-900 text-white flex flex-col shadow-xl z-50">
      {/* Logo/Header */}
      <div className="p-6 border-b border-green-700/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <UsersIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">ACReSAL</h2>
            <p className="text-green-200 text-xs">Project Management System</p>
          </div>
        </div>
      </div>



      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <div className="px-3 mb-4">
          <h3 className="text-xs font-semibold text-green-300 uppercase tracking-wider">Main Menu</h3>
        </div>
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-left transition-all duration-200 group ${
                  currentView === item.id
                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                    : 'text-green-200 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-all duration-200 ${
                    currentView === item.id 
                      ? 'bg-white/20' 
                      : 'bg-transparent group-hover:bg-white/10'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentView === item.id
                      ? 'bg-white text-green-800'
                      : 'bg-green-600 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-green-700/50">
        <div className="bg-white/10 rounded-lg p-3 backdrop-blur-sm mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-green-200">Administrator</p>
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-green-200 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200 group"
        >
          <div className="p-1.5 rounded-lg bg-transparent group-hover:bg-red-500/20 transition-all duration-200">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;