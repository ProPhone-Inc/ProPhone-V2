import React from 'react';
import { File, FileText, FolderOpen, Plus, Search, Filter, ChevronDown, Download, Share2, Trash2, PenSquare, MoreHorizontal, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'contract' | 'proposal' | 'agreement' | 'other';
  status: 'draft' | 'pending' | 'signed' | 'expired' | 'rejected';
  created: string;
  modified: string;
  signers: Array<{
    name: string;
    email: string;
    signed: boolean;
    signedAt?: string;
  }>;
  tags: string[];
}

export function DocumentSystem() {
  const [documents] = React.useState<Document[]>([
    {
      id: '1',
      name: 'Purchase Agreement - 123 Main St',
      type: 'contract',
      status: 'pending',
      created: '2025-03-15',
      modified: '2025-03-15',
      signers: [
        { name: 'John Smith', email: 'john@example.com', signed: true, signedAt: '2025-03-15T14:30:00Z' },
        { name: 'Sarah Johnson', email: 'sarah@example.com', signed: false }
      ],
      tags: ['Real Estate', 'Priority']
    },
    {
      id: '2',
      name: 'Investment Property Proposal',
      type: 'proposal',
      status: 'draft',
      created: '2025-03-14',
      modified: '2025-03-14',
      signers: [
        { name: 'Michael Chen', email: 'michael@example.com', signed: false }
      ],
      tags: ['Investment', 'Draft']
    },
    {
      id: '3',
      name: 'Rental Agreement - 456 Oak Ave',
      type: 'agreement',
      status: 'signed',
      created: '2025-03-13',
      modified: '2025-03-15',
      signers: [
        { name: 'Emma Wilson', email: 'emma@example.com', signed: true, signedAt: '2025-03-15T10:15:00Z' }
      ],
      tags: ['Rental', 'Completed']
    }
  ]);

  const getStatusStyles = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-blue-500/20 text-blue-400';
      case 'pending':
        return 'bg-amber-500/20 text-amber-400';
      case 'signed':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'expired':
        return 'bg-red-500/20 text-red-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'draft':
        return <PenSquare className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'signed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'expired':
      case 'rejected':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <FileText className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Documents</h1>
              <p className="text-white/60">Manage and track your documents</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>New Document</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <FolderOpen className="w-4 h-4" />
              <span>Folders</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-4">
          {documents.map(doc => (
            <div
              key={doc.id}
              className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                    <File className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{doc.name}</h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusStyles(doc.status)}`}>
                        {getStatusIcon(doc.status)}
                        <span>{doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}</span>
                      </div>
                      <span className="text-white/40">•</span>
                      <span className="text-white/60 text-sm">Modified {new Date(doc.modified).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Share2 className="w-4 h-4 text-white/60 hover:text-white" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-white/60 hover:text-white" />
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
                    {doc.signers.map((signer, index) => (
                      <div
                        key={index}
                        className={`w-8 h-8 rounded-full border-2 border-zinc-900 ${
                          signer.signed ? 'bg-emerald-500/20' : 'bg-zinc-700'
                        } flex items-center justify-center`}
                        title={`${signer.name} (${signer.signed ? 'Signed' : 'Pending'})`}
                      >
                        {signer.signed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-white/40" />
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-white/60">
                    {doc.signers.filter(s => s.signed).length} of {doc.signers.length} signed
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {doc.tags.map((tag, index) => (
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