import React from 'react';
import { Plus, MoreHorizontal, Search, Filter, ChevronDown, User, Mail, Phone, MapPin, DollarSign, Calendar, Clock, Tag, Trash2, PenSquare } from 'lucide-react';
import { useDraggable } from '../../hooks/useDraggable';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  budget: string;
  source: string;
  lastContact: string;
  nextFollowUp: string;
  tags: string[];
  avatar?: string;
  stage: string;
}

interface KanbanBoardProps {
  onAddLead?: () => void;
  onEditLead?: (lead: Lead) => void;
  onDeleteLead?: (lead: Lead) => void;
}

export function KanbanBoard({ onAddLead, onEditLead, onDeleteLead }: KanbanBoardProps) {
  const [stages] = React.useState([
    { id: 'new', name: 'New Leads', color: '#4285f4' },
    { id: 'contacted', name: 'Contacted', color: '#fbbc05' },
    { id: 'qualified', name: 'Qualified', color: '#34a853' },
    { id: 'proposal', name: 'Proposal', color: '#ea4335' },
    { id: 'negotiation', name: 'Negotiation', color: '#9334ea' },
    { id: 'closed', name: 'Closed', color: '#16a34a' }
  ]);

  const [leads] = React.useState<Lead[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '(555) 123-4567',
      location: 'New York, NY',
      budget: '$500,000',
      source: 'Website',
      lastContact: '2025-03-15',
      nextFollowUp: '2025-03-20',
      tags: ['High Priority', 'First Time Buyer'],
      stage: 'new',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      phone: '(555) 987-6543',
      location: 'San Francisco, CA',
      budget: '$750,000',
      source: 'Referral',
      lastContact: '2025-03-14',
      nextFollowUp: '2025-03-19',
      tags: ['Investor', 'Cash Buyer'],
      stage: 'contacted',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    },
    // Add more mock leads...
  ]);

  const { draggedItem, handleDragStart, handleDragOver, handleDrop } = useDraggable();

  const handleStageChange = (leadId: string, newStage: string) => {
    setLeads(prev => prev.map(lead => 
      lead.id === leadId ? { ...lead, stage: newStage } : lead
    ));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-white">Lead Pipeline</h1>
          <button
            onClick={onAddLead}
            className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Add Lead</span>
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search leads..."
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

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-6 min-w-max">
          {stages.map(stage => (
            <div
              key={stage.id}
              className="w-80 flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => {
                handleDrop(e);
                if (draggedItem) {
                  handleStageChange(draggedItem.id, stage.id);
                }
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                  <h3 className="font-medium text-white">{stage.name}</h3>
                  <span className="text-white/40 text-sm">
                    ({leads.filter(lead => lead.stage === stage.id).length})
                  </span>
                </div>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                  <MoreHorizontal className="w-4 h-4 text-white/40" />
                </button>
              </div>

              <div className="space-y-4">
                {leads
                  .filter(lead => lead.stage === stage.id)
                  .map(lead => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead)}
                      className="bg-zinc-800/50 rounded-lg border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 transition-all duration-200 group"
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img 
                                src={lead.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(lead.name)}&background=B38B3F&color=fff`}
                                alt={lead.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">{lead.name}</h4>
                              <div className="text-sm text-white/60">{lead.location}</div>
                            </div>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex items-center space-x-1">
                              <button 
                                onClick={() => onEditLead?.(lead)}
                                className="p-1 hover:bg-white/10 rounded transition-colors"
                              >
                                <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                              </button>
                              <button 
                                onClick={() => onDeleteLead?.(lead)}
                                className="p-1 hover:bg-red-500/20 rounded transition-colors"
                              >
                                <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-white/60">
                            <Mail className="w-4 h-4 mr-2" />
                            {lead.email}
                          </div>
                          <div className="flex items-center text-white/60">
                            <Phone className="w-4 h-4 mr-2" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center text-white/60">
                            <DollarSign className="w-4 h-4 mr-2" />
                            {lead.budget}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-xs">
                            <Calendar className="w-4 h-4 text-white/40" />
                            <span className="text-white/40">Next: {new Date(lead.nextFollowUp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lead.tags.map((tag, index) => (
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
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}