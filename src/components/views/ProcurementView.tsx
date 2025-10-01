import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Package,
  FileText,
  Building,
  Loader2,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  Award,
  ShoppingCart,
  ClipboardList,
  Gavel,
  BarChart3,
  RefreshCw
} from 'lucide-react';
import {
  procurementService,
  Vendor,
  PurchaseOrder,
  ProcurementRequest,
  Tender,
  Contract,
  ProcurementStats,
  CreateVendorRequest,
  CreatePurchaseOrderRequest,
  CreateProcurementRequestRequest,
  CreateTenderRequest,
  CreateContractRequest
} from '../../services/procurementService';

const ProcurementView: React.FC = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'vendors' | 'purchase-orders' | 'procurement-requests' | 'tenders' | 'contracts'>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Data state
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [procurementRequests, setProcurementRequests] = useState<ProcurementRequest[]>([]);
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [stats, setStats] = useState<ProcurementStats | null>(null);

  // UI state
  const [showCreateVendorModal, setShowCreateVendorModal] = useState(false);
  const [showCreatePOModal, setShowCreatePOModal] = useState(false);
  const [showCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [showCreateTenderModal, setShowCreateTenderModal] = useState(false);
  const [showCreateContractModal, setShowCreateContractModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [newVendor, setNewVendor] = useState<CreateVendorRequest>({
    name: '',
    contact_person: '',
    email: '',
    phone: '',
    address: '',
    category: 'supplier',
    notes: ''
  });

  const [newPurchaseOrder, setNewPurchaseOrder] = useState<CreatePurchaseOrderRequest>({
    vendor_id: 0,
    items: [],
    expected_delivery_date: '',
    notes: ''
  });

  const [newProcurementRequest, setNewProcurementRequest] = useState<CreateProcurementRequestRequest>({
    department: '',
    priority: 'medium',
    justification: '',
    items: []
  });

  const [newTender, setNewTender] = useState<CreateTenderRequest>({
    title: '',
    description: '',
    category: 'goods',
    estimated_value: 0,
    currency: 'NGN',
    closing_date: '',
    opening_date: '',
    requirements: []
  });

  const [newContract, setNewContract] = useState<CreateContractRequest>({
    vendor_id: 0,
    title: '',
    description: '',
    contract_type: 'supply',
    start_date: '',
    end_date: '',
    total_value: 0,
    currency: 'NGN',
    payment_terms: '',
    delivery_terms: '',
    notes: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Load data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, we'll use mock data since APIs might not be implemented yet
      // This allows the UI to work while backend is being developed
      await Promise.all([
        fetchVendors(),
        fetchPurchaseOrders(),
        fetchProcurementRequests(),
        fetchTenders(),
        fetchContracts(),
        fetchStats()
      ]);
    } catch (err) {
      console.log('API not available, using mock data:', err);
      // Set mock data for demonstration
      setVendors([
        {
          id: 1,
          name: 'Tech Solutions Ltd',
          contact_person: 'John Smith',
          email: 'john@techsolutions.com',
          phone: '+234 801 234 5678',
          address: '123 Tech Street, Lagos',
          category: 'supplier',
          status: 'active',
          rating: 4.5,
          notes: 'Reliable IT equipment supplier',
          created_at: '2024-01-15',
          updated_at: '2024-01-15'
        },
        {
          id: 2,
          name: 'Office Supplies Co',
          contact_person: 'Mary Johnson',
          email: 'mary@officesupplies.com',
          phone: '+234 802 345 6789',
          address: '456 Office Avenue, Abuja',
          category: 'supplier',
          status: 'active',
          rating: 4.2,
          notes: 'Office stationery and supplies',
          created_at: '2024-02-10',
          updated_at: '2024-02-10'
        }
      ]);
      setPurchaseOrders([
        {
          id: 1,
          po_number: 'PO-2024-001',
          vendor_id: 1,
          vendor_name: 'Tech Solutions Ltd',
          status: 'approved',
          total_amount: 250000,
          currency: 'NGN',
          requested_by: 'IT Department',
          approved_by: 'Procurement Manager',
          created_at: '2024-01-20',
          approved_at: '2024-01-21',
          expected_delivery_date: '2024-02-15',
          notes: 'Laptop computers for new staff',
          items: [
            {
              id: 1,
              po_id: 1,
              item_name: 'Dell Laptop',
              description: 'Dell Inspiron 15 3000',
              quantity: 5,
              unit_price: 50000,
              total_price: 250000,
              unit: 'pieces',
              category: 'IT Equipment',
              specifications: 'Intel i5, 8GB RAM, 256GB SSD'
            }
          ]
        }
      ]);
      setProcurementRequests([
        {
          id: 1,
          request_number: 'PR-2024-001',
          department: 'IT Department',
          requested_by: 'IT Manager',
          priority: 'high',
          status: 'approved',
          total_estimated_cost: 500000,
          currency: 'NGN',
          justification: 'Need new computers for project team',
          created_at: '2024-01-15',
          approved_at: '2024-01-16',
          approved_by: 'Procurement Manager',
          items: [
            {
              id: 1,
              request_id: 1,
              item_name: 'Desktop Computers',
              description: 'High-performance desktop computers',
              quantity: 10,
              estimated_unit_price: 50000,
              estimated_total_price: 500000,
              unit: 'pieces',
              category: 'IT Equipment',
              specifications: 'Intel i7, 16GB RAM, 512GB SSD',
              justification: 'Required for new project development'
            }
          ]
        }
      ]);
      setTenders([]);
      setContracts([]);
      setStats({
        totalVendors: 2,
        activeVendors: 2,
        totalPurchaseOrders: 1,
        pendingPurchaseOrders: 0,
        totalProcurementRequests: 1,
        pendingProcurementRequests: 0,
        totalTenders: 0,
        activeTenders: 0,
        totalContracts: 0,
        activeContracts: 0,
        totalSpent: 250000,
        monthlySpending: [
          { month: 'January', amount: 250000 },
          { month: 'February', amount: 0 },
          { month: 'March', amount: 0 }
        ],
        topVendors: [
          { vendor_name: 'Tech Solutions Ltd', total_amount: 250000, order_count: 1 },
          { vendor_name: 'Office Supplies Co', total_amount: 0, order_count: 0 }
        ],
        categoryBreakdown: [
          { category: 'IT Equipment', amount: 250000, percentage: 100 },
          { category: 'Office Supplies', amount: 0, percentage: 0 }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const data = await procurementService.getVendors();
      setVendors(data);
    } catch (err) {
      console.error('Error fetching vendors:', err);
      // Set empty array if API fails
      setVendors([]);
    }
  };

  const fetchPurchaseOrders = async () => {
    try {
      const data = await procurementService.getPurchaseOrders();
      setPurchaseOrders(data);
    } catch (err) {
      console.error('Error fetching purchase orders:', err);
      setPurchaseOrders([]);
    }
  };

  const fetchProcurementRequests = async () => {
    try {
      const data = await procurementService.getProcurementRequests();
      setProcurementRequests(data);
    } catch (err) {
      console.error('Error fetching procurement requests:', err);
      setProcurementRequests([]);
    }
  };

  const fetchTenders = async () => {
    try {
      const data = await procurementService.getTenders();
      setTenders(data);
    } catch (err) {
      console.error('Error fetching tenders:', err);
      setTenders([]);
    }
  };

  const fetchContracts = async () => {
    try {
      const data = await procurementService.getContracts();
      setContracts(data);
    } catch (err) {
      console.error('Error fetching contracts:', err);
      setContracts([]);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await procurementService.getProcurementStats();
      setStats(data);
    } catch (err) {
      console.error('Error fetching stats:', err);
      setStats({
        totalVendors: 0,
        activeVendors: 0,
        totalPurchaseOrders: 0,
        pendingPurchaseOrders: 0,
        totalProcurementRequests: 0,
        pendingProcurementRequests: 0,
        totalTenders: 0,
        activeTenders: 0,
        totalContracts: 0,
        activeContracts: 0,
        totalSpent: 0,
        monthlySpending: [],
        topVendors: [],
        categoryBreakdown: []
      });
    }
  };

  // Vendor management
  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await procurementService.createVendor(newVendor);
      setSuccess('Vendor created successfully!');
      setShowCreateVendorModal(false);
      setNewVendor({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        category: 'supplier',
        notes: ''
      });
      fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create vendor');
    }
  };

  const handleUpdateVendor = async (id: number, data: any) => {
    try {
      await procurementService.updateVendor(id, data);
      setSuccess('Vendor updated successfully!');
      fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor');
    }
  };

  const handleDeleteVendor = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this vendor?')) {
      return;
    }
    try {
      await procurementService.deleteVendor(id);
      setSuccess('Vendor deleted successfully!');
      fetchVendors();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vendor');
    }
  };

  // Purchase Order management
  const handleCreatePurchaseOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await procurementService.createPurchaseOrder(newPurchaseOrder);
      setSuccess('Purchase order created successfully!');
      setShowCreatePOModal(false);
      setNewPurchaseOrder({
        vendor_id: 0,
        items: [],
        expected_delivery_date: '',
        notes: ''
      });
      fetchPurchaseOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create purchase order');
    }
  };

  const handleApprovePurchaseOrder = async (id: number) => {
    try {
      await procurementService.approvePurchaseOrder(id);
      setSuccess('Purchase order approved successfully!');
      fetchPurchaseOrders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve purchase order');
    }
  };

  // Procurement Request management
  const handleCreateProcurementRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await procurementService.createProcurementRequest(newProcurementRequest);
      setSuccess('Procurement request created successfully!');
      setShowCreateRequestModal(false);
      setNewProcurementRequest({
        department: '',
        priority: 'medium',
        justification: '',
        items: []
      });
      fetchProcurementRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create procurement request');
    }
  };

  const handleApproveProcurementRequest = async (id: number) => {
    try {
      await procurementService.approveProcurementRequest(id);
      setSuccess('Procurement request approved successfully!');
      fetchProcurementRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve procurement request');
    }
  };

  const handleRejectProcurementRequest = async (id: number, reason: string) => {
    try {
      await procurementService.rejectProcurementRequest(id, reason);
      setSuccess('Procurement request rejected successfully!');
      fetchProcurementRequests();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject procurement request');
    }
  };

  // Tender management
  const handleCreateTender = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await procurementService.createTender(newTender);
      setSuccess('Tender created successfully!');
      setShowCreateTenderModal(false);
      setNewTender({
        title: '',
        description: '',
        category: 'goods',
        estimated_value: 0,
        currency: 'NGN',
        closing_date: '',
        opening_date: '',
        requirements: []
      });
      fetchTenders();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create tender');
    }
  };

  // Contract management
  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await procurementService.createContract(newContract);
      setSuccess('Contract created successfully!');
      setShowCreateContractModal(false);
      setNewContract({
        vendor_id: 0,
        title: '',
        description: '',
        contract_type: 'supply',
        start_date: '',
        end_date: '',
        total_value: 0,
        currency: 'NGN',
        payment_terms: '',
        delivery_terms: '',
        notes: ''
      });
      fetchContracts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create contract');
    }
  };

  // Utility functions
  const formatCurrency = (amount: number, currency: string = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'rejected':
      case 'cancelled':
      case 'terminated':
        return 'bg-red-100 text-red-800';
      case 'in_progress':
      case 'sent':
      case 'published':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
      case 'received':
      case 'awarded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
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

  // Filter functions
  const filteredVendors = vendors.filter(vendor => {
    const matchesSearch = vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || vendor.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const filteredPurchaseOrders = purchaseOrders.filter(po => {
    const matchesSearch = po.po_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendor_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredProcurementRequests = procurementRequests.filter(req => {
    const matchesSearch = req.request_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.requested_by.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Overview Dashboard Component
  const OverviewDashboard = () => (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Vendors</p>
              <p className="text-2xl font-bold text-blue-600">{stats?.totalVendors || 0}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Purchase Orders</p>
              <p className="text-2xl font-bold text-green-600">{stats?.totalPurchaseOrders || 0}</p>
            </div>
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Tenders</p>
              <p className="text-2xl font-bold text-orange-600">{stats?.activeTenders || 0}</p>
            </div>
            <Gavel className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats?.totalSpent || 0)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Purchase Orders</h3>
          <div className="space-y-3">
            {purchaseOrders.slice(0, 5).map(po => (
              <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{po.po_number}</p>
                  <p className="text-sm text-gray-600">{po.vendor_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(po.total_amount, po.currency)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                    {po.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Procurement Requests</h3>
          <div className="space-y-3">
            {procurementRequests.slice(0, 5).map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{req.request_number}</p>
                  <p className="text-sm text-gray-600">{req.department}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(req.total_estimated_cost, req.currency)}</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Vendors Table Component
  const VendorsTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Vendors</h3>
        <button
          onClick={() => setShowCreateVendorModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredVendors.map(vendor => (
              <tr key={vendor.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                    <div className="text-sm text-gray-500">{vendor.address}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-gray-900">{vendor.contact_person}</div>
                    <div className="text-sm text-gray-500">{vendor.email}</div>
                    <div className="text-sm text-gray-500">{vendor.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {vendor.category.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(vendor.status)}`}>
                    {vendor.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {vendor.rating ? (
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">{vendor.rating}/5</span>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-500">No rating</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(vendor);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleUpdateVendor(vendor.id, { status: vendor.status === 'active' ? 'inactive' : 'active' })}
                      className="text-green-600 hover:text-green-900"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteVendor(vendor.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Purchase Orders Table Component
  const PurchaseOrdersTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Purchase Orders</h3>
        <button
          onClick={() => setShowCreatePOModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create PO
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PO Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPurchaseOrders.map(po => (
              <tr key={po.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{po.po_number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{po.vendor_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(po.total_amount, po.currency)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}>
                    {po.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{new Date(po.created_at).toLocaleDateString()}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(po);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {po.status === 'pending_approval' && (
                      <button
                        onClick={() => handleApprovePurchaseOrder(po.id)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Procurement Requests Table Component
  const ProcurementRequestsTable = () => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Procurement Requests</h3>
        <button
          onClick={() => setShowCreateRequestModal(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Request
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested By</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredProcurementRequests.map(req => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{req.request_number}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{req.department}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{req.requested_by}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(req.priority)}`}>
                    {req.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{formatCurrency(req.total_estimated_cost, req.currency)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                    {req.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setSelectedItem(req);
                        setShowDetailsModal(true);
                      }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {req.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApproveProcurementRequest(req.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) handleRejectProcurementRequest(req.id, reason);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Procurement Management</h1>
          <p className="text-gray-600 mt-2">Manage vendors, purchase orders, and procurement processes</p>
        </div>
        <button
          onClick={fetchAllData}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Refresh
        </button>
      </div>

      {/* Error & Success Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}
      {success && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          <p className="text-green-700 text-sm">{success}</p>
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">
            ×
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'vendors', label: 'Vendors', icon: Users },
            { id: 'purchase-orders', label: 'Purchase Orders', icon: ShoppingCart },
            { id: 'procurement-requests', label: 'Requests', icon: ClipboardList },
            { id: 'tenders', label: 'Tenders', icon: Gavel },
            { id: 'contracts', label: 'Contracts', icon: FileText }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Categories</option>
          <option value="supplier">Supplier</option>
          <option value="contractor">Contractor</option>
          <option value="service_provider">Service Provider</option>
        </select>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600">Loading procurement data...</span>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && <OverviewDashboard />}
          {activeTab === 'vendors' && <VendorsTable />}
          {activeTab === 'purchase-orders' && <PurchaseOrdersTable />}
          {activeTab === 'procurement-requests' && <ProcurementRequestsTable />}
          {activeTab === 'tenders' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Tenders</h3>
              <p className="text-gray-500">Tender management functionality coming soon...</p>
            </div>
          )}
          {activeTab === 'contracts' && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contracts</h3>
              <p className="text-gray-500">Contract management functionality coming soon...</p>
            </div>
          )}
        </>
      )}

      {/* Create Vendor Modal */}
      {showCreateVendorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Vendor</h2>
            <form onSubmit={handleCreateVendor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vendor Name *</label>
                  <input
                    type="text"
                    required
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({ ...newVendor, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={newVendor.contact_person}
                    onChange={(e) => setNewVendor({ ...newVendor, contact_person: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({ ...newVendor, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    required
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({ ...newVendor, address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select
                    required
                    value={newVendor.category}
                    onChange={(e) => setNewVendor({ ...newVendor, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="supplier">Supplier</option>
                    <option value="contractor">Contractor</option>
                    <option value="service_provider">Service Provider</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newVendor.notes}
                    onChange={(e) => setNewVendor({ ...newVendor, notes: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateVendorModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {showDetailsModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              <pre className="text-sm text-gray-700 bg-gray-50 p-4 rounded-lg overflow-auto">
                {JSON.stringify(selectedItem, null, 2)}
              </pre>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcurementView;
