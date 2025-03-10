import React from 'react';
import { Download } from 'lucide-react';

interface Invoice {
  id: string;
  number: string;
  amount: number;
  status: 'paid' | 'open' | 'void' | 'draft';
  created: number;
  dueDate: string;
  downloadUrl: string;
}

interface InvoiceTableProps {
  invoices: Invoice[];
  selectedInvoices: string[];
  setSelectedInvoices: (ids: string[]) => void;
  selectAll: boolean;
  setSelectAll: (select: boolean) => void;
  onDownload: (ids: string[]) => void;
}

export function InvoiceTable({
  invoices,
  selectedInvoices,
  setSelectedInvoices,
  selectAll,
  setSelectAll,
  onDownload
}: InvoiceTableProps) {
  return (
    <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#B38B3F]/20">
            <th className="py-4 px-4 text-left">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={(e) => {
                    setSelectAll(e.target.checked);
                    setSelectedInvoices(
                      e.target.checked 
                        ? invoices.map(inv => inv.id)
                        : []
                    );
                  }}
                  className="w-4 h-4 rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                />
              </div>
            </th>
            <th className="py-4 px-4 text-left text-white/70 font-medium">Invoice</th>
            <th className="py-4 px-4 text-left text-white/70 font-medium">Amount</th>
            <th className="py-4 px-4 text-left text-white/70 font-medium">Status</th>
            <th className="py-4 px-4 text-left text-white/70 font-medium">Date</th>
            <th className="py-4 px-4 text-right text-white/70 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="border-b border-[#B38B3F]/10 hover:bg-white/5">
              <td className="py-4 px-4">
                <input
                  type="checkbox"
                  checked={selectedInvoices.includes(invoice.id)}
                  onChange={(e) => {
                    setSelectedInvoices(prev => 
                      e.target.checked
                        ? [...prev, invoice.id]
                        : prev.filter(id => id !== invoice.id)
                    );
                  }}
                  className="w-4 h-4 rounded border-[#B38B3F]/30 text-[#B38B3F] bg-black/40 focus:ring-[#B38B3F]/50"
                />
              </td>
              <td className="py-4 px-4">
                <div className="font-medium text-white">{invoice.number}</div>
              </td>
              <td className="py-4 px-4">
                <div className="text-white">${(invoice.amount / 100).toFixed(2)}</div>
              </td>
              <td className="py-4 px-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  invoice.status === 'paid'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : invoice.status === 'open'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-zinc-500/20 text-zinc-400'
                }`}>
                  {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                </span>
              </td>
              <td className="py-4 px-4">
                <div className="text-white/70">
                  {new Date(invoice.created).toLocaleDateString()}
                </div>
              </td>
              <td className="py-4 px-4 text-right">
                <button
                  onClick={() => onDownload([invoice.id])}
                  className="text-[#B38B3F] hover:text-[#FFD700] transition-colors"
                >
                  <Download className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}