import React, { useState, useEffect } from 'react';
import { Plus, Package, CheckCircle, Clock, AlertTriangle, Building, Wrench, Settings, Users, ArrowRight, ArrowLeft, FileText, Box, Loader2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { storeService, StoreItem as ApiStoreItem, StoreRequest as ApiStoreRequest } from '../../services/storeService';

// Local UI interfaces for compatibility
interface LocalStoreItem {
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

interface LocalItemRequest {
  id: string;
  itemId: string;
  itemName: string;
  itemType: 'consumable' | 'non_consumable';
  quantity: number;
  unit: string;
  purpose: string;
  status: 'pending' | 'approved' | 'issued' | 'returned' | 'rejected';
  requestDate: string;
  approvedDate?: string;
  issuedDate?: string;
  returnDate?: string;
  requestedBy: string;
  department: string;
  approvedBy?: string;
  issuedBy?: string;
  notes?: string;
  expectedReturnDate?: string; // Only for non-consumables
}

const StoreManagerView: React.FC = () => {
  // API state
  const [items, setItems] = useState<LocalStoreItem[]>([]);
  const [requests, setRequests] = useState<LocalItemRequest[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [requestsError, setRequestsError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI state
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [showCreateItemForm, setShowCreateItemForm] = useState(false);
  const [showEditItemForm, setShowEditItemForm] = useState(false);
  const [showCreateRequestForm, setShowCreateRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LocalItemRequest | null>(null);
  const [selectedItem, setSelectedItem] = useState<LocalStoreItem | null>(null);
  const [handoverNotes, setHandoverNotes] = useState('');
  const [returnNotes, setReturnNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');

  // Form state
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    is_consumable: true,
    quantity: 0
  });
  
  const [newRequest, setNewRequest] = useState({
    item_id: 0,
    quantity: 0
  });

  // Fetch data on mount
  useEffect(() => {
    fetchItems();
    fetchRequests();
  }, []);

  const fetchItems = async () => {
    try {
      setIsLoadingItems(true);
      setItemsError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setItemsError('Please log in to view items');
        return;
      }
      
      const apiItems = await storeService.getItems();
      
      // Convert API items to local format
      const localItems: LocalStoreItem[] = apiItems.map(apiItem => ({
        id: apiItem.id?.toString() || '',
        name: apiItem.name,
        description: apiItem.description,
        category: 'other', // Default category since API doesn't have this
        type: apiItem.is_consumable ? 'consumable' : 'non_consumable',
        quantity: apiItem.quantity,
        unit: 'units', // Default unit since API doesn't have this
        unitPrice: 0, // Default price since API doesn't have this
        location: 'Store' // Default location since API doesn't have this
      }));
      
      setItems(localItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load items';
      setItemsError(errorMessage);
      console.error('Error fetching items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const fetchRequests = async () => {
    try {
      setIsLoadingRequests(true);
      setRequestsError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        setRequestsError('Please log in to view requests');
        return;
      }
      
      const apiRequests = await storeService.getRequests();
      
      // Convert API requests to local format
      const localRequests: LocalItemRequest[] = apiRequests.map(apiReq => ({
        id: apiReq.id?.toString() || '',
        itemId: apiReq.item_id.toString(),
        itemName: items.find(item => item.id === apiReq.item_id.toString())?.name || 'Unknown Item',
        itemType: items.find(item => item.id === apiReq.item_id.toString())?.type || 'consumable',
        quantity: apiReq.quantity,
        unit: 'units',
        purpose: 'General use', // Default purpose since API doesn't have this
        status: apiReq.status || 'pending',
        requestDate: apiReq.requested_date || new Date().toISOString().split('T')[0],
        approvedDate: apiReq.approved_date,
        issuedDate: apiReq.issued_date,
        returnDate: apiReq.returned_date,
        requestedBy: apiReq.requested_by || 'Unknown User',
        department: 'General', // Default department since API doesn't have this
        approvedBy: apiReq.approved_by,
        issuedBy: apiReq.issued_by,
        notes: apiReq.notes
      }));
      
      setRequests(localRequests);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load requests';
      setRequestsError(errorMessage);
      console.error('Error fetching requests:', err);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // API integration functions
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.createItem(newItem);
      setSuccessMessage('Item created successfully!');
      setNewItem({ name: '', description: '', is_consumable: true, quantity: 0 });
      setShowCreateItemForm(false);
      fetchItems(); // Refresh items list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setErrorMessage(errorMessage);
      console.error('Error creating item:', err);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.updateItem(parseInt(selectedItem.id), {
        name: newItem.name,
        description: newItem.description,
        is_consumable: newItem.is_consumable,
        quantity: newItem.quantity
      });
      
      setSuccessMessage('Item updated successfully!');
      setShowEditItemForm(false);
      setSelectedItem(null);
      fetchItems(); // Refresh items list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update item';
      setErrorMessage(errorMessage);
      console.error('Error updating item:', err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.deleteItem(parseInt(itemId));
      setSuccessMessage('Item deleted successfully!');
      fetchItems(); // Refresh items list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setErrorMessage(errorMessage);
      console.error('Error deleting item:', err);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.createRequest(newRequest);
      setSuccessMessage('Request created successfully!');
      setNewRequest({ item_id: 0, quantity: 0 });
      setShowCreateRequestForm(false);
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create request';
      setErrorMessage(errorMessage);
      console.error('Error creating request:', err);
    }
  };

  const handleApproveRequest = async (requestId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.approveRequest(parseInt(requestId));
      setSuccessMessage('Request approved successfully!');
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to approve request';
      setErrorMessage(errorMessage);
      console.error('Error approving request:', err);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.rejectRequest(parseInt(requestId));
      setSuccessMessage('Request rejected successfully!');
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reject request';
      setErrorMessage(errorMessage);
      console.error('Error rejecting request:', err);
    }
  };

  const handleIssueRequest = async (requestId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.issueRequest(parseInt(requestId));
      setSuccessMessage('Item issued successfully!');
      fetchRequests(); // Refresh requests list
      fetchItems(); // Refresh items list to update quantities
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to issue item';
      setErrorMessage(errorMessage);
      console.error('Error issuing item:', err);
    }
  };

  const handleReturnRequest = async (requestId: string) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.returnRequest(parseInt(requestId));
      setSuccessMessage('Item returned successfully!');
      fetchRequests(); // Refresh requests list
      fetchItems(); // Refresh items list to update quantities
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to return item';
      setErrorMessage(errorMessage);
      console.error('Error returning item:', err);
    }
  };

  const getItemTypeIcon = (type: LocalStoreItem['type']) => {
    switch (type) {
      case 'consumable':
        return <Package className="w-4 h-4 text-orange-600" />;
      case 'non_consumable':
        return <Box className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: LocalItemRequest['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'issued':
        return <ArrowRight className="w-4 h-4 text-blue-600" />;
      case 'returned':
        return <ArrowLeft className="w-4 h-4 text-purple-600" />;
      case 'rejected':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: LocalItemRequest['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'issued':
        return 'bg-blue-100 text-blue-800';
      case 'returned':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryLabel = (category: LocalStoreItem['category']) => {
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

  const getItemTypeLabel = (type: LocalStoreItem['type']) => {
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

  const confirmHandover = async () => {
    if (!selectedRequest) return;
    
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.issueRequest(parseInt(selectedRequest.id));
      setSuccessMessage('Item issued successfully!');

    setShowHandoverForm(false);
    setSelectedRequest(null);
    setHandoverNotes('');
      
      // Refresh data
      fetchRequests();
      fetchItems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to issue item';
      setErrorMessage(errorMessage);
      console.error('Error issuing item:', err);
    }
  };

  const confirmReturn = async () => {
    if (!selectedRequest) return;
    
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.returnRequest(parseInt(selectedRequest.id));
      setSuccessMessage('Item returned successfully!');

    setShowReturnForm(false);
    setSelectedRequest(null);
    setReturnNotes('');
      
      // Refresh data
      fetchRequests();
      fetchItems();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to return item';
      setErrorMessage(errorMessage);
      console.error('Error returning item:', err);
    }
  };

  const approvedRequests = requests.filter(r => r.status === 'approved');
  const issuedRequests = requests.filter(r => r.status === 'issued' && r.itemType === 'non_consumable');
  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Manager Portal</h1>
          <p className="text-gray-600 mt-2">Manage inventory and item requests</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateItemForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
          <button
            onClick={() => setShowCreateRequestForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Create Request
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{errorMessage}</p>
          <button
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
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
              <p className="text-sm font-medium text-gray-600">Issued</p>
              <p className="text-2xl font-bold text-blue-600">{issuedRequests.length}</p>
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
            {isLoadingItems ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-green-600" />
                  <span className="text-gray-600">Loading items...</span>
                </div>
              </div>
            ) : itemsError ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-600">{itemsError}</span>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No items found</p>
                <p className="text-gray-400 text-xs mt-1">Add your first item to get started</p>
              </div>
            ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(item);
                            setNewItem({
                              name: item.name,
                              description: item.description,
                              is_consumable: item.type === 'consumable',
                              quantity: item.quantity
                            });
                            setShowEditItemForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md text-xs font-medium transition-colors"
                        >
                          <Edit className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md text-xs font-medium transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
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
                      {request.issuedDate && <div>Issued: {request.issuedDate}</div>}
                      {request.returnDate && <div>Returned: {request.returnDate}</div>}
                      {request.expectedReturnDate && (
                        <div className="text-blue-600">Expected: {request.expectedReturnDate}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApproveRequest(request.id)}
                              className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectRequest(request.id)}
                              className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => handleIssueRequest(request.id)}
                            className="text-green-600 hover:text-green-900 bg-green-50 hover:bg-green-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Issue
                          </button>
                        )}
                        {request.status === 'issued' && request.itemType === 'non_consumable' && (
                          <button
                            onClick={() => handleReturnRequest(request.id)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Mark Returned
                          </button>
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

      {/* Create Item Modal */}
      {showCreateItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Add New Item</h2>
            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter item description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newItem.is_consumable ? 'consumable' : 'non_consumable'}
                  onChange={(e) => setNewItem({ ...newItem, is_consumable: e.target.value === 'consumable' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="consumable">Consumable</option>
                  <option value="non_consumable">Non-Consumable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateItemForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Item Modal */}
      {showEditItemForm && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Edit Item</h2>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter item name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Enter item description"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newItem.is_consumable ? 'consumable' : 'non_consumable'}
                  onChange={(e) => setNewItem({ ...newItem, is_consumable: e.target.value === 'consumable' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="consumable">Consumable</option>
                  <option value="non_consumable">Non-Consumable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  required
                  min="0"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditItemForm(false);
                    setSelectedItem(null);
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Request Modal */}
      {showCreateRequestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Request</h2>
            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item</label>
                <select
                  value={newRequest.item_id}
                  onChange={(e) => setNewRequest({ ...newRequest, item_id: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value={0}>Select an item</option>
                  {items.map((item) => (
                    <option key={item.id} value={parseInt(item.id)}>
                      {item.name} ({item.type})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newRequest.quantity}
                  onChange={(e) => setNewRequest({ ...newRequest, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter quantity"
                  required
                  min="1"
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagerView;
