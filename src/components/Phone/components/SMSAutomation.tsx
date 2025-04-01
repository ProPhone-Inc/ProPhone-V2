import React from 'react';
import { MessageSquare, Plus, Upload, BarChart2, Search, Filter, ChevronDown, Users, Tag, Clock, Calendar, ArrowRight, ArrowLeft as ArrowLeftIcon, Trash2, PenSquare, MoreHorizontal, CheckCircle2, Clock as ClockIcon, AlertTriangle, Send, X, FileText } from 'lucide-react';
import { ImportFromCRMModal } from './ImportFromCRMModal'; 
import UploadAudienceModal from './UploadAudienceModal';
import { CreateCampaignModal } from './CreateCampaignModal';
import { CreateTemplateModal } from './CreateTemplateModal';
import { CampaignEditPage } from './CampaignEditPage';
import { useSystemNotifications } from '../../../hooks/useSystemNotifications';
import { useCampaignSettings } from '../../../hooks/useCampaignSettings';
import { useCampaignProcessor } from '../../../hooks/useCampaignProcessor';
import { useCampaignPhoneLines } from '../../../hooks/useCampaignPhoneLines';
import { EditCampaignModal } from './EditCampaignModal';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  audience: string;
  template: string;
  sent: number;
  delivered: number;
  responses: number;
  schedule?: {
    startDate: string;
    time: string;
    frequency?: 'once' | 'daily' | 'weekly' | 'monthly';
  };
  createdAt: string;
  phoneLines: string[];
  currentPhoneLineIndex: number;
}

interface Template {
  id: string;
  name: string;
  content: string;
  variables: string[];
  category: string;
  createdAt: string;
}

interface Audience {
  id: string;
  name: string;
  description: string;
  count: number;
  source: string;
  lastUpdated: string;
  tags: string[];
}

export function SMSAutomation() {
  const [activeTab, setActiveTab] = React.useState<'campaigns' | 'templates' | 'audiences'>('campaigns');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showImportModal, setShowImportModal] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<Campaign | null>(null);
  const [editingTemplate, setEditingTemplate] = React.useState<Template | null>(null);
  const [showCreateTemplate, setShowCreateTemplate] = React.useState(false);
  const [showEditPage, setShowEditPage] = React.useState(false);
  const [selectedAudience, setSelectedAudience] = React.useState<Audience | null>(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [expandedTemplates, setExpandedTemplates] = React.useState<Set<string>>(new Set());
  const [messageDisplayLimits, setMessageDisplayLimits] = React.useState<Record<string, number>>({});
  const { phoneLines, assignLinesToCampaign, releaseLines } = useCampaignPhoneLines();
  const { addNotification } = useSystemNotifications();
  const { startProcessing, getProcessingState } = useCampaignProcessor();
  const [campaignProgress, setCampaignProgress] = React.useState<Record<string, {
    totalContacts: number;
    processedContacts: number;
  }>>({});

  const [audiences, setAudiences] = React.useState<Audience[]>([
    {
      id: '1',
      name: 'High-Value Leads',
      description: 'Leads with budget over $500k',
      count: 156,
      source: 'CRM Import',
      lastUpdated: '2025-03-15',
      tags: ['VIP', 'High Budget']
    },
    {
      id: '2',
      name: 'Recent Contacts',
      description: 'Contacts added in last 30 days',
      count: 89,
      source: 'Manual Upload',
      lastUpdated: '2025-03-14',
      tags: ['New', 'Follow Up']
    }
  ]);

  const [campaigns, setCampaigns] = React.useState<Campaign[]>([
    {
      id: '1',
      name: 'Spring Property Campaign',
      status: 'processing',
      audience: 'High-Value Leads',
      template: 'Property Viewing Template',
      sent: 0,
      delivered: 0,
      responses: 0,
      schedule: {
        startDate: '2025-03-20',
        time: '09:00',
        frequency: 'daily'
      },
      createdAt: new Date().toISOString(),
      phoneLines: ['1', '2'],
      currentPhoneLineIndex: 0
    }
  ]);

  // Add a mock template
  React.useEffect(() => {
    if (templates.length === 0) {
      setTemplates([
        {
          id: '1',
          name: 'Property Viewing Template',
          content: 'Hi {{firstName}}, interested in viewing our latest properties?\n---\nPerfect time to invest in real estate!\n===\nCheck out our latest properties and schedule a viewing.',
          variables: ['firstName', 'lastName', 'propertyAddress'],
          category: 'Real Estate',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  }, []);

  // Check campaign progress and completion
  React.useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      campaigns.forEach(campaign => {
        // Skip if campaign is not active or already completed
        if (campaign.status !== 'active' && campaign.status !== 'scheduled') return;
        
        const campaignTime = new Date(`${campaign.schedule.startDate}T${campaign.schedule.time}`);
        
        // Check if it's time to start the campaign
        if (campaign.status === 'scheduled' && now >= campaignTime) {
          setCampaigns(prev => prev.map(c => 
            c.id === campaign.id ? { ...c, status: 'active' } : c
          ));
          
          addNotification({
            type: 'announcement',
            title: 'Campaign Started',
            message: `${campaign.name} has started sending messages`,
            priority: 'medium'
          });
          
          // Initialize progress tracking
          setCampaignProgress(prev => ({
            ...prev,
            [campaign.id]: {
              totalContacts: audiences.find(a => a.name === campaign.audience)?.count || 0,
              processedContacts: 0
            }
          }));
        }
        
        // Update progress for active campaigns
        if (campaign.status === 'active') {
          const progress = campaignProgress[campaign.id];
          if (progress) {
            // Simulate progress (in real app, this would be actual progress)
            const newProcessed = Math.min(
              progress.processedContacts + campaign.smsRate,
              progress.totalContacts
            );
            
            setCampaignProgress(prev => ({
              ...prev,
              [campaign.id]: {
                ...prev[campaign.id],
                processedContacts: newProcessed
              }
            }));
            
            // Check if campaign is complete
            if (newProcessed >= progress.totalContacts) {
              // Mark campaign as completed
              setCampaigns(prev => prev.map(c => 
                c.id === campaign.id ? { ...c, status: 'completed' } : c
              ));
              
              // Release phone lines
              releaseLines(campaign.id);
              
              // Send completion notification
              addNotification({
                type: 'announcement',
                title: 'Campaign Completed',
                message: `${campaign.name} has finished. Phone lines have been released.`,
                priority: 'medium'
              });
            }
          }
        }
      });
    }, 1000); // Check every second
    
    return () => clearInterval(interval);
  }, [campaigns, audiences, addNotification, releaseLines, campaignProgress]);

  const handleImportList = (listId: string) => {
    const newAudience: Audience = {
      id: Math.random().toString(36).substr(2, 9),
      name: 'Imported List',
      description: 'Contacts imported from CRM',
      count: Math.floor(Math.random() * 100) + 50,
      source: 'CRM Import',
      lastUpdated: new Date().toISOString(),
      tags: ['CRM', 'New']
    };
    
    setAudiences(prev => [newAudience, ...prev]);
    setShowImportModal(false);
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <MessageSquare className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">SMS Campaign</h1>
              <p className="text-white/60">Create and manage SMS campaigns</p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Create Campaign Modal */}
        {showCreateModal && (
          <CreateCampaignModal
            onClose={() => setShowCreateModal(false)}
            onSave={async (campaign) => {
              const newCampaign: Campaign = {
                id: Math.random().toString(36).substr(2, 9),
                name: campaign.name,
                status: 'processing',
                audience: audiences.find(a => a.id === campaign.audience)?.name || '',
                template: templates.find(t => campaign.templates.includes(t.id))?.name || '',
                sent: 0,
                delivered: 0,
                responses: 0,
                schedule: {
                  startDate: campaign.schedule.startDate,
                  time: campaign.schedule.startTime,
                  frequency: campaign.schedule.endDate ? 'daily' : 'once'
                },
                createdAt: new Date().toISOString(),
                phoneLines: campaign.phoneLines,
                currentPhoneLineIndex: 0
              };
              
              // Start campaign processing
              const audience = audiences.find(a => a.id === campaign.audience);
              if (audience) {
                await startProcessing(
                  newCampaign.id,
                  audience.contacts || [], // In real app, this would be actual contacts
                  campaign.statusFilters
                );
              }
              
              // Update campaign status based on processing result
              const processingState = getProcessingState(newCampaign.id);
              if (processingState?.status === 'completed') {
                newCampaign.status = 'scheduled';
              } else if (processingState?.status === 'failed') {
                newCampaign.status = 'failed';
              }
              
              // Assign phone lines to the campaign
              assignLinesToCampaign(newCampaign.id, campaign.phoneLines);
              
              setCampaigns(prev => [newCampaign, ...prev]);
              setShowCreateModal(false);
            }}
            audiences={audiences}
            templates={templates}
            phoneLines={phoneLines}
          />
        )}
        <div className="flex items-center space-x-4">
          <div className="flex bg-zinc-800/50 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'campaigns'
                  ? 'bg-[#FFD700] text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Campaigns
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'templates'
                  ? 'bg-[#FFD700] text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Templates
            </button>
            <button
              onClick={() => setActiveTab('audiences')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'audiences'
                  ? 'bg-[#FFD700] text-black'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              Audiences
            </button>
          </div>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-white/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'campaigns' && (
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{campaign.name}</h3>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="text-sm text-white/40">
                          {campaign.audience}
                        </div>
                        <span className="text-white/40">•</span>
                        <div className="text-sm text-white/40">
                          {campaign.template}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <Clock className="w-4 h-4 text-white/40" />
                        <span className="text-sm text-white/40">
                          {campaign.schedule?.frequency === 'once'
                            ? `Scheduled for ${campaign.schedule.startDate} at ${campaign.schedule.time}`
                            : `${campaign.schedule?.frequency.charAt(0).toUpperCase() + campaign.schedule?.frequency.slice(1)} at ${campaign.schedule?.time}`}
                          {' • Next Line: '}
                          {phoneLines.find(l => l.id === campaign.phoneLines[campaign.currentPhoneLineIndex])?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      campaign.status === 'scheduled' ? 'bg-amber-500/20 text-amber-400' :
                      campaign.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                      campaign.status === 'paused' ? 'bg-gray-500/20 text-gray-400' :
                      'bg-zinc-500/20 text-zinc-400'
                    }`}>
                      {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="bg-zinc-900/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <div className="text-sm text-white/60 mb-1">Messages Sent</div>
                    <div className="text-2xl font-bold text-white">{campaign.sent.toLocaleString()}</div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <div className="text-sm text-white/60 mb-1">Delivered</div>
                    <div className="text-2xl font-bold text-white">{campaign.delivered.toLocaleString()}</div>
                  </div>
                  <div className="bg-zinc-900/50 rounded-lg p-4 border border-[#B38B3F]/20">
                    <div className="text-sm text-white/60 mb-1">Responses</div>
                    <div className="text-2xl font-bold text-white">{campaign.responses.toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-white/60">
                    Created {new Date(campaign.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => {
                        setEditingCampaign(campaign);
                        setShowEditPage(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'audiences' && (
          <div className="space-y-4">
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
              >
                <Users className="w-4 h-4" />
                <span>Import from CRM</span>
              </button>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Audience</span>
              </button>
            </div>
            {audiences.map((audience) => (
              <div
                key={audience.id}
                className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{audience.name}</h3>
                      <p className="text-white/60 mt-1">{audience.description}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="text-sm text-white/40">
                          {audience.count.toLocaleString()} contacts
                        </div>
                        <span className="text-white/40">•</span>
                        <div className="text-sm text-white/40">
                          Updated {new Date(audience.lastUpdated).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <button className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {audience.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-white/60">
                    Source: {audience.source}
                  </div>
                  <button 
                    onClick={() => setSelectedAudience(audience)}
                    className="text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center space-x-1"
                  >
                    <span>View Audience</span>
                    <ArrowLeftIcon className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowCreateTemplate(true)}
                className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </div>
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6 hover:border-[#B38B3F]/40 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#FFD700]" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">{template.name}</h3>
                      {/* Preview first message only when collapsed */}
                      {!expandedTemplates.has(template.id) && (
                        <div className="text-white/60 mt-1 font-mono text-sm">
                          <span className="text-[#FFD700]">Message 1:</span> {template.content.split('\n===\n')[0].split('\n---\n')[0]}
                          {template.content.split('\n===\n')[0].split('\n---\n').length > 1 && (
                            <div className="text-white/40 mt-1">
                              + {template.content.split('\n===\n')[0].split('\n---\n').length - 1} more messages
                            </div>
                          )}
                        </div>
                      )}
                      {/* Show all messages when expanded */}
                      {expandedTemplates.has(template.id) && (
                        <div className="text-white/60 mt-1 font-mono text-sm">
                          {template.content.split('\n===\n')[0].split('\n---\n').slice(0, messageDisplayLimits[template.id] || 10).map((msg, i) => (
                            <div key={i} className="mb-2">
                              <span className="text-[#FFD700]">Message {i + 1}:</span> {msg}
                            </div>
                          ))}
                          {template.content.split('\n===\n')[0].split('\n---\n').length > (messageDisplayLimits[template.id] || 10) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setMessageDisplayLimits(prev => ({
                                  ...prev,
                                  [template.id]: (prev[template.id] || 10) + 10
                                }));
                              }}
                              className="mt-2 text-[#FFD700] hover:text-[#FFD700]/80 text-sm flex items-center space-x-1"
                            >
                              <span>View More</span>
                              <ChevronDown className="w-4 h-4" />
                            </button>
                          )}
                          <div className="mt-4 text-amber-400">
                            <span className="text-[#FFD700]">Backup:</span> {template.content.split('\n===\n')[1]}
                          </div>
                        </div>
                      )}
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="text-sm text-white/40">
                          {template.category}
                        </div>
                        <span className="text-white/40">•</span>
                        <div className="text-sm text-white/40">
                          Created {new Date(template.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedTemplates(prev => {
                          const newSet = new Set(prev);
                          if (newSet.has(template.id)) {
                            newSet.delete(template.id);
                            // Reset message limit when collapsing
                            setMessageDisplayLimits(prevLimits => {
                              const newLimits = { ...prevLimits };
                              delete newLimits[template.id];
                              return newLimits;
                            });
                          } else {
                            newSet.add(template.id);
                          }
                          return newSet;
                        });
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <ChevronDown 
                        className={`w-4 h-4 text-white/60 hover:text-white transition-transform duration-200 ${
                          expandedTemplates.has(template.id) ? 'rotate-180' : ''
                        }`} 
                      />
                    </button>
                    <button 
                      onClick={() => {
                        setEditingTemplate(template);
                        setShowCreateTemplate(true);
                      }}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <PenSquare className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                    <button 
                      onClick={() => {
                        setTemplates(prev => prev.filter(t => t.id !== template.id));
                      }}
                      className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400/70 hover:text-red-400" />
                    </button>
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-white/60 hover:text-white" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {template.variables.map((variable) => (
                    <span
                      key={variable}
                      className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs"
                    >
                      {variable}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Import from CRM Modal */}
        {showImportModal && (
          <ImportFromCRMModal
            onClose={() => setShowImportModal(false)}
            onImport={handleImportList}
          />
        )}

        {/* Upload Audience Modal */}
        {showUploadModal && (
          <UploadAudienceModal
            onClose={() => setShowUploadModal(false)}
            onUpload={async (file, audienceName, count) => {
              const newAudience: Audience = {
                id: Math.random().toString(36).substr(2, 9),
                name: audienceName,
                description: `Contacts uploaded from ${file.name}`,
                count: count,
                source: 'File Upload',
                lastUpdated: new Date().toISOString(),
                tags: ['Uploaded', 'New']
              };
              
              setAudiences(prev => [newAudience, ...prev]);
              setShowUploadModal(false);
            }}
          />
        )}

        {/* Create Template Modal */}
        {showCreateTemplate && (
          <CreateTemplateModal
            onClose={() => {
              setEditingTemplate(null);
              setShowCreateTemplate(false);
            }}
            template={editingTemplate}
            onSave={async (template) => {
              const newTemplate: Template = {
                id: editingTemplate?.id || Math.random().toString(36).substr(2, 9),
                name: template.name,
                content: template.messages.join('\n---\n') + '\n===\n' + template.backupMessage,
                variables: template.variables,
                category: 'Custom',
                createdAt: editingTemplate?.createdAt || new Date().toISOString()
              };
              
              setTemplates(prev => {
                if (editingTemplate) {
                  // Update existing template
                  return prev.map(t => t.id === editingTemplate.id ? newTemplate : t);
                }
                // Add new template
                return [newTemplate, ...prev];
              });
              
              setEditingTemplate(null);
              setShowCreateTemplate(false);
            }}
          />
        )}

        {/* Edit Campaign Modal */}
        {editingCampaign && showEditPage && (
          <div className="absolute inset-0 z-50 bg-zinc-900">
            <CampaignEditPage
              campaignId={editingCampaign.id}
              campaign={editingCampaign}
              onBack={() => {
                setEditingCampaign(null);
                setShowEditPage(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}