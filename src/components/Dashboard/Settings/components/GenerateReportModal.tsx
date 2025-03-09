import React from 'react';
import { X, Calendar, BarChart2, Clock, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GenerateReportModalProps {
  onClose: () => void;
  onGenerate: (dateRange: { start: string; end: string } | string) => void;
}

interface ChartData {
  month: string;
  amount: number;
  color: string;
}

export function GenerateReportModal({ onClose, onGenerate }: GenerateReportModalProps) {
  const [dateRange, setDateRange] = React.useState<{ start: string; end: string } | string>('30days');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [chartData, setChartData] = React.useState<ChartData[]>([]);

  React.useEffect(() => {
    const generateChartData = () => {
      let startDate: Date;
      let endDate = new Date();
      
      if (typeof dateRange === 'string') {
        switch (dateRange) {
          case '30days':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
            break;
          case '60days':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 60);
            break;
          case '90days':
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 90);
            break;
          case 'ytd':
            startDate = new Date(endDate.getFullYear(), 0, 1);
            break;
          default:
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        }
      } else {
        startDate = new Date(dateRange.start);
        endDate = new Date(dateRange.end);
      }

      const months: ChartData[] = [];
      const currentDate = new Date(startDate);
      const colors = ['#B38B3F', '#C69C43', '#D9AD47', '#ECBE4B', '#FFD700', '#FFE44D'];
      let colorIndex = 0;

      while (currentDate <= endDate) {
        const monthName = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        const label = `${monthName} ${year}`;
        
        // Generate random amount between 2000 and 6000 for demo
        const amount = Math.floor(Math.random() * (6000 - 2000) + 2000);
        
        months.push({
          month: label,
          amount,
          color: colors[colorIndex % colors.length]
        });
        
        colorIndex++;
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      setChartData(months);
    };

    generateChartData();
  }, [dateRange]);

  // Mock invoice data
  const invoices = [
    {
      id: 'INV-001',
      date: '2025-01-15',
      amount: 2500,
      status: 'paid',
      description: 'January Subscription'
    },
    {
      id: 'INV-002',
      date: '2025-02-15',
      amount: 3200,
      status: 'paid',
      description: 'February Subscription + Add-ons'
    },
    {
      id: 'INV-003',
      date: '2025-03-15',
      amount: 4100,
      status: 'paid',
      description: 'March Premium Package'
    },
    {
      id: 'INV-004',
      date: '2025-04-15',
      amount: 3800,
      status: 'pending',
      description: 'April Services'
    },
    {
      id: 'INV-005',
      date: '2025-05-15',
      amount: 4500,
      status: 'paid',
      description: 'May Enterprise Plan'
    },
    {
      id: 'INV-006',
      date: '2025-06-15',
      amount: 5200,
      status: 'pending',
      description: 'June Full Suite'
    }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await onGenerate(dateRange);
    } finally {
      setIsGenerating(false);
      onClose();
    }
  };

  const totalSpent = chartData.reduce((sum, item) => sum + item.amount, 0);
  const avgPerMonth = totalSpent / chartData.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-3xl transform animate-fade-in max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <FileText className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Generate Spending Report</h2>
              <p className="text-white/60">View and export your spending analytics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold text-white mt-1">${totalSpent.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center">
                  <BarChart2 className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>
            </div>
            <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Average per Month</p>
                  <p className="text-2xl font-bold text-white mt-1">${avgPerMonth.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Select Time Period
            </label>
            <select
              value={typeof dateRange === 'string' ? dateRange : 'custom'}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setDateRange({ start: '', end: '' });
                } else {
                  setDateRange(e.target.value);
                }
              }}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="30days">Last 30 Days</option>
              <option value="60days">Last 60 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="ytd">Current YTD</option>
              <option value="custom">Custom Range</option>
            </select>

            {typeof dateRange === 'object' && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => 
                      typeof prev === 'object' ? { ...prev, start: e.target.value } : prev
                    )}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark] focus:border-[#FFD700]/40 transition-colors cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFD700' viewBox='0 0 24 24'%3E%3Cpath d='M19 4h-1V3c0-.6-.4-1-1-1s-1 .4-1 1v1H8V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z'/%3E%3C/svg%3E")`,
                      backgroundPosition: '12px center',
                      backgroundSize: '20px',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => 
                      typeof prev === 'object' ? { ...prev, end: e.target.value } : prev
                    )}
                    className="w-full pl-10 pr-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark] focus:border-[#FFD700]/40 transition-colors cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23FFD700' viewBox='0 0 24 24'%3E%3Cpath d='M19 4h-1V3c0-.6-.4-1-1-1s-1 .4-1 1v1H8V3c0-.6-.4-1-1-1s-1 .4-1 1v1H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z'/%3E%3C/svg%3E")`,
                      backgroundPosition: '12px center',
                      backgroundSize: '20px',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Spending Chart */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Monthly Spending</h3>
            <div className="h-64 bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(179, 139, 63, 0.1)" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#999' }}
                    axisLine={{ stroke: 'rgba(179, 139, 63, 0.2)' }}
                    angle={-45}
                    textAnchor="end" 
                    height={60}
                  />
                  <YAxis 
                    tick={{ fill: '#999' }}
                    axisLine={{ stroke: 'rgba(179, 139, 63, 0.2)' }}
                    tickFormatter={(value) => `$${value.toLocaleString()}`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1a1a1a',
                      border: '1px solid rgba(179, 139, 63, 0.2)',
                      borderRadius: '0.5rem',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                    }}
                    cursor={{ fill: 'rgba(179, 139, 63, 0.1)' }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="url(#barGradient)"
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-out"
                    className="filter drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]"
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#B38B3F" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Invoices Table */}
          <div>
            <h3 className="text-lg font-medium text-white mb-4">Invoice Details</h3>
            <div className="bg-zinc-800/50 border border-[#B38B3F]/20 rounded-xl overflow-hidden max-h-[200px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#B38B3F]/20">
                    <th className="text-left py-4 px-4 text-white/70 font-medium">Invoice ID</th>
                    <th className="text-left py-4 px-4 text-white/70 font-medium">Date</th>
                    <th className="text-left py-4 px-4 text-white/70 font-medium">Description</th>
                    <th className="text-left py-4 px-4 text-white/70 font-medium">Amount</th>
                    <th className="text-left py-4 px-4 text-white/70 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-[#B38B3F]/10 hover:bg-white/5">
                      <td className="py-4 px-4 font-medium text-white">{invoice.id}</td>
                      <td className="py-4 px-4 text-white/70">
                        {new Date(invoice.date).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 text-white/70">{invoice.description}</td>
                      <td className="py-4 px-4 text-white font-medium">
                        ${invoice.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        <div className="flex justify-end space-x-3 bg-zinc-900 p-4 border-t border-[#B38B3F]/20">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Generate Report</span>
                </>
              )}
            </button>
          </div>
      </div>
    </div>
  );
}