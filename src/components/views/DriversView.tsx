import React, { useState, useEffect } from 'react';
import { Plus, Car, User, Wrench, Fuel, AlertTriangle, CheckCircle, XCircle, Clock as ClockIcon, Loader2, AlertCircle, Eye } from 'lucide-react';
import { driverService, DriverRequest as ApiDriverRequest, Car as ApiCar } from '../../services/driverService';

interface Vehicle {
  id: number;
  manufacturer: string;
  model: string;
  plate_number: string;
  year: number;
  assigned_to: string;
}

interface Driver {
  id: number;
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicle?: number; // Vehicle ID
  isActive: boolean;
}

interface DriverRequest {
  id: number;
  car_id: number;
  request_type: 'fuel' | 'maintenance' | 'repair' | 'inspection' | 'other';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  total_cost: number;
  // Additional fields that might be present
  driver_id?: number;
  liters_requested?: number;
  price_per_liter?: number;
  description?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  requested_date?: string;
  location?: string;
  estimated_cost?: number;
  created_at?: string;
  updated_at?: string;
}

const DriversView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: 1,
      name: 'Yusuf Abdullahi',
      employeeId: 'EMP001',
      phone: '+234-801-234-5678',
      email: 'yusuf.abdullahi@company.com',
      licenseNumber: 'DL123456789',
      licenseExpiry: '2025-12-31',
      assignedVehicle: 1,
      isActive: true
    },
    {
      id: 2,
      name: 'Aisha Ibrahim',
      employeeId: 'EMP002',
      phone: '+234-802-345-6789',
      email: 'aisha.ibrahim@company.com',
      licenseNumber: 'DL987654321',
      licenseExpiry: '2026-06-15',
      assignedVehicle: 2,
      isActive: true
    },
    {
      id: 3,
      name: 'Ibrahim Sani',
      employeeId: 'EMP003',
      phone: '+234-803-456-7890',
      email: 'ibrahim.sani@company.com',
      licenseNumber: 'DL456789123',
      licenseExpiry: '2025-09-20',
      isActive: true
    }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [carsError, setCarsError] = useState<string | null>(null);

  const [driverRequests, setDriverRequests] = useState<DriverRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const [showCreateRequestForm, setShowCreateRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState<{
    driver_id: number;
    car_id: number;
    request_type: 'fuel' | 'maintenance' | 'repair' | 'inspection' | 'other';
    liters_requested?: number;
    price_per_liter?: number;
    description?: string;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    location?: string;
    estimated_cost?: number;
  }>({
    driver_id: 2, // Default to driver 2 as per API example
    car_id: 1,
    request_type: 'fuel',
    liters_requested: 40,
    price_per_liter: 750,
    description: '',
    priority: 'medium',
    location: '',
    estimated_cost: 0
  });

  // Fetch cars on mount
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoadingCars(true);
        setCarsError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
          setCarsError('Please log in to view cars');
          return;
        }
        
        const apiCars = await driverService.getCars();
        setVehicles(apiCars);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load cars';
        setCarsError(errorMessage);
        console.error('Error fetching cars:', err);
      } finally {
        setIsLoadingCars(false);
      }
    };

    fetchCars();
  }, []);

  // Fetch driver requests on mount
  useEffect(() => {
    const fetchDriverRequests = async () => {
      try {
        setIsLoadingRequests(true);
        setRequestsError(null);
        
        // Check if user is authenticated
        const token = localStorage.getItem('authToken');
        if (!token) {
          setRequestsError('Please log in to view requests');
          return;
        }
        
        // For now, fetch requests for driver ID 2 (as per your example)
        // In a real app, this would be the logged-in driver's ID
        const driverId = 2;
        const apiRequests = await driverService.getDriverRequests(driverId);
        setDriverRequests(apiRequests);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load requests';
        setRequestsError(errorMessage);
        console.error('Error fetching driver requests:', err);
      } finally {
        setIsLoadingRequests(false);
      }
    };

    fetchDriverRequests();
  }, []);

  const getRequestTypeIcon = (type: DriverRequest['request_type']) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'fuel':
        return <Fuel className="w-4 h-4 text-green-600" />;
      case 'repair':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'inspection':
        return <CheckCircle className="w-4 h-4 text-purple-600" />;
      case 'other':
        return <Car className="w-4 h-4 text-gray-600" />;
      default:
        return <Car className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority?: DriverRequest['priority']) => {
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

  const getStatusColor = (status?: DriverRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmittingRequest(true);
      setSubmitError(null);
      setSubmitSuccess(null);
      
      // Validate required fields
      if (!newRequest.driver_id || !newRequest.car_id || !newRequest.request_type) {
        setSubmitError('Please fill in all required fields');
        return;
      }
      
      // Validate fuel-specific fields
      if (newRequest.request_type === 'fuel') {
        if (!newRequest.liters_requested || newRequest.liters_requested <= 0) {
          setSubmitError('Please enter a valid number of liters requested');
          return;
        }
        if (!newRequest.price_per_liter || newRequest.price_per_liter <= 0) {
          setSubmitError('Please enter a valid price per liter');
          return;
        }
      }
      
      // Prepare API request data - only send required fields for the API
      let apiRequestData: any = {
        driver_id: newRequest.driver_id,
        car_id: newRequest.car_id,
        request_type: newRequest.request_type
      };
      
      // Add fuel-specific fields only for fuel requests
      if (newRequest.request_type === 'fuel') {
        apiRequestData.liters_requested = newRequest.liters_requested;
        apiRequestData.price_per_liter = newRequest.price_per_liter;
      }
      
      // Submit request to API
      console.log('Submitting request to API:', apiRequestData);
      const response = await driverService.submitRequest(apiRequestData);
      console.log('API response:', response);
      
      // Show success message
      setSubmitSuccess(`Request submitted successfully! Request ID: ${response.request_id}, Status: ${response.status}, Total Cost: ${formatCurrency(response.total_cost)}`);
      
      // Refresh the requests list
      const driverId = 2; // Same as in useEffect
      const apiRequests = await driverService.getDriverRequests(driverId);
      setDriverRequests(apiRequests);
      
      // Reset form
      setNewRequest({
        driver_id: 2,
        car_id: 1,
        request_type: 'fuel',
        liters_requested: 40,
        price_per_liter: 750,
        description: '',
        priority: 'medium',
        location: '',
        estimated_cost: 0
      });
      
      // Close form after a short delay
      setTimeout(() => {
        setShowCreateRequestForm(false);
        setSubmitSuccess(null);
      }, 3000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit request';
      setSubmitError(errorMessage);
      console.error('Error submitting request:', err);
    } finally {
      setIsSubmittingRequest(false);
    }
  };

  const getDriverName = (driverId: number) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getVehicleInfo = (vehicleId: number) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.manufacturer} ${vehicle.model} (${vehicle.plate_number})` : 'Unknown Vehicle';
  };

  const calculateTotalAmount = (request: DriverRequest) => {
    // Use total_cost from API response
    return request.total_cost || 0;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Driver Requests</h1>
          <p className="text-gray-600 mt-2">Manage driver service requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateRequestForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Request
          </button>
        </div>
      </div>

      {/* Error Messages */}
      {requestsError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{requestsError}</p>
          <button
            onClick={() => setRequestsError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {carsError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{carsError}</p>
          <button
            onClick={() => setCarsError(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">{submitSuccess}</p>
          <button
            onClick={() => setSubmitSuccess(null)}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Request Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vehicle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoadingRequests ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-6 h-6 animate-spin text-green-600 mr-2" />
                      <span className="text-gray-600">Loading requests...</span>
                    </div>
                  </td>
                </tr>
              ) : driverRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <Car className="w-12 h-12 text-gray-300 mb-4" />
                      <p className="text-gray-500 text-lg font-medium">No requests found</p>
                      <p className="text-gray-400 text-sm mt-1">Submit your first request to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                driverRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            {getRequestTypeIcon(request.request_type)}
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 capitalize">
                            {request.request_type}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.driver_id ? `Driver ${request.driver_id}` : 'Unknown Driver'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getVehicleInfo(request.car_id)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status?.replace('_', ' ') || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(request.priority)}`}>
                        {request.priority || 'Medium'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(calculateTotalAmount(request))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {request.requested_date ? new Date(request.requested_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-green-600 hover:text-green-900 flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Request Modal */}
      {showCreateRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Request</h2>
            
            {/* Error Message */}
            {submitError && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-3">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-red-700 text-sm">{submitError}</p>
                <button
                  onClick={() => setSubmitError(null)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-3">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <p className="text-green-700 text-sm">{submitSuccess}</p>
                <button
                  onClick={() => setSubmitSuccess(null)}
                  className="ml-auto text-green-500 hover:text-green-700"
                >
                  ×
                </button>
              </div>
            )}
            
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Driver</label>
                  <select
                    value={newRequest.driver_id}
                    onChange={(e) => setNewRequest({ ...newRequest, driver_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name} ({driver.employeeId})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                  <select
                    value={newRequest.car_id}
                    onChange={(e) => setNewRequest({ ...newRequest, car_id: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isLoadingCars}
                  >
                    {isLoadingCars ? (
                      <option value="">Loading vehicles...</option>
                    ) : vehicles.length === 0 ? (
                      <option value="">No vehicles available</option>
                    ) : (
                      vehicles.map((vehicle) => (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.manufacturer} {vehicle.model} ({vehicle.plate_number})
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                  <select
                    value={newRequest.request_type}
                    onChange={(e) => setNewRequest({ ...newRequest, request_type: e.target.value as DriverRequest['request_type'] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="fuel">Fuel</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="inspection">Inspection</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                {/* Fuel specific fields - only show for fuel requests */}
                {newRequest.request_type === 'fuel' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Liters Requested *</label>
                      <input
                        type="number"
                        value={newRequest.liters_requested || ''}
                        onChange={(e) => setNewRequest({ ...newRequest, liters_requested: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter liters needed"
                        required
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Price per Liter (₦) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newRequest.price_per_liter || ''}
                        onChange={(e) => setNewRequest({ ...newRequest, price_per_liter: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter current fuel price"
                        required
                        min="0.01"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-green-800">Total Cost:</span>
                          <span className="text-lg font-bold text-green-600">
                            {formatCurrency((newRequest.liters_requested || 0) * (newRequest.price_per_liter || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateRequestForm(false);
                    setSubmitError(null);
                    setSubmitSuccess(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isSubmittingRequest}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isSubmittingRequest}
                >
                  {isSubmittingRequest && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isSubmittingRequest ? 'Submitting to API...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriversView;