import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, Search, Eye, DollarSign, Building, X } from 'lucide-react';

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
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedWorkplan, setSelectedWorkplan] = useState<Workplan | null>(null);
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
    setShowDetailsModal(true);
  };

  const filteredWorkplans = workplans.filter(workplan =>
    workplan.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workplan.leadImplementation.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      {/* Workplan Details Modal */}
      {showDetailsModal && selectedWorkplan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/90 backdrop-blur-md rounded-md border border-white/20 shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Workplan Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700 p-1"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

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

              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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