import React from 'react';
import { FileText, Search, Filter, ChevronDown, Clock, CheckCircle2, AlertTriangle, ArrowUpRight, Users, Tag, Calendar, MoreHorizontal } from 'lucide-react';
import { Trash2 } from 'lucide-react';

interface Transaction {
  id: string;
  title: string;
  type: 'contract' | 'proposal' | 'agreement' | 'other';
  status: 'draft' | 'pending' | 'completed' | 'expired' | 'rejected';
  amount: number;
  dueDate: string;
  created: string;
  modified: string;
  parties: Array<{
    name: string;
    email: string;
    role: string;
    status: 'pending' | 'signed' | 'declined';
    signedAt?: string;
  }>;
  tags: string[];
}

export function TransactionsView() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [dateFilter, setDateFilter] = React.useState('all');
  const [selectedTransactions, setSelectedTransactions] = React.useState<string[]>([]);

  const [transactions] = React.useState<Transaction[]>([
    {
      id: '1',
      title: 'Commercial Lease Agreement - Downtown Office',
      type: 'contract',
      status: 'pending',
      amount: 250000,
      dueDate: '2025-04-01',
      created: '2025-03-15',
      modified: '2025-03-15',
      parties: [
        { name: 'John Smith', email: 'john@example.com', role: 'Tenant', status: 'signed', signedAt: '2025-03-15T14:30:00Z' },
        { name: 'Sarah Johnson', email: 'sarah@example.com', role: 'Landlord', status: 'pending' }
      ],
      tags: ['Commercial', 'Priority', 'Q2 2025']
    },
    {
      id: '2',
      title: 'Property Purchase Agreement - 123 Main St',
      type: 'contract',
      status: 'completed',
      amount: 750000,
      dueDate: '2025-03-30',
      created: '2025-03-10',
      modified: '2025-03-15',
      parties: [
        { name: 'Michael Chen', email: 'michael@example.com', role: 'Buyer', status: 'signed', signedAt: '2025-03-14T10:15:00Z' },
        { name: 'Emma Wilson', email: 'emma@example.com', role: 'Seller', status: 'signed', signedAt: '2025-03-15T09:30:00Z' }
      ],
      tags: ['Residential', 'Completed']
    },
    {
      id: '3',
      title: 'Investment Property Proposal',
      type: 'proposal',
      status: 'draft',
      amount: 1200000,
      dueDate: '2025-04-15',
      created: '2025-03-14',
      modified: '2025-03-14',
      parties: [
        { name: 'David Brown', email: 'david@example.com', role: 'Investor', status: 'pending' }
      ],
      tags: ['Investment', 'Draft']
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

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 overflow-hidden">
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <ArrowUpRight className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Transactions</h1>
              <p className="text-white/60">Manage and track document transactions</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Advanced Filters</span>
            </button>
            <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>New Transaction</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="expired">Expired</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{transaction.title}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(transaction.status)}`}>
                        {getStatusIcon(transaction.status)}
                        <span>{transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}</span>
                      </div>
                      <span className="text-white/40">•</span>
                      <div className="flex items-center space-x-1 text-white/60">
                        <Calendar className="w-4 h-4" />
                        <span>Due {new Date(transaction.dueDate).toLocaleDateString()}</span>
                      </div>
                      <span className="text-white/40">•</span>
                      <div className="text-[#FFD700] font-medium">
                        ${transaction.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 text-white/60 hover:text-white" />
                  </button>
                  <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <MoreHorizontal className="w-4 h-4 text-white/60 hover:text-white" />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex -space-x-2">
                    {transaction.parties.map((party, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 border-zinc-900 ${
                          party.status === 'signed' ? 'bg-emerald-500/20' : 'bg-zinc-700'
                        } flex items-center justify-center`}
                        title={`${party.name} (${party.role}) - ${party.status}`}
                      >
                        {party.status === 'signed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-white/60">
                    {transaction.parties.filter(p => p.status === 'signed').length} of {transaction.parties.length} signed
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {transaction.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}