import React from 'react';
import { X, Users, Search, Filter, ChevronDown, Check, ArrowRight } from 'lucide-react';

interface CRMList {
  id: string;
  name: string;
  description: string;
  count: number;
  lastUpdated: string;
  tags: string[];
}

interface ImportFromCRMModalProps {
  onClose: () => void;
  onImport: (listId: string) => void;
}

export function ImportFromCRMModal({ onClose, onImport }: ImportFromCRMModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedList, setSelectedList] = React.useState<string | null>(null);
  const [isImporting, setIsImporting] = React.useState(false);

  // Mock CRM lists data
  const crmLists: CRMList[] = [
    {
      id: '1',
      name: 'Active Buyers',
      description: 'Qualified leads actively looking to purchase',
      count: 234,
      lastUpdated: '2025-03-15',
      tags: ['Buyers', 'Active', 'Qualified']
    },
    {
      id: '2',
      name: 'Recent Website Inquiries',
      description: 'Leads from website contact forms',
      count: 156,
      lastUpdated: '2025-03-14',
      tags: ['Website', 'New Leads']
    },
    {
      id: '3',
      name: 'Past Clients',
      description: 'Previous successful transactions',
      count: 892,
      lastUpdated: '2025-03-13',
      tags: ['Clients', 'Completed']
    }
  ];

  const filteredLists = crmLists.filter(list =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleImport = async () => {
    if (!selectedList) return;
    
    setIsImporting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      onImport(selectedList);
      onClose();
    } catch (error) {
      console.error('Failed to import list:', error);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Users className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Import from CRM</h2>
              <p className="text-white/60">Select a list to import contacts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              <select
                className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
              >
                <option value="all">All Lists</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredLists.map((list) => (
              <button
                key={list.id}
                onClick={() => setSelectedList(list.id)}
                className={`w-full p-4 text-left rounded-xl border transition-all duration-200 ${
                  selectedList === list.id
                    ? 'bg-[#B38B3F]/20 border-[#B38B3F]/40'
                    : 'bg-zinc-800/50 border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-white">{list.name}</h3>
                      <p className="text-sm text-white/60">{list.description}</p>
                    </div>
                  </div>
                  {selectedList === list.id && (
                    <div className="w-6 h-6 rounded-full bg-[#FFD700] flex items-center justify-center">
                      <Check className="w-4 h-4 text-black" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-4 mt-4">
                  <div className="text-sm text-white/40">
                    {list.count.toLocaleString()} contacts
                  </div>
                  <span className="text-white/40">•</span>
                  <div className="text-sm text-white/40">
                    Updated {new Date(list.lastUpdated).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {list.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-[#B38B3F]/20">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!selectedList || isImporting}
            className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
          >
            {isImporting ? (
              <>
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Importing...</span>
              </>
            ) : (
              <>
                <span>Import List</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}