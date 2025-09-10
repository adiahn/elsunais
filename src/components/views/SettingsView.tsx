import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Building, Receipt, Loader2, AlertCircle } from 'lucide-react';
import { componentService, Component } from '../../services/componentService';

interface LocalComponent extends Component {
  description: string;
  isActive: boolean;
}

interface Tax {
  id: string;
  name: string;
  percentage: number;
  description: string;
  isActive: boolean;
}

const SettingsView: React.FC = () => {
  const [components, setComponents] = useState<LocalComponent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [taxes, setTaxes] = useState<Tax[]>([
    {
      id: '1',
      name: 'Withholding Tax',
      percentage: 5,
      description: 'Tax withheld from payments to contractors',
      isActive: true
    },
    {
      id: '2',
      name: 'Income Tax',
      percentage: 10,
      description: 'Income tax deduction',
      isActive: true
    },
    {
      id: '3',
      name: 'Social Security',
      percentage: 2.5,
      description: 'Social security contribution',
      isActive: true
    }
  ]);

  const [showComponentForm, setShowComponentForm] = useState(false);
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [editingComponent, setEditingComponent] = useState<LocalComponent | null>(null);
  const [editingTax, setEditingTax] = useState<Tax | null>(null);
  const [newComponent, setNewComponent] = useState({ name: '', description: '' });
  const [newTax, setNewTax] = useState({ name: '', percentage: 0, description: '' });

  // Load components on mount
  useEffect(() => {
    console.log('SettingsView mounted, checking auth...');
    const token = localStorage.getItem('authToken');
    console.log('Auth token exists:', !!token);
    loadComponents();
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

  const handleCreateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComponent.name.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Create component via API
      await componentService.createComponent({ name: newComponent.name });
      
      // Show success message
      setSuccessMessage(`Component "${newComponent.name}" created successfully!`);
      
      // Reload components to get the updated list
      await loadComponents();
      
      setNewComponent({ name: '', description: '' });
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
    setNewComponent({ name: component.name, description: component.description });
    setShowComponentForm(true);
  };

  const handleUpdateComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingComponent || !newComponent.name.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      // Update component via API
      await componentService.updateComponent(editingComponent.id, { name: newComponent.name });
      
      // Reload components to get the updated list
      await loadComponents();
      
      setEditingComponent(null);
      setNewComponent({ name: '', description: '' });
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

  const handleCreateTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTax.name.trim() || newTax.percentage <= 0) return;

    const tax: Tax = {
      id: Date.now().toString(),
      name: newTax.name,
      percentage: newTax.percentage,
      description: newTax.description,
      isActive: true
    };

    setTaxes([...taxes, tax]);
    setNewTax({ name: '', percentage: 0, description: '' });
    setShowTaxForm(false);
  };

  const handleEditTax = (tax: Tax) => {
    setEditingTax(tax);
    setNewTax({ name: tax.name, percentage: tax.percentage, description: tax.description });
    setShowTaxForm(true);
  };

  const handleUpdateTax = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTax || !newTax.name.trim() || newTax.percentage <= 0) return;

    setTaxes(taxes.map(tax => 
      tax.id === editingTax.id 
        ? { ...tax, name: newTax.name, percentage: newTax.percentage, description: newTax.description }
        : tax
    ));

    setEditingTax(null);
    setNewTax({ name: '', percentage: 0, description: '' });
    setShowTaxForm(false);
  };

  const handleDeleteTax = (id: string) => {
    if (window.confirm('Are you sure you want to delete this tax?')) {
      setTaxes(taxes.filter(tax => tax.id !== id));
    }
  };

  const handleToggleTaxStatus = (id: string) => {
    setTaxes(taxes.map(tax => 
      tax.id === id ? { ...tax, isActive: !tax.isActive } : tax
    ));
  };

  const cancelForm = () => {
    setShowComponentForm(false);
    setShowTaxForm(false);
    setEditingComponent(null);
    setEditingTax(null);
    setNewComponent({ name: '', description: '' });
    setNewTax({ name: '', percentage: 0, description: '' });
    setError(null);
    setSuccessMessage(null);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage components and tax configurations</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Components Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">Components</h2>
              </div>
              <button
                onClick={() => setShowComponentForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Component
              </button>
            </div>
          </div>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                <span className="ml-2 text-gray-600">Loading components...</span>
              </div>
            ) : (
              <div className="space-y-4">
                {console.log('Rendering components:', components, 'Length:', components.length)}
                {components.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No components found. Create your first component!</p>
                  </div>
                ) : (
                  components.map((component) => (
                <div key={component.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{component.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        component.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {component.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleComponentStatus(component.id)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        component.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {component.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditComponent(component)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteComponent(component.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* Taxes Management */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Receipt className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">Taxes</h2>
              </div>
              <button
                onClick={() => setShowTaxForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tax
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {taxes.map((tax) => (
                <div key={tax.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium text-gray-900">{tax.name}</h3>
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        {tax.percentage}%
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        tax.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tax.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{tax.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleTaxStatus(tax.id)}
                      className={`px-3 py-1 text-xs rounded-md ${
                        tax.isActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {tax.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditTax(tax)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTax(tax.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Component Form Modal */}
      {showComponentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Building className="w-5 h-5 text-green-600" />
                </div>
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
              {!isLoading && !error && newComponent.name && (
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
                  disabled={isLoading || !newComponent.name.trim()}
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

      {/* Tax Form Modal */}
      {showTaxForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingTax ? 'Edit Tax' : 'Add New Tax'}
              </h3>
              <button
                onClick={cancelForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={editingTax ? handleUpdateTax : handleCreateTax} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Name</label>
                <input
                  type="text"
                  value={newTax.name}
                  onChange={(e) => setNewTax({ ...newTax, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tax name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newTax.percentage}
                  onChange={(e) => setNewTax({ ...newTax, percentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tax percentage"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTax.description}
                  onChange={(e) => setNewTax({ ...newTax, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tax description"
                  rows={3}
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  {editingTax ? 'Update' : 'Create'}
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