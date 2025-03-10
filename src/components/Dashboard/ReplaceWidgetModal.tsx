import React from 'react';
import { X, MessageSquare, Phone, Mail, Voicemail, Info, Users, Calendar, BarChart2, Activity, Search, Filter, Star, TrendingUp, Zap, Sparkles, LayoutTemplate, Globe, GitMerge, UserCheck, Store } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { CampaignOverview } from './CampaignOverview';
import { StatusTracking } from './StatusTracking';
import { CampaignPerformance } from './CampaignPerformance';
import { RecentActivity } from './RecentActivity';
import { TopContacts } from './TopContacts';
import { UpcomingTasks } from './UpcomingTasks';
import { WidgetDetailsModal } from './WidgetDetailsModal';

interface WidgetCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Widget {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  component: React.ReactNode;
  category: string;
  price: string;
  downloads: number;
  rating: number;
}

export interface ReplaceWidgetModalProps {
  onClose: () => void;
  onSelect: (widgetId: string) => void;
  currentWidget: string;
}

const activeWidgets = [
  {
    id: 'unread-messages',
    title: 'Unread Messages',
    description: 'Track unread messages and notifications',
    icon: <MessageSquare className="w-5 h-5 text-[#FFD700]" />,
    size: 'small'
  },
  {
    id: 'missed-calls',
    title: 'Missed Calls',
    description: 'Track missed calls and voicemails',
    icon: <Phone className="w-5 h-5 text-[#FFD700]" />,
    size: 'small'
  },
  {
    id: 'voicemails',
    title: 'Voicemails',
    description: 'Track new voicemails',
    icon: <Voicemail className="w-5 h-5 text-[#FFD700]" />,
    size: 'small'
  },
  {
    id: 'unread-emails',
    title: 'Unread Emails',
    description: 'Track unread emails and responses',
    icon: <Mail className="w-5 h-5 text-[#FFD700]" />,
    size: 'small'
  }
];

const availableWidgets: Widget[] = [
  {
    id: 'unread-messages',
    title: 'Unread Messages',
    description: 'Track unread messages and notifications',
    icon: <MessageSquare className="w-5 h-5 text-[#FFD700]" />,
    size: 'small',
    category: 'communication',
    price: 'Free',
    downloads: 2400,
    rating: 4.8,
    component: (
      <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">8</div>
          <MessageSquare className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div className="text-sm text-white/60 mt-2">Unread Messages</div>
      </div>
    )
  },
  {
    id: 'missed-calls',
    title: 'Missed Calls',
    description: 'Track missed calls and voicemails',
    icon: <Phone className="w-5 h-5 text-[#FFD700]" />,
    size: 'small',
    category: 'communication',
    price: 'Free',
    downloads: 1800,
    rating: 4.7,
    component: (
      <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">5</div>
          <Phone className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div className="text-sm text-white/60 mt-2">Missed Calls</div>
      </div>
    )
  },
  {
    id: 'unread-emails',
    title: 'Unread Emails',
    description: 'Track unread emails and responses',
    icon: <Mail className="w-5 h-5 text-[#FFD700]" />,
    size: 'small',
    category: 'communication',
    price: 'Free',
    downloads: 2100,
    rating: 4.9,
    component: (
      <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">15</div>
          <Mail className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div className="text-sm text-white/60 mt-2">Unread Emails</div>
      </div>
    )
  },
  {
    id: 'voicemails',
    title: 'Voicemails',
    description: 'Track new voicemails',
    icon: <Voicemail className="w-5 h-5 text-[#FFD700]" />,
    size: 'small',
    category: 'communication',
    price: 'Free',
    downloads: 1500,
    rating: 4.6,
    component: (
      <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-white">12</div>
          <Voicemail className="w-6 h-6 text-[#FFD700]" />
        </div>
        <div className="text-sm text-white/60 mt-2">Voicemails</div>
      </div>
    )
  }
];

export function ReplaceWidgetModal({ onClose, onSelect, currentWidget }: ReplaceWidgetModalProps) {
  const categories: WidgetCategory[] = [
    {
      id: 'dashboard',
      title: 'Dashboard Widgets',
      description: 'Essential widgets for your main dashboard',
      icon: <LayoutTemplate className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'email',
      title: 'Email Builder Widgets',
      description: 'Design and manage email campaigns',
      icon: <Mail className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'website',
      title: 'Website/Funnel Builder',
      description: 'Create landing pages and funnels',
      icon: <Globe className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'sms',
      title: 'SMS Widgets',
      description: 'Manage SMS campaigns and responses',
      icon: <MessageSquare className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'dialer',
      title: 'Power Dialer Widgets',
      description: 'Track calls and performance',
      icon: <Phone className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'crm',
      title: 'CRM Widgets',
      description: 'Manage contacts and leads',
      icon: <Users className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'flow',
      title: 'Flow Widgets',
      description: 'Automation and workflow tools',
      icon: <GitMerge className="w-5 h-5 text-[#FFD700]" />
    },
    {
      id: 'client',
      title: 'Client Dashboard',
      description: 'Client-facing dashboard widgets',
      icon: <UserCheck className="w-5 h-5 text-[#FFD700]" />
    }
  ];

  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sizeFilter, setSizeFilter] = React.useState<string>('all');

  const [selectedWidget, setSelectedWidget] = React.useState<string | null>(null);
  const [previewScale, setPreviewScale] = React.useState(1);
  const [showDetails, setShowDetails] = React.useState<Widget | null>(null);

  React.useEffect(() => {
    // Calculate preview scale based on widget size
    const widget = availableWidgets.find(w => w.id === selectedWidget);
    if (widget) {
      setPreviewScale(widget.size === 'large' ? 0.3 : widget.size === 'medium' ? 0.4 : 0.5);
    }
  }, [selectedWidget]);

  // Filter widgets based on category, search query, and size
  const filteredWidgets = availableWidgets.filter(widget => {
    // Get the current widget's size
    const currentWidgetObj = availableWidgets.find(w => w.id === currentWidget);
    if (!currentWidgetObj) return false;

    // Only show widgets of the same size
    const matchesSize = widget.size === currentWidgetObj.size;

    const matchesCategory = selectedCategory === 'all' || widget.category === selectedCategory;
    const matchesSearch = widget.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         widget.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Don't show the current widget in the list
    const isNotCurrentWidget = widget.id !== currentWidget;

    return matchesCategory && matchesSearch && matchesSize && isNotCurrentWidget;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-7xl transform animate-fade-in flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                <Store className="w-6 h-6 text-[#FFD700]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Widget Marketplace</h3>
                <p className="text-white/60 text-sm">Discover and add new widgets to your dashboard</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Categories Sidebar */}
            <div className="w-80 border-r border-[#B38B3F]/20 flex flex-col">
              {/* Search */}
              <div className="p-4 border-b border-[#B38B3F]/20">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search widgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                  />
                </div>
              </div>

              {/* Categories List */}
              <div className="flex-1 overflow-y-auto divide-y divide-[#B38B3F]/10">
                {/* Categories */}
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`
                      w-full p-4 text-left transition-all duration-200 border-b border-[#B38B3F]/10
                      ${selectedCategory === category.id
                        ? 'bg-[#B38B3F]/20'
                        : 'hover:bg-[#B38B3F]/10'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-white">{category.title}</h4>
                        <p className="text-white/60 text-sm mt-1">{category.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Widgets Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">
                  {selectedCategory === 'all' ? 'All Widgets' : categories.find(c => c.id === selectedCategory)?.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-white/40" />
                  <select
                    value={sizeFilter}
                    onChange={(e) => setSizeFilter(e.target.value)}
                    className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
                  >
                    <option value="all">All Sizes</option>
                    <option value="small">Small (1x1)</option>
                    <option value="medium">Medium (2x1)</option>
                    <option value="large">Large (3x2)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {filteredWidgets.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => {
                      setShowDetails(widget);
                    }}
                    disabled={widget.id === currentWidget}
                    className={`
                      relative p-6 rounded-xl border text-left transition-all duration-200 group
                      ${widget.id === currentWidget
                        ? 'bg-zinc-800/50 border-zinc-700/50 cursor-not-allowed opacity-50'
                        : `bg-zinc-800/50 border-[#B38B3F]/20 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 ${
                            selectedWidget === widget.id ? 'border-[#FFD700] shadow-lg shadow-[#FFD700]/10' : ''
                          }`
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                        {widget.icon}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-[#FFD700]" />
                        <span className="text-[#FFD700] text-sm">{widget.rating}</span>
                      </div>
                    </div>
                    <div>
                      <div>
                        <h4 className="font-medium text-white">{widget.title}</h4>
                        <p className="text-white/60 text-sm mt-1">{widget.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-emerald-400" />
                          <span className="text-emerald-400 text-xs">{widget.downloads}+ users</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-white/50">
                            {widget.size === 'small' ? '1x1' : widget.size === 'medium' ? '2x1' : '3x2'}
                          </span>
                          <span className="text-[#FFD700] font-medium">{widget.price}</span>
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#B38B3F]/0 via-[#FFD700]/5 to-[#B38B3F]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#B38B3F]/20 bg-black/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-[#FFD700]" />
                <span className="text-white/70">Pro tip: Drag and drop widgets to rearrange them on your dashboard</span>
              </div>
              <button
                onClick={() => selectedWidget && onSelect(selectedWidget)}
                disabled={!selectedWidget}
                className="px-6 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Replace Widget
              </button>
            </div>
          </div>
      </div>
      
      {showDetails && (
        <WidgetDetailsModal
          widget={showDetails}
          currentWidget={currentWidget}
          onClose={() => setShowDetails(null)}
          onSelect={() => {
            setSelectedWidget(showDetails.id);
            onSelect(showDetails.id);
          }}
        />
      )}
    </div>
  );
}