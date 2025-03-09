import React from 'react';
import { CreditCard, Plus, Download, ArrowRight, Receipt, Wallet, AlertTriangle } from 'lucide-react';
import { BillingTabs } from './components/BillingTabs';
import { PlansSection } from './components/PlansSection';
import { PaymentMethodSection } from './components/PaymentMethodSection';
import { InvoiceFilters } from './components/InvoiceFilters';
import { InvoiceTable } from './components/InvoiceTable';
import { PaymentMethodModal } from './PaymentMethodModal';

interface BillingSectionProps {
  userData: any;
}

export function BillingSection({ userData }: BillingSectionProps) {

  const [currentTab, setCurrentTab] = React.useState<string>('plans');
  const [invoices, setInvoices] = React.useState<any[]>([]);
  const [isLoadingInvoices, setIsLoadingInvoices] = React.useState(false);
  const [dateFilter, setDateFilter] = React.useState('all');
  const [dateRange, setDateRange] = React.useState<{start: string; end: string}>({
    start: '',
    end: ''
  });
  const [showDateRange, setShowDateRange] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedInvoices, setSelectedInvoices] = React.useState<Array<string>>([]);
  const [selectAll, setSelectAll] = React.useState<boolean>(false);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);
  const [showPaymentModal, setShowPaymentModal] = React.useState<boolean>(false);
  const [paymentMethods, setPaymentMethods] = React.useState<Array<any>>([]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = React.useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = React.useState<string>('idle');
  const [saveStatus, setSaveStatus] = React.useState<string>('idle');

  // Load invoices when tab changes
  React.useEffect(() => {
    const loadInvoices = async () => {
      if (currentTab !== 'invoices') return;
      
      setIsLoadingInvoices(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data
        const mockInvoices = [
          {
            id: 'in_1234',
            number: 'INV-2025-001',
            amount: 2900,
            status: 'paid',
            created: Date.now() - 86400000,
            dueDate: '2025-04-15',
            downloadUrl: '#'
          },
          {
            id: 'in_1235',
            number: 'INV-2025-002',
            amount: 2900,
            status: 'paid',
            created: Date.now() - 86400000 * 30,
            dueDate: '2025-03-15',
            downloadUrl: '#'
          }
        ];
        
        setInvoices(mockInvoices);
      } catch (error) {
        console.error('Failed to load invoices:', error);
      } finally {
        setIsLoadingInvoices(false);
      }
    };
    
    loadInvoices();
  }, [currentTab]);

  // Load payment methods
  React.useEffect(() => {
    const loadPaymentMethods = async () => {
      if (currentTab !== 'payment') return;
      
      setIsLoadingPaymentMethods(true);
      try {
        // Mock data
        const mockPaymentMethods = [
          {
            id: 'pm_1234',
            card: {
              brand: 'visa',
              last4: '4242',
              exp_month: 12,
              exp_year: 25
            },
            isDefault: true
          }
        ];
        
        setPaymentMethods(mockPaymentMethods);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      } finally {
        setIsLoadingPaymentMethods(false);
      }
    };
    
    loadPaymentMethods();
  }, [currentTab]);

  const plans = [
    {
      name: 'Business Starter',
      price: 'Free',
      features: [
        'Basic Marketing Tools',
        'Up to 100 Contacts',
        'Email Support',
        'Basic Analytics',
        'Standard Templates'
      ],
      current: userData?.plan === 'starter'
    },
    {
      name: 'Business Pro',
      price: '$29',
      features: [
        'Advanced Marketing Tools',
        'Up to 2500 Contacts',
        'Priority Support',
        'Advanced Analytics',
        'Premium Templates',
        'Custom Branding',
        'API Access'
      ],
      current: userData?.plan === 'pro'
    },
    {
      name: 'Business Elite',
      price: '$99',
      features: [
        'Enterprise Marketing Suite',
        'Unlimited Contacts',
        '24/7 Dedicated Support',
        'Custom Analytics',
        'Custom Templates',
        'White Labeling',
        'API Access',
        'Custom Integrations',
        'Dedicated Account Manager'
      ],
      current: userData?.plan === 'enterprise'
    }
  ];

  const handleDownloadInvoices = async (ids: string[]) => {
    setIsDownloading(true);
    try {
      await Promise.all(ids.map(async (id) => {
        const invoice = invoices.find(inv => inv.id === id);
        if (!invoice) return;
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Simulate download
        const element = document.createElement('a');
        element.href = `data:text/plain;charset=utf-8,Invoice ${invoice.number}`;
        element.download = `invoice-${invoice.number}.pdf`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }));
    } catch (error) {
      console.error('Failed to download invoices:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const selectedData = invoices
        .filter(inv => selectedInvoices.includes(inv.id))
        .map(inv => ({
          number: inv.number,
          amount: (inv.amount / 100).toFixed(2),
          status: inv.status,
          date: new Date(inv.created).toLocaleDateString(),
          dueDate: inv.dueDate
        }));

      const headers = ['Invoice Number,Amount,Status,Date,Due Date\n'];
      const rows = selectedData.map(inv => 
        `${inv.number},$${inv.amount},${inv.status},${inv.date},${inv.dueDate}\n`
      );
      const csvContent = headers.concat(rows).join('');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `invoice-report-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error) {
      console.error('Failed to export report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-8">
      <BillingTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {currentTab === 'plans' && (
        <PlansSection 
          plans={plans}
          onUpgrade={(plan) => {
            console.log('Upgrade to:', plan.name);
          }}
          onCancel={() => {
            console.log('Cancel subscription');
          }}
        />
      )}

      {currentTab === 'payment' && (
        <PaymentMethodSection
          paymentMethods={paymentMethods}
          isLoading={isLoadingPaymentMethods}
          onAddPaymentMethod={() => setShowPaymentModal(true)}
        />
      )}

      {currentTab === 'invoices' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Invoices</h2>
            <div className="flex items-center space-x-3">
              {selectedInvoices.length > 0 && (
                <>
                  <button
                    onClick={handleExportReport}
                    disabled={isExporting}
                    className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] font-medium rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export Report</span>
                  </button>
                  <button
                    onClick={() => handleDownloadInvoices(selectedInvoices)}
                    disabled={isDownloading}
                    className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2 disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isDownloading 
                        ? 'Downloading...' 
                        : `Download ${selectedInvoices.length} Selected`}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#B38B3F]/20 to-zinc-700 border border-[#B38B3F]/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-2">Monthly Usage</h3>
            <p className="text-[#FFD700] text-sm mb-4">Upgrade for unlimited - see plans below</p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'CRM Contacts', current: 100, total: 5000 },
                { label: 'SMS Sent', current: 100, total: 15000 },
                { label: 'Flows', current: 30, total: 500, suffix: 'Tasks' },
                { label: 'Landing Page', current: 1, total: 1 },
                { label: 'Websites', current: 1, total: 1 },
                { label: 'Funnels', current: 1, total: 1 },
                { label: 'Email Marketing Sends', current: 35, total: 1000 },
                { label: 'Audience Contacts', current: 300, total: 5000 },
                { label: 'Power Dialer Calls', current: 120, total: 1000 }
              ].map((item) => (
                <div key={item.label} className="bg-zinc-600/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-white/70 text-xs">{item.label}</span>
                    <span className="text-white/70 text-xs">
                      {item.current} of {item.total}{item.suffix ? ` ${item.suffix}` : ''}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#B38B3F]/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#B38B3F] to-[#FFD700] rounded-full transition-all duration-500"
                      style={{ width: `${(item.current / item.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <InvoiceFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            dateRange={dateRange}
            setDateRange={setDateRange}
            showDateRange={showDateRange}
            setShowDateRange={setShowDateRange}
          />

          {isLoadingInvoices ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-t-transparent border-[#B38B3F] rounded-full animate-spin" />
            </div>
          ) : invoices.length > 0 ? (
            <InvoiceTable
              invoices={invoices}
              selectedInvoices={selectedInvoices}
              setSelectedInvoices={setSelectedInvoices}
              selectAll={selectAll}
              setSelectAll={setSelectAll}
              onDownload={handleDownloadInvoices}
            />
          ) : (
            <div className="text-center py-12 text-white/50">
              No invoices found
            </div>
          )}
        </div>
      )}

      {showPaymentModal && (
        <PaymentMethodModal
          onClose={() => setShowPaymentModal(false)}
          onSuccess={(paymentMethod) => {
            setPaymentMethods(prev => [paymentMethod, ...prev]);
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
}