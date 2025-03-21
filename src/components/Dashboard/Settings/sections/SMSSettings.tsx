import React from 'react';
import { MessageSquare, Ban, Bot, Zap, Plus, Trash2, PenSquare, Check, X, AlertTriangle, Search, Download, Upload } from 'lucide-react';
import { ImportDNCModal } from './ImportDNCModal';
import { DNCMappingModal } from './DNCMappingModal';

interface DNContact {
  id: string;
  number: string;
  selected: boolean;
}

interface AutoResponse {
  id: string;
  trigger: string;
  response: string;
  active: boolean;
}

interface QuickReply {
  id: string;
  content: string;
  category: string;
  usageCount: number;
}

export function SMSSettings() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [dncNumbers, setDncNumbers] = React.useState<DNContact[]>([
    {
      id: '1',
      number: '(555) 123-4567',
      selected: false
    },
    {
      id: '2',
      number: '(555) 234-5678',
      selected: false
    }
  ]);
  const [activeTab, setActiveTab] = React.useState<'dnc' | 'auto' | 'quick'>('dnc');
  const [selectAll, setSelectAll] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isExporting, setIsExporting] = React.useState(false);
  const [autoResponses, setAutoResponses] = React.useState<AutoResponse[]>([
    {
      id: '1',
      trigger: 'STOP',
      response: 'You have been unsubscribed from future messages.',
      active: true
    },
    {
      id: '2',
      trigger: 'After Hours',
      response: 'Thank you for your message. Our office is currently closed. We will respond during business hours.',
      active: true
    }
  ]);
  const [quickReplies, setQuickReplies] = React.useState<QuickReply[]>([
    {
      id: '1',
      content: 'Thank you for your interest! I will review your inquiry and get back to you shortly.',
      category: 'general',
      usageCount: 45
    },
    {
      id: '2',
      content: 'I am currently assisting another client. I will reach out as soon as I am available.',
      category: 'busy',
      usageCount: 32
    }
  ]);
  const [newNumber, setNewNumber] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Filter DNC numbers based on real-time search
  const filteredNumbers = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return dncNumbers;
    }
    
    // Clean search query to match number format
    const query = searchQuery.toLowerCase().replace(/[^\d().\- ]/g, '');
    
    // Search by number - match any part of the number
    return dncNumbers.filter(contact => {
      const normalizedNumber = contact.number.toLowerCase();
      return normalizedNumber.includes(query);
    });
  }, [dncNumbers, searchQuery]);

  // Handle select all toggle
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setDncNumbers(prev => prev.map(contact => ({
      ...contact,
      selected: !selectAll
    })));
  };

  // Get current page numbers
  const getCurrentPageNumbers = () => {
    const indexOfLastNumber = currentPage * rowsPerPage;
    const indexOfFirstNumber = indexOfLastNumber - rowsPerPage;
    return filteredNumbers.slice(indexOfFirstNumber, indexOfLastNumber);
  };

  // Change page
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  // Handle individual selection
  const handleSelect = (id: string) => {
    setDncNumbers(prev => prev.map(contact => 
      contact.id === id 
        ? { ...contact, selected: !contact.selected }
        : contact
    ));
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    setDncNumbers(prev => prev.filter(contact => !contact.selected));
    setSelectAll(false);
  };

  const handleAddDNC = () => {
    if (!newNumber.trim()) {
      setError('Phone number is required');
      return;
    }

    // Check if number already exists
    const isDuplicate = dncNumbers.some(contact => contact.number === newNumber);
    if (isDuplicate) {
      setError('This number is already in the DNC list');
      return;
    }

    const newContact: DNContact = {
      id: Math.random().toString(36).substr(2, 9),
      number: newNumber,
      selected: false
    };

    setDncNumbers(prev => [newContact, ...prev]);
    setNewNumber('');
    setError(null);
  };

  // Handle CSV export
  const handleExport = () => {
    const selectedContacts = dncNumbers.filter(contact => contact.selected);
    
    if (selectedContacts.length === 0) {
      setError('Please select at least one number to export');
      return;
    }

    setIsExporting(true);
    try {
      // Create CSV content
      const csvContent = [
        'DNC Numbers',
        ...selectedContacts.map(contact => contact.number)
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `dnc-numbers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError('Failed to export numbers');
      console.error('Export error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = (numbers: string[]) => {
    // Filter out duplicates before adding
    const existingNumbers = new Set(dncNumbers.map(contact => contact.number));
    const uniqueNumbers = numbers.filter(number => !existingNumbers.has(number));
    
    if (uniqueNumbers.length > 0) {
      const newDncNumbers = uniqueNumbers.map(number => ({
        id: Math.random().toString(36).substr(2, 9),
        number,
        selected: false
      }));
      setDncNumbers(prev => [...newDncNumbers, ...prev]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
            <MessageSquare className="w-6 h-6 text-[#FFD700]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">SMS Settings</h2>
            <p className="text-white/60">Manage your SMS preferences and automation</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-1 border-b border-[#B38B3F]/20">
        <button
          onClick={() => setActiveTab('dnc')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'dnc'
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Ban className="w-4 h-4" />
            <span>DNC Manager</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'auto'
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span>Auto Responder</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('quick')}
          className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'quick'
              ? 'border-[#FFD700] text-[#FFD700]'
              : 'border-transparent text-white/70 hover:text-white'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4" />
            <span>Quick Replies</span>
          </div>
        </button>
      </div>

      {activeTab === 'dnc' && (
        <div className="space-y-6">
          <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Do Not Contact List</h3>
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Import Numbers</span>
              </button>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <input
                type="text"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="Enter phone number"
                className="flex-1 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
              <button 
                onClick={handleAddDNC}
                className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <select
                    value={rowsPerPage}
                    onChange={(e) => setRowsPerPage(parseInt(e.target.value))}
                    className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
                  >
                    <option value="10">10 per page</option>
                    <option value="15">15 per page</option>
                    <option value="30">30 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                  {dncNumbers.filter(n => n.selected).length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Selected</span>
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-white/60">
                    <span className="text-[#FFD700]">{dncNumbers.filter(c => c.selected).length}</span> selected
                  </div>
                  <div className="text-sm text-white/60">
                    <span className="text-[#FFD700]">{dncNumbers.length}</span> total numbers
                  </div>
                  {filteredNumbers.some(c => c.selected) && (
                    <button
                      onClick={handleExport}
                      disabled={isExporting}
                      className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center space-x-1"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-3 h-3 border-2 border-[#FFD700] border-t-transparent rounded-full animate-spin mr-1" />
                          <span>Exporting...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          <span>Export Selected</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
                {filteredNumbers.some(c => c.selected) && (
                  <button
                    onClick={handleBulkDelete}
                    className="text-red-400 hover:text-red-300 text-sm flex items-center space-x-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  aria-label="Search DNC numbers"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchQuery('');
                      setSelectAll(false);
                    }
                  }}
                  className="w-64 pl-9 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                  placeholder="Search DNC numbers..."
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectAll(false);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-white/40 hover:text-white" />
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center mb-4 py-2 bg-zinc-900/95 backdrop-blur-sm border-b border-[#B38B3F]/20">
                <div className="w-5 h-5 rounded border border-[#B38B3F]/40 flex items-center justify-center mr-3">
                  <div className="relative">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="opacity-0 absolute"
                  />
                  {selectAll && (
                    <Check className="w-3 h-3 text-[#FFD700]" />
                  )}
                  </div>
                </div>
                <span className="text-white/60 text-sm">Select All ({dncNumbers.length} numbers)</span>
                {dncNumbers.filter(n => n.selected).length > 0 && (
                  <div className="ml-4 text-sm text-white/60">
                    <span className="text-[#FFD700]">{dncNumbers.filter(n => n.selected).length}</span> selected
                  </div>
                )}
              </div>
              {getCurrentPageNumbers().map((number) => (
                <div
                  key={number.id}
                  className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-[#B38B3F]/20"
                >
                  <div className="flex items-center space-x-2" onClick={() => handleSelect(number.id)}>
                    <div className="w-5 h-5 rounded border border-[#B38B3F]/40 flex items-center justify-center">
                      <input
                        type="checkbox"
                        checked={number.selected}
                        className="opacity-0 absolute"
                      />
                      {number.selected && (
                        <Check className="w-3 h-3 text-[#FFD700]" />
                      )}
                    </div>
                    <div className="font-medium text-white">{number.number}</div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-white/60">
                  Showing {Math.min((currentPage - 1) * rowsPerPage + 1, filteredNumbers.length)} to {Math.min(currentPage * rowsPerPage, filteredNumbers.length)} of {filteredNumbers.length} numbers
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-white/70">
                    Page {currentPage} of {Math.ceil(filteredNumbers.length / rowsPerPage)}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= Math.ceil(filteredNumbers.length / rowsPerPage)}
                    className="px-3 py-1 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'auto' && (
        <div className="space-y-6">
          <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Auto Responses</h3>
              <button className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Response</span>
              </button>
            </div>

            <div className="space-y-4">
              {autoResponses.map((response) => (
                <div 
                  key={response.id}
                  className="p-4 bg-zinc-900/50 rounded-lg border border-[#B38B3F]/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-white">{response.trigger}</div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors ${
                        response.active 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-zinc-700/50 text-white/40'
                      }`}>
                        {response.active ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{response.response}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'quick' && (
        <div className="space-y-6">
          <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-white">Quick Replies</h3>
              <button className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Reply</span>
              </button>
            </div>

            <div className="space-y-4">
              {quickReplies.map((reply) => (
                <div 
                  key={reply.id}
                  className="p-4 bg-zinc-900/50 rounded-lg border border-[#B38B3F]/10"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-[#FFD700] capitalize">{reply.category}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-white/40">
                        Used {reply.usageCount} times
                      </span>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                      </button>
                      <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                      </button>
                    </div>
                  </div>
                  <p className="text-white/70">{reply.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Import Modal */}
      {showImportModal && (
        <ImportDNCModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImport}
        />
      )}
    </div>
  );
}