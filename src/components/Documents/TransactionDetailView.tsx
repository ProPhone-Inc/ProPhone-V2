import React from 'react';
import { ChevronLeft, Info, Download, Plus, Search, FileText, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface TransactionDetailProps {
  onBack: () => void;
  transaction: {
    id: string;
    propertyAddress: string;
    city: string;
    state: string;
    zip: string;
    type: string;
    status: string;
    price: number;
    closingDate?: string;
  };
}

export function TransactionDetailView({ onBack, transaction }: TransactionDetailProps) {
  const [activeTab, setActiveTab] = React.useState('documents');
  const [searchQuery, setSearchQuery] = React.useState('');

  const documents = [
    { name: 'CLOSING DOCS', type: 'folder', items: [] },
    { name: 'EXECUTED DOCS BUY SIDE', type: 'folder', items: [
      { name: 'SALES CHECKLIST', type: 'file' },
      { name: 'EXE (2) SELLER\'S ESTIMATED NET PROCEEDS DISCLOSURE', type: 'file' },
      { name: 'EXE CONFIRMATION OF AGENCY', type: 'file' },
      { name: 'EXE PURCHASE AND SALE BOUND', type: 'file' },
      { name: 'EXE DISCLAIMER NOTICE', type: 'file' },
      { name: 'EXE WIRE FRAUD', type: 'file' },
      { name: 'EXE INVESTOR ADDENDUM', type: 'file' },
      { name: 'EXE AMENDMENT 1', type: 'file' },
      { name: 'EXE AMENDMENT 2', type: 'file' },
      { name: 'EXE REALTOR COMMISSIONS', type: 'file' },
      { name: 'EXE BANK LETTER', type: 'file' },
      { name: 'EXE SELLER POSESSION AGREEMENT', type: 'file' }
    ]},
    { name: 'N/S AND DOCS BUY SIDE', type: 'folder', items: [] }
  ];

  return (
    <div className="h-full flex flex-col bg-zinc-900/50">
      {/* Header */}
      <div className="bg-[#2B579A] text-white p-6">
        <div className="flex items-center space-x-4 mb-6">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{transaction.propertyAddress}</h1>
            <p className="text-white/80">{transaction.city}, {transaction.state} {transaction.zip}</p>
          </div>
          <button className="ml-auto p-2 hover:bg-white/10 rounded-full transition-colors">
            <Info className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="text-white/60 text-sm">Transaction Type</div>
            <div className="flex items-center mt-1">
              <div className="font-medium">{transaction.type}</div>
              <ChevronLeft className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Status</div>
            <div className="flex items-center mt-1">
              <div className="font-medium">{transaction.status}</div>
              <ChevronLeft className="w-4 h-4 ml-1" />
            </div>
          </div>
          <div>
            <div className="text-white/60 text-sm">Sale Price</div>
            <div className="font-medium">${transaction.price.toLocaleString()}</div>
          </div>
          {transaction.closingDate && (
            <div>
              <div className="text-white/60 text-sm">Closing on</div>
              <div className="font-medium">{transaction.closingDate}</div>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-[#B38B3F]/20">
        <div className="flex space-x-1 px-4">
          {['Documents', 'Tasks', 'People', 'Details', 'Activity Log', 'Notifications'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`py-4 px-6 text-sm font-medium transition-colors relative ${
                activeTab === tab.toLowerCase()
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {tab}
              {tab === 'Notifications' && (
                <span className="absolute top-3 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  17
                </span>
              )}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FFD700]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Section */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-white">Documents</h2>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add documents</span>
              </button>
              <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity">
                Add folder
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mb-6">
            <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              All
            </button>
            <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">
              Sent
            </button>
            <button className="px-4 py-2 text-white/60 hover:text-white transition-colors">
              Received
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#B38B3F]/20 text-left">
                  <th className="py-3 px-4 text-white/70 font-medium w-8"></th>
                  <th className="py-3 px-4 text-white/70 font-medium">NAME</th>
                  <th className="py-3 px-4 text-white/70 font-medium">PACKET STATUS</th>
                  <th className="py-3 px-4 text-white/70 font-medium">MODIFIED ON</th>
                  <th className="py-3 px-4 text-white/70 font-medium">REVIEW STATUS</th>
                  <th className="py-3 px-4 text-white/70 font-medium">NOTES</th>
                  <th className="py-3 px-4 text-white/70 font-medium w-8"></th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <React.Fragment key={doc.name}>
                    <tr className="group hover:bg-white/5">
                      <td className="py-3 px-4">
                        <button className="p-1 hover:bg-white/10 rounded transition-colors">
                          <ChevronLeft className={`w-4 h-4 text-white/40 transition-transform ${doc.items.length > 0 ? 'rotate-90' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <FileText className="w-5 h-5 text-[#FFD700]" />
                          <span className="text-white">{doc.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-white/60">-</td>
                      <td className="py-3 px-4 text-white/60">-</td>
                      <td className="py-3 px-4 text-white/60">-</td>
                      <td className="py-3 px-4 text-white/60">-</td>
                      <td className="py-3 px-4">
                        <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                          <Info className="w-4 h-4 text-white/60" />
                        </button>
                      </td>
                    </tr>
                    {doc.items.map((item) => (
                      <tr key={item.name} className="group hover:bg-white/5">
                        <td className="py-3 px-4"></td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2 pl-6">
                            <FileText className="w-5 h-5 text-[#FFD700]" />
                            <span className="text-white">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-white/60">-</td>
                        <td className="py-3 px-4 text-white/60">-</td>
                        <td className="py-3 px-4 text-white/60">-</td>
                        <td className="py-3 px-4 text-white/60">-</td>
                        <td className="py-3 px-4">
                          <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded transition-all">
                            <Info className="w-4 h-4 text-white/60" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}