import React from 'react';
import { Ban, CreditCard, Plus, Download, ArrowRight, Receipt, Wallet, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { RemoveAdsModal } from '../RemoveAdsModal';

interface BillingSectionProps {
  userData: any;
}

export function BillingSection({ userData }: BillingSectionProps) {
  const { user } = useAuth();
  const [showRemoveAdsModal, setShowRemoveAdsModal] = React.useState(false);
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

  // Hide for platform owner and super admins
  if (user?.role === 'owner' || user?.role === 'super_admin' || user?.adFreeSubscription?.active) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Remove Ads Section */}
      {user?.showAds && (
        <div className="bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 border border-[#B38B3F]/30 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Ban className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Remove Ads</h3>
              <p className="text-white/60">Enjoy an ad-free experience for $10/month</p>
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
    </div>
  );
}