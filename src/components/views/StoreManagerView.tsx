import React, { useState, useEffect } from 'react';
import { Plus, Package, CheckCircle, Clock, AlertTriangle, ArrowRight, ArrowLeft, FileText, Box, Loader2, AlertCircle, Edit, Trash2 } from 'lucide-react';
import { storeService } from '../../services/storeService';

// Local UI interfaces for compatibility
interface LocalStoreItem {
  id: string;
  name: string;
  description: string;
  category: 'office_supplies' | 'equipment' | 'tools' | 'electronics' | 'furniture' | 'other';
  type: 'consumable' | 'non_consumable';
  quantity: number;
  unit: string;
  supplier?: string;
  location: string;
  created_by_id?: number;
  date_created?: string;
  date_updated?: string;
  store_id?: number;
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
  canReturn?: boolean; // Can this request be returned?
}

const StoreManagerView: React.FC = () => {
  // API state
  const [items, setItems] = useState<LocalStoreItem[]>([]);
  const [requests, setRequests] = useState<LocalItemRequest[]>([]);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);
  const [isDeletingItem, setIsDeletingItem] = useState(false);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // UI state
  const [showCreateItemForm, setShowCreateItemForm] = useState(false);
  const [showEditItemForm, setShowEditItemForm] = useState(false);
  const [showCreateRequestForm, setShowCreateRequestForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<LocalItemRequest | null>(null);
  const [selectedItem, setSelectedItem] = useState<LocalStoreItem | null>(null);
  const [returnNotes, setReturnNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');

  // Form state
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    item_type: 'consumable' as 'consumable' | 'non-consumable',
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
      console.log('Auth token:', token ? 'Present' : 'Missing');
      if (!token) {
        setItemsError('Please log in to view items');
        return;
      }
      
      console.log('Attempting to fetch store items...');
      const apiItems = await storeService.getItems();
      
      // Convert API items to local format
      const localItems: LocalStoreItem[] = apiItems.map(apiItem => ({
        id: apiItem.id?.toString() || '',
        name: apiItem.name,
        description: apiItem.description,
        category: 'other', // Default category since API doesn't have this
        type: apiItem.item_type === 'consumable' ? 'consumable' : 'non_consumable',
        quantity: apiItem.quantity,
        unit: 'units', // Default unit since API doesn't have this
        location: 'Store', // Default location since API doesn't have this
        created_by_id: apiItem.created_by_id,
        date_created: apiItem.date_created,
        date_updated: apiItem.date_updated,
        store_id: apiItem.store_id
      }));
      
      setItems(localItems);
      console.log('Successfully fetched items:', localItems);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load items';
      setItemsError(errorMessage);
      console.error('Error fetching items:', err);
      
      // Log detailed error information
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as any;
        console.error('Error status:', axiosError.response?.status);
        console.error('Error data:', axiosError.response?.data);
        console.error('Error headers:', axiosError.response?.headers);
      }
    } finally {
      setIsLoadingItems(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setErrorMessage('Please log in to view requests');
        return;
      }
      
      const apiRequests = await storeService.getRequests();
      
      // Convert API requests to local format
      const localRequests: LocalItemRequest[] = apiRequests.map(apiReq => {
        const itemType = items.find(item => item.id === apiReq.item_id.toString())?.type || 'consumable';
        
        // For consumables: auto-approve, for non-consumables: need approval
        let status = apiReq.status || 'pending';
        if (itemType === 'consumable' && status === 'pending') {
          status = 'approved'; // Auto-approve consumables
        }
        
        const canReturn = itemType === 'non_consumable' && (status === 'issued' || status === 'approved');
        
        return {
          id: apiReq.id?.toString() || '',
          itemId: apiReq.item_id.toString(),
          itemName: items.find(item => item.id === apiReq.item_id.toString())?.name || 'Unknown Item',
          itemType: itemType,
          quantity: apiReq.quantity,
          unit: 'units',
          purpose: 'General use', // Default purpose since API doesn't have this
          status: status,
          requestDate: apiReq.requested_date || new Date().toISOString().split('T')[0],
          approvedDate: itemType === 'consumable' ? (apiReq.requested_date || new Date().toISOString().split('T')[0]) : apiReq.approved_date,
          issuedDate: apiReq.issued_date,
          returnDate: apiReq.returned_date,
          requestedBy: apiReq.requested_by || 'Unknown User',
          department: 'General', // Default department since API doesn't have this
          approvedBy: itemType === 'consumable' ? 'System' : apiReq.approved_by,
          issuedBy: apiReq.issued_by,
          notes: apiReq.notes,
          expectedReturnDate: undefined, // API doesn't provide this field yet
          canReturn: canReturn
        };
      });
      
      setRequests(localRequests);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load requests';
      setErrorMessage(errorMessage);
      console.error('Error fetching requests:', err);
    }
  };

  // API integration functions
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsCreatingItem(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.createItem(newItem);
      setSuccessMessage('Item created successfully!');
      setNewItem({ name: '', description: '', item_type: 'consumable', quantity: 0 });
      setShowCreateItemForm(false);
      fetchItems(); // Refresh items list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create item';
      setErrorMessage(errorMessage);
      console.error('Error creating item:', err);
    } finally {
      setIsCreatingItem(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;
    
    try {
      setIsUpdatingItem(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.updateItem(parseInt(selectedItem.id), {
        name: newItem.name,
        description: newItem.description,
        item_type: newItem.item_type,
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
    } finally {
      setIsUpdatingItem(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      setIsDeletingItem(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.deleteItem(parseInt(itemId));
      setSuccessMessage('Item deleted successfully!');
      fetchItems(); // Refresh items list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete item';
      setErrorMessage(errorMessage);
      console.error('Error deleting item:', err);
    } finally {
      setIsDeletingItem(false);
    }
  };

  const handleReturnItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await storeService.returnItem(parseInt(selectedRequest.id), returnNotes);
      
      setSuccessMessage('Item return recorded successfully!');
      setShowReturnForm(false);
      setSelectedRequest(null);
      setReturnNotes('');
      fetchRequests(); // Refresh requests list
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to return item';
      setErrorMessage(errorMessage);
      console.error('Error returning item:', err);
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
                            item_type: item.type === 'consumable' ? 'consumable' : 'non-consumable',
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
                          className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-2 py-1 rounded-md text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                          disabled={isDeletingItem}
                        >
                          {isDeletingItem ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
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
                        {request.canReturn && (
                          <button
                            onClick={() => {
                              setSelectedRequest(request);
                              setShowReturnForm(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md text-xs font-medium transition-colors"
                          >
                            Return Item
                          </button>
                        )}
                        {request.status === 'returned' && (
                          <span className="text-purple-600 text-xs">Returned</span>
                        )}
                        {request.status === 'rejected' && (
                          <span className="text-red-600 text-xs">Rejected</span>
                        )}
                        {request.itemType === 'consumable' && request.status === 'approved' && (
                          <span className="text-green-600 text-xs">Ready for Issue</span>
                        )}
                        {request.itemType === 'consumable' && request.status === 'issued' && (
                          <span className="text-green-600 text-xs">Completed</span>
                        )}
                        {request.itemType === 'non_consumable' && request.status === 'pending' && (
                          <span className="text-gray-500 text-xs">Awaiting Approval</span>
                        )}
                        {request.itemType === 'non_consumable' && request.status === 'approved' && (
                          <span className="text-blue-500 text-xs">Ready for Issue</span>
                        )}
                        {request.itemType === 'non_consumable' && request.status === 'issued' && !request.canReturn && (
                          <span className="text-orange-500 text-xs">Issued</span>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter item name"
                  required
                  disabled={isCreatingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Enter item description"
                  required
                  disabled={isCreatingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newItem.item_type}
                  onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value as 'consumable' | 'non-consumable' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isCreatingItem}
                >
                  <option value="consumable">Consumable</option>
                  <option value="non-consumable">Non-Consumable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter quantity"
                  required
                  min="0"
                  disabled={isCreatingItem}
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateItemForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={isCreatingItem}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isCreatingItem}
                >
                  {isCreatingItem && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isCreatingItem ? 'Creating Item...' : 'Create Item'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter item name"
                  required
                  disabled={isUpdatingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  rows={3}
                  placeholder="Enter item description"
                  required
                  disabled={isUpdatingItem}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newItem.item_type}
                  onChange={(e) => setNewItem({ ...newItem, item_type: e.target.value as 'consumable' | 'non-consumable' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  required
                  disabled={isUpdatingItem}
                >
                  <option value="consumable">Consumable</option>
                  <option value="non-consumable">Non-Consumable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Enter quantity"
                  required
                  min="0"
                  disabled={isUpdatingItem}
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
                  disabled={isUpdatingItem}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  disabled={isUpdatingItem}
                >
                  {isUpdatingItem && <Loader2 className="w-4 h-4 animate-spin" />}
                  {isUpdatingItem ? 'Updating Item...' : 'Update Item'}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Return Item Modal */}
      {showReturnForm && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Return Item</h2>
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedRequest.itemName}</h3>
              <p className="text-sm text-gray-600">Quantity: {selectedRequest.quantity} {selectedRequest.unit}</p>
              <p className="text-sm text-gray-600">Requested by: {selectedRequest.requestedBy}</p>
            </div>
            <form onSubmit={handleReturnItem} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return Notes (Optional)</label>
                <textarea
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes about the return..."
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowReturnForm(false);
                    setSelectedRequest(null);
                    setReturnNotes('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Confirm Return
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
