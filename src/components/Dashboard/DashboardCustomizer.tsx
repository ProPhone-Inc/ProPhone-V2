import React from 'react';
import { X, GripVertical, Settings, LayoutGrid, Rows, LayoutTemplate, MessageSquare, Phone, Mail, BarChart as ChartBar, Activity } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { CampaignOverview } from './CampaignOverview';
import { StatusTracking } from './StatusTracking';
import { CampaignPerformance } from './CampaignPerformance';
import { RecentActivity } from './RecentActivity';
import { MarketingCard } from './MarketingCard';
import { TopContacts } from './TopContacts';
import { UpcomingTasks } from './UpcomingTasks';

interface Widget {
  id: string;
  title: string;
  description: string;
  visible: boolean;
  order: number;
  size: 'small' | 'medium' | 'large';
  x: number;
  y: number;
  w: number;
  h: number;
  component: string;
}

interface DashboardCustomizerProps {
  onClose: () => void;
  onSave: (widgets: Widget[]) => void;
}

interface WidgetSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  widgets: Widget[];
}

export function DashboardCustomizer({ onClose, onSave }: DashboardCustomizerProps) {
  const sections: WidgetSection[] = [
    {
      id: 'communication',
      title: 'Communication',
      icon: <MessageSquare className="w-5 h-5 text-[#FFD700]" />,
      widgets: [
        {
          id: 'unread-messages',
          title: 'Unread Messages',
          description: 'Track unread messages and notifications',
          size: 'small',
          component: 'UnreadMessages'
        },
        {
          id: 'missed-calls',
          title: 'Missed Calls',
          description: 'Track missed calls and voicemails',
          size: 'small',
          component: 'MissedCalls'
        },
        {
          id: 'voicemails',
          title: 'Voicemails',
          description: 'Track new and unheard voicemails',
          size: 'small',
          component: 'Voicemails'
        },
        {
          id: 'unread-emails',
          title: 'Unread Emails',
          description: 'Track unread emails and responses',
          size: 'small',
          component: 'UnreadEmails'
        }
      ]
    },
    {
      id: 'analytics',
      title: 'Analytics',
      icon: <ChartBar className="w-5 h-5 text-[#FFD700]" />,
      widgets: [
        {
          id: 'campaign-overview',
          title: 'Campaign Overview',
          description: 'Overview of all marketing campaigns',
          size: 'large',
          component: 'CampaignOverview'
        },
        {
          id: 'campaign-performance',
          title: 'Campaign Performance',
          description: 'Detailed campaign metrics and analytics',
          size: 'large',
          component: 'CampaignPerformance'
        }
      ]
    },
    {
      id: 'tracking',
      title: 'Tracking',
      icon: <Activity className="w-5 h-5 text-[#FFD700]" />,
      widgets: [
        {
          id: 'status-tracking',
          title: 'Status Tracking',
          description: 'Track lead and contact statuses',
          size: 'large',
          component: 'StatusTracking'
        },
        {
          id: 'recent-activity',
          title: 'Recent Activity',
          description: 'Latest actions and updates',
          size: 'medium',
          component: 'RecentActivity'
        }
      ]
    }
  ];

  const [widgets, setWidgets] = React.useState<Widget[]>([
    {
      id: 'stats',
      title: 'Status Overview',
      description: 'Track key metrics and performance indicators',
      visible: true,
      order: 1,
      size: 'medium',
      x: 0,
      y: 0,
      w: 2,
      h: 1,
      component: 'StatsCards'
    },
    {
      id: 'campaign-overview',
      title: 'Campaign Overview',
      description: 'Overview of all marketing campaigns',
      visible: true,
      order: 2,
      size: 'large',
      x: 2,
      y: 0,
      w: 3,
      h: 2,
      component: 'CampaignOverview'
    },
    {
      id: 'status-tracking',
      title: 'Status Tracking',
      description: 'Track lead and contact statuses',
      visible: true,
      order: 3,
      size: 'medium',
      x: 0,
      y: 1,
      w: 2,
      h: 1,
      component: 'StatusTracking'
    },
    {
      id: 'campaign-performance',
      title: 'Campaign Performance',
      description: 'Detailed campaign metrics and analytics',
      visible: true,
      order: 4,
      size: 'large',
      x: 0,
      y: 2,
      w: 3,
      h: 2,
      component: 'CampaignPerformance'
    },
    {
      id: 'recent-activity',
      title: 'Recent Activity',
      description: 'Latest actions and updates',
      visible: true,
      order: 5,
      size: 'medium',
      x: 3,
      y: 2,
      w: 2,
      h: 1,
      component: 'RecentActivity'
    }
  ]);

  // Fixed marketing card widget that cannot be moved or edited
  const marketingCard = {
    id: 'marketing',
    title: 'Boost Your Campaigns',
    description: 'Marketing campaign quick actions',
    visible: true,
    order: 999, // High order to ensure it's always at the end
    size: 'small',
    x: 5, // Fixed position on the right side
    y: 0,
    w: 1,
    h: 1,
    fixed: true // Mark as fixed/non-editable
  };

  const [availableWidgets] = React.useState([
    {
      id: 'marketing',
      title: 'Marketing Card',
      description: 'Marketing campaign quick actions',
      size: 'small'
    },
    {
      id: 'contacts',
      title: 'Top Contacts',
      description: 'Most engaged contacts and leads',
      size: 'small'
    },
    {
      id: 'tasks',
      title: 'Upcoming Tasks',
      description: 'Scheduled tasks and reminders',
      size: 'small'
    }
  ]);

  const [draggedWidget, setDraggedWidget] = React.useState<string | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState<string | null>(null);
  const [gridSize, setGridSize] = React.useState({ cols: 6, rows: 4 });
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const gridRef = React.useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = React.useState<string | null>(null);

  const handleDragStart = (widgetId: string, e: React.DragEvent) => {
    // Prevent dragging the marketing card
    if (widgetId === 'marketing') {
      e.preventDefault();
      return;
    }
    setDraggedWidget(widgetId);
    setIsDragging(true);
    setShowPreview(widgetId);

    // Set drag image
    const dragImage = document.createElement('div');
    dragImage.className = 'bg-[#FFD700]/20 border-2 border-[#FFD700] rounded-lg w-32 h-32';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 16, 16);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setDraggedWidget(null);
    setIsDragging(false);
    setShowPreview(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedWidget || !gridRef.current) return;
    
    // Prevent dropping on marketing card's position
    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / gridSize.cols));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / gridSize.rows));
    
    if (x === marketingCard.x && y === marketingCard.y) {
      return;
    }

    // Find widget being dropped
    const widget = widgets.find(w => w.id === draggedWidget) || availableWidgets.find(w => w.id === draggedWidget);
    if (!widget) return;

    // Calculate size based on widget type
    const size = {
      small: { w: 1, h: 1 },
      medium: { w: 2, h: 1 },
      large: { w: 3, h: 2 }
    }[widget.size];

    // Check if space is available
    const isSpaceAvailable = (x: number, y: number, w: number, h: number) => {
      if (x + w > gridSize.cols || y + h > gridSize.rows) return false;
      
      return !widgets.some(widget => {
        if (widget.id === draggedWidget) return false;
        const overlap = !(
          x + w <= widget.x ||
          x >= widget.x + widget.w ||
          y + h <= widget.y ||
          y >= widget.y + widget.h
        );
        return overlap;
      });
    };

    // Find nearest available space
    let placed = false;
    let bestX = x;
    let bestY = y;

    // Try to place as close as possible to drop position
    for (let offsetY = 0; offsetY < gridSize.rows && !placed; offsetY++) {
      for (let offsetX = 0; offsetX < gridSize.cols && !placed; offsetX++) {
        for (const testY of [y - offsetY, y + offsetY]) {
          for (const testX of [x - offsetX, x + offsetX]) {
            if (
              testX >= 0 && 
              testY >= 0 && 
              testX + size.w <= gridSize.cols &&
              testY + size.h <= gridSize.rows &&
              isSpaceAvailable(testX, testY, size.w, size.h)
            ) {
              bestX = testX;
              bestY = testY;
              placed = true;
              break;
            }
          }
          if (placed) break;
        }
      }
    }

    if (placed) {
      setWidgets(prev => {
        const existing = prev.find(w => w.id === draggedWidget);
        if (existing) {
          // Update existing widget
          return prev.map(w => 
            w.id === draggedWidget 
              ? { ...w, x: bestX, y: bestY }
              : w
          );
        } else {
          // Add new widget from available widgets
          return [...prev, {
            ...widget,
            visible: true,
            order: prev.length + 1,
            x: bestX,
            y: bestY,
            w: size.w,
            h: size.h
          }];
        }
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!gridRef.current || !draggedWidget) return;

    const rect = gridRef.current.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / gridSize.cols));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / gridSize.rows));

    // Show preview of where widget will be placed
    const previewEl = document.getElementById('drag-preview');
    if (previewEl) {
      const cellWidth = rect.width / gridSize.cols;
      const cellHeight = rect.height / gridSize.rows;
      
      previewEl.style.left = `${x * cellWidth}px`;
      previewEl.style.top = `${y * cellHeight}px`;
      previewEl.style.width = `${cellWidth}px`;
      previewEl.style.height = `${cellHeight}px`;
      previewEl.style.opacity = '0.5';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900/90 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-4rem)] max-w-7xl h-[calc(100vh-4rem)] overflow-hidden flex flex-col backdrop-blur-xl">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                <LayoutTemplate className="w-5 h-5 text-[#FFD700]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Dashboard Builder</h2>
                <p className="text-white/60">Drag and drop widgets to customize your dashboard</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex bg-zinc-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#FFD700] text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#FFD700] text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <Rows className="w-5 h-5" />
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Widget Sections */}
          <div className="w-80 border-r border-[#B38B3F]/20 overflow-y-auto">
            {sections.map((section) => (
              <div key={section.id} className="p-4 border-b border-[#B38B3F]/20">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                    {section.icon}
                  </div>
                  <h3 className="text-lg font-medium text-white">{section.title}</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {section.widgets.map((widget) => (
                    <div
                      key={widget.id}
                      draggable
                      onDragStart={(e) => handleDragStart(widget.id, e)}
                      onDragEnd={handleDragEnd}
                      className="relative bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20 hover:border-[#B38B3F]/40 cursor-move transition-colors group w-full"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center border border-[#B38B3F]/20">
                            <GripVertical className="w-4 h-4 text-[#FFD700] group-hover:text-[#FFD700] transition-colors" />
                          </div>
                          <div>
                            <h4 className="font-medium text-white text-sm">{widget.title}</h4>
                            <div className="flex items-center space-x-1.5 text-xs text-white/50 mt-0.5">
                              <span>{widget.size === 'small' ? '1x1' : widget.size === 'medium' ? '2x1' : '3x2'}</span>
                              <div className="relative group/size">
                                <svg className="w-3.5 h-3.5 text-white/40 group-hover/size:text-[#FFD700] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                  <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                  <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"/>
                                  <circle cx="12" cy="8" r="1" fill="currentColor"/>
                                </svg>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-32 p-2 bg-zinc-900/95 backdrop-blur-sm border border-[#B38B3F]/20 rounded-lg shadow-xl opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all duration-200 z-50">
                                  <p className="text-xs text-white/70">
                                    {widget.size === 'small' 
                                      ? 'Small widget (1x1 grid space)'
                                      : widget.size === 'medium'
                                        ? 'Medium widget (2x1 grid space)'
                                        : 'Large widget (3x2 grid space)'}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative group/info">
                          <button className="p-1 rounded-full hover:bg-white/10 transition-colors">
                            <svg className="w-4 h-4 text-white/40 group-hover/info:text-[#FFD700] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                              <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"/>
                              <circle cx="12" cy="8" r="1" fill="currentColor"/>
                            </svg>
                          </button>
                          <div className="absolute right-0 top-full mt-2 w-[300px] p-4 bg-zinc-900/95 backdrop-blur-sm border border-[#B38B3F]/20 rounded-lg shadow-xl opacity-0 invisible group-hover/info:opacity-100 group-hover/info:visible transition-all duration-200 z-50">
                            <p className="text-sm text-white/70">{widget.description}</p>
                            <div className="mt-3 bg-black/20 rounded-lg p-2 border border-[#B38B3F]/10 overflow-hidden">
                              <div className="transform scale-[0.4] origin-top-left -ml-[60%] -mt-[60%] w-[250%] h-[250%]">
                                {widget.id === 'unread-messages' && (
                                  <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
                                    <div className="flex items-center justify-between">
                                      <div className="text-2xl font-bold text-white">8</div>
                                      <MessageSquare className="w-6 h-6 text-[#FFD700]" />
                                    </div>
                                    <div className="text-sm text-white/60 mt-2">Unread Messages</div>
                                  </div>
                                )}
                                {widget.id === 'missed-calls' && (
                                  <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
                                    <div className="flex items-center justify-between">
                                      <div className="text-2xl font-bold text-white">5</div>
                                      <Phone className="w-6 h-6 text-[#FFD700]" />
                                    </div>
                                    <div className="text-sm text-white/60 mt-2">Missed Calls</div>
                                  </div>
                                )}
                                {widget.id === 'voicemails' && (
                                  <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
                                    <div className="flex items-center justify-between">
                                      <div className="text-2xl font-bold text-white">12</div>
                                      <Mail className="w-6 h-6 text-[#FFD700]" />
                                    </div>
                                    <div className="text-sm text-white/60 mt-2">Voicemails</div>
                                  </div>
                                )}
                                {widget.id === 'unread-emails' && (
                                  <div className="bg-zinc-800 rounded-lg p-4 border border-[#B38B3F]/20">
                                    <div className="flex items-center justify-between">
                                      <div className="text-2xl font-bold text-white">15</div>
                                      <Mail className="w-6 h-6 text-[#FFD700]" />
                                    </div>
                                    <div className="text-sm text-white/60 mt-2">Unread Emails</div>
                                  </div>
                                )}
                                {widget.id === 'campaign-overview' && <CampaignOverview />}
                                {widget.id === 'status-tracking' && <StatusTracking />}
                                {widget.id === 'campaign-performance' && <CampaignPerformance />}
                                {widget.id === 'recent-activity' && <RecentActivity />}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Grid Layout Area */}
          <div className="flex-1 p-6 overflow-auto bg-black/20">
            <div 
              ref={gridRef}
              className="relative w-full max-w-[1200px] mx-auto aspect-[16/9] bg-black/40 rounded-xl border-2 border-dashed border-[#B38B3F]/20 overflow-hidden"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 pointer-events-none">
                {Array.from({ length: gridSize.cols * gridSize.rows }).map((_, i) => (
                  <div 
                    key={i}
                    className="border border-[#B38B3F]/5 relative before:absolute before:inset-0 before:bg-[radial-gradient(circle,_#B38B3F_1px,_transparent_1px)] before:bg-[length:20px_20px] before:opacity-5"
                  />
                ))}
              </div>

              {/* Placed Widgets */}
              {widgets.map((widget) => (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={(e) => handleDragStart(widget.id, e)}
                  onDragEnd={handleDragEnd}
                  className={`
                    absolute bg-zinc-900/95 backdrop-blur-sm rounded-xl border transition-all duration-200 cursor-move overflow-hidden
                    ${isDragging && draggedWidget === widget.id
                      ? 'opacity-50 border-[#FFD700]/50'
                      : 'border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
                    }
                  `}
                  style={{
                    left: `${(widget.x / gridSize.cols) * 100}%`,
                    top: `${(widget.y / gridSize.rows) * 100}%`,
                    width: `${(widget.w / gridSize.cols) * 100}%`,
                    height: `${(widget.h / gridSize.rows) * 100}%`,
                    transform: 'scale(0.98)',
                    transformOrigin: 'top left',
                    transition: isDragging && draggedWidget === widget.id ? 'none' : 'all 0.3s ease'
                  }}
                >
                  <div className="p-4 h-full relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center border border-[#B38B3F]/20">
                          <GripVertical className="w-4 h-4 text-[#FFD700]" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white text-sm">{widget.title}</h3>
                          <div className="flex items-center space-x-1.5 text-xs text-white/50 mt-0.5">
                            <span>{widget.size === 'small' ? '1x1' : widget.size === 'medium' ? '2x1' : '3x2'}</span>
                            <div className="relative group/size">
                              <svg className="w-3.5 h-3.5 text-white/40 group-hover/size:text-[#FFD700] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <circle cx="12" cy="12" r="10" strokeWidth="2"/>
                                <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"/>
                                <circle cx="12" cy="8" r="1" fill="currentColor"/>
                              </svg>
                              <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 w-32 p-2 bg-zinc-900/95 backdrop-blur-sm border border-[#B38B3F]/20 rounded-lg shadow-xl opacity-0 invisible group-hover/size:opacity-100 group-hover/size:visible transition-all duration-200 z-50">
                                <p className="text-xs text-white/70">
                                  {widget.size === 'small' 
                                    ? 'Small widget (1x1 grid space)'
                                    : widget.size === 'medium'
                                      ? 'Medium widget (2x1 grid space)'
                                      : 'Large widget (3x2 grid space)'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setShowSettings(showSettings === widget.id ? null : widget.id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Settings className="w-4 h-4 text-white/40 hover:text-[#FFD700] transition-colors" />
                        </button>
                      </div>
                    </div>
                    {/* Widget Preview */}
                    <div className="mt-4 h-[calc(100%-4rem)] overflow-hidden">
                      {widget.component === 'StatsCards' && (
                        <div className="transform scale-[0.8] origin-top">
                          <StatsCards />
                        </div>
                      )}
                      {widget.component === 'CampaignOverview' && (
                        <div className="transform scale-[0.8] origin-top">
                          <CampaignOverview />
                        </div>
                      )}
                      {widget.component === 'StatusTracking' && (
                        <div className="transform scale-[0.8] origin-top">
                          <StatusTracking />
                        </div>
                      )}
                      {widget.component === 'CampaignPerformance' && (
                        <div className="transform scale-[0.8] origin-top">
                          <CampaignPerformance />
                        </div>
                      )}
                      {widget.component === 'RecentActivity' && (
                        <div className="transform scale-[0.8] origin-top">
                          <RecentActivity />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Fixed Marketing Card */}
              <div
                className="absolute bg-zinc-900/90 backdrop-blur-sm rounded-xl border border-[#FFD700]/30 cursor-not-allowed overflow-hidden"
                style={{
                  left: `${(marketingCard.x / gridSize.cols) * 100}%`,
                  top: `${(marketingCard.y / gridSize.rows) * 100}%`,
                  width: `${(marketingCard.w / gridSize.cols) * 100}%`,
                  height: `${(marketingCard.h / gridSize.rows) * 100}%`,
                  transform