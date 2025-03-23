import React from 'react';
import { Home, Flame, Sun, Bell, Megaphone, Calendar, BarChart2, DollarSign, ThumbsDown, Ban, CheckCircle, Plus, PenSquare, Trash2, Phone, Mail, MapPin, Tag, Clock, Settings } from 'lucide-react';
import { useDraggable } from '../../hooks/useDraggable';
import { PipelineModal } from './PipelineModal';

interface Contact {
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
  onEditLead?: (lead: Contact) => void;
  onDeleteLead?: (lead: Contact) => void;
}

export function KanbanBoard({ onAddLead, onEditLead, onDeleteLead }: KanbanBoardProps) {
  const defaultStages = [
    { id: 'new', name: 'New Leads', color: '#4285f4', icon: <Home className="w-4 h-4" /> },
    { id: 'hot', name: 'Hot', color: '#ea4335', icon: <Flame className="w-4 h-4" /> },
    { id: 'warm', name: 'Warm', color: '#fbbc05', icon: <Sun className="w-4 h-4" /> },
    { id: 'follow-up', name: 'Follow Up', color: '#9334ea', icon: <Bell className="w-4 h-4" /> },
    { id: 'prospecting', name: 'Prospecting', color: '#2196f3', icon: <Megaphone className="w-4 h-4" /> },
    { id: 'appointment-set', name: 'Appointment Set', color: '#673ab7', icon: <Calendar className="w-4 h-4" /> },
    { id: 'needs-analysis', name: 'Needs Analysis', color: '#00bcd4', icon: <BarChart2 className="w-4 h-4" /> },
    { id: 'make-offer', name: 'Make Offer', color: '#4caf50', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'not-interested', name: 'Not Interested', color: '#9e9e9e', icon: <ThumbsDown className="w-4 h-4" /> },
    { id: 'dnc', name: 'DNC', color: '#f44336', icon: <Ban className="w-4 h-4" /> },
    { id: 'conversion', name: 'Conversion', color: '#4caf50', icon: <CheckCircle className="w-4 h-4" /> }
  ];

  const [pipelines, setPipelines] = React.useState([
    {
      id: 'default',
      name: 'Default Pipeline',
      stages: defaultStages
    }
  ]);

  const [selectedPipeline, setSelectedPipeline] = React.useState(pipelines[0]);
  const [showPipelineModal, setShowPipelineModal] = React.useState(false);
  const [editingPipeline, setEditingPipeline] = React.useState<typeof selectedPipeline | null>(null);

  const [leads, setLeads] = React.useState<Contact[]>([
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
      stage: 'hot',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
    }
  ]);

  const handleSavePipeline = (pipeline: typeof selectedPipeline) => {
    if (editingPipeline) {
      setPipelines(prev => prev.map(p => 
        p.id === pipeline.id ? pipeline : p
      ));
    } else {
      setPipelines(prev => [...prev, pipeline]);
    }
    setShowPipelineModal(false);
    setEditingPipeline(null);
  };

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
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">Lead Pipeline</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => {
                setEditingPipeline(null);
                setShowPipelineModal(true);
              }}
              className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Pipeline</span>
            </button>
            <button
              onClick={onAddLead}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <select
              value={selectedPipeline.id}
              onChange={(e) => {
                const pipeline = pipelines.find(p => p.id === e.target.value);
                if (pipeline) setSelectedPipeline(pipeline);
              }}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              {pipelines.map(pipeline => (
                <option key={pipeline.id} value={pipeline.id}>
                  {pipeline.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                setEditingPipeline(selectedPipeline);
                setShowPipelineModal(true);
              }}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 text-[#FFD700]" />
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex space-x-6 min-w-max">
          {selectedPipeline.stages.map(stage => (
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
                  <Plus className="w-4 h-4 text-white/40" />
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
      
      {/* Pipeline Modal */}
      {showPipelineModal && (
        <PipelineModal
          onClose={() => {
            setShowPipelineModal(false);
            setEditingPipeline(null);
          }}
          onSave={handleSavePipeline}
          currentPipeline={editingPipeline}
        />
      )}
    </div>
  );
}

// Custom hook for drag and drop functionality
function useDraggable() {
  const [draggedItem, setDraggedItem] = React.useState<Contact | null>(null);

  const handleDragStart = (e: React.DragEvent, item: Contact) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  return {
    draggedItem,
    handleDragStart,
    handleDragOver,
    handleDrop
  };
}