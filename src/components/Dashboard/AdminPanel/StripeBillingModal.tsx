import React, { useEffect } from 'react';
import { X, CreditCard, ArrowUpRight, Building2, Link, CheckCircle2, Code, Copy, ExternalLink, Book, DollarSign, PenSquare, Plus, BarChart2, Link as LinkIcon } from 'lucide-react';
import { EditPlanModal } from './EditPlanModal';
import { CreateInvoiceModal } from './CreateInvoiceModal';
import { PlansPreviewModal } from './PlansPreviewModal';
import { usePlans } from '../../../hooks/usePlans';

interface StripeBillingModalProps {
  onClose: () => void;
}

export function StripeBillingModal({ onClose }: StripeBillingModalProps) {
  const { plans, syncWithStripe } = usePlans();
  const [activeTab, setActiveTab] = React.useState<'overview' | 'plans' | 'invoices' | 'settings'>('overview');
  const [showEditPlan, setShowEditPlan] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [showCreateInvoice, setShowCreateInvoice] = React.useState(false);
  const [showPlansPreview, setShowPlansPreview] = React.useState(false);
  const [selectedInvoice, setSelectedInvoice] = React.useState<any>(null);

  // Mock recent invoices data
  const recentInvoices = [
    {
      id: '1',
      customer: 'Sarah Johnson',
      amount: '$299',
      status: 'paid',
      date: 'Mar 15, 2025'
    },
    {
      id: '2',
      customer: 'Mike Chen',
      amount: '$599',
      status: 'pending',
      date: 'Mar 14, 2025'
    },
    {
      id: '3',
      customer: 'Emma Wilson',
      amount: '$99',
      status: 'paid',
      date: 'Mar 13, 2025'
    },
    {
      id: '4',
      customer: 'James Brown',
      amount: '$299',
      status: 'paid',
      date: 'Mar 12, 2025'
    },
    {
      id: '5',
      customer: 'Lisa Anderson',
      amount: '$899',
      status: 'pending',
      date: 'Mar 11, 2025'
    }
  ];

  // Sync with Stripe on mount
  useEffect(() => {
    syncWithStripe();
  }, [syncWithStripe]);

  const handleEditPlan = (plan: any) => {
    setSelectedPlan(plan);
    setShowEditPlan(true);
  };

  const handlePlanUpdate = async (planId: string, newPrice: string) => {
    // In a real app, this would update the plan price in Stripe
    console.log(`Updating plan ${planId} to ${newPrice}`);
    setShowEditPlan(false);
  };

  const handleCreateInvoice = async (invoiceData: any) => {
    // In a real app, this would create a new invoice in Stripe
    console.log('Creating invoice:', invoiceData);
    setShowCreateInvoice(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-6xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#635BFF]/20 to-[#635BFF]/10 flex items-center justify-center border border-[#635BFF]/30">
              <CreditCard className="w-6 h-6 text-[#635BFF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stripe Billing Dashboard</h2>
              <p className="text-white/60">Manage plans, invoices, and revenue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-[#B38B3F]/20">
          <div className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'overview'
                  ? 'border-[#635BFF] text-[#635BFF]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'plans'
                  ? 'border-[#635BFF] text-[#635BFF]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              Plans
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'invoices'
                  ? 'border-[#635BFF] text-[#635BFF]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              Invoices
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#635BFF] text-[#635BFF]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
          {activeTab === 'overview' && (
            <div className="p-6 space-y-6">
              {/* Revenue Overview */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white/70">Monthly Revenue</h3>
                    <BarChart2 className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <div className="text-2xl font-bold text-white">$35,325</div>
                  <div className="text-sm text-emerald-400">↑ 12% from last month</div>
                </div>
                <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white/70">Active Subscriptions</h3>
                    <CreditCard className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <div className="text-2xl font-bold text-white">800</div>
                  <div className="text-sm text-emerald-400">↑ 8% from last month</div>
                </div>
                <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-white/70">Average Revenue/User</h3>
                    <DollarSign className="w-5 h-5 text-[#635BFF]" />
                  </div>
                  <div className="text-2xl font-bold text-white">$44.15</div>
                  <div className="text-sm text-emerald-400">↑ 5% from last month</div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-[#B38B3F]/20">
                  <h3 className="text-white font-medium">Recent Activity</h3>
                </div>
                <div className="divide-y divide-[#B38B3F]/20">
                  {recentInvoices.map((invoice) => (
                    <div key={invoice.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{invoice.customer}</div>
                        <div className="text-sm text-white/60">{invoice.date}</div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {invoice.status}
                        </div>
                        <div className="text-white font-medium">{invoice.amount}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'plans' && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Subscription Plans</h3>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowPlansPreview(true)}
                    className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm flex items-center space-x-1"
                  >
                    <span>Preview Plans</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                  <a
                    href="https://dashboard.stripe.com/products"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm flex items-center space-x-1"
                  >
                    <span>Manage in Stripe</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="grid gap-6">
                {plans.map((plan) => (
                  <div key={plan.id} className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">{plan.name}</h4>
                        <div className="text-2xl font-bold text-[#635BFF] mt-1">{plan.price}</div>
                      </div>
                      <button
                        onClick={() => handleEditPlan(plan)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        <PenSquare className="w-5 h-5 text-white/60 hover:text-white" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div>
                        <div className="text-white/60 text-sm">Active Users</div>
                        <div className="text-white font-medium mt-1">{plan.users}</div>
                      </div>
                      <div>
                        <div className="text-white/60 text-sm">Monthly Revenue</div>
                        <div className="text-white font-medium mt-1">{plan.revenue}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'invoices' && (
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Invoices</h3>
                <div className="flex items-center space-x-4">
                  <a
                    href="https://dashboard.stripe.com/invoices"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm flex items-center space-x-1"
                  >
                    <span>View in Stripe</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setShowCreateInvoice(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-[#635BFF] text-white rounded-lg hover:bg-[#635BFF]/90 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Invoice</span>
                  </button>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#B38B3F]/20">
                      <th className="text-left py-4 px-4 text-white/70 font-medium">Customer</th>
                      <th className="text-left py-4 px-4 text-white/70 font-medium">Amount</th>
                      <th className="text-left py-4 px-4 text-white/70 font-medium">Status</th>
                      <th className="text-left py-4 px-4 text-white/70 font-medium">Date</th>
                      <th className="text-right py-4 px-4 text-white/70 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-[#B38B3F]/10">
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">{invoice.customer}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-white">{invoice.amount}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}>
                            {invoice.status}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-white/70">{invoice.date}</div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button className="text-white/60 hover:text-white text-sm">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 space-y-6">
              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Stripe Connection</h3>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span className="text-white">Connected to Stripe</span>
                  </div>
                  <a
                    href="https://dashboard.stripe.com/settings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm flex items-center space-x-1"
                  >
                    <span>Manage Settings</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">Webhook Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-medium">Endpoint URL</div>
                      <div className="text-white/60 text-sm">https://api.prophone.io/webhooks/stripe</div>
                    </div>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <Copy className="w-5 h-5 text-white/60 hover:text-white" />
                    </button>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-2">Active Events</div>
                    <div className="space-y-2">
                      {['payment_intent.succeeded', 'invoice.paid', 'customer.subscription.updated'].map((event) => (
                        <div key={event} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <code className="text-sm text-white/70">{event}</code>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
                <h3 className="text-lg font-bold text-white mb-4">API Keys</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-white font-medium mb-2">Live Secret Key</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 font-mono text-white/60 bg-zinc-900 px-3 py-2 rounded-lg">
                        sk_live_•••••••••••••••••
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Copy className="w-5 h-5 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium mb-2">Live Publishable Key</div>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 font-mono text-white/60 bg-zinc-900 px-3 py-2 rounded-lg">
                        pk_live_•••••••••••••••••
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <Copy className="w-5 h-5 text-white/60 hover:text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showEditPlan && selectedPlan && (
        <EditPlanModal
          plan={selectedPlan}
          onClose={() => setShowEditPlan(false)}
          onSave={handlePlanUpdate}
        />
      )}

      {showCreateInvoice && (
        <CreateInvoiceModal
          onClose={() => setShowCreateInvoice(false)}
          onSave={handleCreateInvoice}
        />
      )}
      
      {showPlansPreview && (
        <PlansPreviewModal onClose={() => setShowPlansPreview(false)} />
      )}
    </div>
  );
}

interface InvoiceDetailsModalProps {
  invoice: any;
  onClose: () => void;
}

function InvoiceDetailsModal({ invoice, onClose }: InvoiceDetailsModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <h3 className="text-xl font-bold text-white">Invoice Details</h3>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <div className="text-white/60 text-sm">Customer</div>
              <div className="text-white font-medium mt-1">{invoice.customer}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Amount</div>
              <div className="text-white font-medium mt-1">{invoice.amount}</div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Status</div>
              <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                invoice.status === 'paid'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}>
                {invoice.status}
              </div>
            </div>
            <div>
              <div className="text-white/60 text-sm">Date</div>
              <div className="text-white font-medium mt-1">{invoice.date}</div>
            </div>
          </div>

          {invoice.status === 'pending' && (
            <div className="bg-[#635BFF]/10 border border-[#635BFF]/20 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[#635BFF] font-medium">Payment Link</h4>
                  <p className="text-white/60 text-sm mt-1">Share this link with your customer to collect payment</p>
                </div>
                <button className="text-[#635BFF] hover:text-[#635BFF]/80 text-sm flex items-center">
                  <Copy className="w-4 h-4 mr-1" />
                  Copy Link
                </button>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}