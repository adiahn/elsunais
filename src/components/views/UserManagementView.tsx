import React from 'react';
import { Users, UserPlus, Shield, Mail, Phone, MapPin } from 'lucide-react';

const UserManagementView: React.FC = () => {
  const userStats = [
    {
      title: 'Total Users',
      count: '1,248',
      icon: Users,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Active Staff',
      count: '156',
      icon: UserPlus,
      color: 'bg-green-100 text-green-600'
    },
    {
      title: 'Administrators',
      count: '12',
      icon: Shield,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const recentUsers = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@ngo.org',
      role: 'Project Manager',
      location: 'Kampala, Uganda',
      status: 'Active',
      joinDate: '2025-01-15'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael.chen@ngo.org',
      role: 'Field Coordinator',
      location: 'Mbale, Uganda',
      status: 'Active',
      joinDate: '2025-01-12'
    },
    {
      id: '3',
      name: 'Amina Hassan',
      email: 'amina.hassan@ngo.org',
      role: 'Community Liaison',
      location: 'Gulu, Uganda',
      status: 'Inactive',
      joinDate: '2025-01-10'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">User Management</h1>
        <p className="text-gray-600">Manage staff, volunteers, and system access</p>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {userStats.map((stat, index) => (
          <div key={index} className="bg-white/50 backdrop-blur-sm rounded-md p-6 border border-white/20 shadow-md">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-md flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-800">{stat.count}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-white/50 backdrop-blur-sm rounded-md border border-white/20 shadow-md mb-8">
        <div className="px-6 py-4 border-b border-gray-200/50">
          <h3 className="text-lg font-medium text-gray-800">Recent Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-600 flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {user.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{user.role}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-md ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.joinDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Coming Soon Message */}
      <div className="bg-white/50 backdrop-blur-sm rounded-md p-12 border border-white/20 shadow-md text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-700 mb-2">Advanced User Management Coming Soon</h3>
        <p className="text-gray-500">
          Advanced user management features including role assignment, permissions, and user profiles will be available soon.
        </p>
      </div>
    </div>
  );
};

export default UserManagementView;