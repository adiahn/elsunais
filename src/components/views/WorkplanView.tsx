import React, { useState } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, Search, Eye, DollarSign, Building, ArrowLeft, Activity, FileText, MessageSquare, Settings, Edit, Download, ChevronDown, ChevronRight } from 'lucide-react';

interface WorkplanComponent {
  id: string;
  componentId: string; // A1, A2, A3, etc.
  expectedStartDate: string;
  expectedEndDate: string;
  idaFunding: number;
  gcfFunding: number;
  leadImplementation: string;
  partners: string;
  procurementMethod: string;
}

interface Workplan {
  id: string;
  name: string;
  components: WorkplanComponent[];
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
      name: 'Water Conservation Project',
      components: [
        {
          id: '1-1',
          componentId: 'A1',
          expectedStartDate: '2025-02-01',
          expectedEndDate: '2025-08-01',
          idaFunding: 500000,
          gcfFunding: 200000,
          leadImplementation: 'Engineering Team',
          partners: 'Local Construction Co.',
          procurementMethod: 'Open Tender'
        },
        {
          id: '1-2',
          componentId: 'A2',
          expectedStartDate: '2025-03-01',
          expectedEndDate: '2025-09-01',
          idaFunding: 300000,
          gcfFunding: 0,
          leadImplementation: 'Environmental Team',
          partners: 'Green Solutions Ltd.',
          procurementMethod: 'Restricted Tender'
        },
        {
          id: '1-3',
          componentId: 'A3',
          expectedStartDate: '2025-04-01',
          expectedEndDate: '2025-10-01',
          idaFunding: 0,
          gcfFunding: 400000,
          leadImplementation: 'Community Team',
          partners: 'Local NGOs',
          procurementMethod: 'Direct Procurement'
        }
      ]
    },
    {
      id: '2',
      name: 'Capacity Building Initiative',
      components: [
        {
          id: '2-1',
          componentId: 'B1',
          expectedStartDate: '2025-01-15',
          expectedEndDate: '2026-01-15',
          idaFunding: 0,
          gcfFunding: 300000,
          leadImplementation: 'Training Department',
          partners: 'Training Institute',
          procurementMethod: 'Direct Procurement'
        },
        {
          id: '2-2',
          componentId: 'B2',
          expectedStartDate: '2025-02-15',
          expectedEndDate: '2026-02-15',
          idaFunding: 250000,
          gcfFunding: 150000,
          leadImplementation: 'HR Department',
          partners: 'HR Consultants',
          procurementMethod: 'Framework Agreement'
        }
      ]
    },
    {
      id: '3',
      name: 'Technology Infrastructure',
      components: [
        {
          id: '3-1',
          componentId: 'C1',
          expectedStartDate: '2025-03-01',
          expectedEndDate: '2025-12-01',
          idaFunding: 750000,
          gcfFunding: 0,
          leadImplementation: 'IT Department',
          partners: 'Tech Solutions Ltd.',
          procurementMethod: 'Restricted Tender'
        }
      ]
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedWorkplan, setSelectedWorkplan] = useState<Workplan | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<WorkplanComponent | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'documents' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedWorkplans, setExpandedWorkplans] = useState<Set<string>>(new Set());
  const [newWorkplan, setNewWorkplan] = useState<Omit<Workplan, 'id'>>({
    name: '',
    components: []
  });

  const componentIdOptions = [
    'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10',
    'B1', 'B2', 'B3', 'B4', 'B5',
    'C1', 'C2', 'C3', 'C4', 'C5'
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
      name: '',
      components: []
    });
    setShowCreateForm(false);
  };

  const handleViewDetails = (workplan: Workplan, component?: WorkplanComponent) => {
    setSelectedWorkplan(workplan);
    setSelectedComponent(component || null);
    setActiveTab('overview');
  };

  const handleBackToList = () => {
    setSelectedWorkplan(null);
    setSelectedComponent(null);
  };

  const toggleWorkplanExpansion = (workplanId: string) => {
    const newExpanded = new Set(expandedWorkplans);
    if (newExpanded.has(workplanId)) {
      newExpanded.delete(workplanId);
    } else {
      newExpanded.add(workplanId);
    }
    setExpandedWorkplans(newExpanded);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalFunding = (ida: number, gcf: number) => {
    return ida + gcf;
  };

  const getWorkplanTotalFunding = (workplan: Workplan) => {
    return workplan.components.reduce((total, component) => {
      return total + getTotalFunding(component.idaFunding, component.gcfFunding);
    }, 0);
  };

  const filteredWorkplans = workplans.filter(workplan =>
    workplan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    workplan.components.some(comp => 
      comp.componentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.leadImplementation.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Show workplan/component details view
  if (selectedWorkplan) {
    const displayData = selectedComponent || selectedWorkplan;
    const isComponentView = selectedComponent !== null;

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
              <h1 className="text-2xl font-semibold text-gray-800">
                {isComponentView ? `${selectedWorkplan.name} - ${selectedComponent.componentId}` : selectedWorkplan.name}
              </h1>
              <p className="text-gray-600">
                {isComponentView ? 'Component Details' : 'Workplan Overview'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center">
              <Edit className="w-4 h-4" />
              Edit
            </button>
            <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 min-w-[100px] justify-center">
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
            {/* Workplan/Component Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                  {isComponentView ? 'Component Information' : 'Workplan Information'}
                </h2>
                
                {isComponentView ? (
                  // Component Details
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Component ID</h3>
                        <p className="text-lg font-semibold text-gray-800 flex items-center">
                          <Building className="w-5 h-5 mr-2 text-blue-600" />
                          {selectedComponent.componentId}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Start Date</h3>
                        <p className="text-lg text-gray-800 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-green-600" />
                          {selectedComponent.expectedStartDate}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected End Date</h3>
                        <p className="text-lg text-gray-800 flex items-center">
                          <Calendar className="w-5 h-5 mr-2 text-green-600" />
                          {selectedComponent.expectedEndDate}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">IDA</h3>
                        <p className={`text-lg font-semibold flex items-center ${
                          selectedComponent.idaFunding > 0 ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <DollarSign className="w-5 h-5 mr-2" />
                          {formatCurrency(selectedComponent.idaFunding)}
                          {selectedComponent.idaFunding === 0 && <span className="text-sm font-normal ml-2">(No contribution)</span>}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">GCF</h3>
                        <p className={`text-lg font-semibold flex items-center ${
                          selectedComponent.gcfFunding > 0 ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          <DollarSign className="w-5 h-5 mr-2" />
                          {formatCurrency(selectedComponent.gcfFunding)}
                          {selectedComponent.gcfFunding === 0 && <span className="text-sm font-normal ml-2">(No contribution)</span>}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Funding</h3>
                        <p className="text-lg font-bold text-gray-800 flex items-center">
                          <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                          {formatCurrency(getTotalFunding(selectedComponent.idaFunding, selectedComponent.gcfFunding))}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Lead Implementation</h3>
                        <p className="text-lg text-gray-800 flex items-center">
                          <Users className="w-5 h-5 mr-2 text-purple-600" />
                          {selectedComponent.leadImplementation}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Partners</h3>
                        <p className="text-lg text-gray-800 flex items-center">
                          <Building className="w-5 h-5 mr-2 text-orange-600" />
                          {selectedComponent.partners}
                        </p>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Procurement Method</h3>
                        <p className="text-lg text-gray-800">{selectedComponent.procurementMethod}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Workplan Overview
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Project Name</h3>
                      <p className="text-lg font-semibold text-gray-800">{selectedWorkplan.name}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Components</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedWorkplan.components.map((component) => (
                          <div key={component.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold text-gray-800 flex items-center">
                                <Building className="w-4 h-4 mr-2 text-blue-600" />
                                {component.componentId}
                              </h4>
                              <button
                                onClick={() => handleViewDetails(selectedWorkplan, component)}
                                className="text-green-600 hover:text-green-700 text-sm font-medium"
                              >
                                View Details →
                              </button>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">IDA:</span>
                                <span className={`font-medium ${component.idaFunding > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                  {formatCurrency(component.idaFunding)}
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">GCF:</span>
                                <span className={`font-medium ${component.gcfFunding > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                  {formatCurrency(component.gcfFunding)}
                                </span>
                              </div>
                              <div className="flex justify-between border-t pt-2">
                                <span className="text-gray-800 font-medium">Total:</span>
                                <span className="font-bold text-gray-800">
                                  {formatCurrency(getTotalFunding(component.idaFunding, component.gcfFunding))}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h3 className="text-sm font-medium text-green-800 uppercase tracking-wider mb-2">Total Workplan Funding</h3>
                      <p className="text-xl font-bold text-green-800">
                        {formatCurrency(getWorkplanTotalFunding(selectedWorkplan))}
                      </p>
                    </div>
                  </div>
                )}
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
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center gap-2"
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
            placeholder="Search workplans by name, component ID, or lead..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
          />
        </div>
      </div>

      {/* Workplans Table */}
      <div className="bg-white/50 backdrop-blur-sm rounded-md border border-white/20 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50/80">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IDA
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GCF
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Funding
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lead Implementation
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Partners
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procurement Method
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredWorkplans.map((workplan) => (
                <React.Fragment key={workplan.id}>
                  {/* Workplan Header Row */}
                  <tr className="bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleWorkplanExpansion(workplan.id)}
                          className="mr-3 p-1 rounded hover:bg-gray-200 transition-colors"
                        >
                          {expandedWorkplans.has(workplan.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-600" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{workplan.name}</div>
                          <div className="text-xs text-gray-500">
                            {workplan.components.length} component{workplan.components.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        {workplan.components.map(comp => comp.componentId).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(workplan.components.reduce((sum, comp) => sum + comp.idaFunding, 0))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-blue-600">
                        {formatCurrency(workplan.components.reduce((sum, comp) => sum + comp.gcfFunding, 0))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-gray-800">
                        {formatCurrency(getWorkplanTotalFunding(workplan))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        Multiple teams
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        Multiple partners
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">
                        Various methods
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetails(workplan)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                  
                  {/* Component Rows (when expanded) */}
                  {expandedWorkplans.has(workplan.id) && workplan.components.map((component) => (
                    <tr key={component.id} className="bg-white/30 hover:bg-white/50 transition-colors">
                      <td className="px-6 py-3">
                        <div className="flex items-center pl-12">
                          <div className="text-sm text-gray-600">
                            Component {component.componentId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-600 bg-blue-100 text-blue-800 px-2 py-1 rounded-md font-medium">
                          {component.componentId}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className={`text-sm font-medium ${
                          component.idaFunding > 0 ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {formatCurrency(component.idaFunding)}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className={`text-sm font-medium ${
                          component.gcfFunding > 0 ? 'text-blue-600' : 'text-gray-400'
                        }`}>
                          {formatCurrency(component.gcfFunding)}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm font-bold text-gray-800">
                          {formatCurrency(getTotalFunding(component.idaFunding, component.gcfFunding))}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Users className="w-4 h-4 mr-1" />
                          {component.leadImplementation}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex items-center text-sm text-gray-600">
                          <Building className="w-4 h-4 mr-1" />
                          {component.partners}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm text-gray-600">{component.procurementMethod}</div>
                      </td>
                      <td className="px-6 py-3">
                        <button
                          onClick={() => handleViewDetails(workplan, component)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newWorkplan.name}
                    onChange={(e) => setNewWorkplan({ ...newWorkplan, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70"
                    placeholder="Enter project name"
                    required
                  />
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-500">Component management will be available after creating the workplan.</p>
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
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
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