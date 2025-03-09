import React from 'react';
import { Search, Filter, FileText } from 'lucide-react';
import { GenerateReportModal } from './GenerateReportModal';

interface InvoiceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateFilter: string;
  setDateFilter: (filter: string) => void;
}

export function InvoiceFilters({
  searchQuery,
  setSearchQuery,
  dateFilter,
  setDateFilter,
}: InvoiceFiltersProps) {
  const [showReportModal, setShowReportModal] = React.useState(false);

  const handleGenerateReport = async (dateRange: { start: string; end: string } | string) => {
    // Handle report generation
    console.log('Generating report for:', dateRange);
  };

  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Search invoices..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-white/40" />
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
        >
          <option value="all">All Time</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
        <button
          onClick={() => setShowReportModal(true)}
          className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] font-medium rounded-lg transition-colors flex items-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Report</span>
        </button>
      </div>
      
      {showReportModal && (
        <GenerateReportModal
          onClose={() => setShowReportModal(false)}
          onGenerate={handleGenerateReport}
        />
      )}
    </div>
  );
}