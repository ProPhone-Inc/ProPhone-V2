import React from 'react';
import { Activity, User, Mail, MessageSquare, ArrowRight, Calendar, PlusCircle, CheckCircle } from 'lucide-react';

export function RecentActivity() {

  const activities = [
    {
      id: 1,
      icon: <Mail className="text-[#FFD700]" />,
      title: 'New Email Campaign Sent',
      description: 'Fall Collection Announcement sent to 5,342 subscribers',
      time: '2 hours ago',
    },
    {
      id: 2,
      icon: <User className="text-[#FFD700]" />,
      title: 'New Contact Added',
      description: 'John Smith (john.smith@example.com) was added to your contacts',
      time: '4 hours ago',
    },
    {
      id: 3,
      icon: <CheckCircle className="text-[#FFD700]" />,
      title: 'Campaign Completed',
      description: 'Summer Sale Reminder campaign has been completed',
      time: 'Yesterday',
    },
    {
      id: 4,
      icon: <MessageSquare className="text-[#FFD700]" />,
      title: 'New SMS Campaign Created',
      description: 'Flash Sale Alert is ready to send',
      time: 'Yesterday',
    },
    {
      id: 5,
      icon: <PlusCircle className="text-[#FFD700]" />,
      title: 'New Campaign Created',
      description: 'New Collection Teaser has been scheduled',
      time: '3 days ago',
    },
  ];

  return (
    <div 
      className="bg-gradient-to-br from-zinc-900 to-black border border-[#B38B3F]/20 rounded-xl overflow-hidden transition-all duration-300 hover:border-[#B38B3F]/40 hover:shadow-lg hover:shadow-[#B38B3F]/5 card-gold-glow"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Activity className="w-5 h-5 mr-2 text-[#FFD700]" />
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>
          </div>
          <div>
            <button className="text-[#B38B3F] hover:text-[#FFD700] text-sm font-medium transition-colors flex items-center">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute top-0 bottom-0 left-6 w-px bg-gradient-to-b from-[#B38B3F]/30 via-[#FFD700]/20 to-transparent"></div>
          <div className="space-y-6">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-start">
                <div className="absolute left-0 mt-1.5 w-3 h-3 rounded-full border-2 border-[#B38B3F] bg-black"></div>
                <div className="flex items-center ml-10">
                  <div className="w-8 h-8 rounded-full bg-[#B38B3F]/10 flex items-center justify-center mr-3">
                    {activity.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{activity.title}</h4>
                    <p className="text-sm text-white/60 mt-0.5">{activity.description}</p>
                    <span className="text-xs text-white/40 flex items-center mt-1">
                      <Calendar className="w-3 h-3 mr-1" /> {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}