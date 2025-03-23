import React from 'react';
import { X, Mail, Phone, MapPin, Tag, FileText, MessageSquare, Calendar, Clock, ArrowUpRight, Star, BarChart2, History } from 'lucide-react';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  propertyAddress: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  tags: string[];
  notes: string;
  leadStatus: 'hot' | 'warm' | 'cold';
}

interface ContactModalProps {
  contact: Contact;
  onClose: () => void;
}

export function ContactModal({ contact, onClose }: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-6xl h-[800px] transform animate-fade-in flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-2/3 p-6 border-r border-[#B38B3F]/20 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] text-2xl font-bold">
                {contact.firstName[0]}{contact.lastName[0]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{contact.firstName} {contact.lastName}</h2>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs font-medium">
                    {contact.leadStatus.toUpperCase()}
                  </span>
                  {contact.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-[#B38B3F]/20 text-[#FFD700] text-xs font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <MessageSquare className="w-5 h-5 text-[#FFD700]" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-[#FFD700]" />
              </button>
              <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <Mail className="w-5 h-5 text-[#FFD700]" />
              </button>
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-[#FFD700]" />
                  <span className="text-white">{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">{contact.email}</span>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-[#FFD700]" />
                  <div>
                    <div className="text-white">{contact.propertyAddress}</div>
                    <div className="text-white/60">{contact.city}, {contact.state} {contact.zip}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Lead Status</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">Lead Score</span>
                  </div>
                  <span className="text-[#FFD700] font-medium">8.5/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <BarChart2 className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">Engagement Level</span>
                  </div>
                  <span className="text-[#FFD700] font-medium">High</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-[#FFD700]" />
                    <span className="text-white">Last Contact</span>
                  </div>
                  <span className="text-white/60">2 days ago</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
            <h3 className="text-lg font-medium text-white mb-4">Notes</h3>
            <div className="text-white/70 whitespace-pre-wrap">{contact.notes}</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-1/3 p-6 bg-zinc-900/50">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white mb-4">Activity History</h3>
              <div className="space-y-4">
                {[
                  { type: 'call', time: '2 days ago', desc: 'Outbound call - 5 mins' },
                  { type: 'email', time: '3 days ago', desc: 'Email response received' },
                  { type: 'meeting', time: '1 week ago', desc: 'Property viewing scheduled' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center flex-shrink-0">
                      {activity.type === 'call' && <Phone className="w-4 h-4 text-[#FFD700]" />}
                      {activity.type === 'email' && <Mail className="w-4 h-4 text-[#FFD700]" />}
                      {activity.type === 'meeting' && <Calendar className="w-4 h-4 text-[#FFD700]" />}
                    </div>
                    <div>
                      <div className="text-white/90">{activity.desc}</div>
                      <div className="text-sm text-white/50">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Upcoming Tasks</h3>
              <div className="space-y-4">
                {[
                  { title: 'Follow-up call', date: 'Tomorrow, 2:00 PM' },
                  { title: 'Send property details', date: 'Friday, 10:00 AM' }
                ].map((task, index) => (
                  <div key={index} className="p-3 bg-zinc-800/50 rounded-lg border border-[#B38B3F]/20">
                    <div className="font-medium text-white">{task.title}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <Calendar className="w-4 h-4 text-[#FFD700]" />
                      <span className="text-sm text-white/60">{task.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Documents</h3>
              <div className="space-y-4">
                {[
                  { title: 'Purchase Agreement', date: 'Mar 15, 2025' },
                  { title: 'Property Inspection', date: 'Mar 10, 2025' }
                ].map((doc, index) => (
                  <div key={index} className="p-3 bg-zinc-800/50 rounded-lg border border-[#B38B3F]/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-white">{doc.title}</div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="w-4 h-4 text-[#FFD700]" />
                          <span className="text-sm text-white/60">{doc.date}</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                        <ArrowUpRight className="w-4 h-4 text-[#FFD700]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}