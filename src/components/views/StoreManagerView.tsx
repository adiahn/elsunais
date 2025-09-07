import React, { useState } from 'react';
import { Plus, Package, CheckCircle, Clock, AlertTriangle, Building, Wrench, Settings, Users, ArrowRight, ArrowLeft, FileText, Box } from 'lucide-react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  category: 'office_supplies' | 'equipment' | 'tools' | 'electronics' | 'furniture' | 'other';
  type: 'consumable' | 'non_consumable';
  quantity: number;
  unit: string;
  unitPrice: number;
  supplier?: string;
  location: string;
}

interface ItemRequest {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'consumable' | 'non_consumable';
  quantity: number;
  unit: string;
  purpose: string;
  status: 'pending' | 'approved' | 'handed_over' | 'returned' | 'rejected';
  requestDate: string;
  approvedDate?: string;
  handoverDate?: string;
  returnDate?: string;
  requestedBy: string;
  department: string;
  approvedBy?: string;
  handedOverBy?: string;
  notes?: string;
  expectedReturnDate?: string; // Only for non-consumables
}

const StoreManagerView: React.FC = () => {
  const [items, setItems] = useState<StoreItem[]>([
    {
      id: '1',
      name: 'A4 Paper',
      description: 'White A4 printing paper',
      category: 'office_supplies',
      type: 'consumable',
      quantity: 50,
      unit: 'reams',
      unitPrice: 15.00,
      supplier: 'Paper Co.',
      location: 'Shelf A1'
    },
    {
      id: '2',
      name: 'Laptop',
      description: 'Dell Latitude 5520',
      category: 'electronics',
      type: 'non_consumable',
      quantity: 5,
      unit: 'units',
      unitPrice: 1200.00,
      supplier: 'Dell Inc.',
      location: 'Storage Room B'
    },
    {
      id: '3',
      name: 'Pen Set',
      description: 'Blue ink ballpoint pens',
      category: 'office_supplies',
      type: 'consumable',
      quantity: 200,
      unit: 'pieces',
      unitPrice: 0.50,
      supplier: 'Office Depot',
      location: 'Shelf A2'
    },
    {
      id: '4',
      name: 'Projector',
      description: 'Epson PowerLite 1781W',
      category: 'electronics',
      type: 'non_consumable',
      quantity: 3,
      unit: 'units',
      unitPrice: 800.00,
      supplier: 'Epson',
      location: 'Storage Room A'
    }
  ]);

  const [requests, setRequests] = useState<ItemRequest[]>([
    {
      id: '1',
      itemId: '1',
      itemName: 'A4 Paper',
      itemType: 'consumable',
      quantity: 5,
      unit: 'reams',
      purpose: 'Office printing needs',
      status: 'approved',
      requestDate: '2025-01-20',
      approvedDate: '2025-01-21',
      requestedBy: 'Aisha Ibrahim',
      department: 'Administration',
      approvedBy: 'Adnan Mukhtar'
    },
    {
      id: '2',
      itemId: '2',
      itemName: 'Laptop',
      itemType: 'non_consumable',
      quantity: 1,
      unit: 'unit',
      purpose: 'Field work assignment',
      status: 'handed_over',
      requestDate: '2025-01-18',
      approvedDate: '2025-01-19',
      handoverDate: '2025-01-20',
      requestedBy: 'Yusuf Abdullahi',
      department: 'Field Operations',
      approvedBy: 'Adnan Mukhtar',
      handedOverBy: 'Store Manager',
      expectedReturnDate: '2025-02-20'
    },
    {
      id: '3',
      itemId: '3',
      itemName: 'Pen Set',
      itemType: 'consumable',
      quantity: 20,
      unit: 'pieces',
      purpose: 'Office stationery',
      status: 'pending',
      requestDate: '2025-01-22',
      requestedBy: 'Fatima Usman',
      department: 'HR'
    },
    {
      id: '4',
      itemId: '4',
      itemName: 'Projector',
      itemType: 'non_consumable',
      quantity: 1,
      unit: 'unit',
      purpose: 'Training session',
      status: 'returned',
      requestDate: '2025-01-10',
      approvedDate: '2025-01-11',
      handoverDate: '2025-01-12',
      returnDate: '2025-01-15',
      requestedBy: 'Zainab Hassan',
      department: 'Training',
      approvedBy: 'Adnan Mukhtar',
      handedOverBy: 'Store Manager',
      expectedReturnDate: '2025-01-20'
    }
  ]);

  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ItemRequest | null>(null);
  const [handoverNotes, setHandoverNotes] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');

  const getItemTypeIcon = (type: StoreItem['type']) => {
    switch (type) {
      case 'consumable':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'non_consumable':
        return <Box className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: ItemRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'handed_over':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
      case 'returned':
        return <ArrowLeft className="w-4 h-4 text-purple-600" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: ItemRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'handed_over':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: StoreItem['category']) => {
    switch (category) {
      case 'office_supplies':
        return 'Office Supplies';
      case 'equipment':
        return 'Equipment';
      case 'tools':
        return 'Tools';
      case 'electronics':
        return 'Electronics';
      case 'furniture':
        return 'Furniture';
      case 'other':
        return 'Other';
      default:
        return 'Other';
    }
  };

  const getItemTypeLabel = (type: StoreItem['type']) => {
    switch (type) {
      case 'consumable':
        return 'Consumable';
      case 'non_consumable':
        return 'Non-Consumable';
      default:
        return 'Unknown';
    }
  };

  const handleHandover = (requestId: string) => {
    setSelectedRequest(requests.find(r => r.id === requestId) || null);
    setShowHandoverForm(true);
    setHandoverNotes('');
  };

  const handleReturn = (requestId: string) => {
    setSelectedRequest(requests.find(r => r.id === requestId) || null);
    setShowReturnForm(true);
    setReturnNotes('');
  };

  const confirmHandover = () => {
    if (!selectedRequest) return;
    
    setRequests(requests.map(request => 
      request.id === selectedRequest.id 
        ? { 
            ...request, 
            status: 'handed_over', 
            handoverDate: new Date().toISOString().split('T')[0],
            handedOverBy: 'Store Manager',
            notes: handoverNotes
          }
        : request
    ));

    // Update item quantity
    setItems(items.map(item => 
      item.id === selectedRequest.itemId 
        ? { ...item, quantity: item.quantity - selectedRequest.quantity }
        : item
    ));

    setShowHandoverForm(false);
    setSelectedRequest(null);
    setHandoverNotes('');
  };

  const confirmReturn = () => {
    if (!selectedRequest) return;
    
    setRequests(requests.map(request => 
      request.id === selectedRequest.id 
        ? { 
            ...request, 
            status: 'returned', 
            returnDate: new Date().toISOString().split('T')[0],
            notes: returnNotes
          }
        : request
    ));

    // Update item quantity
    setItems(items.map(item => 
      item.id === selectedRequest.itemId 
        ? { ...item, quantity: item.quantity + selectedRequest.quantity }
        : item
    ));

    setShowReturnForm(false);
    setSelectedRequest(null);
    setReturnNotes('');
  };

  const approvedRequests = requests.filter(r => r.status === 'approved');
  const handedOverRequests = requests.filter(r => r.status === 'handed_over' && r.itemType === 'non_consumable');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Manager Portal</h1>
          <p className="text-gray-600 mt-2">Manage inventory and item requests</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Requests</p>
              <p className="text-2xl font-bold text-yellow-600">{pendingRequests.length}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved (Ready)</p>
              <p className="text-2xl font-bold text-green-600">{approvedRequests.length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Handed Over</p>
              <p className="text-2xl font-bold text-blue-600">{handedOverRequests.length}</p>
            </div>
            <ArrowRight className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-purple-600">{items.length}</p>
            </div>
            <Package className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'inventory'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>All Inventory</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'requests'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4" />
                <span>All Item Requests</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Inventory Overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getItemTypeIcon(item.type)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{item.name}</div>
                          <div className="text-sm text-gray-500">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'consumable' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getItemTypeLabel(item.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getCategoryLabel(item.category)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity} {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${item.unitPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.location}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Item Requests</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getItemTypeIcon(request.itemType)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{request.itemName}</div>
                          <div className="text-sm text-gray-500">ID: {request.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        request.itemType === 'consumable' 
                          ? 'bg-orange-100 text-orange-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {getItemTypeLabel(request.itemType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.quantity} {request.unit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{request.requestedBy}</div>
                      <div className="text-sm text-gray-500">{request.department}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{request.purpose}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1">{request.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>Requested: {request.requestDate}</div>
                      {request.approvedDate && <div>Approved: {request.approvedDate}</div>}
                      {request.handoverDate && <div>Handed: {request.handoverDate}</div>}
                      {request.returnDate && <div>Returned: {request.returnDate}</div>}
                      {request.expectedReturnDate && (
                        <div className="text-blue-600">Expected: {request.expectedReturnDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleHandover(request.id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Hand Over
                          </button>
                        )}
                        {request.status === 'handed_over' && request.itemType === 'non_consumable' && (
                          <button
                            onClick={() => handleReturn(request.id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Mark Returned
                          </button>
                        )}
                        {request.status === 'pending' && (
                          <span className="text-gray-400 text-xs">Awaiting Approval</span>
                        )}
                        {request.status === 'returned' && (
                          <span className="text-purple-600 text-xs">Completed</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {requests.length === 0 && (
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No requests</h3>
                <p className="mt-1 text-sm text-gray-500">No item requests found.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Handover Modal */}
      {showHandoverForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Hand Over Item</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{selectedRequest.itemName}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedRequest.purpose}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Quantity: {selectedRequest.quantity} {selectedRequest.unit}</span>
                <span className="text-sm text-gray-500">Type: {getItemTypeLabel(selectedRequest.itemType)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Handover Notes (Optional)</label>
              <textarea
                value={handoverNotes}
                onChange={(e) => setHandoverNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Add any notes about the handover"
              />
            </div>

                         {selectedRequest.itemType === 'non_consumable' ? (
               <div className="mb-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                 <p className="text-sm text-blue-800">
                   <strong>Note:</strong> This is a non-consumable item. The recipient is expected to return it.
                 </p>
               </div>
             ) : (
               <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                 <p className="text-sm text-orange-800">
                   <strong>Note:</strong> This is a consumable item. No return is expected.
                 </p>
               </div>
             )}

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowHandoverForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmHandover}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Confirm Handover
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Mark Item as Returned</h2>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{selectedRequest.itemName}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedRequest.purpose}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Quantity: {selectedRequest.quantity} {selectedRequest.unit}</span>
                <span className="text-sm text-gray-500">Returned by: {selectedRequest.requestedBy}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Return Notes (Optional)</label>
              <textarea
                value={returnNotes}
                onChange={(e) => setReturnNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Add any notes about the return"
              />
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowReturnForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReturn}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Confirm Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagerView;
