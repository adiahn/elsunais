import React, { useState } from 'react';
import { DollarSign, FileText, Building, Car, X } from 'lucide-react';

interface Tax {
  id: string;
  name: string;
  percentage: number;
  description: string;
  isActive: boolean;
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
  // Partial payment tracking
  partialPayments?: {
    id: string;
    amount: number;
    percentage: number;
    paymentDate: string;
    receipt?: string;
    notes?: string;
  }[];
  totalPaid?: number;
  remainingAmount?: number;
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
  const [currentView, setCurrentView] = useState<'payments' | 'history'>('payments');
  
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
      recipient: 'Yusuf Abdullahi',
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
      recipient: 'Aisha Ibrahim',
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
      recipient: 'Yusuf Abdullahi',
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
        { id: 't1', name: 'VAT', percentage: 15, description: 'Value Added Tax', isActive: true },
        { id: 't2', name: 'Withholding Tax', percentage: 5, description: 'Tax withheld from payments', isActive: true }
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
  const [selectedTaxes, setSelectedTaxes] = useState<string[]>([]);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [selectedPaymentForPartial, setSelectedPaymentForPartial] = useState<Payment | null>(null);
  const [newPartialPayment, setNewPartialPayment] = useState({
    amount: 0,
    notes: '',
    receipt: ''
  });
  
  // Fetch taxes from settings (in a real app, this would come from a context or API)
  const availableTaxes: Tax[] = [
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
  ];
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
    setSelectedTaxes([]);
    setPaymentMethod('full');
    setPercentagePayments({ start: 30, mid: 40, end: 30 });
    setReceipt('');
    setNotes('');
  };


  const calculateTotalWithTaxes = () => {
    if (!selectedPayment) return 0;
    
    // Calculate VAT deduction (7.5% of original amount)
    const vatDeduction = selectedPayment.amount * 0.075;
    
    // Calculate other tax deductions from selected taxes
    const otherTaxDeductions = selectedTaxes.reduce((total, taxId) => {
      const tax = availableTaxes.find(t => t.id === taxId);
      return total + (tax ? selectedPayment.amount * tax.percentage / 100 : 0);
    }, 0);
    
    // Total deductions (VAT + other taxes)
    const totalDeductions = vatDeduction + otherTaxDeductions;
    
    // Final amount after all deductions
    return selectedPayment.amount - totalDeductions;
  };

  const handleContinueToPayment = () => {
    if (selectedPayment?.recipientType === 'external' && selectedTaxes.length === 0) {
      alert('Please select at least one tax for external payments or click "Continue without taxes"');
      return;
    }
    setCurrentStep('payment');
  };

  const handleContinueWithoutTaxes = () => {
    setCurrentStep('payment');
  };

  const handleDisbursePayment = () => {
    if (!selectedPayment) return;
    
    const finalAmount = calculateTotalWithTaxes();
    const isPartialPayment = paymentMethod === 'percentage';
    
    const newPayment: Payment = {
      id: Date.now().toString(),
      paymentType: selectedPayment.paymentType,
      sourceId: selectedPayment.sourceId,
      title: selectedPayment.title,
      description: selectedPayment.description,
      amount: selectedPayment.amount,
      status: isPartialPayment ? 'processing' : 'processing',
      requestDate: selectedPayment.requestDate,
      approvedDate: selectedPayment.approvedDate,
      recipient: selectedPayment.recipient,
      recipientType: selectedPayment.recipientType,
      taxes: selectedTaxes.length > 0 ? selectedTaxes.map(id => availableTaxes.find(t => t.id === id)!).filter(Boolean) : undefined,
      totalWithTaxes: finalAmount,
      paymentMethod,
      percentagePayments: paymentMethod === 'percentage' ? percentagePayments : undefined,
      receipt,
      notes,
      partialPayments: isPartialPayment ? [{
        id: Date.now().toString(),
        amount: finalAmount,
        percentage: 100, // This will be calculated based on the payment schedule
        paymentDate: new Date().toISOString().split('T')[0],
        receipt,
        notes
      }] : undefined,
      totalPaid: isPartialPayment ? finalAmount : finalAmount,
      remainingAmount: isPartialPayment ? selectedPayment.amount - finalAmount : 0
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

  const getNextDuePercentage = (payment: Payment) => {
    if (!payment.percentagePayments) return null;
    
    const totalPaidPercentage = payment.totalPaid ? (payment.totalPaid / payment.amount) * 100 : 0;
    const { start, mid, end } = payment.percentagePayments;
    
    if (totalPaidPercentage < start) {
      return { percentage: start, amount: (payment.amount * start / 100) - (payment.totalPaid || 0) };
    } else if (totalPaidPercentage < start + mid) {
      return { percentage: mid, amount: (payment.amount * (start + mid) / 100) - (payment.totalPaid || 0) };
    } else if (totalPaidPercentage < 100) {
      return { percentage: end, amount: (payment.amount * 100 / 100) - (payment.totalPaid || 0) };
    }
    
    return null;
  };

  const handleAddPartialPayment = (payment: Payment) => {
    setSelectedPaymentForPartial(payment);
    setNewPartialPayment({ amount: 0, notes: '', receipt: '' });
    setShowAddPaymentModal(true);
  };

  const handleSubmitPartialPayment = () => {
    if (!selectedPaymentForPartial || newPartialPayment.amount <= 0) return;

    const updatedPayment = {
      ...selectedPaymentForPartial,
      partialPayments: [
        ...(selectedPaymentForPartial.partialPayments || []),
        {
          id: Date.now().toString(),
          amount: newPartialPayment.amount,
          percentage: (newPartialPayment.amount / selectedPaymentForPartial.amount) * 100,
          paymentDate: new Date().toISOString().split('T')[0],
          receipt: newPartialPayment.receipt,
          notes: newPartialPayment.notes
        }
      ],
      totalPaid: (selectedPaymentForPartial.totalPaid || 0) + newPartialPayment.amount,
      remainingAmount: selectedPaymentForPartial.amount - ((selectedPaymentForPartial.totalPaid || 0) + newPartialPayment.amount),
      status: ((selectedPaymentForPartial.totalPaid || 0) + newPartialPayment.amount) >= selectedPaymentForPartial.amount ? 'completed' as const : 'processing' as const
    };

    setPayments(payments.map(p => p.id === selectedPaymentForPartial.id ? updatedPayment : p));
    setShowAddPaymentModal(false);
    setSelectedPaymentForPartial(null);
    setNewPartialPayment({ amount: 0, notes: '', receipt: '' });
  };

  const generateInvoice = (payment: Payment) => {
    // Create PDF content
    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice ${payment.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
          .invoice-details { margin-bottom: 30px; }
          .section { margin-bottom: 20px; }
          .section h3 { color: #333; border-bottom: 1px solid #ccc; padding-bottom: 5px; }
          .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
          .label { font-weight: bold; }
          .amount { text-align: right; }
          .total { font-size: 18px; font-weight: bold; border-top: 2px solid #333; padding-top: 10px; }
          .tax-breakdown { background-color: #f5f5f5; padding: 15px; border-radius: 5px; }
          .partial-payment { background-color: #e8f4fd; padding: 10px; border-radius: 5px; margin-top: 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>INVOICE</h1>
          <p>Payment ID: ${payment.id}</p>
          <p>Date: ${payment.paymentDate || new Date().toISOString().split('T')[0]}</p>
        </div>
        
        <div class="invoice-details">
          <div class="section">
            <h3>Payment Details</h3>
            <div class="row">
              <span class="label">Title:</span>
              <span>${payment.title}</span>
            </div>
            <div class="row">
              <span class="label">Description:</span>
              <span>${payment.description}</span>
            </div>
            <div class="row">
              <span class="label">Recipient:</span>
              <span>${payment.recipient}</span>
            </div>
            <div class="row">
              <span class="label">Type:</span>
              <span>${payment.recipientType}</span>
            </div>
          </div>
          
          <div class="section">
            <h3>Amount Breakdown</h3>
            <div class="row">
              <span class="label">Original Amount:</span>
              <span class="amount">$${payment.amount.toLocaleString()}</span>
            </div>
            <div class="row">
              <span class="label">VAT Deduction (7.5%):</span>
              <span class="amount">-$${(payment.amount * 0.075).toLocaleString()}</span>
            </div>
            ${payment.taxes ? payment.taxes.map(tax => `
              <div class="row">
                <span class="label">${tax.name} (${tax.percentage}%):</span>
                <span class="amount">-$${(payment.amount * tax.percentage / 100).toLocaleString()}</span>
              </div>
            `).join('') : ''}
            <div class="row total">
              <span class="label">Final Amount:</span>
              <span class="amount">$${payment.totalWithTaxes?.toLocaleString() || payment.amount.toLocaleString()}</span>
            </div>
          </div>
          
          ${payment.partialPayments && payment.partialPayments.length > 0 ? `
            <div class="section">
              <h3>Payment History</h3>
              ${payment.partialPayments.map((partial, index) => `
                <div class="partial-payment">
                  <div class="row">
                    <span class="label">Payment ${index + 1}:</span>
                    <span class="amount">$${partial.amount.toLocaleString()}</span>
                  </div>
                  <div class="row">
                    <span class="label">Date:</span>
                    <span>${partial.paymentDate}</span>
                  </div>
                  ${partial.notes ? `
                    <div class="row">
                      <span class="label">Notes:</span>
                      <span>${partial.notes}</span>
                    </div>
                  ` : ''}
                </div>
              `).join('')}
              <div class="row">
                <span class="label">Total Paid:</span>
                <span class="amount">$${payment.totalPaid?.toLocaleString() || 0}</span>
              </div>
              ${payment.remainingAmount && payment.remainingAmount > 0 ? `
                <div class="row">
                  <span class="label">Remaining:</span>
                  <span class="amount">$${payment.remainingAmount.toLocaleString()}</span>
                </div>
              ` : ''}
            </div>
          ` : ''}
        </div>
      </body>
      </html>
    `;
    
    // Create blob and download
    const blob = new Blob([invoiceContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', `invoice_${payment.id}.html`);
    linkElement.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accountant Portal</h1>
          <p className="text-gray-600 mt-2">Manage approved payments and disbursements</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentView('payments')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'payments'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Approved Payments
          </button>
          <button
            onClick={() => setCurrentView('history')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              currentView === 'history'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            View History
          </button>
        </div>
      </div>

      {currentView === 'payments' && (
        <div className="space-y-8">
          {/* Quick Stats - Horizontal Layout */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Quick Stats</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
                <div>
                  <span className="text-sm font-medium text-green-800">Total Payments</span>
                  <p className="text-xs text-green-600 mt-1">All time</p>
                </div>
                <span className="text-2xl font-bold text-green-600">{payments.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                <div>
                  <span className="text-sm font-medium text-blue-800">Pending Approval</span>
                  <p className="text-xs text-blue-600 mt-1">Awaiting review</p>
                </div>
                <span className="text-2xl font-bold text-blue-600">{approvedPayments.length}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <div>
                  <span className="text-sm font-medium text-yellow-800">Processing</span>
                  <p className="text-xs text-yellow-600 mt-1">In progress</p>
                </div>
                <span className="text-2xl font-bold text-yellow-600">
                  {payments.filter(p => p.status === 'processing').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                <div>
                  <span className="text-sm font-medium text-gray-800">Completed</span>
                  <p className="text-xs text-gray-600 mt-1">Successfully paid</p>
                </div>
                <span className="text-2xl font-bold text-gray-600">
                  {payments.filter(p => p.status === 'completed').length}
                </span>
              </div>
            </div>
          </div>

          {/* Approved Payments Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Approved Payments</h2>
              <p className="text-sm text-gray-600 mt-1">Click on a payment to proceed with disbursement</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Approved Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {approvedPayments.map((payment) => (
                    <tr 
                      key={payment.id} 
                      className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                        selectedPayment?.id === payment.id ? 'bg-green-50' : ''
                      }`}
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {getPaymentTypeIcon(payment.paymentType)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{payment.title}</div>
                            <div className="text-sm text-gray-500">{payment.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.recipient}</div>
                        <div className="text-sm text-gray-500">{payment.recipientType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${payment.amount.toLocaleString()}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payment.recipientType === 'external' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {payment.recipientType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{payment.approvedDate}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleProceedWithPayment(payment);
                          }}
                          className="text-green-600 hover:text-green-900 font-medium"
                        >
                          Proceed with Payment
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {currentView === 'history' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Payment History</h2>
            <p className="text-sm text-gray-600 mt-1">Complete history of all payments and disbursements</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recipient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{payment.title}</div>
                        <div className="text-sm text-gray-500">{payment.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{payment.recipient}</div>
                      <div className="text-sm text-gray-500">{payment.recipientType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${payment.amount.toLocaleString()}</div>
                      {payment.totalWithTaxes && payment.totalWithTaxes !== payment.amount && (
                        <div className="text-sm text-gray-500">After taxes: ${payment.totalWithTaxes.toLocaleString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.partialPayments && payment.partialPayments.length > 0 ? (
                        <div className="text-sm">
                          <div className="text-gray-900">Partial Payment</div>
                          <div className="text-gray-500">
                            Paid: ${payment.totalPaid?.toLocaleString() || 0}
                          </div>
                          {payment.remainingAmount && payment.remainingAmount > 0 && (
                            <div className="text-red-500">
                              Remaining: ${payment.remainingAmount.toLocaleString()}
                            </div>
                          )}
                          {getNextDuePercentage(payment) && (
                            <div className="text-blue-600 text-xs mt-1">
                              Next due: {getNextDuePercentage(payment)?.percentage}% (${getNextDuePercentage(payment)?.amount.toLocaleString()})
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">Full Payment</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {payment.status === 'processing' && (
                          <button
                            onClick={() => handleMarkAsDisbursed(payment.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Mark as Disbursed
                          </button>
                        )}
                        {payment.partialPayments && payment.remainingAmount && payment.remainingAmount > 0 && (
                          <button
                            onClick={() => handleAddPartialPayment(payment)}
                            className="text-orange-600 hover:text-orange-900"
                          >
                            Add Payment
                          </button>
                        )}
                        <button
                          onClick={() => generateInvoice(payment)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Download Invoice
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
                <h3 className="text-lg font-medium text-gray-900">Select Taxes</h3>
                <p className="text-sm text-gray-600">Choose applicable taxes for this external payment.</p>
                
                <div className="space-y-3">
                  {availableTaxes.filter(tax => tax.isActive).map((tax) => (
                    <label key={tax.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTaxes.includes(tax.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTaxes([...selectedTaxes, tax.id]);
                          } else {
                            setSelectedTaxes(selectedTaxes.filter(id => id !== tax.id));
                          }
                        }}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{tax.name}</span>
                          <span className="text-sm text-gray-500">{tax.percentage}%</span>
                        </div>
                        <p className="text-xs text-gray-500">{tax.description}</p>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">Original Amount:</span>
                      <span className="text-sm text-blue-600">${selectedPayment?.amount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">VAT Deduction (7.5%):</span>
                      <span className="text-sm text-red-600">-${(selectedPayment?.amount * 0.075).toLocaleString()}</span>
                    </div>
                    {selectedTaxes.map((taxId) => {
                      const tax = availableTaxes.find(t => t.id === taxId);
                      return tax ? (
                        <div key={tax.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-800">{tax.name} ({tax.percentage}%):</span>
                          <span className="text-sm text-red-600">-${(selectedPayment?.amount * tax.percentage / 100).toLocaleString()}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t border-blue-300 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-blue-800">Final Amount:</span>
                        <span className="text-lg font-bold text-green-600">
                          ${calculateTotalWithTaxes().toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

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
                          min="0"
                          max="100"
                          value={percentagePayments.start}
                          onChange={(e) => setPercentagePayments({...percentagePayments, start: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">Mid (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={percentagePayments.mid}
                          onChange={(e) => setPercentagePayments({...percentagePayments, mid: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-1">End (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={percentagePayments.end}
                          onChange={(e) => setPercentagePayments({...percentagePayments, end: Number(e.target.value)})}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    {percentagePayments.start + percentagePayments.mid + percentagePayments.end > 100 && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">
                          <strong>Error:</strong> Total percentage cannot exceed 100%. 
                          Current total: {percentagePayments.start + percentagePayments.mid + percentagePayments.end}%
                        </p>
                      </div>
                    )}
                    <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
                      <p className="text-sm text-gray-600">
                        <strong>Total:</strong> {percentagePayments.start + percentagePayments.mid + percentagePayments.end}%
                      </p>
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
                    disabled={paymentMethod === 'percentage' && percentagePayments.start + percentagePayments.mid + percentagePayments.end > 100}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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

      {/* Add Partial Payment Modal */}
      {showAddPaymentModal && selectedPaymentForPartial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Partial Payment</h3>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Payment Details</h4>
                <p className="text-sm text-blue-800">{selectedPaymentForPartial.title}</p>
                <div className="mt-2 text-sm text-blue-700">
                  <div>Total Amount: ${selectedPaymentForPartial.amount.toLocaleString()}</div>
                  <div>Paid: ${selectedPaymentForPartial.totalPaid?.toLocaleString() || 0}</div>
                  <div>Remaining: ${selectedPaymentForPartial.remainingAmount?.toLocaleString() || 0}</div>
                  {getNextDuePercentage(selectedPaymentForPartial) && (
                    <div className="font-medium">
                      Next due: {getNextDuePercentage(selectedPaymentForPartial)?.percentage}% (${getNextDuePercentage(selectedPaymentForPartial)?.amount.toLocaleString()})
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Amount</label>
                <input
                  type="number"
                  value={newPartialPayment.amount}
                  onChange={(e) => setNewPartialPayment({ ...newPartialPayment, amount: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter payment amount"
                  min="0"
                  max={selectedPaymentForPartial.remainingAmount || selectedPaymentForPartial.amount}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                <textarea
                  value={newPartialPayment.notes}
                  onChange={(e) => setNewPartialPayment({ ...newPartialPayment, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  rows={3}
                  placeholder="Add any notes about this payment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Receipt (Optional)</label>
                <input
                  type="file"
                  onChange={(e) => setNewPartialPayment({ ...newPartialPayment, receipt: e.target.files?.[0]?.name || '' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  accept=".pdf,.jpg,.jpeg,.png"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPartialPayment}
                  disabled={newPartialPayment.amount <= 0}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Add Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountantView;
