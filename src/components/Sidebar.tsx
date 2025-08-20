import React from 'react';
import { LayoutDashboard, Calendar, Settings, Users, LogOut, Heart } from 'lucide-react';
import { ViewType } from './Dashboard';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, onLogout }) => {
  const menuItems = [
    { id: 'dashboard' as ViewType, icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'workplan' as ViewType, icon: Calendar, label: 'Workplan' },
    { id: 'settings' as ViewType, icon: Settings, label: 'Settings' },
    { id: 'user-management' as ViewType, icon: Users, label: 'User Management' },
  ];

  return (
    <div className="w-64 bg-green-800 text-white flex flex-col">
      {/* Logo/Header */}
      <div className="p-6 border-b border-green-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-sm flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Admin Portal</h2>
            <p className="text-green-300 text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-left transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-green-700 text-white shadow-md'
                    : 'text-green-200 hover:bg-green-700 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t border-green-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-green-200 hover:bg-green-700 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;