import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  Clock, 
  DollarSign, 
  Building, 
  Activity, 
  FileText, 
  MessageSquare,  
  Settings,
  Eye,
  Edit,
  Download
} from 'lucide-react';

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

const WorkplanDetailsView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [workplan, setWorkplan] = useState<Workplan | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'documents' | 'settings'>('overview');

  // Mock data - in real app, this would come from API based on URL params
  useEffect(() => {
    // Simulate fetching workplan data based on ID
    const mockWorkplans: { [key: string]: Workplan } = {
      '1': {
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
      '2': {
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
      '3': {
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
    };

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

    // Simulate API delay
    setTimeout(() => {
      const workplanData = mockWorkplans[id || '1'];
      if (workplanData) {
        setWorkplan(workplanData);
        setActivities(mockActivities);
      }
    }, 500);
  }, [id]);

  const handleBack = () => {
    window.close(); // Close the current tab
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

  if (!workplan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading workplan details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={handleBack}
                className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{workplan.component}</h1>
                <p className="text-sm text-gray-500">Workplan Details</p>
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
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                      <p className="text-lg font-semibold text-gray-800">{workplan.component}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Duration</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Clock className="w-5 h-5 mr-2 text-green-600" />
                        {workplan.duration}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected Start Date</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        {workplan.expectedStartDate}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Expected End Date</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                        {workplan.expectedEndDate}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Source of Funding</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                        {workplan.sourceOfFunding}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Lead Implementation</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-purple-600" />
                        {workplan.leadImplementation}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Partners</h3>
                      <p className="text-lg text-gray-800 flex items-center">
                        <Building className="w-5 h-5 mr-2 text-orange-600" />
                        {workplan.partners}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Procurement Method</h3>
                      <p className="text-lg text-gray-800">{workplan.procurementMethod}</p>
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
                  {activities.slice(0, 5).map((activity) => (
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
                <button className="w-full mt-4 text-sm text-green-600 hover:text-green-700 font-medium">
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
              {activities.map((activity) => (
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
    </div>
  );
};

export default WorkplanDetailsView;
