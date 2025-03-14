import React from 'react';
import { Mail, Phone, MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';

export function CampaignPerformance() {
  const stats = [
    {
      title: 'Email Campaigns',
      icon: <Mail className="w-6 h-6 text-[#FFD700]" />,
      metrics: [
        { label: 'Sent', value: '24,951', change: '+8.2%', positive: true },
        { label: 'Opened', value: '18,723', change: '+5.7%', positive: true },
        { label: 'Clicked', value: '4,891', change: '+3.4%', positive: true },
        { label: 'Converted', value: '982', change: '+2.1%', positive: true }
      ]
    },
    {
      title: 'Power Dialer',
      icon: <Phone className="w-6 h-6 text-[#FFD700]" />,
      metrics: [
        { label: 'Total Calls', value: '12,845', change: '+6.8%', positive: true },
        { label: 'Connected', value: '8,992', change: '+4.2%', positive: true },
        { label: 'Voicemail', value: '2,853', change: '-2.5%', positive: false },
        { label: 'Converted', value: '745', change: '+1.8%', positive: true }
      ]
    },
    {
      title: 'SMS Campaigns',
      icon: <MessageSquare className="w-6 h-6 text-[#FFD700]" />,
      metrics: [
        { label: 'Sent', value: '35,624', change: '+9.4%', positive: true },
        { label: 'Delivered', value: '34,891', change: '+9.1%', positive: true },
        { label: 'Responded', value: '12,456', change: '+5.3%', positive: true },
        { label: 'Converted', value: '2,845', change: '+3.7%', positive: true }
      ]
    }
  ];

  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-white">Campaign Performance</h2>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {stats.map((category) => (
            <div key={category.title} className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-[#B38B3F]/10 flex items-center justify-center border border-[#B38B3F]/20">
                  {category.icon}
                </div>
                <h3 className="font-medium text-white">{category.title}</h3>
              </div>
              
              <div className="space-y-3">
                {category.metrics.map((metric) => (
                  <div key={metric.label} className="bg-zinc-800/50 rounded-lg p-3 border border-[#B38B3F]/20">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-white/60 text-sm">{metric.label}</span>
                      <div className={`flex items-center text-sm ${metric.positive ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {metric.positive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {metric.change}
                      </div>
                    </div>
                    <div className="text-lg font-bold text-white">{metric.value}</div>
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