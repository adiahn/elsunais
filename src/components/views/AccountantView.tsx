import React, { useState } from 'react';
import { Plus, DollarSign, Receipt, FileText, CheckCircle, Clock, AlertTriangle, Building, Car, Wrench, Fuel, User } from 'lucide-react';

interface Tax {
  id: string;
  name: string;
  percentage: number;
}

interface Payment {
  id: string;
  paymentType: 'activity' | 'driver_request' | 'other';
  sourceId: string; // ID of the activity, driver request, or other expense
  title: string;
  description: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  requestDate: string;
  approvedDate: string;
  paymentDate?: string;
  recipient: string;
  recipientType: 'internal' | 'external';
  taxes?: Tax[];
  totalWithTaxes?: number;
  paymentMethod?: 'full' | 'percentage';
  percentagePayments?: {
    start: number;
    mid: number;
    end: number;
  };
  receipt?: string;
  notes?: string;
}

interface ApprovedPayment {
  id: string;
  paymentType: 'activity' | 'driver_request' | 'other';
  sourceId: string;
  title: string;
  description: string;
  amount: number;
  recipient: string;
  recipientType: 'internal' | 'external';
  requestDate: string;
  approvedDate: string;
  componentName?: string;
  projectName?: string;
  activityName?: string;
}

const AccountantView: React.FC = () => {
  const [approvedPayments, setApprovedPayments] = useState<ApprovedPayment[]>([
    {
      id: '1',
      paymentType: 'activity',
      sourceId: '1-1-1',
      title: 'Drainage Construction',
      description: 'Construction of drainage system in Component A',
      amount: 50000,
      recipient: 'ABC Construction Ltd.',
      recipientType: 'external',
      requestDate: '2025-01-15',
      approvedDate: '2025-01-18',
      componentName: 'Dryland Management',
      projectName: 'Infrastructure Development',
      activityName: 'Drainage System Construction'
    },
    {
      id: '2',
      paymentType: 'driver_request',
      sourceId: '2',
      title: 'Vehicle Fueling',
      description: 'Fuel tank refill for Toyota Camry',
      amount: 125,
      recipient: 'John Smith',
      recipientType: 'internal',
      requestDate: '2025-01-19',
      approvedDate: '2025-01-20'
    },
    {
      id: '3',
      paymentType: 'activity',
      sourceId: '1-3-1',
      title: 'Stakeholder Meetings',
      description: 'Community engagement activities',
      amount: 5000,
      recipient: 'Community Team',
      recipientType: 'internal',
      requestDate: '2025-01-16',
      approvedDate: '2025-01-17',
      componentName: 'Dryland Management',
      projectName: 'Community Engagement',
      activityName: 'Stakeholder Meetings'
    },
    {
      id: '4',
      paymentType: 'other',
      sourceId: '4',
      title: 'Office Supplies',
      description: 'Purchase of office equipment and supplies',
      amount: 2500,
      recipient: 'Office Depot',
      recipientType: 'external',
      requestDate: '2025-01-14',
      approvedDate: '2025-01-16'
    }
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'p1',
      paymentType: 'driver_request',
      sourceId: '1',
      title: 'Vehicle Maintenance',
      description: 'Oil change and filter replacement',
      amount: 75,
      status: 'completed',
      requestDate: '2025-01-10',
      approvedDate: '2025-01-12',
      paymentDate: '2025-01-15',
      recipient: 'John Smith',
      recipientType: 'internal',
      paymentMethod: 'full',
      receipt: 'receipt_001.pdf'
    },
    {
      id: 'p2',
      paymentType: 'activity',
      sourceId: '1-1-1',
      title: 'Equipment Procurement',
      description: 'Procuring construction equipment',
      amount: 25000,
      status: 'processing',
      requestDate: '2025-01-08',
      approvedDate: '2025-01-10',
      recipient: 'XYZ Equipment Co.',
      recipientType: 'external',
      taxes: [
        { id: 't1', name: 'VAT', percentage: 15 },
        { id: 't2', name: 'Withholding Tax', percentage: 5 }
      ],
      totalWithTaxes: 30000,
      paymentMethod: 'percentage',
      percentagePayments: {
        start: 30,
        mid: 40,
        end: 30
      }
    }
  ]);

  const [selectedPayment, setSelectedPayment] = useState<ApprovedPayment | null>(null);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [currentStep, setCurrentStep] = useState<'taxes' | 'payment' | 'disbursement'>('taxes');
  const [taxes, setTaxes] = useState<Tax[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'full' | 'percentage'>('full');
  const [percentagePayments, setPercentagePayments] = useState({ start: 30, mid: 40, end: 30 });
  const [receipt, setReceipt] = useState('');
  const [notes, setNotes] = useState('');

  const getPaymentTypeIcon = (type: ApprovedPayment['paymentType']) => {
    switch (type) {
      case 'activity':
        return <Building className="w-4 h-4 text-blue-600" />;
      case 'driver_request':
        return <Car className="w-4 h-4 text-green-600" />;
      case 'other':
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusIcon = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'processing':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'cancelled':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleProceedWithPayment = (payment: ApprovedPayment) => {
    setSelectedPayment(payment);
    setShowPaymentForm(true);
    setCurrentStep('taxes');
    setTaxes([]);
    setPaymentMethod('full');
    setPercentagePayments({ start: 30, mid: 40, end: 30 });
    setReceipt('');
    setNotes('');
  };

  const addTax = () => {
    setTaxes([...taxes, { id: Date.now().toString(), name: '', percentage: 0 }]);
  };

  const updateTax = (id: string, field: 'name' | 'percentage', value: string | number) => {
    setTaxes(taxes.map(tax => 
      tax.id === id ? { ...tax, [field]: value } : tax
    ));
  };

  const removeTax = (id: string) => {
    setTaxes(taxes.filter(tax => tax.id !== id));
  };

  const calculateTotalWithTaxes = () => {
    if (!selectedPayment) return 0;
    const taxAmount = taxes.reduce((total, tax) => total + (selectedPayment.amount * tax.percentage / 100), 0);
    return selectedPayment.amount + taxAmount;
  };

  const handleContinueToPayment = () => {
    if (selectedPayment?.recipientType === 'external' && taxes.length === 0) {
      alert('Please add at least one tax for external payments or click "Continue without taxes"');
      return;
    }
    setCurrentStep('payment');
  };

  const handleContinueWithoutTaxes = () => {
    setCurrentStep('payment');
  };

  const handleDisbursePayment = () => {
    if (!selectedPayment) return;
    
    const newPayment: Payment = {
      id: Date.now().toString(),
      paymentType: selectedPayment.paymentType,
      sourceId: selectedPayment.sourceId,
      title: selectedPayment.title,
      description: selectedPayment.description,
      amount: selectedPayment.amount,
      status: 'processing',
      requestDate: selectedPayment.requestDate,
      approvedDate: selectedPayment.approvedDate,
      recipient: selectedPayment.recipient,
      recipientType: selectedPayment.recipientType,
      taxes: taxes.length > 0 ? taxes : undefined,
      totalWithTaxes: taxes.length > 0 ? calculateTotalWithTaxes() : undefined,
      paymentMethod,
      percentagePayments: paymentMethod === 'percentage' ? percentagePayments : undefined,
      receipt,
      notes
    };

    setPayments([...payments, newPayment]);
    setApprovedPayments(approvedPayments.filter(p => p.id !== selectedPayment.id));
    setShowPaymentForm(false);
    setSelectedPayment(null);
  };

  const handleMarkAsDisbursed = (paymentId: string) => {
    setPayments(payments.map(payment => 
      payment.id === paymentId 
        ? { ...payment, status: 'completed', paymentDate: new Date().toISOString().split('T')[0] }
        : payment
    ));
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accountant Portal</h1>
          <p className="text-gray-600 mt-2">Manage approved payments and disbursements</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Approved Payments */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Approved Payments</h2>
            <div className="space-y-3">
              {approvedPayments.map((payment) => (
                <div
                  key={payment.id}
                  onClick={() => setSelectedPayment(payment)}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedPayment?.id === payment.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getPaymentTypeIcon(payment.paymentType)}
                      <span className="font-medium text-gray-900">{payment.title}</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">${payment.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{payment.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{payment.recipient}</span>
                    <span>{payment.approvedDate}</span>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleProceedWithPayment(payment);
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Proceed with Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment History */}
        <div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h2>
            <div className="space-y-3">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getPaymentTypeIcon(payment.paymentType)}
                      <span className="font-medium text-gray-900">{payment.title}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        ${payment.totalWithTaxes ? payment.totalWithTaxes.toLocaleString() : payment.amount.toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{payment.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{payment.recipient}</span>
                    <span>{payment.paymentDate || payment.approvedDate}</span>
                  </div>
                  {payment.status === 'processing' && (
                    <div className="mt-3">
                      <button
                        onClick={() => handleMarkAsDisbursed(payment.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      >
                        Mark as Disbursed
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form Modal */}
      {showPaymentForm && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Process Payment</h2>
            
            {/* Payment Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">{selectedPayment.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{selectedPayment.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Amount: ${selectedPayment.amount.toLocaleString()}</span>
                <span className="text-sm text-gray-500">Recipient: {selectedPayment.recipient}</span>
              </div>
            </div>

            {/* Taxes Step */}
            {currentStep === 'taxes' && selectedPayment.recipientType === 'external' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Add Taxes</h3>
                <p className="text-sm text-gray-600">External payments require tax calculations.</p>
                
                {taxes.map((tax) => (
                  <div key={tax.id} className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={tax.name}
                      onChange={(e) => updateTax(tax.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Tax name (e.g., VAT, Withholding Tax)"
                    />
                    <input
                      type="number"
                      value={tax.percentage}
                      onChange={(e) => updateTax(tax.id, 'percentage', Number(e.target.value))}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="%"
                    />
                    <button
                      onClick={() => removeTax(tax.id)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button
                  onClick={addTax}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-md border border-green-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Tax
                </button>

                {taxes.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">Total with Taxes:</span>
                      <span className="text-lg font-bold text-green-600">
                        ${calculateTotalWithTaxes().toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleContinueWithoutTaxes}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Continue without taxes
                  </button>
                  <button
                    onClick={handleContinueToPayment}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Continue with taxes
                  </button>
                </div>
              </div>
            )}

            {/* Payment Method Step */}
            {currentStep === 'payment' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Payment Method</h3>
                
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="full"
                      checked={paymentMethod === 'full'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'full' | 'percentage')}
                      className="mr-3"
                    />
                    <span>Full Payment</span>
                  </label>
                  
                  {selectedPayment.recipientType === 'external' && (
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="percentage"
                        checked={paymentMethod === 'percentage'}
                        onChange={(e) => setPaymentMethod(e.target.value as 'full' | 'percentage')}
                        className="mr-3"
                      />
                      <span>Percentage Payment (for contractors)</span>
                    </label>
                  )}
                </div>

                {paymentMethod === 'percentage' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Payment Schedule</h4>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Start (%)</label>
                        <input
                          type="number"
                          value={percentagePayments.start}
                          onChange={(e) => setPercentagePayments({...percentagePayments, start: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Mid (%)</label>
                        <input
                          type="number"
                          value={percentagePayments.mid}
                          onChange={(e) => setPercentagePayments({...percentagePayments, mid: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">End (%)</label>
                        <input
                          type="number"
                          value={percentagePayments.end}
                          onChange={(e) => setPercentagePayments({...percentagePayments, end: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setCurrentStep('taxes')}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setCurrentStep('disbursement')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Disbursement Step */}
            {currentStep === 'disbursement' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Disburse Payment</h3>
                <p className="text-sm text-gray-600">Make the payment using your account and then confirm disbursement.</p>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Receipt (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => setReceipt(e.target.files?.[0]?.name || '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Add any notes about this payment"
                  />
                </div>

                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleDisbursePayment}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    I have disbursed the payment
                  </button>
                </div>
              </div>
            )}

            {/* Skip taxes for internal payments */}
            {currentStep === 'taxes' && selectedPayment.recipientType === 'internal' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Internal Payment</h3>
                <p className="text-sm text-gray-600">Internal payments do not require taxes.</p>
                
                <div className="flex items-center justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => setCurrentStep('payment')}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Continue with Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountantView;
