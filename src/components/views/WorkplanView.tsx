import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Users, Search, Eye, DollarSign, Building, ArrowLeft, Activity, FileText, MessageSquare, Settings, Edit, Download, Loader2, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { componentService, Component as ApiComponent } from '../../services/componentService';
import { subComponentService, SubComponent } from '../../services/subComponentService';
import { projectService, Project } from '../../services/projectService';
import { workplanService, Workplan } from '../../services/workplanService';
import { activityService, Activity as ApiActivity, ProcurementMethod } from '../../services/activityService';

interface Activity {
  id: string;
  name: string;
  date: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
}

interface WorkplanComponent {
  id: string;
  name: string;
  componentId: string; // A, B, C, etc.
  projects: Project[];
}

interface WorkplanWithComponent extends Workplan {
  component: ApiComponent;
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
  const [workplans, setWorkplans] = useState<WorkplanWithComponent[]>([]);
  
  const [showCreateWorkplanForm, setShowCreateWorkplanForm] = useState(false);
  const [showCreateProjectForm, setShowCreateProjectForm] = useState(false);
  const [showCreateActivityForm, setShowCreateActivityForm] = useState(false);
  const [selectedWorkplan, setSelectedWorkplan] = useState<WorkplanWithComponent | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<WorkplanComponent | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'documents' | 'settings'>('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [availableSubComponents, setAvailableSubComponents] = useState<SubComponent[]>([]);
  const [expandedWorkplans, setExpandedWorkplans] = useState<Set<string>>(new Set());
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [activitiesError, setActivitiesError] = useState<string | null>(null);
  const [newWorkplan, setNewWorkplan] = useState<{
    title: string;
    component_id: number;
  }>({
    title: '',
    component_id: 0
  });
  const [newProject, setNewProject] = useState<{
    title: string;
    sub_component_id: number;
    component_id: number;
    project_info: {
      file_no: string;
      expected_start_date: string;
      expected_end_date: string;
      ida_funding: number;
      gcf_funding: number;
      lead_implementation: string;
      partners: string;
      procurement_method: string;
      status: string;
    };
  }>({
    title: '',
    sub_component_id: 0,
    component_id: 0,
    project_info: {
      file_no: '',
      expected_start_date: '',
      expected_end_date: '',
      ida_funding: 0,
      gcf_funding: 0,
      lead_implementation: '',
    partners: '',
      procurement_method: '',
      status: 'in_progress'
    }
  });
  const [newActivity, setNewActivity] = useState<{
    title: string;
    duration: number;
    project_id: number;
    expected_start_time: string;
    expected_finish_time: string;
    status: 'in-progress' | 'completed' | 'pending' | 'cancelled';
    procurement_methods: ProcurementMethod[];
  }>({
    title: '',
    duration: 0,
    project_id: 0,
    expected_start_time: '',
    expected_finish_time: '',
    status: 'pending',
    procurement_methods: []
  });



  // Debug modal states
  useEffect(() => {
    console.log('Modal states:', {
      showCreateWorkplanForm,
      showCreateProjectForm,
      showCreateActivityForm
    });
  }, [showCreateWorkplanForm, showCreateProjectForm, showCreateActivityForm]);

  // Test API connection on mount
  useEffect(() => {
    const testApiConnection = async () => {
      try {
        console.log('Testing API connection...');
        const components = await componentService.getComponents();
        console.log('API connection successful, found components:', components.length);
        
        // Test workplan endpoint
        try {
          const workplans = await workplanService.getAllWorkplans();
          console.log('Workplan endpoint working, found workplans:', workplans.length);
          
          // Test project fetching for each workplan
          for (const workplan of workplans) {
            try {
              console.log(`Testing project fetch for workplan ${workplan.id}...`);
              const projects = await projectService.getProjectsByWorkplan(workplan.id);
              console.log(`Workplan ${workplan.id} has ${projects.length} projects:`, projects);
            } catch (projectError) {
              console.error(`Error fetching projects for workplan ${workplan.id}:`, projectError);
            }
          }
        } catch (workplanError) {
          console.error('Workplan endpoint error:', workplanError);
        }
      } catch (error) {
        console.error('API connection failed:', error);
      }
    };
    
    testApiConnection();
  }, []);


  // State for API components
  const [availableComponents, setAvailableComponents] = useState<ApiComponent[]>([]);
  const [isLoadingComponents, setIsLoadingComponents] = useState(false);
  const [, setIsLoadingSubComponents] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [componentsError, setComponentsError] = useState<string | null>(null);
  const [, setSubComponentsError] = useState<string | null>(null);
  const [projectsError, setProjectsError] = useState<string | null>(null);

  // Fetch workplans from API on mount
  useEffect(() => {
    const fetchWorkplans = async () => {
      try {
        setIsLoadingComponents(true);
        setComponentsError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
          setComponentsError('Please log in to view workplans');
          return;
        }
        
        const apiWorkplans = await workplanService.getAllWorkplans();
        const apiComponents = await componentService.getComponents();
        setAvailableComponents(apiComponents);
        
        
        // Check if workplans is valid array
        if (!Array.isArray(apiWorkplans)) {
          console.error('API returned invalid workplans data:', apiWorkplans);
          setComponentsError('Invalid workplans data received from API');
          return;
        }
        
        // Fetch all sub-components first
        console.log('Fetching all sub-components...');
        const allSubComponents = await subComponentService.getAllSubComponents();
        console.log('All sub-components fetched:', allSubComponents);
        setAvailableSubComponents(allSubComponents);

        // Convert API workplans to workplan with component format and fetch their projects
        const workplansWithComponents: WorkplanWithComponent[] = await Promise.all(
          apiWorkplans.map(async (workplan) => {
            console.log(`Looking for component with ID: ${workplan.component_id} (type: ${typeof workplan.component_id})`);
            console.log('Available components:', apiComponents.map(c => ({ id: c.id, name: c.name, type: typeof c.id })));
            
            // Add null check for component_id
            if (!workplan.component_id) {
              console.warn(`Workplan ${workplan.id} has no component_id`);
              return {
                ...workplan,
                component: { id: 0, name: 'No Component' },
          projects: []
              };
            }
          
          const component = apiComponents.find(comp => comp.id === workplan.component_id || comp.id === parseInt(workplan.component_id.toString()));
            console.log(`Found component for workplan ${workplan.id}:`, component);
            
            let projects: Project[] = [];
            
            try {
              console.log(`Fetching projects for workplan ${workplan.id}...`);
              projects = await projectService.getProjectsByWorkplan(workplan.id);
              console.log(`Found ${projects.length} projects for workplan ${workplan.id}:`, projects);
      } catch (err) {
              console.error(`Error fetching projects for workplan ${workplan.id}:`, err);
            }
            
            return {
              ...workplan,
              component: component || { id: 0, name: 'Unknown Component' },
              projects
            };
          })
        );
        
        console.log('Initial workplans fetch - Final workplans with components:', workplansWithComponents);
        setWorkplans(workplansWithComponents);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load workplans';
        setComponentsError(errorMessage);
        console.error('Error fetching workplans:', err);
      } finally {
        setIsLoadingComponents(false);
      }
    };

    fetchWorkplans();
  }, []);

  // Fetch sub-components when a component is selected
  const fetchSubComponents = async (componentId: number) => {
    try {
      setIsLoadingSubComponents(true);
      setSubComponentsError(null);
      
      console.log(`Fetching sub-components for component ${componentId}...`);
      const subComponents = await subComponentService.getSubComponentsByComponent(componentId);
      console.log(`Found ${subComponents.length} sub-components for component ${componentId}:`, subComponents);
      setAvailableSubComponents(subComponents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load sub-components';
      setSubComponentsError(errorMessage);
      console.error('Error fetching sub-components:', err);
    } finally {
      setIsLoadingSubComponents(false);
    }
  };

  // Clear sub-component cache when needed
  // const clearSubComponentCache = () => {
  //   subComponentService.clearCache();
  // };

  // Fetch activities for a project
  const fetchActivities = async (projectId: number) => {
    try {
      setIsLoadingActivities(true);
      setActivitiesError(null);
      
      console.log(`Fetching activities for project ${projectId}...`);
      const projectActivities = await activityService.getActivitiesByProject(projectId);
      console.log(`Found ${projectActivities.length} activities for project ${projectId}:`, projectActivities);
      setActivities(projectActivities);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load activities';
      setActivitiesError(errorMessage);
      console.error('Error fetching activities:', err);
    } finally {
      setIsLoadingActivities(false);
    }
  };


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

  const handleCreateWorkplan = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Creating workplan with data:', newWorkplan);
    
    // Validate form data
    if (!newWorkplan.title.trim()) {
      setProjectsError('Workplan title is required');
      return;
    }
    
    if (!newWorkplan.component_id || newWorkplan.component_id === 0) {
      setProjectsError('Please select a component');
      return;
    }
    
    try {
      setIsLoadingProjects(true);
      setProjectsError(null);
      
      const workplanData = {
        title: newWorkplan.title.trim(),
        component_id: newWorkplan.component_id
      };
      
      console.log('Sending workplan data:', workplanData);
      
      const response = await workplanService.createWorkplan(workplanData);
      console.log('Workplan created successfully:', response);
      
      // Refresh workplans after successful creation
      console.log('Refreshing workplans after creation...');
      const apiWorkplans = await workplanService.getAllWorkplans();
      const apiComponents = await componentService.getComponents();
      
      // Check if workplans is valid array
      if (!Array.isArray(apiWorkplans)) {
        console.error('API returned invalid workplans data after creation:', apiWorkplans);
        setProjectsError('Failed to refresh workplans after creation');
        return;
      }
      
      // Fetch all sub-components
      console.log('Fetching all sub-components after workplan creation...');
      const allSubComponents = await subComponentService.getAllSubComponents();
      console.log('All sub-components fetched after creation:', allSubComponents);
      setAvailableSubComponents(allSubComponents);
      
      const workplansWithComponents: WorkplanWithComponent[] = await Promise.all(
        apiWorkplans.map(async (workplan) => {
          // Add null check for component_id
          if (!workplan.component_id) {
            console.warn(`Workplan ${workplan.id} has no component_id`);
            return {
              ...workplan,
              component: { id: 0, name: 'No Component' },
      projects: []
            };
          }
          
          const component = apiComponents.find(comp => comp.id === workplan.component_id || comp.id === parseInt(workplan.component_id.toString()));
          let projects: Project[] = [];
          
            try {
              projects = await projectService.getProjectsByWorkplan(workplan.id);
            } catch (err) {
              console.error(`Error fetching projects for workplan ${workplan.id}:`, err);
            }
          
          return {
            ...workplan,
            component: component || { id: 0, name: 'Unknown Component' },
            projects
          };
        })
      );
      
      console.log('Updated workplans list:', workplansWithComponents);
      setWorkplans(workplansWithComponents);
      
      // Reset form
      setNewWorkplan({
        title: '',
        component_id: 0
      });
      setShowCreateWorkplanForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workplan';
      setProjectsError(errorMessage);
      console.error('Error creating workplan:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComponent) return;
    
    try {
      setIsLoadingProjects(true);
      setProjectsError(null);
      
      const projectData = {
        title: newProject.title,
        workplan_id: selectedWorkplan!.id,
        sub_component_id: newProject.sub_component_id,
        component_id: parseInt(selectedComponent.id),
        project_info: newProject.project_info
      };
      
      await projectService.createProject(projectData);
      
      // Refresh the workplan's projects
      if (selectedWorkplan) {
        const updatedProjects = await projectService.getProjectsByWorkplan(selectedWorkplan.id);
        const updatedWorkplan = {
          ...selectedWorkplan,
          projects: updatedProjects
        };
        
        setWorkplans(workplans.map(wp => 
          wp.id === selectedWorkplan.id ? updatedWorkplan : wp
        ));
        setSelectedWorkplan(updatedWorkplan);
        setSelectedComponent({
          ...selectedComponent,
          projects: updatedProjects
        });
      }
      
      // Reset form
    setNewProject({
        title: '',
        sub_component_id: 0,
        component_id: parseInt(selectedComponent.id),
        project_info: {
          file_no: '',
          expected_start_date: '',
          expected_end_date: '',
          ida_funding: 0,
          gcf_funding: 0,
          lead_implementation: '',
      partners: '',
          procurement_method: '',
          status: 'in_progress'
        }
    });
    setShowCreateProjectForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setProjectsError(errorMessage);
      console.error('Error creating project:', err);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    
    try {
      setIsLoadingActivities(true);
      setActivitiesError(null);
      
      const activityData = {
        title: newActivity.title,
        duration: newActivity.duration,
        project_id: selectedProject.id,
        expected_start_time: newActivity.expected_start_time,
        expected_finish_time: newActivity.expected_finish_time,
        status: newActivity.status,
        procurement_methods: newActivity.procurement_methods
      };
      
      console.log('Creating activity with data:', activityData);
      await activityService.createActivity(activityData);
      
      // Refresh activities for the project
      await fetchActivities(selectedProject.id);
      
      // Reset form
    setNewActivity({
        title: '',
        duration: 0,
        project_id: selectedProject.id,
        expected_start_time: '',
        expected_finish_time: '',
        status: 'pending',
        procurement_methods: []
    });
    setShowCreateActivityForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create activity';
      setActivitiesError(errorMessage);
      console.error('Error creating activity:', err);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleViewWorkplanDetails = async (workplan: WorkplanWithComponent) => {
    console.log('Viewing workplan details:', workplan);
    setSelectedWorkplan(workplan);
    setSelectedComponent({
      id: workplan.component.id.toString(),
      name: workplan.component.name,
      componentId: String.fromCharCode(65 + workplan.component.id - 1), // A, B, C, etc.
      projects: workplan.projects
    });
    setSelectedProject(null);
    setActiveTab('overview');
    
    // Fetch sub-components for this component
    console.log(`Fetching sub-components for component ${workplan.component.id}...`);
    await fetchSubComponents(workplan.component.id);
    
    // Set the component_id in the new project form
    setNewProject(prev => ({
      ...prev,
      component_id: workplan.component.id
    }));
  };

  const handleViewProjectDetails = async (project: Project) => {
    if (!selectedWorkplan) return;
    
    setSelectedProject(project);
    setActiveTab('overview');
    
    // Fetch activities for this project
    await fetchActivities(project.id);
  };

  const handleBackToList = () => {
    setSelectedWorkplan(null);
    setSelectedComponent(null);
    setSelectedProject(null);
    setActiveTab('overview');
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

  const getWorkplanTotalFunding = (workplan: WorkplanWithComponent) => {
    return workplan.projects.reduce((total, project) => {
      const idaFunding = project.project_info.ida_funding || 0;
      const gcfFunding = project.project_info.gcf_funding || 0;
      return total + getTotalFunding(idaFunding, gcfFunding);
    }, 0);
  };


  const filteredWorkplans = workplans.filter(workplan => {
    const matchesSearch = workplan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workplan.component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workplan.projects.some(project => 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.project_info.lead_implementation || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    if (!statusFilter) return matchesSearch;
    
    const hasMatchingStatus = workplan.projects.some(project => 
      (project.project_info.status || '').toLowerCase() === statusFilter.toLowerCase()
    );
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





  // Show workplan/component/project details view
  if (selectedWorkplan) {
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
                  {isProjectView ? `${selectedWorkplan.title} - ${selectedProject?.title}` : `${selectedWorkplan.title} - ${selectedComponent?.name}`}
                </h1>
                <p className="text-gray-600">
                  {isProjectView ? 'Project Details' : 'Workplan Overview'}
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
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Project Title</h3>
                          <p className="text-lg font-semibold text-gray-800 flex items-center">
                            <Building className="w-5 h-5 mr-2 text-blue-600" />
                            {selectedProject.title}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">File No</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-green-600" />
                            {selectedProject.project_info.file_no || 'N/A'}
                          </p>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Start Date</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-green-600" />
                            {selectedProject.project_info.expected_start_date || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected End Date</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Calendar className="w-5 h-5 mr-2 text-green-600" />
                            {selectedProject.project_info.expected_end_date || 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">IDA</h3>
                          <p className={`text-lg font-semibold flex items-center ${
                            (selectedProject.project_info.ida_funding || 0) > 0 ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            <DollarSign className="w-5 h-5 mr-2" />
                            {formatCurrency(selectedProject.project_info.ida_funding || 0)}
                            {(selectedProject.project_info.ida_funding || 0) === 0 && <span className="text-sm font-normal ml-2">(No contribution)</span>}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">GCF</h3>
                          <p className={`text-lg font-semibold flex items-center ${
                            (selectedProject.project_info.gcf_funding || 0) > 0 ? 'text-blue-600' : 'text-gray-400'
                          }`}>
                            <DollarSign className="w-5 h-5 mr-2" />
                            {formatCurrency(selectedProject.project_info.gcf_funding || 0)}
                            {(selectedProject.project_info.gcf_funding || 0) === 0 && <span className="text-sm font-normal ml-2">(No contribution)</span>}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Funding</h3>
                          <p className="text-lg font-bold text-gray-800 flex items-center">
                            <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                            {formatCurrency(getTotalFunding(selectedProject.project_info.ida_funding || 0, selectedProject.project_info.gcf_funding || 0))}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Lead Implementation</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Users className="w-5 h-5 mr-2 text-purple-600" />
                            {selectedProject.project_info.lead_implementation || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Partners</h3>
                          <p className="text-lg text-gray-800 flex items-center">
                            <Building className="w-5 h-5 mr-2 text-orange-600" />
                            {selectedProject.project_info.partners || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Procurement Method</h3>
                          <p className="text-lg text-gray-800">{selectedProject.project_info.procurement_method || 'N/A'}</p>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            selectedProject.project_info.status === 'completed' ? 'bg-green-100 text-green-800' :
                            selectedProject.project_info.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {(selectedProject.project_info.status || 'in_progress').replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Component Overview
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Component Name</h3>
                        <p className="text-lg font-semibold text-gray-800">{selectedComponent?.name}</p>
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
                          {selectedComponent?.projects?.map((project) => (
                            <div key={project.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800 flex items-center">
                                  <Building className="w-4 h-4 mr-2 text-blue-600" />
                                  {project.title}
                                </h4>
                                <button
                                  onClick={() => handleViewProjectDetails(project)}
                                  className="text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                  View Details →
                                </button>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">File No:</span>
                                  <span className="font-medium text-gray-800">{project.project_info.file_no || 'N/A'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">IDA:</span>
                                  <span className={`font-medium ${(project.project_info.ida_funding || 0) > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {formatCurrency(project.project_info.ida_funding || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">GCF:</span>
                                  <span className={`font-medium ${(project.project_info.gcf_funding || 0) > 0 ? 'text-blue-600' : 'text-gray-400'}`}>
                                    {formatCurrency(project.project_info.gcf_funding || 0)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Total:</span>
                                  <span className="font-bold text-gray-800">
                                    {formatCurrency(getTotalFunding(project.project_info.ida_funding || 0, project.project_info.gcf_funding || 0))}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
                                  <span className="text-gray-600">Status:</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    project.project_info.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    project.project_info.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                    'bg-yellow-100 text-yellow-800'
                                  }`}>
                                    {(project.project_info.status || 'in_progress').replace('_', ' ')}
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
                        {isProjectView ? selectedComponent?.projects.length || 0 : selectedWorkplan?.projects.length || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Total Funding:</span>
                      <span className="font-semibold text-gray-800">
                        {isProjectView 
                          ? formatCurrency(getTotalFunding(selectedProject?.project_info.ida_funding || 0, selectedProject?.project_info.gcf_funding || 0))
                          : formatCurrency(getWorkplanTotalFunding(selectedWorkplan!))
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Activities:</span>
                      <span className="font-semibold text-gray-800">
                        {isProjectView ? 'N/A' : 'N/A'}
                      </span>
                    </div>
                    {!isProjectView && selectedWorkplan && (
                      <div className="pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Status Distribution</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">In Progress:</span>
                            <span className="text-xs font-medium text-yellow-600">
                              {selectedWorkplan.projects.filter(p => p.project_info.status === 'in_progress').length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Completed:</span>
                            <span className="text-xs font-medium text-green-600">
                              {selectedWorkplan.projects.filter(p => p.project_info.status === 'completed').length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600">Approved:</span>
                            <span className="text-xs font-medium text-blue-600">
                              {selectedWorkplan.projects.filter(p => p.project_info.status === 'approved').length}
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
              
              {activitiesError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {activitiesError}
                </div>
              )}
              
              <div className="space-y-4">
                {isLoadingActivities ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
                    <span className="text-gray-600">Loading activities...</span>
                  </div>
                ) : !activities || activities.length === 0 ? (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No activities available</p>
                    <p className="text-sm text-gray-400 mt-1">Create activities to track project progress</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {activities.map((activity) => (
                      <div key={activity.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            <Activity className="w-4 h-4 mr-2 text-blue-600" />
                            {activity.title || 'Untitled Activity'}
                          </h4>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                            activity.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                            activity.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {(activity.status || 'pending').replace('-', ' ').toUpperCase()}
                          </span>
                      </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium text-gray-800">{activity.duration || 0} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Start:</span>
                            <span className="font-medium text-gray-800">
                              {activity.expected_start_time ? new Date(activity.expected_start_time).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Finish:</span>
                            <span className="font-medium text-gray-800">
                              {activity.expected_finish_time ? new Date(activity.expected_finish_time).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Procurement Methods:</span>
                            <span className="font-medium text-gray-800">{activity.procurement_methods?.length || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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

        {showCreateProjectForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Project</h2>
              <form onSubmit={handleCreateProject} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Project Title
                    </label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
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
                      value={newProject.project_info.file_no}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, file_no: e.target.value }
                      })}
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
                      value={newProject.sub_component_id}
                      onChange={(e) => setNewProject({ ...newProject, sub_component_id: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value={0}>Select Sub Component</option>
                      {availableSubComponents.map((subComp) => (
                        <option key={subComp.id} value={subComp.id}>{subComp.title}</option>
                      ))}
                    </select>
                    {/* Debug: Available sub-components for project form */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Start Date
                    </label>
                    <input
                      type="date"
                      value={newProject.project_info.expected_start_date}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, expected_start_date: e.target.value }
                      })}
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
                      value={newProject.project_info.expected_end_date}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, expected_end_date: e.target.value }
                      })}
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
                      value={newProject.project_info.ida_funding}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, ida_funding: Number(e.target.value) }
                      })}
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
                      value={newProject.project_info.gcf_funding}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, gcf_funding: Number(e.target.value) }
                      })}
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
                      value={newProject.project_info.lead_implementation}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, lead_implementation: e.target.value }
                      })}
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
                      value={newProject.project_info.partners}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, partners: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Procurement Method
                    </label>
                    <select
                      value={newProject.project_info.procurement_method}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, procurement_method: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Method</option>
                      <option value="Open Tender">Open Tender</option>
                      <option value="Limited Tender">Limited Tender</option>
                      <option value="Direct Contract">Direct Contract</option>
                      <option value="Framework Agreement">Framework Agreement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={newProject.project_info.status}
                      onChange={(e) => setNewProject({ 
                        ...newProject, 
                        project_info: { ...newProject.project_info, status: e.target.value }
                      })}
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
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Activity</h2>
              {activitiesError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {activitiesError}
                </div>
              )}
              <form onSubmit={handleCreateActivity} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Activity Title
                  </label>
                  <input
                    type="text"
                      value={newActivity.title}
                      onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (days)
                  </label>
                  <input
                      type="number"
                      value={newActivity.duration}
                      onChange={(e) => setNewActivity({ ...newActivity, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                      min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Start Time
                  </label>
                    <input
                      type="datetime-local"
                      value={newActivity.expected_start_time}
                      onChange={(e) => setNewActivity({ ...newActivity, expected_start_time: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expected Finish Time
                    </label>
                    <input
                      type="datetime-local"
                      value={newActivity.expected_finish_time}
                      onChange={(e) => setNewActivity({ ...newActivity, expected_finish_time: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                      <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Procurement Methods
                  </label>
                  <div className="space-y-2">
                    {newActivity.procurement_methods.map((method, index) => (
                      <div key={index} className="flex gap-2 p-3 border border-gray-200 rounded-md">
                        <input
                          type="text"
                          placeholder="Method name (e.g., Direct Purchase, Tender)"
                          value={method.method_name}
                          onChange={(e) => {
                            const updatedMethods = [...newActivity.procurement_methods];
                            updatedMethods[index] = { ...method, method_name: e.target.value };
                            setNewActivity({ ...newActivity, procurement_methods: updatedMethods });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Notes"
                          value={typeof method.procurement_notes === 'string' ? method.procurement_notes : ''}
                          onChange={(e) => {
                            const updatedMethods = [...newActivity.procurement_methods];
                            updatedMethods[index] = { ...method, procurement_notes: e.target.value };
                            setNewActivity({ ...newActivity, procurement_methods: updatedMethods });
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const updatedMethods = newActivity.procurement_methods.filter((_, i) => i !== index);
                            setNewActivity({ ...newActivity, procurement_methods: updatedMethods });
                          }}
                          className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setNewActivity({
                          ...newActivity,
                          procurement_methods: [...newActivity.procurement_methods, { method_name: '', procurement_notes: '' }]
                        });
                      }}
                      className="w-full px-4 py-2 border-2 border-dashed border-gray-300 text-gray-600 hover:border-green-500 hover:text-green-600 rounded-md transition-colors"
                    >
                      + Add Procurement Method
                    </button>
                  </div>
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
                    disabled={isLoadingActivities}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoadingActivities && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isLoadingActivities ? 'Creating...' : 'Create Activity'}
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
          <p className="text-gray-600 mt-2">Manage workplans, components and projects</p>
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
          onClick={() => setShowCreateWorkplanForm(true)}
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
                  Workplan Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sub-Component
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procurement Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IDA Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GCF Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Funding
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingComponents ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
                      <span className="text-gray-600">Loading workplans...</span>
                    </div>
                  </td>
                </tr>
              ) : componentsError ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                      <span className="text-red-600">{componentsError}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredWorkplans.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Building className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No workplans found</p>
                      <p className="text-gray-400 text-sm mt-1">
                        {searchTerm ? 'No workplans match your search criteria' : 'Create workplans to get started'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredWorkplans.map((workplan) => {
                  const isExpanded = expandedWorkplans.has(workplan.id.toString());
                  
                  return (
                    <React.Fragment key={workplan.id}>
                      {/* Workplan Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button
                              onClick={() => toggleWorkplanExpansion(workplan.id.toString())}
                          className="mr-2 p-1 hover:bg-gray-200 rounded transition-colors"
                        >
                              {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-gray-500" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                                {workplan.title}
                          </div>
                          <div className="text-sm text-gray-500">
                                {workplan.projects.length} projects
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {workplan.component.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      -
                    </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-gray-400 text-sm">
                      -
                          </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          -
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      -
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                            onClick={() => handleViewWorkplanDetails(workplan)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </td>
                  </tr>
                  
                  {/* Project Rows (when expanded) */}
                      {isExpanded && workplan.projects.map((project) => {
                        console.log(`Looking for sub-component with ID: ${project.sub_component_id} (type: ${typeof project.sub_component_id})`);
                        console.log('Available sub-components:', availableSubComponents.map(sub => ({ id: sub.id, title: sub.title, type: typeof sub.id })));
                        const subComponent = availableSubComponents.find(sub => sub.id === project.sub_component_id);
                        console.log(`Found sub-component for project ${project.id}:`, subComponent);
                        return (
                    <tr key={project.id} className="bg-gray-50 hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="ml-8">
                          <div className="text-sm font-medium text-gray-900">
                                  {project.title}
                                </div>
                                <div className="text-sm text-gray-500">
                                  File No: {project.project_info.file_no || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              -
                      </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {subComponent?.title || 'Unknown'}
                      </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {project.project_info.procurement_method || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                project.project_info.status === 'completed' ? 'bg-green-100 text-green-800' :
                                project.project_info.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                project.project_info.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {(project.project_info.status || 'N/A').replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(project.project_info.ida_funding || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              {formatCurrency(project.project_info.gcf_funding || 0)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                              {formatCurrency(getTotalFunding(project.project_info.ida_funding || 0, project.project_info.gcf_funding || 0))}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                                onClick={() => handleViewProjectDetails(project)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-2 min-w-[120px] justify-center"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </td>
                    </tr>
                        );
                      })}
                </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>



      {/* Create Workplan Modal */}
      {showCreateWorkplanForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Workplan</h2>
            {projectsError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {projectsError}
              </div>
            )}
            <form onSubmit={(e) => {
              console.log('Form submitted!');
              handleCreateWorkplan(e);
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Workplan Title
                </label>
                <input
                  type="text"
                  value={newWorkplan.title}
                  onChange={(e) => {
                    console.log('Title changed:', e.target.value);
                    setNewWorkplan({ ...newWorkplan, title: e.target.value });
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component
                </label>
                {isLoadingComponents ? (
                  <div className="flex items-center justify-center py-4 border border-gray-300 rounded-md">
                    <Loader2 className="w-4 h-4 animate-spin text-green-600 mr-2" />
                    <span className="text-gray-600">Loading components...</span>
                  </div>
                ) : (
                  <select
                    value={newWorkplan.component_id}
                    onChange={(e) => {
                      console.log('Component changed:', e.target.value);
                      setNewWorkplan({ ...newWorkplan, component_id: parseInt(e.target.value) });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isLoadingComponents}
                  >
                    <option value={0}>Select Component</option>
                    {availableComponents.map((component) => (
                      <option key={component.id} value={component.id}>
                        {component.name}
                      </option>
                    ))}
                  </select>
                )}
                {availableComponents.length === 0 && !isLoadingComponents && !componentsError && (
                  <p className="text-sm text-gray-500 mt-1">No components available. Create components in Settings first.</p>
                )}
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateWorkplanForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoadingComponents || availableComponents.length === 0 || isLoadingProjects}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isLoadingProjects && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isLoadingProjects ? 'Creating...' : 'Create Workplan'}
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