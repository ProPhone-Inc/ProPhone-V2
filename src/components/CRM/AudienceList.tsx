import React from 'react';
import { Plus, Search, Filter, ChevronDown, Users, Star, Trash2, PenSquare, BarChart2, Download } from 'lucide-react';

interface Segment {
  id: string;
  name: string;
  description: string;
  count: number;
  lastUpdated: string;
  criteria: {
    type: string;
    value: string;
  }[];
  tags: string[];
}

interface AudienceListProps {
  onCreateSegment?: () => void;
  onEditSegment?: (segment: Segment) => void;
  onDeleteSegment?: (segment: Segment) => void;
}

export function AudienceList({ onCreateSegment, onEditSegment, onDeleteSegment }: AudienceListProps) {
  const [segments] = React.useState<Segment[]>([
    {
      id: '1',
      name: 'High-Value Leads',
      description: 'Leads with budget over $500k',
      count: 156,
      lastUpdated: '2025-03-15',
      criteria: [
        { type: 'budget', value: '>= $500,000' },
        { type: 'status', value: 'Active' }
      ],
      tags: ['VIP', 'High Budget']
    },
    {
      id: '2',
      name: 'Recent Contacts',
      description: 'Contacts added in last 30 days',
      count: 89,
      lastUpdated: '2025-03-14',
      criteria: [
        { type: 'created', value: 'Last 30 days' }
      ],
      tags: ['New', 'Follow Up']
    },
    {
      id: '3',
      name: 'Engaged Prospects',
      description: 'High engagement in last 7 days',
      count: 234,
      lastUpdated: '2025-03-13',
      criteria: [
        { type: 'engagement', value: 'High' },
        { type: 'lastActivity', value: '< 7 days' }
      ],
      tags: ['Active', 'Engaged']
    }
  ]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Audience Segments</h1>
          <button
            onClick={onCreateSegment}
            className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Segment</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search segments..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Segments List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid gap-6">
          {segments.map(segment => (
            <div
              key={segment.id}
              className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[#FFD700]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{segment.name}</h3>
                    <p className="text-white/60">{segment.description}</p>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onEditSegment?.(segment)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <button 
                      onClick={() => onDeleteSegment?.(segment)}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-zinc-900/50 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">Total Contacts</div>
                  <div className="text-xl font-bold text-white">{segment.count.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">Last Updated</div>
                  <div className="text-white">{new Date(segment.lastUpdated).toLocaleDateString()}</div>
                </div>
                <div className="bg-zinc-900/50 rounded-lg p-3">
                  <div className="text-sm text-white/60 mb-1">Engagement Rate</div>
                  <div className="text-white">24.5%</div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {segment.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <BarChart2 className="w-4 h-4 text-[#FFD700]" />
                  </button>
                  <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                    <Download className="w-4 h-4 text-[#FFD700]" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}