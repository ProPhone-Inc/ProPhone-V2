import React from 'react';
import { Search, Filter, ChevronDown, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, Archive, Home, Bell, Download, LayoutGrid, Plus } from 'lucide-react';
import { Trash2 } from 'lucide-react';
import { TransactionDetailView } from './TransactionDetailView';

interface Transaction {
  id: string;
  type: 'Purchase' | 'Listing for Sale';
  status: 'Pre-Offer' | 'Under Contract' | 'Pre-Listing' | 'Active Listing';
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  created: string;
  closingDate?: string;
}

export function TransactionsView() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('creation');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);

  const [transactions] = React.useState<Transaction[]>([
    {
      id: '1',
      propertyAddress: '644 Highway 13',
      city: 'Cunningham',
      state: 'TN',
      zip: '37052',
      type: 'Purchase',
      status: 'Pre-Offer',
      price: 234499,
      created: '2025-02-13 8:15 PM'
    },
    {
      id: '2',
      propertyAddress: '108 65th Ave',
      city: 'Palmer',
      state: 'TN',
      zip: '37365',
      type: 'Purchase',
      status: 'Under Contract',
      price: 155000,
      created: '2025-01-30 10:16 AM',
      closingDate: '2025-03-23'
    },
    {
      id: '3',
      propertyAddress: '4009 Sawmill Road',
      city: 'Woodlawn',
      state: 'TN',
      zip: 'USA',
      type: 'Listing for Sale',
      status: 'Pre-Listing',
      price: 289900,
      created: '2025-01-14 9:36 AM'
    }
  ]);

  const getStatusStyles = (status: Transaction['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'expired':
        return 'bg-red-500/20 text-red-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'draft':
        return <FileText className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'expired':
      case 'rejected':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (selectedTransaction) {
    return (
      <TransactionDetailView
        transaction={selectedTransaction}
        onBack={() => setSelectedTransaction(null)}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 overflow-hidden">
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <ArrowUpRight className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Default Profile</h1>
              <p className="text-white/60">Clarksville Real Estate Inc</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">64</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] via-[#FFD700] to-[#B38B3F] text-black font-medium rounded-lg 
              hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:shadow-[#B38B3F]/20 
              bg-[length:200%_100%] hover:bg-[100%_0] bg-[0%_0] transform hover:scale-105 active:scale-95
              flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Add Loop</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search by address, title, MLS#, etc."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white hover:bg-zinc-700 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              <span className="bg-blue-500 text-white text-xs px-1.5 rounded">2</span>
            </button>
            <div className="flex items-center space-x-2 px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white">
              <span>Sort: Creation date</span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <button className="p-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white hover:bg-zinc-700 transition-colors">
              <Download className="w-5 h-5" />
            </button>
            <button className="p-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white hover:bg-zinc-700 transition-colors">
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              onClick={() => setSelectedTransaction(transaction)}
              className="bg-gradient-to-br from-zinc-900/95 to-black/95 rounded-xl border border-[#B38B3F]/30 overflow-hidden 
                transform transition-all duration-300 hover:scale-[1.02] hover:border-[#FFD700]/40 hover:shadow-lg hover:shadow-[#B38B3F]/20 
                group relative cursor-pointer"
            >
              {/* Animated gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/5 to-[#B38B3F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Property Icon */}
              <div className="p-4 border-b border-[#B38B3F]/20 relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30 
                  group-hover:border-[#FFD700]/40 transition-colors">
                  <Home className="w-6 h-6 text-[#FFD700] group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>

              {/* Property Details */}
              <div className="p-4">
                <h3 className="text-white font-medium mb-2 group-hover:text-[#FFD700] transition-colors">{transaction.propertyAddress}</h3>
                <p className="text-white/60 text-sm mb-4">
                  {transaction.city}, {transaction.state} {transaction.zip}
                </p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Type:</span>
                    <span className="text-white">{transaction.type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Status:</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusStyles(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Price:</span>
                    <span className="text-[#FFD700] font-medium">${transaction.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Created:</span>
                    <span className="text-white">{transaction.created}</span>
                  </div>
                </div>
              </div>
              
              {/* Action Button */}
              <div className="p-4 border-t border-[#B38B3F]/20">
                <button className="w-full flex items-center justify-center space-x-2 text-sm text-[#FFD700] hover:text-[#FFD700]/80 transition-colors">
                  <Archive className="w-4 h-4" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}