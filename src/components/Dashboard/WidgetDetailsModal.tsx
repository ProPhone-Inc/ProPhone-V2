import React from 'react';
import { X, Star, TrendingUp, Sparkles, DollarSign, Check, ArrowRight } from 'lucide-react';
import { StatsCards } from './StatsCards';
import { CampaignOverview } from './CampaignOverview';
import { StatusTracking } from './StatusTracking';
import { CampaignPerformance } from './CampaignPerformance';
import { RecentActivity } from './RecentActivity';
import { TopContacts } from './TopContacts';
import { UpcomingTasks } from './UpcomingTasks';

interface WidgetDetailsModalProps {
  widget: {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    size: 'small' | 'medium' | 'large';
    component: React.ReactNode;
  };
  onClose: () => void;
  onSelect: () => void;
  currentWidget: string;
}

export function WidgetDetailsModal({ widget, onClose, onSelect, currentWidget }: WidgetDetailsModalProps) {
  // Calculate pricing based on widget size
  const getPricing = (size: string) => {
    switch (size) {
      case 'small':
        return { price: 'Free', period: 'forever' };
      case 'medium':
        return { price: '$5', period: '/month' };
      case 'large':
        return { price: '$10', period: '/month' };
      default:
        return { price: 'Free', period: 'forever' };
    }
  };

  const pricing = getPricing(widget.size);
  const isCurrentWidget = widget.id === currentWidget;

  const features = [
    'Real-time data updates',
    'Customizable appearance',
    'Interactive elements',
    'Data export capabilities',
    'Integration with other widgets'
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex">
        {/* Preview Section */}
        <div className="w-3/5 border-r border-[#B38B3F]/20 p-8 bg-black/20">
          <div className="aspect-video rounded-xl border border-[#B38B3F]/20 overflow-hidden bg-black/40 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="transform transition-transform duration-300 hover:scale-90" style={{ 
                transform: `scale(${widget.size === 'large' ? 0.6 : widget.size === 'medium' ? 0.7 : 0.8})`
              }}>
                {widget.component}
              </div>
            </div>
          </div>
          
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-medium text-white">Widget Preview</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="text-sm text-white/60">Size</div>
                <div className="text-white font-medium mt-1">
                  {widget.size === 'small' ? '1x1 Grid Space' : 
                   widget.size === 'medium' ? '2x1 Grid Space' : 
                   '3x2 Grid Space'}
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="text-sm text-white/60">Rating</div>
                <div className="text-white font-medium mt-1 flex items-center">
                  <Star className="w-4 h-4 text-[#FFD700] mr-1" />
                  4.8/5.0
                </div>
              </div>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="text-sm text-white/60">Downloads</div>
                <div className="text-white font-medium mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mr-1" />
                  2.4k
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="w-2/5 p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
                {widget.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{widget.title}</h2>
                <div className="flex items-center space-x-2 mt-1">
                  <Star className="w-4 h-4 text-[#FFD700]" />
                  <span className="text-[#FFD700]">4.8</span>
                  <span className="text-white/40">•</span>
                  <span className="text-white/60">2.4k downloads</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Description</h3>
              <p className="text-white/70">{widget.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Features</h3>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2 text-white/70">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-3">Requirements</h3>
              <div className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/20">
                <div className="flex items-center space-x-2 text-white/70">
                  <Sparkles className="w-4 h-4 text-[#FFD700]" />
                  <span>Pro subscription or higher required for some features</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-[#B38B3F]/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-2xl font-bold text-white flex items-center">
                  <DollarSign className="w-6 h-6 text-[#FFD700]" />
                  {pricing.price}
                  <span className="text-white/40 text-base font-normal ml-1">{pricing.period}</span>
                </div>
                <p className="text-white/60 text-sm">One-time purchase, lifetime updates</p>
              </div>
              <button
                onClick={onSelect}
                disabled={isCurrentWidget}
                className="px-6 py-3 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center space-x-2"
              >
                <span>{isCurrentWidget ? "Can't replace current widget" : "Install"}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}