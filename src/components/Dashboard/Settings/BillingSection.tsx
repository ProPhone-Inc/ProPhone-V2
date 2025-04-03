import React from 'react';
import { Ban, CreditCard, Plus, Download, ArrowRight, Receipt, Wallet, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { RemoveAdsModal } from '../RemoveAdsModal';
import { BillingTabs } from './components/BillingTabs';
import { InvoiceFilters } from './components/InvoiceFilters';
import { InvoiceTable } from './components/InvoiceTable';
import { PaymentMethodList } from './components/PaymentMethodList';
import { GenerateReportModal } from './components/GenerateReportModal';
import { PaymentMethodModal } from './PaymentMethodModal';
import { PlansPreviewModal } from './PlansPreviewModal';
import { TeamPanelModal } from '../TeamPanel/components/TeamPanelModal';

interface BillingSectionProps {
  userData: any;
  onClose: () => void;
  setShowTeamPanel: (show: boolean) => void;
}

export function BillingSection({ userData, onClose, setShowTeamPanel }: BillingSectionProps) {
  const [showRemoveAdsModal, setShowRemoveAdsModal] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState<string>('plans');
  const [invoices, setInvoices] = React.useState<any[]>([
    {
      id: 'inv_123456',
      number: 'INV-001',
      amount: 2900,
      status: 'paid',
      created: 1709596800000, // March 5, 2025
      dueDate: '2025-03-15',
      downloadUrl: '#'
    },
    {
      id: 'inv_123457',
      number: 'INV-002',
      amount: 2900,
      status: 'paid',
      created: 1712275200000, // April 5, 2025
      dueDate: '2025-04-15',
      downloadUrl: '#'
    },
    {
      id: 'inv_123458',
      number: 'INV-003',
      amount: 2900,
      status: 'open',
      created: 1714867200000, // May 5, 2025
      dueDate: '2025-05-15',
      downloadUrl: '#'
    }
  ]);
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
  const [paymentMethods, setPaymentMethods] = React.useState<Array<any>>([
    {
      id: 'pm_123456',
      card: {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      },
      isDefault: true
    }
  ]);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = React.useState<boolean>(false);
  const [updateStatus, setUpdateStatus] = React.useState<string>('idle');
  const [saveStatus, setSaveStatus] = React.useState<string>('idle');
  const [showReportModal, setShowReportModal] = React.useState<boolean>(false);
  const [showPlansModal, setShowPlansModal] = React.useState<boolean>(false);
  const [showTeamPanelLocal, setShowTeamPanelLocal] = React.useState(false);

  const handleDownloadInvoices = (ids: string[]) => {
    setIsDownloading(true);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would trigger actual downloads
      console.log(`Downloading invoices: ${ids.join(', ')}`);
    }, 1500);
  };

  const handleGenerateReport = (dateRange: { start: string; end: string } | string) => {
    setIsExporting(true);
    
    // Simulate report generation
    setTimeout(() => {
      setIsExporting(false);
      // In a real app, this would generate and download a report
      console.log(`Generating report for: ${typeof dateRange === 'string' ? dateRange : `${dateRange.start} to ${dateRange.end}`}`);
    }, 2000);
  };

  const handleAddPaymentMethod = (paymentMethod: any) => {
    setPaymentMethods(prev => [
      { ...paymentMethod, isDefault: prev.length === 0 },
      ...prev.map(pm => ({ ...pm, isDefault: false }))
    ]);
    setShowPaymentModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Billing Tabs */}
      <BillingTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Subscription Plans Tab */}
      {currentTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/30 rounded-xl p-6 backdrop-blur-sm w-full">
              <h3 className="text-lg font-bold text-white mb-4">Current Plan Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Plan</span>
                  <span className="text-white font-medium">Free</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Price</span>
                  <span className="text-white font-medium">Total: $20/month ($10 team members + $10 ads removal)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Billing Period</span>
                  <span className="text-white font-medium">Monthly</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Next Payment</span>
                  <span className="text-white font-medium">May 15, 2025</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Ads</span>
                  <span className="text-emerald-400 font-medium">Removed</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Team Members</span>
                  <span className="text-white font-medium">2 members ($5/month each)</span>
                </div>
                <button
                  onClick={() => setShowTeamPanel(true)}
                  className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center space-x-1 mt-2"
                >
                  <span>View Team</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6 mb-12 w-full">
            <div className="bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/30 rounded-xl p-6 transform-none">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                    <Ban className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Remove Ads</h3>
                    <p className="text-white/60">Enjoy an ad-free experience</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRemoveAdsModal(true)}
                  className="w-full py-3 bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                >
                  <Ban className="w-4 h-4" />
                  <span>Remove Ads ($10/month)</span>
                </button>
              </div>
            
            <div className="bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/30 rounded-xl p-6 transform-none">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                    <Users className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Add Team Members</h3>
                    <p className="text-white/60">Each member is $5/month</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (onClose) {
                      onClose();
                      // Small delay to ensure settings modal is fully closed before opening team panel
                      setTimeout(() => {
                        setShowTeamPanel(true);
                      }, 50);
                    } else {
                      setShowTeamPanelLocal(true);
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
                >
                  <Users className="w-4 h-4" />
                  <span>Open Team Panel</span>
                </button>
              </div>
          </div>
          
          {/* Add more spacing at the bottom for a cleaner look */}
          <div className="h-16"></div>
        </div>
      )}

      {/* Payment Methods Tab */}
      {currentTab === 'payment' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Payment Methods</h3>
            <button 
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Payment Method</span>
            </button>
          </div>

          <PaymentMethodList
            paymentMethods={paymentMethods}
            isLoading={isLoadingPaymentMethods}
            onEdit={(method) => {
              // In a real app, this would open an edit modal
              console.log('Edit payment method:', method);
            }}
          />

          <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-amber-400 font-medium">Payment Security</h4>
              <p className="text-amber-400/80 text-sm mt-1">
                All payment information is securely processed and stored by Stripe. We never store your card details.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invoices Tab */}
      {currentTab === 'invoices' && (
        <div className="space-y-6">
          <InvoiceFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
          />

          <InvoiceTable
            invoices={invoices}
            selectedInvoices={selectedInvoices}
            setSelectedInvoices={setSelectedInvoices}
            selectAll={selectAll}
            setSelectAll={setSelectAll}
            onDownload={handleDownloadInvoices}
          />
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <GenerateReportModal
          onClose={() => setShowReportModal(false)}
          onGenerate={handleGenerateReport}
        />
      )}

      {/* Payment Method Modal */}
      {showPaymentModal && (
        <PaymentMethodModal
          onClose={() => setShowPaymentModal(false)}
          onSave={handleAddPaymentMethod}
        />
      )}

      {/* Plans Preview Modal */}
      {showPlansModal && (
        <PlansPreviewModal onClose={() => setShowPlansModal(false)} />
      )}

      {/* Remove Ads Modal */}
      {showRemoveAdsModal && (
        <RemoveAdsModal
          onClose={() => setShowRemoveAdsModal(false)}
          onSubscribe={() => {
            // Handle subscription
            setShowRemoveAdsModal(false);
          }}
        />
      )}
      
      {/* Team Panel Modal */}
      {showTeamPanelLocal && (
        <TeamPanelModal
          isOpen={showTeamPanelLocal}
          onClose={() => {
            setShowTeamPanelLocal(false);
          }}
        />
      )}
    </div>
  );
}