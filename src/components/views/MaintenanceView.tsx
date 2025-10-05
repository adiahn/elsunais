import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, FileText, CheckCircle, Clock, AlertTriangle, Building, Wrench, Settings, Users, Phone, Mail, Calendar, X, Loader2, AlertCircle } from 'lucide-react';
import { maintenanceService, MaintenanceRequest, CreateMaintenanceRequest, MaintenanceStats } from '../../services/maintenanceService';

// Local interface for UI compatibility
interface LocalMaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: 'office_supplies' | 'equipment' | 'utilities' | 'cleaning' | 'security' | 'it_services' | 'other';
  amount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed';
  requestDate: string;
  approvedDate?: string;
  paymentDate?: string;
  requestedBy: string;
  department: string;
  vendor?: string;
  receipt?: string;
  notes?: string;
}

const MaintenanceView: React.FC = () => {
  // API state
  const [requests, setRequests] = useState<LocalMaintenanceRequest[]>([]);
  const [stats, setStats] = useState<MaintenanceStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // UI state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LocalMaintenanceRequest | null>(null);
  const [newRequest, setNewRequest] = useState<CreateMaintenanceRequest>({
    title: '',
    category: 'office_supplies',
    details: {
      location: '',
      issue: '',
      requested_by: ''
    },
    priority: 'medium',
    amount: 0,
    notes: '',
    vendor: ''
  });

  // Fetch data on mount
  useEffect(() => {
    fetchRequests();
    fetchStats();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to view maintenance requests');
        return;
      }
      
      const apiRequests = await maintenanceService.getMaintenanceRequests();
      console.log('Fetched maintenance requests from API:', apiRequests);
      
      // Convert API requests to local format
      const localRequests: LocalMaintenanceRequest[] = apiRequests.map(apiReq => ({
        id: apiReq.id.toString(),
        title: apiReq.title,
        description: apiReq.details.issue,
        category: apiReq.category,
        amount: apiReq.amount || 0,
        priority: apiReq.priority,
        status: apiReq.status === 'in_progress' ? 'processing' : apiReq.status,
        requestDate: apiReq.requested_date,
        approvedDate: apiReq.approved_date,
        paymentDate: apiReq.completed_date,
        requestedBy: apiReq.details.requested_by,
        department: 'General', // Default department since API doesn't have this
        vendor: apiReq.vendor,
        receipt: apiReq.receipt,
        notes: apiReq.notes
      }));
      
      setRequests(localRequests);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load maintenance requests';
      setError(errorMessage);
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return;
      }
      
      const apiStats = await maintenanceService.getMaintenanceStats();
      setStats(apiStats);
    } catch (err) {
      console.error('Error fetching maintenance stats:', err);
      // Don't set error for stats, just log it
    }
  };

  const getCategoryIcon = (category: MaintenanceRequest['category']) => {
    switch (category) {
      case 'office_supplies':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'equipment':
        return <Wrench className="w-4 h-4 text-green-600" />;
      case 'utilities':
        return <Building className="w-4 h-4 text-purple-600" />;
      case 'cleaning':
        return <Settings className="w-4 h-4 text-orange-600" />;
      case 'security':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'it_services':
        return <Settings className="w-4 h-4 text-indigo-600" />;
      case 'other':
        return <DollarSign className="w-4 h-4 text-gray-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'processing':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: MaintenanceRequest['category']) => {
    switch (category) {
      case 'office_supplies':
        return 'Office Supplies';
      case 'equipment':
        return 'Equipment';
      case 'utilities':
        return 'Utilities';
      case 'cleaning':
        return 'Cleaning';
      case 'security':
        return 'Security';
      case 'it_services':
        return 'IT Services';
      case 'other':
        return 'Other';
      default:
        return 'Other';
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setError(null);
      setSuccess(null);
      
      await maintenanceService.createMaintenanceRequest(newRequest);
      setSuccess('Maintenance request created successfully!');
      setNewRequest({
        title: '',
        category: 'office_supplies',
        details: {
          location: '',
          issue: '',
          requested_by: ''
        },
        priority: 'medium',
        amount: 0,
        notes: '',
        vendor: ''
      });
      setShowCreateForm(false);
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create maintenance request';
      setError(errorMessage);
      console.error('Error creating maintenance request:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setError(null);
      setSuccess(null);
      
      await maintenanceService.approveMaintenanceRequest(parseInt(requestId));
      setSuccess('Maintenance request approved successfully!');
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve maintenance request';
      setError(errorMessage);
      console.error('Error approving maintenance request:', err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setError(null);
      setSuccess(null);
      
      await maintenanceService.rejectMaintenanceRequest(parseInt(requestId), 'Request rejected');
      setSuccess('Maintenance request rejected successfully!');
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject maintenance request';
      setError(errorMessage);
      console.error('Error rejecting maintenance request:', err);
    }
  };

  const handleMarkAsCompleted = async (requestId: string) => {
    try {
      setError(null);
      setSuccess(null);
      
      await maintenanceService.completeMaintenanceRequest(parseInt(requestId));
      setSuccess('Maintenance request completed successfully!');
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to complete maintenance request';
      setError(errorMessage);
      console.error('Error completing maintenance request:', err);
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const processingRequests = requests.filter(r => r.status === 'processing');
  const completedRequests = requests.filter(r => r.status === 'completed');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Maintenance Portal</h1>
          <p className="text-gray-600 mt-2">Manage office maintenance and payment requests</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Request
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
          <button
            onClick={() => setSuccess(null)}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">
                {stats ? stats.pending_requests : pendingRequests.length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {stats ? stats.approved_requests : approvedRequests.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-blue-600">
                {stats ? stats.completed_requests : completedRequests.length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-purple-600">
                ${stats ? stats.total_amount.toLocaleString() : requests.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Maintenance Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Maintenance Requests</h2>
          <p className="text-sm text-gray-600 mt-1">Click on a request to view details and take actions</p>
        </div>
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                <span className="text-gray-600">Loading maintenance requests...</span>
              </div>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">No maintenance requests found</p>
              <p className="text-gray-400 text-xs mt-1">Create your first maintenance request to get started</p>
            </div>
          ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {requests.map((request) => (
                <tr 
                  key={request.id} 
                  className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedRequest?.id === request.id ? 'bg-green-50' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-3">
                        {getCategoryIcon(request.category)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">{request.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.requestedBy}</div>
                    <div className="text-sm text-gray-500">{request.department}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">${request.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{getCategoryLabel(request.category)}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                      {request.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{request.requestDate}</div>
                    {request.approvedDate && (
                      <div className="text-sm text-gray-500">Approved: {request.approvedDate}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {request.status === 'pending' && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveRequest(request.id);
                            }}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectRequest(request.id);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {request.status === 'approved' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsCompleted(request.id);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">{selectedRequest.title}</h4>
                <p className="text-sm text-gray-600">{selectedRequest.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <p className="text-lg font-bold text-green-600">${selectedRequest.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <p className="text-sm text-gray-900">{getCategoryLabel(selectedRequest.category)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                    {selectedRequest.priority}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested By</label>
                  <p className="text-sm text-gray-900">{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <p className="text-sm text-gray-900">{selectedRequest.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Request Date</label>
                  <p className="text-sm text-gray-900">{selectedRequest.requestDate}</p>
                </div>
                {selectedRequest.approvedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approved Date</label>
                    <p className="text-sm text-gray-900">{selectedRequest.approvedDate}</p>
                  </div>
                )}
              </div>

              {selectedRequest.vendor && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vendor</label>
                  <p className="text-sm text-gray-900">{selectedRequest.vendor}</p>
                </div>
              )}

              {selectedRequest.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <p className="text-sm text-gray-900">{selectedRequest.notes}</p>
                </div>
              )}

              {selectedRequest.receipt && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Receipt</label>
                  <a 
                    href="#" 
                    className="text-blue-600 hover:text-blue-800 text-sm underline"
                  >
                    {selectedRequest.receipt}
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200">
                {selectedRequest.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        handleApproveRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => {
                        handleRejectRequest(selectedRequest.id);
                        setSelectedRequest(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                )}
                {selectedRequest.status === 'approved' && (
                  <button
                    onClick={() => {
                      handleMarkAsCompleted(selectedRequest.id);
                      setSelectedRequest(null);
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Maintenance Request</h2>
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter request title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Issue Description</label>
                <textarea
                  value={newRequest.details.issue}
                  onChange={(e) => setNewRequest({
                    ...newRequest, 
                    details: {...newRequest.details, issue: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Describe the maintenance issue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={newRequest.details.location}
                  onChange={(e) => setNewRequest({
                    ...newRequest, 
                    details: {...newRequest.details, location: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter location (e.g., Office Block A)"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Requested By</label>
                <input
                  type="text"
                  value={newRequest.details.requested_by}
                  onChange={(e) => setNewRequest({
                    ...newRequest, 
                    details: {...newRequest.details, requested_by: e.target.value}
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({...newRequest, category: e.target.value as MaintenanceRequest['category']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="office_supplies">Office Supplies</option>
                    <option value="equipment">Equipment</option>
                    <option value="utilities">Utilities</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="security">Security</option>
                    <option value="it_services">IT Services</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({...newRequest, priority: e.target.value as MaintenanceRequest['priority']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount ($)</label>
                  <input
                    type="number"
                    value={newRequest.amount}
                    onChange={(e) => setNewRequest({...newRequest, amount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor (Optional)</label>
                  <input
                    type="text"
                    value={newRequest.vendor}
                    onChange={(e) => setNewRequest({...newRequest, vendor: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Vendor name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Requested By</label>
                  <input
                    type="text"
                    value={newRequest.requestedBy}
                    onChange={(e) => setNewRequest({...newRequest, requestedBy: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <input
                    type="text"
                    value={newRequest.department}
                    onChange={(e) => setNewRequest({...newRequest, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Department name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={2}
                  placeholder="Additional notes"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isCreating}
                >
                  {isCreating && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCreating ? 'Creating Request...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MaintenanceView;
