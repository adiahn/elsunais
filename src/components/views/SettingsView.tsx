import React from 'react';
import { Settings, User, Bell, Shield, Database, Globe } from 'lucide-react';

const SettingsView: React.FC = () => {
  const settingsSections = [
    {
      title: 'Profile Settings',
      description: 'Manage your account information and preferences',
      icon: User,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Notifications',
      description: 'Configure notification preferences and alerts',
      icon: Bell,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Security',
      description: 'Password, authentication, and security settings',
      icon: Shield,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Data Management',
      description: 'Backup, export, and data retention settings',
      icon: Database,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Organization',
      description: 'NGO details, locations, and global settings',
      icon: Globe,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your system preferences and configurations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {settingsSections.map((section, index) => (
          <div key={index} className="bg-white/50 backdrop-blur-sm rounded-md p-6 border border-white/20 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className={`w-12 h-12 ${section.color} rounded-md flex items-center justify-center mb-4`}>
              <section.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">{section.title}</h3>
            <p className="text-gray-600 text-sm">{section.description}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white/50 backdrop-blur-sm rounded-md p-12 border border-white/20 shadow-md text-center">
        <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Settings Panel Coming Soon</h3>
        <p className="text-gray-500">
          Detailed configuration options will be available in the next update.
        </p>
      </div>
    </div>
  );
};

export default SettingsView;