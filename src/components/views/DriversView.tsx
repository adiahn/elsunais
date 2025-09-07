import React, { useState } from 'react';
import { Plus, Car, User, Wrench, Fuel, AlertTriangle, CheckCircle, XCircle, Clock as ClockIcon } from 'lucide-react';

interface Vehicle {
  id: string;
  licensePlate: string;
  make: string;
  model: string;
  year: number;
  type: 'sedan' | 'suv' | 'truck' | 'van' | 'motorcycle';
  assignedDriver?: string; // Driver ID
}

interface Driver {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  email: string;
  licenseNumber: string;
  licenseExpiry: string;
  assignedVehicle?: string; // Vehicle ID
  isActive: boolean;
}

interface DriverRequest {
  id: string;
  driverId: string;
  vehicleId: string;
  requestType: 'maintenance' | 'fueling' | 'repair' | 'inspection' | 'other';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
  requestedDate: string;
  estimatedCost?: number;
  location?: string;
  attachments?: string[];
  // Fueling specific fields
  litresRequested?: number;
  pricePerLitre?: number;
  totalFuelCost?: number;
  // Vehicle change justification
  vehicleChangeReason?: string;
}

const DriversView: React.FC = () => {
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: '1',
      name: 'Yusuf Abdullahi',
      employeeId: 'EMP001',
      phone: '+234-801-234-5678',
      email: 'yusuf.abdullahi@company.com',
      licenseNumber: 'DL123456789',
      licenseExpiry: '2025-12-31',
      assignedVehicle: '1',
      isActive: true
    },
    {
      id: '2',
      name: 'Aisha Ibrahim',
      employeeId: 'EMP002',
      phone: '+234-802-345-6789',
      email: 'aisha.ibrahim@company.com',
      licenseNumber: 'DL987654321',
      licenseExpiry: '2026-06-15',
      assignedVehicle: '2',
      isActive: true
    },
    {
      id: '3',
      name: 'Ibrahim Sani',
      employeeId: 'EMP003',
      phone: '+234-803-456-7890',
      email: 'ibrahim.sani@company.com',
      licenseNumber: 'DL456789123',
      licenseExpiry: '2025-09-20',
      isActive: true
    }
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: '1',
      licensePlate: 'ABC-123',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
      type: 'sedan',
      assignedDriver: '1'
    },
    {
      id: '2',
      licensePlate: 'XYZ-789',
      make: 'Ford',
      model: 'Explorer',
      year: 2021,
      type: 'suv',
      assignedDriver: '2'
    },
    {
      id: '3',
      licensePlate: 'DEF-456',
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2020,
      type: 'truck'
    }
  ]);

  const [driverRequests, setDriverRequests] = useState<DriverRequest[]>([
    {
      id: '1',
      driverId: '1',
      vehicleId: '1',
      requestType: 'maintenance',
      description: 'Oil change and filter replacement',
      priority: 'medium',
      status: 'pending',
      requestedDate: '2025-01-20',
      estimatedCost: 75,
      location: 'Main Garage',
      odometerReading: 45000
    },
    {
      id: '2',
      driverId: '2',
      vehicleId: '2',
      requestType: 'fueling',
      description: 'Fuel tank refill',
      priority: 'high',
      status: 'approved',
      requestedDate: '2025-01-19',
      location: 'Gas Station - Main St',
      odometerReading: 32000,
      litresRequested: 50,
      pricePerLitre: 2.50,
      totalFuelCost: 125
    },
    {
      id: '3',
      driverId: '1',
      vehicleId: '3',
      requestType: 'repair',
      description: 'Brake pad replacement needed',
      priority: 'urgent',
      status: 'in_progress',
      requestedDate: '2025-01-18',
      estimatedCost: 200,
      location: 'Auto Repair Shop',
      odometerReading: 28000
    }
  ]);

  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<DriverRequest | null>(null);
  const [showCreateRequestForm, setShowCreateRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState<Omit<DriverRequest, 'id'>>({
    driverId: '1', // Default to first driver
    vehicleId: '1', // Default to first driver's assigned vehicle
    requestType: 'maintenance',
    description: '',
    priority: 'medium',
    status: 'pending',
    requestedDate: new Date().toISOString().split('T')[0],
    odometerReading: 0,
    litresRequested: 0,
    pricePerLitre: 0,
    totalFuelCost: 0,
    vehicleChangeReason: ''
  });

  const getRequestTypeIcon = (type: DriverRequest['requestType']) => {
    switch (type) {
      case 'maintenance':
        return <Wrench className="w-4 h-4 text-blue-600" />;
      case 'fueling':
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

  const getPriorityColor = (priority: DriverRequest['priority']) => {
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

  const getStatusColor = (status: DriverRequest['status']) => {
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

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total fuel cost if it's a fueling request
    let totalFuelCost = 0;
    if (newRequest.requestType === 'fueling' && newRequest.litresRequested && newRequest.pricePerLitre) {
      totalFuelCost = newRequest.litresRequested * newRequest.pricePerLitre;
    }
    
    const request: DriverRequest = {
      ...newRequest,
      id: Date.now().toString(),
      driverId: '1', // Default to first driver (in real app, this would be the logged-in driver)
      totalFuelCost: newRequest.requestType === 'fueling' ? totalFuelCost : undefined
    };
    
    setDriverRequests([...driverRequests, request]);
    setNewRequest({
      driverId: '1',
      vehicleId: '1',
      requestType: 'maintenance',
      description: '',
      priority: 'medium',
      status: 'pending',
      requestedDate: new Date().toISOString().split('T')[0],
      odometerReading: 0,
      litresRequested: 0,
      pricePerLitre: 0,
      totalFuelCost: 0,
      vehicleChangeReason: ''
    });
    setShowCreateRequestForm(false);
  };

  const getDriverName = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : 'Unknown Driver';
  };

  const getVehicleInfo = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    return vehicle ? `${vehicle.make} ${vehicle.model} (${vehicle.licensePlate})` : 'Unknown Vehicle';
  };

  const getDriverAssignedVehicle = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    return driver?.assignedVehicle || '';
  };

  const isVehicleChanged = (selectedVehicleId: string, driverId: string) => {
    const assignedVehicle = getDriverAssignedVehicle(driverId);
    return selectedVehicleId !== assignedVehicle;
  };

  return (
    <div className="p-8">
             {/* Header */}
       <div className="flex items-center justify-between mb-8">
         <div>
           <h1 className="text-3xl font-bold text-gray-900">Driver Portal</h1>
           <p className="text-gray-600 mt-2">Submit service requests for your vehicle</p>
         </div>
         <div className="flex items-center space-x-3">
           <button
             onClick={() => setShowCreateRequestForm(true)}
             className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
           >
             <Plus className="w-4 h-4" />
             Submit Request
           </button>
         </div>
       </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                 {/* My Requests List */}
         <div className="lg:col-span-1">
           <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
             <h2 className="text-lg font-semibold text-gray-900 mb-4">My Requests</h2>
             <div className="space-y-3">
               {driverRequests.map((request) => (
                 <div
                   key={request.id}
                   onClick={() => setSelectedRequest(request)}
                   className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                     selectedRequest?.id === request.id
                       ? 'border-green-500 bg-green-50'
                       : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                   }`}
                 >
                   <div className="flex items-center space-x-3">
                     <div className="flex-shrink-0">
                       <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                         {getRequestTypeIcon(request.requestType)}
                       </div>
                     </div>
                     <div className="flex-1 min-w-0">
                       <p className="text-sm font-medium text-gray-900 truncate capitalize">
                         {request.requestType}
                       </p>
                       <p className="text-sm text-gray-500 truncate">
                         {getVehicleInfo(request.vehicleId)}
                       </p>
                       <p className="text-xs text-gray-400">
                         {request.requestedDate}
                       </p>
                     </div>
                     <div className="flex-shrink-0">
                       <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                         {request.status.replace('_', ' ')}
                       </span>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>

                 {/* Main Content */}
         <div className="lg:col-span-2">
           {selectedRequest ? (
             <div className="space-y-6">
               {/* Request Details */}
               <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                 <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Details</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Request Type</h3>
                     <p className="text-lg font-semibold text-gray-800 capitalize">{selectedRequest.requestType}</p>
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Vehicle</h3>
                     <p className="text-lg text-gray-800">{getVehicleInfo(selectedRequest.vehicleId)}</p>
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Status</h3>
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedRequest.status)}`}>
                       {selectedRequest.status.replace('_', ' ')}
                     </span>
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Priority</h3>
                     <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(selectedRequest.priority)}`}>
                       {selectedRequest.priority}
                     </span>
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Requested Date</h3>
                     <p className="text-lg text-gray-800">{selectedRequest.requestedDate}</p>
                   </div>
                   <div>
                     <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Location</h3>
                     <p className="text-lg text-gray-800">{selectedRequest.location}</p>
                   </div>
                   {selectedRequest.odometerReading && (
                     <div>
                       <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Odometer Reading</h3>
                       <p className="text-lg text-gray-800">{selectedRequest.odometerReading.toLocaleString()} km</p>
                     </div>
                   )}
                   {selectedRequest.estimatedCost && (
                     <div>
                       <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Estimated Cost</h3>
                       <p className="text-lg text-gray-800">${selectedRequest.estimatedCost}</p>
                     </div>
                   )}
                   {selectedRequest.requestType === 'fueling' && selectedRequest.litresRequested && (
                     <>
                       <div>
                         <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Litres Requested</h3>
                         <p className="text-lg text-gray-800">{selectedRequest.litresRequested} L</p>
                       </div>
                       <div>
                         <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Price per Litre</h3>
                         <p className="text-lg text-gray-800">${selectedRequest.pricePerLitre}</p>
                       </div>
                       <div>
                         <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Total Cost</h3>
                         <p className="text-lg font-bold text-green-600">${selectedRequest.totalFuelCost}</p>
                       </div>
                     </>
                   )}
                   {selectedRequest.vehicleChangeReason && (
                     <div className="md:col-span-2">
                       <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Vehicle Change Reason</h3>
                       <p className="text-lg text-gray-800">{selectedRequest.vehicleChangeReason}</p>
                     </div>
                   )}
                 </div>
                 <div className="mt-6">
                   <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                   <p className="text-gray-800">{selectedRequest.description}</p>
                 </div>
               </div>
             </div>
           ) : (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
               <div className="text-center py-12">
                 <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                 <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Request</h3>
                 <p className="text-gray-500">Choose a request from the list to view its details.</p>
               </div>
             </div>
           )}
         </div>
      </div>

      {/* Create Request Modal */}
      {showCreateRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
                         <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit Service Request</h2>
             <form onSubmit={handleCreateRequest} className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle</label>
                   <select
                     value={newRequest.vehicleId}
                     onChange={(e) => setNewRequest({ ...newRequest, vehicleId: e.target.value })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     required
                   >
                     {vehicles.map((vehicle) => (
                       <option key={vehicle.id} value={vehicle.id}>
                         {vehicle.make} {vehicle.model} ({vehicle.licensePlate})
                         {vehicle.id === getDriverAssignedVehicle(newRequest.driverId) ? ' (Assigned)' : ''}
                       </option>
                     ))}
                   </select>
                 </div>
                 
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Request Type</label>
                   <select
                     value={newRequest.requestType}
                     onChange={(e) => setNewRequest({ ...newRequest, requestType: e.target.value as DriverRequest['requestType'] })}
                     className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                     required
                   >
                     <option value="maintenance">Maintenance</option>
                     <option value="fueling">Fueling</option>
                     <option value="repair">Repair</option>
                     <option value="inspection">Inspection</option>
                     <option value="other">Other</option>
                   </select>
                 </div>
                 
                 {/* Vehicle change reason - only show if vehicle is different from assigned */}
                 {isVehicleChanged(newRequest.vehicleId, newRequest.driverId) && (
                   <div className="md:col-span-2">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Why are you using a different vehicle?</label>
                     <input
                       type="text"
                       value={newRequest.vehicleChangeReason || ''}
                       onChange={(e) => setNewRequest({ ...newRequest, vehicleChangeReason: e.target.value })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="Explain why you're using a different vehicle"
                       required
                     />
                   </div>
                 )}
                 
                 {/* Fueling specific fields */}
                 {newRequest.requestType === 'fueling' && (
                   <>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Litres Requested</label>
                       <input
                         type="number"
                         value={newRequest.litresRequested || ''}
                         onChange={(e) => {
                           const litres = Number(e.target.value);
                           const price = newRequest.pricePerLitre || 0;
                           setNewRequest({ 
                             ...newRequest, 
                             litresRequested: litres,
                             totalFuelCost: litres * price
                           });
                         }}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                         placeholder="Enter litres needed"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-2">Price per Litre ($)</label>
                       <input
                         type="number"
                         step="0.01"
                         value={newRequest.pricePerLitre || ''}
                         onChange={(e) => {
                           const price = Number(e.target.value);
                           const litres = newRequest.litresRequested || 0;
                           setNewRequest({ 
                             ...newRequest, 
                             pricePerLitre: price,
                             totalFuelCost: litres * price
                           });
                         }}
                         className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                         placeholder="Enter current fuel price"
                         required
                       />
                     </div>
                     <div className="md:col-span-2">
                       <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                         <div className="flex items-center justify-between">
                           <span className="text-sm font-medium text-green-800">Total Cost:</span>
                           <span className="text-lg font-bold text-green-600">
                             ${newRequest.totalFuelCost?.toFixed(2) || '0.00'}
                           </span>
                         </div>
                       </div>
                     </div>
                   </>
                 )}
                 
                 {/* Location - only required for fueling and repair */}
                 {(newRequest.requestType === 'fueling' || newRequest.requestType === 'repair') && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                     <input
                       type="text"
                       value={newRequest.location || ''}
                       onChange={(e) => setNewRequest({ ...newRequest, location: e.target.value })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="Enter location"
                       required
                     />
                   </div>
                 )}
                 
                 
                 {/* Priority - only for repair and other */}
                 {(newRequest.requestType === 'repair' || newRequest.requestType === 'other') && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                     <select
                       value={newRequest.priority}
                       onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as DriverRequest['priority'] })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       required
                     >
                       <option value="low">Low</option>
                       <option value="medium">Medium</option>
                       <option value="high">High</option>
                       <option value="urgent">Urgent</option>
                     </select>
                   </div>
                 )}
                 
                 {/* Estimated cost - only for repair */}
                 {newRequest.requestType === 'repair' && (
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">Estimated Cost ($)</label>
                     <input
                       type="number"
                       value={newRequest.estimatedCost || ''}
                       onChange={(e) => setNewRequest({ ...newRequest, estimatedCost: Number(e.target.value) })}
                       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                       placeholder="Enter estimated cost"
                     />
                   </div>
                 )}
               </div>
               
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                 <textarea
                   value={newRequest.description}
                   onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                   rows={3}
                   placeholder={
                     newRequest.requestType === 'maintenance' ? 'Describe the maintenance needed (e.g., oil change, tire rotation)' :
                     newRequest.requestType === 'fueling' ? 'Describe fueling details (e.g., fuel type, station name)' :
                     newRequest.requestType === 'repair' ? 'Describe the repair needed and symptoms' :
                     newRequest.requestType === 'inspection' ? 'Describe what needs to be inspected' :
                     'Describe the request'
                   }
                   required
                 />
               </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateRequestForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                                 <button
                   type="submit"
                   className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                 >
                   Submit Request
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
