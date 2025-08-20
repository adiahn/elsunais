import React from 'react';
import { BarChart3, Users, Calendar, TrendingUp } from 'lucide-react';

const DashboardView: React.FC = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to your project management portal</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white/50 backdrop-blur-sm rounded-md p-6 border border-white/20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-md flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-semibold text-gray-800">1,248</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-md p-6 border border-white/20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Workplans</p>
              <p className="text-2xl font-semibold text-gray-800">23</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-md p-6 border border-white/20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-md flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed Projects</p>
              <p className="text-2xl font-semibold text-gray-800">156</p>
            </div>
          </div>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-md p-6 border border-white/20 shadow-md">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-md flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-semibold text-gray-800">+12%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      <div className="bg-white/50 backdrop-blur-sm rounded-md p-12 border border-white/20 shadow-md text-center">
        <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Dashboard Analytics Coming Soon</h3>
        <p className="text-gray-500">
          This section will display comprehensive analytics and insights about your project operations.
        </p>
      </div>
    </div>
  );
};

export default DashboardView;