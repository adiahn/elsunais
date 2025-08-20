import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, Search, Eye, DollarSign, Building, ArrowLeft, Activity, FileText, MessageSquare, Settings, Edit, Download } from 'lucide-react';

interface Workplan {
  id: string;
  component: string;
  duration: string;
  expectedStartDate: string;
  expectedEndDate: string;
  sourceOfFunding: string;
  leadImplementation: string;
  partners: string;
  procurementMethod: string;
}

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'update' | 'comment' | 'status_change' | 'file_upload';
}

const WorkplanView: React.FC = () => {
  const [workplans, setWorkplans] = useState<Workplan[]>([
    {
      id: '1',
      component: 'Infrastructure Development',
      duration: '6 months',
      expectedStartDate: '2025-02-01',
      expectedEndDate: '2025-08-01',
      sourceOfFunding: 'Government Grant',
      leadImplementation: 'Engineering Team',
      partners: 'Local Construction Co.',
      procurementMethod: 'Open Tender'
    },
    {
      id: '2',
      component: 'Capacity Building',
      duration: '12 months',
      expectedStartDate: '2025-01-15',
      expectedEndDate: '2026-01-15',
      sourceOfFunding: 'Private Donor',
      leadImplementation: 'Training Department',
      partners: 'Training Institute',
      procurementMethod: 'Direct Procurement'
    },
    {
      id: '3',
      component: 'Technology Solutions',
      duration: '9 months',
      expectedStartDate: '2025-03-01',
      expectedEndDate: '2025-12-01',
      sourceOfFunding: 'International Fund',
      leadImplementation: 'IT Department',
      partners: 'Tech Solutions Ltd.',
      procurementMethod: 'Restricted Tender'
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkplan, setSelectedWorkplan] = useState<Workplan | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'documents' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [newWorkplan, setNewWorkplan] = useState<Omit<Workplan, 'id'>>({
    component: '',
    duration: '',
    expectedStartDate: '',
    expectedEndDate: '',
    sourceOfFunding: '',
    leadImplementation: '',
    partners: '',
    procurementMethod: ''
  });

  const componentOptions = [
    'Infrastructure Development',
    'Capacity Building',
    'Technology Solutions',
    'Research & Development',
    'Community Outreach',
    'Environmental Protection',
    'Health & Safety',
    'Education & Training'
  ];

  const procurementMethods = [
    'Open Tender',
    'Restricted Tender',
    'Direct Procurement',
    'Framework Agreement',
    'Request for Quotation',
    'Single Source'
  ];

  const mockActivities: ActivityLog[] = [
    {
      id: '1',
      action: 'Workplan Updated',
      user: 'John Doe',
      timestamp: '2025-01-20 14:30',
      details: 'Updated project timeline and budget allocation',
      type: 'update'
    },
    {
      id: '2',
      action: 'Comment Added',
      user: 'Sarah Smith',
      timestamp: '2025-01-19 16:45',
      details: 'Need to review the procurement timeline for phase 2',
      type: 'comment'
    },
    {
      id: '3',
      action: 'Status Changed',
      user: 'Mike Johnson',
      timestamp: '2025-01-18 09:15',
      details: 'Project status changed from Planning to In Progress',
      type: 'status_change'
    },
    {
      id: '4',
      action: 'Document Uploaded',
      user: 'Lisa Wang',
      timestamp: '2025-01-17 11:20',
      details: 'Uploaded technical specifications document',
      type: 'file_upload'
    }
  ];

  const handleCreateWorkplan = (e: React.FormEvent) => {
    e.preventDefault();
    const workplan: Workplan = {
      ...newWorkplan,
      id: Date.now().toString()
    };
    setWorkplans([...workplans, workplan]);
    setNewWorkplan({
      component: '',
      duration: '',
      expectedStartDate: '',
      expectedEndDate: '',
      sourceOfFunding: '',
      leadImplementation: '',
      partners: '',
      procurementMethod: ''
    });
    setShowCreateForm(false);
  };

  const handleViewDetails = (workplan: Workplan) => {
    setSelectedWorkplan(workplan);
    setActiveTab('overview');
  };

  const handleBackToList = () => {
    setSelectedWorkplan(null);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'update':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'status_change':
        return <Activity className="w-4 h-4 text-purple-500" />;
      case 'file_upload':
        return <FileText className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const filteredWorkplans = workplans.filter(workplan =>
    workplan.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workplan.leadImplementation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show workplan details view
  if (selectedWorkplan) {
    return (
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBackToList}
              className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">{selectedWorkplan.component}</h1>
              <p className="text-gray-600">Workplan Details</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Eye },
              { id: 'activities', label: 'Activities', icon: Activity },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Workplan Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Workplan Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Component</h3>
                      <p className="text-lg font-semibold text-gray-800">{selectedWorkplan.component}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Duration</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        {selectedWorkplan.duration}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Start Date</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        {selectedWorkplan.expectedStartDate}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected End Date</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        {selectedWorkplan.expectedEndDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Source of Funding</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        {selectedWorkplan.sourceOfFunding}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Lead Implementation</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        {selectedWorkplan.leadImplementation}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Partners</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-orange-600" />
                        {selectedWorkplan.partners}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Procurement Method</h3>
                      <p className="text-lg text-gray-800">{selectedWorkplan.procurementMethod}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activities</h2>
                <div className="space-y-4">
                  {mockActivities.slice(0, 5).map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="mt-1">
                        {getActivityIcon(activity.type)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.user} • {activity.timestamp}</p>
                        <p className="text-xs text-gray-600 mt-1">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => setActiveTab('activities')}
                  className="w-full mt-4 text-sm text-green-600 hover:text-green-700 font-medium"
                >
                  View All Activities →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">All Activities</h2>
            <div className="space-y-4">
              {mockActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{activity.user}</p>
                    <p className="text-sm text-gray-600">{activity.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Documents</h2>
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No Documents Yet</h3>
              <p className="text-gray-500">Documents related to this workplan will appear here.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Workplan Settings</h2>
            <div className="text-center py-12">
              <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Settings Coming Soon</h3>
              <p className="text-gray-500">Advanced settings and configuration options will be available here.</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show workplan list view
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">Workplan Management</h1>
          <p className="text-gray-600">Manage and track all your project workplans</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create New Workplan
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search workplans..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Workplans Table */}
      <div className="bg-white/50 backdrop-blur-sm rounded-md border border-white/20 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Source of Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Implementation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partners
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procurement Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkplans.map((workplan) => (
                <tr key={workplan.id} className="hover:bg-white/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{workplan.component}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{workplan.duration}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {workplan.sourceOfFunding}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-1" />
                      {workplan.leadImplementation}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="w-4 h-4 mr-1" />
                      {workplan.partners}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">{workplan.procurementMethod}</div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(workplan)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Workplan Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-md border border-white/20 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Create New Workplan</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateWorkplan} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Component
                    </label>
                    <select
                      value={newWorkplan.component}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, component: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    >
                      <option value="">Select Component</option>
                      {componentOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={newWorkplan.duration}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      placeholder="e.g., 6 months"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected Start Date
                    </label>
                    <input
                      type="date"
                      value={newWorkplan.expectedStartDate}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, expectedStartDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Expected End Date
                    </label>
                    <input
                      type="date"
                      value={newWorkplan.expectedEndDate}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, expectedEndDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Source of Funding
                    </label>
                    <input
                      type="text"
                      value={newWorkplan.sourceOfFunding}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, sourceOfFunding: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lead Implementation
                    </label>
                    <input
                      type="text"
                      value={newWorkplan.leadImplementation}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, leadImplementation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Partners
                    </label>
                    <input
                      type="text"
                      value={newWorkplan.partners}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, partners: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Procurement Method
                    </label>
                    <select
                      value={newWorkplan.procurementMethod}
                      onChange={(e) => setNewWorkplan({ ...newWorkplan, procurementMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                      required
                    >
                      <option value="">Select Procurement Method</option>
                      {procurementMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded-md font-medium transition-colors"
                  >
                    Create Workplan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkplanView;