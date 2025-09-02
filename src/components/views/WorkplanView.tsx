import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Search, Eye, DollarSign, Building, ArrowLeft, Activity, FileText, MessageSquare, Settings, Edit, Download, ChevronDown, ChevronRight } from 'lucide-react';

interface Activity {
  id: string;
  name: string;
  date: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface Project {
  id: string;
  name: string;
  projectId: string; // A1, A2, A3, etc.
  fileNo: string;
  expectedStartDate: string;
  expectedEndDate: string;
  idaFunding: number;
  gcfFunding: number;
  leadImplementation: string;
  partners: string;
  procurementMethod: string;
  status: 'completed' | 'in_progress' | 'approved';
  activities: Activity[];
}

interface Component {
  id: string;
  name: string;
  componentId: string; // A, B, C, etc.
  projects: Project[];
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
  const [components, setComponents] = useState<Component[]>([
    {
      id: '1',
      name: 'Dryland Management',
      componentId: 'A',
      projects: [
        {
          id: '1-1',
          name: 'Area Supervision',
          projectId: 'A1',
          fileNo: 'ACRESAL-001',
          expectedStartDate: '2025-02-01',
          expectedEndDate: '2025-08-01',
          idaFunding: 500000,
          gcfFunding: 200000,
          leadImplementation: 'Engineering Team',
          partners: 'Local Construction Co.',
          procurementMethod: 'Open Tender',
          status: 'in_progress',
          activities: [
            {
              id: '1-1-1',
              name: 'Mobilization of funds',
              date: '2025-02-01',
              description: 'Initial fund mobilization for project startup',
              status: 'completed'
            },
            {
              id: '1-1-2',
              name: 'Site preparation',
              date: '2025-02-15',
              description: 'Preparing construction sites for drainage work',
              status: 'in_progress'
            }
          ]
        },
        {
          id: '1-2',
          name: 'Drainage Construction',
          projectId: 'A2',
          fileNo: 'ACRESAL-002',
          expectedStartDate: '2025-03-01',
          expectedEndDate: '2025-09-01',
          idaFunding: 300000,
          gcfFunding: 0,
          leadImplementation: 'Environmental Team',
          partners: 'Green Solutions Ltd.',
          procurementMethod: 'Restricted Tender',
          status: 'approved',
          activities: [
            {
              id: '1-2-1',
              name: 'Equipment procurement',
              date: '2025-03-01',
              description: 'Procuring construction equipment for drainage work',
              status: 'pending'
            }
          ]
        },
        {
          id: '1-3',
          name: 'Community Engagement',
          projectId: 'A3',
          expectedStartDate: '2025-04-01',
          expectedEndDate: '2025-10-01',
          idaFunding: 0,
          gcfFunding: 400000,
          leadImplementation: 'Community Team',
          partners: 'Local NGOs',
          procurementMethod: 'Direct Procurement',
          status: 'completed',
          fileNo: 'ACRESAL-003',
          activities: [
            {
              id: '1-3-1',
              name: 'Stakeholder meetings',
              date: '2025-04-01',
              description: 'Meeting with community stakeholders',
              status: 'completed'
            }
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Community Climate Resillience',
      componentId: 'B',
      projects: [
        {
          id: '2-1',
          name: 'Training Program',
          projectId: 'B1',
          expectedStartDate: '2025-01-15',
          expectedEndDate: '2026-01-15',
          idaFunding: 0,
          gcfFunding: 300000,
          leadImplementation: 'Training Department',
          partners: 'Training Institute',
          procurementMethod: 'Direct Procurement',
          status: 'in_progress',
          fileNo: 'ACRESAL-004',
          activities: []
        },
        {
          id: '2-2',
          name: 'HR Development',
          projectId: 'B2',
          expectedStartDate: '2025-02-15',
          expectedEndDate: '2026-02-15',
          idaFunding: 250000,
          gcfFunding: 150000,
          leadImplementation: 'HR Department',
          partners: 'HR Consultants',
          procurementMethod: 'Framework Agreement',
          status: 'completed',
          fileNo: 'ACRESAL-005',
          activities: []
        }
      ]
    },
    {
      id: '3',
      name: 'Institutional Strengthening and Project Management',
      componentId: 'C',
      projects: [
        {
          id: '3-1',
          name: 'IT System Implementation',
          projectId: 'C1',
          expectedStartDate: '2025-03-01',
          expectedEndDate: '2025-12-01',
          idaFunding: 750000,
          gcfFunding: 0,
          leadImplementation: 'IT Department',
          partners: 'Tech Solutions Ltd.',
          procurementMethod: 'Restricted Tender',
          status: 'in_progress',
          fileNo: 'ACRESAL-006',
          activities: []
        }
      ]
    },
    {
      id: '4',
      name: 'Contingency Emergency Response',
      componentId: 'D',
      projects: [
        {
          id: '3-1',
          name: 'IT System Implementation',
          projectId: 'D1',
          expectedStartDate: '2025-03-01',
          expectedEndDate: '2025-12-01',
          idaFunding: 750000,
          gcfFunding: 0,
          leadImplementation: 'IT Department',
          partners: 'Tech Solutions Ltd.',
          procurementMethod: 'Restricted Tender',
          status: 'in_progress',
          fileNo: 'ACRESAL-007',
          activities: []
        }
      ]
    }
  ]);
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [showCreateActivityForm, setShowCreateActivityForm] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'documents' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [newComponent, setNewComponent] = useState<Omit<Component, 'id'>>({
    name: '',
    componentId: '',
    projects: []
  });
  const [newProject, setNewProject] = useState<Omit<Project, 'id'>>({
    name: '',
    projectId: '',
    fileNo: '',
    expectedStartDate: '',
    expectedEndDate: '',
    idaFunding: 0,
    gcfFunding: 0,
    leadImplementation: '',
    partners: '',
    procurementMethod: '',
    status: 'in_progress',
    activities: []
  });
  const [newActivity, setNewActivity] = useState<Omit<Activity, 'id'>>({
    name: '',
    date: '',
    description: '',
    status: 'pending'
  });



  // Debug modal states
  useEffect(() => {
    console.log('Modal states:', {
      showCreateForm,
      showCreateProjectForm,
      showCreateActivityForm
    });
  }, [showCreateForm, showCreateProjectForm, showCreateActivityForm]);

  // Mock settings data - in real app this would come from settings/API
  const availableComponents = [
    { id: 'A', name: 'Dryland Management' },
    { id: 'B', name: 'Community Climate Resillience' },
    { id: 'C', name: 'Institutional Strengthening and Project Management' },
    { id: 'D', name: 'Contingency Emergency Response' }
  ];
  const subComponentOptions = {
    'A': ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10'],
    'B': ['B1', 'B2', 'B3', 'B4', 'B5'],
    'C': ['C1', 'C2', 'C3', 'C4', 'C5'],
    'D': ['D1', 'D2', 'D3', 'D4', 'D5']
  };

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
      action: 'Component Updated',
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

  const handleCreateComponent = (e: React.FormEvent) => {
    e.preventDefault();
    const component: Component = {
      ...newComponent,
      id: Date.now().toString()
    };
    setComponents([...components, component]);
    setNewComponent({
      name: '',
      componentId: '',
      projects: []
    });
    setShowCreateForm(false);
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComponent) return;
    
    const project: Project = {
      ...newProject,
      id: Date.now().toString(),
      fileNo: newProject.fileNo || ''
    };
    
    const updatedComponent = {
      ...selectedComponent,
      projects: [...selectedComponent.projects, project]
    };
    
    setComponents(components.map(comp => 
      comp.id === selectedComponent.id ? updatedComponent : comp
    ));
    setSelectedComponent(updatedComponent);
    
    setNewProject({
      name: '',
      projectId: '',
      expectedStartDate: '',
      expectedEndDate: '',
      idaFunding: 0,
      gcfFunding: 0,
      leadImplementation: '',
      partners: '',
      procurementMethod: '',
      status: 'in_progress',
      activities: []
    });
    setShowCreateProjectForm(false);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    const activity: Activity = {
      ...newActivity,
      id: Date.now().toString()
    };
    
    const updatedProject = {
      ...selectedProject,
      activities: [...selectedProject.activities, activity]
    };
    
    // Update the project in the selected component
    if (selectedComponent) {
      const updatedComponent = {
        ...selectedComponent,
        projects: selectedComponent.projects.map(proj => 
          proj.id === selectedProject.id ? updatedProject : proj
        )
      };
      
      setComponents(components.map(comp => 
        comp.id === selectedComponent.id ? updatedComponent : comp
      ));
      setSelectedComponent(updatedComponent);
      setSelectedProject(updatedProject);
    }
    
    setNewActivity({
      name: '',
      date: '',
      description: '',
      status: 'pending'
    });
    setShowCreateActivityForm(false);
  };

  const handleViewDetails = (component: Component, project?: Project) => {
    setSelectedComponent(component);
    setSelectedProject(project || null);
    setActiveTab('overview');
  };

  const handleBackToList = () => {
    setSelectedComponent(null);
    setSelectedProject(null);
    setActiveTab('overview');
  };

  const toggleComponentExpansion = (componentId: string) => {
    const newExpanded = new Set(expandedComponents);
    if (newExpanded.has(componentId)) {
      newExpanded.delete(componentId);
    } else {
      newExpanded.add(componentId);
    }
    setExpandedComponents(newExpanded);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getTotalFunding = (ida: number, gcf: number): number => {
    return ida + gcf;
  };

  const getComponentTotalFunding = (component: Component) => {
    return component.projects.reduce((total, project) => {
      return total + getTotalFunding(project.idaFunding, project.gcfFunding);
    }, 0);
  };

  const filteredComponents = components.filter(component => {
    const matchesSearch = component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      component.projects.some(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.leadImplementation.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    if (!statusFilter) return matchesSearch;
    
    const hasMatchingStatus = component.projects.some(project => project.status === statusFilter);
    return matchesSearch && hasMatchingStatus;
  });

  const getActivityIcon = (type: ActivityLog['type']) => {
    switch (type) {
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'comment':
        return <MessageSquare className="w-4 h-4 text-green-600" />;
      case 'status_change':
        return <Activity className="w-4 h-4 text-purple-600" />;
      case 'file_upload':
        return <FileText className="w-4 h-4 text-orange-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };





  // Show component/project details view
  if (selectedComponent) {
    const isProjectView = selectedProject !== null;

    return (
      <>
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
                  {isProjectView ? `${selectedComponent.name} - ${selectedProject.name}` : selectedComponent.name}
                </h1>
                <p className="text-gray-600">
                  {isProjectView ? 'Project Details' : 'Component Overview'}
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
                ...(isProjectView ? [{ id: 'activities', label: 'Activities', icon: Activity }] : []),
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
              {/* Component/Project Details */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6">
                    {isProjectView ? 'Project Information' : 'Component Information'}
                  </h2>
                  
                  {isProjectView ? (
                    // Project Details
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Project ID</h3>
                          <p className="text-lg font-semibold text-gray-800 flex items-center">
                            <Building className="w-5 h-5 mr-2 text-blue-600" />
                            {selectedProject.projectId}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Start Date</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-green-600" />
                            {selectedProject.expectedStartDate}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected End Date</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-green-600" />
                            {selectedProject.expectedEndDate}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">IDA</h3>
                          <p className={`text-lg font-semibold flex items-center ${
                            selectedProject.idaFunding > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <DollarSign className="w-5 h-5 mr-2" />
                            {formatCurrency(selectedProject.idaFunding)}
                            {selectedProject.idaFunding === 0 && <span className="text-sm font-normal ml-2">(No contribution)</span>}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">GCF</h3>
                          <p className={`text-lg font-semibold flex items-center ${
                            selectedProject.gcfFunding > 0 ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            <DollarSign className="w-5 h-5 mr-2" />
                            {formatCurrency(selectedProject.gcfFunding)}
                            {selectedProject.gcfFunding === 0 && <span className="text-sm font-normal ml-2">(No contribution)</span>}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Funding</h3>
                          <p className="text-lg font-bold text-gray-800 flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                            {formatCurrency(getTotalFunding(selectedProject.idaFunding, selectedProject.gcfFunding))}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Lead Implementation</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-purple-600" />
                            {selectedProject.leadImplementation}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Partners</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Building className="w-5 h-5 mr-2 text-orange-600" />
                            {selectedProject.partners}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Procurement Method</h3>
                          <p className="text-lg text-gray-800">{selectedProject.procurementMethod}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedProject.status === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedProject.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedProject.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Component Overview
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Component Name</h3>
                        <p className="text-lg font-semibold text-gray-800">{selectedComponent.name}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Projects</h3>
                          <button
                            onClick={() => {
                              console.log('Opening project form');
                              setShowCreateProjectForm(true);
                            }}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            Add Project
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {selectedComponent.projects.map((project) => (
                            <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800 flex items-center">
                                  <Building className="w-4 h-4 mr-2 text-blue-600" />
                                  {project.projectId}
                                </h4>
                                <button
                                  onClick={() => handleViewDetails(selectedComponent, project)}
                                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                  View Details →
                                </button>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Name:</span>
                                  <span className="font-medium text-gray-800">{project.name}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">IDA:</span>
                                  <span className={`font-medium ${project.idaFunding > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {formatCurrency(project.idaFunding)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">GCF:</span>
                                  <span className={`font-medium ${project.gcfFunding > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {formatCurrency(project.gcfFunding)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-bold text-gray-800">
                                    {formatCurrency(getTotalFunding(project.idaFunding, project.gcfFunding))}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {project.status.replace('_', ' ')}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Projects:</span>
                      <span className="font-semibold text-gray-800">
                        {isProjectView ? selectedComponent.projects.length : components.reduce((total, comp) => total + comp.projects.length, 0)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Funding:</span>
                      <span className="font-semibold text-gray-800">
                        {isProjectView 
                          ? formatCurrency(getTotalFunding(selectedProject.idaFunding, selectedProject.gcfFunding))
                          : formatCurrency(components.reduce((total, comp) => total + getComponentTotalFunding(comp), 0))
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Activities:</span>
                      <span className="font-semibold text-gray-800">
                        {isProjectView ? selectedProject.activities.length : 'N/A'}
                      </span>
                    </div>
                    {!isProjectView && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Status Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">In Progress:</span>
                            <span className="text-xs font-medium text-yellow-600">
                              {components.reduce((total, comp) => total + comp.projects.filter(p => p.status === 'in_progress').length, 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Completed:</span>
                            <span className="text-xs font-medium text-green-600">
                              {components.reduce((total, comp) => total + comp.projects.filter(p => p.status === 'completed').length, 0)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Approved:</span>
                            <span className="text-xs font-medium text-blue-600">
                              {components.reduce((total, comp) => total + comp.projects.filter(p => p.status === 'approved').length, 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Activities - Only show for projects */}
                {isProjectView && (
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                      {mockActivities.slice(0, 3).map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                            <p className="text-sm text-gray-500">{activity.user}</p>
                            <p className="text-xs text-gray-400">{activity.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activities</h2>
                {isProjectView && selectedProject && (
                  <button
                    onClick={() => {
                      console.log('Opening activity form');
                      setShowCreateActivityForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add Activity
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {isProjectView && selectedProject ? (
                  selectedProject.activities.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{activity.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                          activity.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {activity.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{activity.description}</p>
                      <p className="text-sm text-gray-500">Date: {activity.date}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">
                    {isProjectView ? 'No activities found for this project.' : 'Select a project to view its activities.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Documents</h2>
              <p className="text-gray-500">Document management functionality will be implemented here.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Settings</h2>
              <p className="text-gray-500">Settings and configuration options will be implemented here.</p>
            </div>
          )}
        </div>

        {/* Modals for Details View */}
        {/* Create Project Modal */}
        {showCreateProjectForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Name
                    </label>
                    <input
                      type="text"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File No
                    </label>
                    <input
                      type="text"
                      value={newProject.fileNo}
                      onChange={(e) => setNewProject({ ...newProject, fileNo: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter file number"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Component
                    </label>
                    <select
                      value={newProject.projectId}
                      onChange={(e) => setNewProject({ ...newProject, projectId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Sub Component</option>
                      {selectedComponent?.componentId && 
                        subComponentOptions[selectedComponent.componentId as keyof typeof subComponentOptions]?.map((id: string) => (
                          <option key={id} value={id}>{id}</option>
                        ))
                      }
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Start Date
                    </label>
                    <input
                      type="date"
                      value={newProject.expectedStartDate}
                      onChange={(e) => setNewProject({ ...newProject, expectedStartDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected End Date
                    </label>
                    <input
                      type="date"
                      value={newProject.expectedEndDate}
                      onChange={(e) => setNewProject({ ...newProject, expectedEndDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IDA Funding
                    </label>
                    <input
                      type="number"
                      value={newProject.idaFunding}
                      onChange={(e) => setNewProject({ ...newProject, idaFunding: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GCF Funding
                    </label>
                    <input
                      type="number"
                      value={newProject.gcfFunding}
                      onChange={(e) => setNewProject({ ...newProject, gcfFunding: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lead Implementation
                    </label>
                    <input
                      type="text"
                      value={newProject.leadImplementation}
                      onChange={(e) => setNewProject({ ...newProject, leadImplementation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partners
                    </label>
                    <input
                      type="text"
                      value={newProject.partners}
                      onChange={(e) => setNewProject({ ...newProject, partners: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procurement Method
                    </label>
                    <select
                      value={newProject.procurementMethod}
                      onChange={(e) => setNewProject({ ...newProject, procurementMethod: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Method</option>
                      {procurementMethods.map((method) => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newProject.status}
                      onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'completed' | 'in_progress' | 'approved' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateProjectForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Activity Modal */}
        {showCreateActivityForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Activity</h2>
              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Name
                  </label>
                  <input
                    type="text"
                    value={newActivity.name}
                    onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newActivity.status}
                    onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateActivityForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Create Activity
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workplan Management</h1>
          <p className="text-gray-600 mt-2">Manage components, projects, and activities</p>
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

      {/* Search and Create */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search components, projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent w-80"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <button
          onClick={() => {
            console.log('Opening component form');
            setShowCreateForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Workplan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procurement Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IDA
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GCF
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredComponents.map((component) => (
                <React.Fragment key={component.id}>
                  {/* Component Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                          onClick={() => toggleComponentExpansion(component.id)}
                          className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                          {expandedComponents.has(component.id) ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {component.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {component.projects.length} projects
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewDetails(component)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                  
                  {/* Project Rows (when expanded) */}
                  {expandedComponents.has(component.id) && component.projects.map((project) => (
                    <tr key={project.id} className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="ml-8">
                          <div className="text-sm font-medium text-gray-900">
                            {project.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {project.procurementMethod}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        {formatCurrency(project.idaFunding)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {formatCurrency(project.gcfFunding)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        {formatCurrency(getTotalFunding(project.idaFunding, project.gcfFunding))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          project.status === 'completed' ? 'bg-green-100 text-green-800' :
                          project.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {project.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(component, project)}
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

      {/* Create Component Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Workplan</h2>
            <form onSubmit={handleCreateComponent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component
                </label>
                <select
                  value={newComponent.componentId}
                  onChange={(e) => {
                    const selected = availableComponents.find(comp => comp.id === e.target.value);
                    setNewComponent({ 
                      ...newComponent, 
                      componentId: e.target.value,
                      name: selected ? selected.name : ''
                    });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Component</option>
                  {availableComponents.map((component) => (
                    <option key={component.id} value={component.id}>
                      {component.id} - {component.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Workplan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Name
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File No
                  </label>
                  <input
                    type="text"
                    value={newProject.fileNo}
                    onChange={(e) => setNewProject({ ...newProject, fileNo: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter file number"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub Component
                  </label>
                  <select
                    value={newProject.projectId}
                    onChange={(e) => setNewProject({ ...newProject, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Sub Component</option>
                    {selectedComponent?.componentId && 
                      subComponentOptions[selectedComponent.componentId as keyof typeof subComponentOptions]?.map((id: string) => (
                        <option key={id} value={id}>{id}</option>
                      ))
                    }
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Start Date
                  </label>
                  <input
                    type="date"
                    value={newProject.expectedStartDate}
                    onChange={(e) => setNewProject({ ...newProject, expectedStartDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected End Date
                  </label>
                  <input
                    type="date"
                    value={newProject.expectedEndDate}
                    onChange={(e) => setNewProject({ ...newProject, expectedEndDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    IDA Funding
                  </label>
                  <input
                    type="number"
                    value={newProject.idaFunding}
                    onChange={(e) => setNewProject({ ...newProject, idaFunding: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    GCF Funding
                  </label>
                  <input
                    type="number"
                    value={newProject.gcfFunding}
                    onChange={(e) => setNewProject({ ...newProject, gcfFunding: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lead Implementation
                  </label>
                  <input
                    type="text"
                    value={newProject.leadImplementation}
                    onChange={(e) => setNewProject({ ...newProject, leadImplementation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Partners
                  </label>
                  <input
                    type="text"
                    value={newProject.partners}
                    onChange={(e) => setNewProject({ ...newProject, partners: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Procurement Method
                  </label>
                  <select
                    value={newProject.procurementMethod}
                    onChange={(e) => setNewProject({ ...newProject, procurementMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Method</option>
                    {procurementMethods.map((method) => (
                      <option key={method} value={method}>{method}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={newProject.status}
                    onChange={(e) => setNewProject({ ...newProject, status: e.target.value as 'completed' | 'in_progress' | 'approved' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="approved">Approved</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateProjectForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Activity Modal */}
      {showCreateActivityForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Activity</h2>
            <form onSubmit={handleCreateActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Name
                </label>
                <input
                  type="text"
                  value={newActivity.name}
                  onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newActivity.date}
                  onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newActivity.description}
                  onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={newActivity.status}
                  onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateActivityForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkplanView;