import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Building, 
  Receipt, 
  Loader2, 
  AlertCircle, 
  Settings as SettingsIcon,
  DollarSign,
  Percent,
  Calendar,
  User,
  Activity,
  CheckCircle,
  RefreshCw,
  Search,
  Filter,
  Car as CarIcon
} from 'lucide-react';
import { componentService, Component } from '../../services/componentService';
import { deductionService, Deduction, CreateDeductionRequest } from '../../services/deductionService';
import { carService, Car, CreateCarRequest } from '../../services/carService';

interface LocalComponent extends Component {
  title: string;
  description: string;
  isActive: boolean;
}


const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'deductions' | 'cars'>('components');
  const [components, setComponents] = useState<LocalComponent[]>([]);
  const [deductions, setDeductions] = useState<Deduction[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDeductions, setIsLoadingDeductions] = useState(false);
  const [isLoadingCars, setIsLoadingCars] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showDeductionForm, setShowDeductionForm] = useState(false);
  const [showCarForm, setShowCarForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<LocalComponent | null>(null);
  const [editingDeduction, setEditingDeduction] = useState<Deduction | null>(null);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [newComponent, setNewComponent] = useState({ name: '', title: '', description: '' });
  const [newDeduction, setNewDeduction] = useState<CreateDeductionRequest>({
    activity_id: 1, // Auto-generated/default
    amount: 0,
    description: '',
    is_percentage: false
  });
  const [newCar, setNewCar] = useState<CreateCarRequest>({
    plate_number: '',
    model: '',
    manufacturer: '',
    year: new Date().getFullYear(),
    user_id: 1, // Default driver
    created_by: 1 // Auto-generated/default
  });

  // Load data on mount
  useEffect(() => {
    console.log('SettingsView mounted, checking auth...');
    const token = localStorage.getItem('authToken');
    console.log('Auth token exists:', !!token);
    loadComponents();
    loadDeductions();
    loadCars();
  }, []);

  const loadComponents = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Loading components...');
      const apiComponents = await componentService.getComponents();
      console.log('API response:', apiComponents);
      
      // Convert API components to local format with default values
      const localComponents: LocalComponent[] = apiComponents.map(comp => ({
        ...comp,
        title: comp.title || '',
        description: comp.description || '',
        isActive: comp.isActive ?? true
      }));
      
      console.log('Local components:', localComponents);
      setComponents(localComponents);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load components';
      setError(errorMessage);
      console.error('Error loading components:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDeductions = async () => {
    try {
      setIsLoadingDeductions(true);
      setError(null);
      console.log('Loading deductions...');
      const apiDeductions = await deductionService.getDeductions();
      console.log('Deductions API response:', apiDeductions);
      
      // Debug: Log each deduction's is_percentage value
      apiDeductions.forEach((deduction, index) => {
        console.log(`Deduction ${index + 1}:`, {
          id: deduction.id,
          description: deduction.description,
          amount: deduction.amount,
          is_percentage: deduction.is_percentage,
          type: typeof deduction.is_percentage
        });
      });
      
      setDeductions(apiDeductions);
    } catch (err) {
      console.error('Error loading deductions:', err);
      // Don't set error for deductions as it's not critical
      setDeductions([]);
    } finally {
      setIsLoadingDeductions(false);
    }
  };

  const loadCars = async () => {
    try {
      setIsLoadingCars(true);
      setError(null);
      console.log('Loading cars...');
      const apiCars = await carService.getCars();
      console.log('Cars API response:', apiCars);
      setCars(apiCars);
    } catch (err) {
      console.error('Error loading cars:', err);
      // Don't set error for cars as it's not critical
      setCars([]);
    } finally {
      setIsLoadingCars(false);
    }
  };

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComponent.name.trim() || !newComponent.title.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Create component via API
      await componentService.createComponent({ 
        name: newComponent.name,
        title: newComponent.title
      });
      
      // Show success message
      setSuccessMessage(`Component "${newComponent.name}" created successfully!`);
      
      // Reload components to get the updated list
      await loadComponents();
      
      setNewComponent({ name: '', title: '', description: '' });
      setShowComponentForm(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create component';
      setError(errorMessage);
      console.error('Error creating component:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditComponent = (component: LocalComponent) => {
    setEditingComponent(component);
    setNewComponent({ name: component.name, title: component.title, description: component.description });
    setShowComponentForm(true);
  };

  const handleUpdateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComponent || !newComponent.name.trim() || !newComponent.title.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Update component via API
      await componentService.updateComponent(editingComponent.id, { 
        name: newComponent.name,
        title: newComponent.title
      });
      
      // Reload components to get the updated list
      await loadComponents();
      
      setEditingComponent(null);
      setNewComponent({ name: '', title: '', description: '' });
      setShowComponentForm(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update component';
      setError(errorMessage);
      console.error('Error updating component:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComponent = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        setIsLoading(true);
        setError(null);
        
        // Delete component via API
        await componentService.deleteComponent(id);
        
        // Reload components to get the updated list
        await loadComponents();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete component';
        setError(errorMessage);
        console.error('Error deleting component:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleComponentStatus = (id: number) => {
    setComponents(components.map(comp => 
      comp.id === id ? { ...comp, isActive: !comp.isActive } : comp
    ));
  };


  // Deduction management functions
  const handleCreateDeduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeduction.description.trim() || newDeduction.amount <= 0) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Debug: Log what we're sending to the API
      console.log('=== CREATING DEDUCTION ===');
      console.log('Form data being sent:', {
        activity_id: newDeduction.activity_id,
        amount: newDeduction.amount,
        description: newDeduction.description,
        is_percentage: newDeduction.is_percentage,
        is_percentage_type: typeof newDeduction.is_percentage
      });
      
      const createdDeduction = await deductionService.createDeduction(newDeduction);
      console.log('API Response after creation:', createdDeduction);
      
      setSuccessMessage('Deduction created successfully!');
      await loadDeductions();
      
      setNewDeduction({
        activity_id: 1, // Auto-generated/default
        amount: 0,
        description: '',
        is_percentage: false
      });
      setShowDeductionForm(false);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create deduction';
      setError(errorMessage);
      console.error('Error creating deduction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditDeduction = (deduction: Deduction) => {
    setEditingDeduction(deduction);
    setNewDeduction({
      activity_id: deduction.activity_id,
      amount: deduction.amount,
      description: deduction.description,
      is_percentage: deduction.is_percentage
    });
    setShowDeductionForm(true);
  };

  const handleUpdateDeduction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeduction || !newDeduction.description.trim() || newDeduction.amount <= 0) return;

    try {
      setIsLoading(true);
      setError(null);
      
      await deductionService.updateDeduction(editingDeduction.id, {
        activity_id: newDeduction.activity_id,
        amount: newDeduction.amount,
        description: newDeduction.description,
        is_percentage: newDeduction.is_percentage
      });
      
      setSuccessMessage('Deduction updated successfully!');
      await loadDeductions();
      
      setEditingDeduction(null);
      setNewDeduction({
        activity_id: 1, // Auto-generated/default
        amount: 0,
        description: '',
        is_percentage: false
      });
      setShowDeductionForm(false);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update deduction';
      setError(errorMessage);
      console.error('Error updating deduction:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDeduction = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this deduction?')) {
      try {
        setIsLoading(true);
        setError(null);
        
        await deductionService.deleteDeduction(id);
        setSuccessMessage('Deduction deleted successfully!');
        await loadDeductions();
        
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete deduction';
        setError(errorMessage);
        console.error('Error deleting deduction:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Car management functions
  const handleCreateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCar.plate_number.trim() || !newCar.model.trim() || !newCar.manufacturer.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      console.log('=== CREATING CAR ===');
      console.log('Form data being sent:', newCar);
      
      const createdCar = await carService.createCar(newCar);
      console.log('API Response after creation:', createdCar);
      
      setSuccessMessage('Car created successfully!');
      await loadCars();
      
      setNewCar({
        plate_number: '',
        model: '',
        manufacturer: '',
        year: new Date().getFullYear(),
        user_id: 1, // Default driver
        created_by: 1 // Auto-generated/default
      });
      setShowCarForm(false);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create car';
      setError(errorMessage);
      console.error('Error creating car:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
    setNewCar({
      plate_number: car.plate_number,
      model: car.model,
      manufacturer: car.manufacturer,
      year: car.year,
      user_id: car.user_id,
      created_by: car.created_by
    });
    setShowCarForm(true);
  };

  const handleUpdateCar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar || !newCar.plate_number.trim() || !newCar.model.trim() || !newCar.manufacturer.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      await carService.updateCar(editingCar.id, {
        plate_number: newCar.plate_number,
        model: newCar.model,
        manufacturer: newCar.manufacturer,
        year: newCar.year,
        user_id: newCar.user_id,
        created_by: newCar.created_by
      });
      
      setSuccessMessage('Car updated successfully!');
      await loadCars();
      
      setEditingCar(null);
      setNewCar({
        plate_number: '',
        model: '',
        manufacturer: '',
        year: new Date().getFullYear(),
        user_id: 1, // Default driver
        created_by: 1 // Auto-generated/default
      });
      setShowCarForm(false);
      
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update car';
      setError(errorMessage);
      console.error('Error updating car:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCar = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        setIsLoading(true);
        setError(null);
        
        await carService.deleteCar(id);
        setSuccessMessage('Car deleted successfully!');
        await loadCars();
        
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete car';
        setError(errorMessage);
        console.error('Error deleting car:', err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const cancelForm = () => {
    setShowComponentForm(false);
    setShowDeductionForm(false);
    setShowCarForm(false);
    setEditingComponent(null);
    setEditingDeduction(null);
    setEditingCar(null);
    setNewComponent({ name: '', title: '', description: '' });
    setNewDeduction({
      activity_id: 1, // Auto-generated/default
      amount: 0,
      description: '',
      is_percentage: false
    });
    setNewCar({
      plate_number: '',
      model: '',
      manufacturer: '',
      year: new Date().getFullYear(),
      user_id: 1, // Default driver
      created_by: 1 // Auto-generated/default
    });
    setError(null);
    setSuccessMessage(null);
  };

  // Utility functions
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-NG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter functions
  const filteredComponents = components.filter(comp =>
    comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comp.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredDeductions = deductions.filter(deduction =>
    deduction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (deduction.is_percentage ? 'percentage' : 'fixed').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCars = cars.filter(car =>
    car.plate_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Manage components, taxes, and deductions</p>
        </div>

        {/* Search and Refresh */}
        <div className="flex items-center gap-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search settings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => {
              loadComponents();
              loadDeductions();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
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
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0"></div>
          <p className="text-green-700 text-sm">{successMessage}</p>
          <button
            onClick={() => setSuccessMessage(null)}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'components', label: 'Components', count: components.length },
              { id: 'deductions', label: 'Deductions & Taxes', count: deductions.length },
              { id: 'cars', label: 'Cars', count: cars.length }
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
                {tab.label}
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Components Tab */}
        {activeTab === 'components' && (
          <>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Project Components</h2>
              </div>
              <button
                onClick={() => setShowComponentForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Component
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  <span className="ml-3 text-gray-600">Loading components...</span>
              </div>
            ) : (
              <div className="space-y-4">
                  {filteredComponents.length === 0 ? (
                    <div className="text-center py-12">
                      <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
                      <p className="text-gray-500 mb-4">Get started by creating your first project component.</p>
                      <button
                        onClick={() => setShowComponentForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create Component
                      </button>
                  </div>
                ) : (
                    filteredComponents.map((component) => (
                      <div key={component.id} className="group p-6 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                  <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{component.name}</h3>
                              <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        component.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {component.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                            <p className="text-sm font-medium text-gray-700 mb-2">{component.title}</p>
                            <p className="text-sm text-gray-600">{component.description}</p>
                  </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleToggleComponentStatus(component.id)}
                              className={`p-2 rounded-lg transition-colors ${
                        component.isActive 
                                  ? 'text-red-600 hover:bg-red-50' 
                                  : 'text-green-600 hover:bg-green-50'
                      }`}
                              title={component.isActive ? 'Deactivate' : 'Activate'}
                    >
                              <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleEditComponent(component)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(component.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                          </div>
                  </div>
                </div>
                  ))
                )}
              </div>
            )}
          </div>
          </>
        )}


        {/* Deductions Tab */}
        {activeTab === 'deductions' && (
          <>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Deductions & Taxes</h2>
              </div>
              <button
                  onClick={() => setShowDeductionForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                  Add Deduction/Tax
              </button>
            </div>
          </div>

          <div className="p-6">
              {isLoadingDeductions ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                  <span className="ml-3 text-gray-600">Loading deductions...</span>
                </div>
              ) : (
            <div className="space-y-4">
                  {filteredDeductions.length === 0 ? (
                    <div className="text-center py-12">
                      <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No deductions or taxes found</h3>
                      <p className="text-gray-500 mb-4">Create deductions and taxes for activities and projects.</p>
                      <button
                        onClick={() => setShowDeductionForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        Create Deduction/Tax
                      </button>
                    </div>
                  ) : (
                    filteredDeductions.map((deduction) => (
                      <div key={deduction.id} className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                  <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-base font-medium text-gray-900">{deduction.description}</h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                !deduction.is_percentage 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {!deduction.is_percentage ? 'Fixed Amount' : 'Percentage'}
                      </span>
                    </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                {deduction.is_percentage ? (
                                  <>
                                    <Percent className="w-4 h-4" />
                                    {deduction.amount}%
                                  </>
                                ) : (
                                  <>
                                    {formatCurrency(deduction.amount)}
                                  </>
                                )}
                  </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(deduction.date_created)}
                              </div>
                            </div>
                  </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                              onClick={() => handleEditDeduction(deduction)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                              onClick={() => handleDeleteDeduction(deduction.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {/* Cars Tab */}
        {activeTab === 'cars' && (
          <>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Cars Management</h2>
                </div>
                <button
                  onClick={() => setShowCarForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Car
                </button>
              </div>
            </div>

            <div className="p-6">
              {isLoadingCars ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                  <span className="ml-3 text-gray-600">Loading cars...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCars.length === 0 ? (
                    <div className="text-center py-12">
                      <CarIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
                      <p className="text-gray-500 mb-4">Add cars to manage your fleet.</p>
                      <button
                        onClick={() => setShowCarForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                      >
                        <Plus className="w-4 h-4" />
                        Add Car
                      </button>
                    </div>
                  ) : (
                    filteredCars.map((car) => (
                      <div key={car.id} className="group p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-base font-medium text-gray-900">{car.manufacturer} {car.model}</h3>
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                {car.plate_number}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {car.year}
                              </div>
                              <div className="flex items-center gap-1">
                                <User className="w-4 h-4" />
                                Driver ID: {car.user_id}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditCar(car)}
                              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                              title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                              onClick={() => handleDeleteCar(car.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
            </div>
                    ))
                  )}
          </div>
              )}
        </div>
          </>
        )}
      </div>

      {/* Component Form Modal */}
      {showComponentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingComponent ? 'Edit Component' : 'Create New Component'}
                </h3>
              </div>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingComponent ? handleUpdateComponent : handleCreateComponent} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Component Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newComponent.name}
                  onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Dryland Management, Community Climate Resilience"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Enter a descriptive name for the component</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newComponent.title}
                  onChange={(e) => setNewComponent({ ...newComponent, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Dryland Management Component, Community Climate Resilience Initiative"
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Enter a title for the component (required by backend)</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-gray-400">(Optional)</span>
                </label>
                <textarea
                  value={newComponent.description}
                  onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Provide additional details about this component..."
                  rows={4}
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Add a detailed description to help identify this component</p>
              </div>

              {/* Success Message */}
              {!isLoading && !error && newComponent.name && newComponent.title && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm text-green-700">
                      Ready to {editingComponent ? 'update' : 'create'} component
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={isLoading}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newComponent.name.trim() || !newComponent.title.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingComponent ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingComponent ? 'Update Component' : 'Create Component'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* Deduction Form Modal */}
      {showDeductionForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingDeduction ? 'Edit Deduction/Tax' : 'Create New Deduction/Tax'}
              </h3>
              </div>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingDeduction ? handleUpdateDeduction : handleCreateDeduction} className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={newDeduction.amount}
                  onChange={(e) => setNewDeduction({ ...newDeduction, amount: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Enter deduction amount"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newDeduction.is_percentage ? 'percentage' : 'fixed'}
                  onChange={(e) => {
                    const isPercentage = e.target.value === 'percentage';
                    console.log('=== TYPE SELECTION CHANGED ===');
                    console.log('Selected value:', e.target.value);
                    console.log('is_percentage will be set to:', isPercentage);
                    setNewDeduction({ ...newDeduction, is_percentage: isPercentage });
                    console.log('Updated newDeduction state:', { ...newDeduction, is_percentage: isPercentage });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  disabled={isLoading}
                >
                  <option value="fixed">Fixed Amount</option>
                  <option value="percentage">Percentage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={newDeduction.description}
                  onChange={(e) => setNewDeduction({ ...newDeduction, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Enter deduction description"
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={isLoading}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newDeduction.description.trim() || newDeduction.amount <= 0}
                  className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:bg-purple-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingDeduction ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4" />
                      {editingDeduction ? 'Update Deduction/Tax' : 'Create Deduction/Tax'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Car Form Modal */}
      {showCarForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingCar ? 'Edit Car' : 'Add New Car'}
                </h3>
              </div>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={editingCar ? handleUpdateCar : handleCreateCar} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plate Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCar.plate_number}
                  onChange={(e) => setNewCar({ ...newCar, plate_number: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter plate number (e.g., XYZ-5678)"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCar.manufacturer}
                  onChange={(e) => setNewCar({ ...newCar, manufacturer: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter manufacturer (e.g., Honda)"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newCar.model}
                  onChange={(e) => setNewCar({ ...newCar, model: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter model (e.g., Civic)"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={newCar.year}
                  onChange={(e) => setNewCar({ ...newCar, year: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter year"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Driver ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newCar.user_id}
                  onChange={(e) => setNewCar({ ...newCar, user_id: Number(e.target.value) })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter driver ID"
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={cancelForm}
                  disabled={isLoading}
                  className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !newCar.plate_number.trim() || !newCar.model.trim() || !newCar.manufacturer.trim()}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {editingCar ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                  <Save className="w-4 h-4" />
                      {editingCar ? 'Update Car' : 'Add Car'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsView;