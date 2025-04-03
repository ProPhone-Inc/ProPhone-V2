import React from 'react';
import { MessageSquare, Search, Filter, ChevronDown } from 'lucide-react';

export function SMSPerformanceCard() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortColumn, setSortColumn] = React.useState('name');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc'>('desc');

  const campaigns = [
    {
      id: '1',
      name: 'Spring Property Campaign',
      prospects: 3000,
      sent: 2451,
      delivered: 2389,
      failed: 62,
      responses: 342,
      deliverabilityRate: '97.5%',
      status: 'active'
    },
    {
      id: '2',
      name: 'Investment Opportunity',
      prospects: 2500,
      sent: 1892,
      delivered: 1845,
      failed: 47,
      responses: 256,
      deliverabilityRate: '97.5%',
      status: 'completed'
    },
    {
      id: '3',
      name: 'New Listing Alert',
      prospects: 4000,
      sent: 3241,
      delivered: 3198,
      failed: 43,
      responses: 521,
      deliverabilityRate: '98.7%',
      status: 'active'
    },
    {
      id: '4',
      name: 'Open House Reminder',
      prospects: 1200,
      sent: 982,
      delivered: 967,
      failed: 15,
      responses: 203,
      deliverabilityRate: '98.5%',
      status: 'scheduled'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      case 'scheduled':
        return 'bg-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MessageSquare className="w-5 h-5 text-[#FFD700] mr-2" />
            <h2 className="text-xl font-bold text-white">SMS Campaign Performance</h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9 pr-4 py-1.5 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white text-sm placeholder-white/40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-white/40" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-1.5 text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B38B3F]/20">
                <th className="text-left py-3 px-4 text-white/70 font-medium">Campaign</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Prospects</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Sent</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Delivered</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Failed</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Responses</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Deliverability Rate</th>
                <th className="text-left py-4 px-4 text-white/70 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-[#B38B3F]/10 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div className="font-medium text-white">{campaign.name}</div>
                  </td>
                  <td className="py-4 px-4 text-white">{campaign.prospects.toLocaleString()}</td>
                  <td className="py-4 px-4 text-white">{campaign.sent.toLocaleString()}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-white">{campaign.delivered.toLocaleString()}</span>
                      <span className="text-emerald-400 text-sm ml-2">
                        ({((campaign.delivered / campaign.sent) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-white">{campaign.failed.toLocaleString()}</span>
                      <span className="text-red-400 text-sm ml-2">
                        ({((campaign.failed / campaign.sent) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center">
                      <span className="text-white">{campaign.responses.toLocaleString()}</span>
                      <span className="text-[#FFD700] text-sm ml-2">
                        ({((campaign.responses / campaign.delivered) * 100).toFixed(1)}%)
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white">
                    {campaign.deliverabilityRate}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}