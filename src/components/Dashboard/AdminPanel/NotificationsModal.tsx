import React from 'react';
import { X, Bell, Mail, AlertTriangle, Settings, Search, Filter, Star, TrendingUp, Zap, Sparkles, LayoutTemplate, Globe, GitMerge, UserCheck, Store, Send, Clock, Ban, Trash2 } from 'lucide-react';
import { EmailTemplatesModal } from './EmailTemplatesModal';
import { NotificationComposer } from './NotificationComposer';

interface NotificationLog {
  id: string;
  type: 'suspension' | 'ban' | 'reactivation' | 'deletion' | 'system';
  recipient: string;
  subject: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: string;
}

interface NotificationsModalProps {
  onClose: () => void;
  onOpenEmailTemplates: () => void;
}

export function NotificationsModal({ onClose, onOpenEmailTemplates }: NotificationsModalProps) {
  const [activeTab, setActiveTab] = React.useState<'logs' | 'settings'>('logs');
  const [showEmailTemplates, setShowEmailTemplates] = React.useState(false);
  const [showComposer, setShowComposer] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [typeFilter, setTypeFilter] = React.useState('all');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [selectedLog, setSelectedLog] = React.useState<NotificationLog | null>(null);
  const [isResending, setIsResending] = React.useState(false);

  const [notificationLogs, setNotificationLogs] = React.useState<NotificationLog[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'suspension':
        return <Ban className="w-5 h-5 text-amber-400" />;
      case 'ban':
        return <Trash2 className="w-5 h-5 text-red-400" />;
      case 'reactivation':
        return <UserCheck className="w-5 h-5 text-emerald-400" />;
      case 'deletion':
        return <Trash2 className="w-5 h-5 text-red-400" />; 
      default:
        return <AlertTriangle className="w-5 h-5 text-[#FFD700]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return (
          <span className="px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
            Sent
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
            Failed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium animate-pulse">
            Pending
          </span>
        );
      default:
        return null;
    }
  };

  const handleResend = async (log: NotificationLog) => {
    setIsResending(true);
    try {
      // Simulate API call to resend notification
      await new Promise(resolve => setTimeout(resolve, 1500));
      // Update the log status
      log.status = 'sent';
      setSelectedLog({ ...log });
    } finally {
      setIsResending(false);
    }
  };

  const filteredLogs = notificationLogs.filter(log => {
    const matchesSearch = 
      log.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || log.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-6xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Bell className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Notification Center</h2>
              <p className="text-white/60">Manage system notifications and email alerts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="border-b border-[#B38B3F]/20">
          <div className="flex space-x-4 px-6">
            <button
              onClick={() => setActiveTab('logs')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'logs'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              Notification Logs
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'settings'
                  ? 'border-[#FFD700] text-[#FFD700]'
                  : 'border-transparent text-white/70 hover:text-white'
              }`}
            >
              Settings
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
          {activeTab === 'logs' ? (
            <div className="p-6 space-y-6">
              {/* Filters */}
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowComposer(true)}
                  className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </button>
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search notifications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-white/40" />
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
                  >
                    <option value="all">All Types</option>
                    <option value="suspension">Suspension</option>
                    <option value="ban">Ban</option>
                    <option value="reactivation">Reactivation</option>
                    <option value="system">System</option>
                  </select>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
                  >
                    <option value="all">All Status</option>
                    <option value="sent">Sent</option>
                    <option value="failed">Failed</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>

              {/* Notification List */}
              <div className="space-y-4">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`bg-zinc-800/50 rounded-xl border transition-colors cursor-pointer ${
                      selectedLog?.id === log.id
                        ? 'border-[#B38B3F] shadow-lg shadow-[#B38B3F]/5'
                        : 'border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
                    }`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {getNotificationIcon(log.type)}
                          <div>
                            <div className="font-medium text-white">{log.subject}</div>
                            <div className="text-sm text-white/60">{log.recipient}</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          {getStatusBadge(log.status)}
                          <div className="text-sm text-white/50">
                            {new Date(log.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {selectedLog?.id === log.id && (
                        <div className="mt-4 pt-4 border-t border-[#B38B3F]/20">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="text-white/70">
                                <span className="text-white/50">Type:</span>{' '}
                                {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                              </div>
                              {log.status === 'failed' && (
                                <div className="text-red-400 text-sm">
                                  Failed to deliver: Server timeout
                                </div>
                              )}
                            </div>
                            <div className="flex space-x-3">
                              {log.status === 'failed' && (
                                <button
                                  onClick={() => handleResend(log)}
                                  disabled={isResending}
                                  className="flex items-center space-x-2 px-3 py-1.5 bg-[#B38B3F] text-black rounded-lg hover:bg-[#B38B3F]/90 transition-colors text-sm font-medium disabled:opacity-50"
                                >
                                  {isResending ? (
                                    <>
                                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                                      <span>Resending...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Send className="w-4 h-4" />
                                      <span>Resend</span>
                                    </>
                                  )}
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedLog(null);
                                }}
                                className="px-3 py-1.5 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors text-sm"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              {/* Email Templates Section */}
              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-[#FFD700]" />
                    <h3 className="text-lg font-bold text-white">Email Templates</h3>
                  </div>
                  <button
                    onClick={() => setShowEmailTemplates(true)}
                    className="px-4 py-2 bg-[#B38B3F] text-black rounded-lg hover:bg-[#B38B3F]/90 transition-colors text-sm font-medium"
                  >
                    Manage Templates
                  </button>
                </div>
                <p className="text-white/70">
                  Configure and customize email templates for system notifications
                </p>
              </div>

              {/* System Alerts Section */}
              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertTriangle className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="text-lg font-bold text-white">System Alerts</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Failed Login Attempts</div>
                      <div className="text-sm text-white/60">
                        Notify when multiple failed login attempts are detected
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div>
                      <div className="font-medium text-white">System Performance</div>
                      <div className="text-sm text-white/60">
                        Alert when system resources are running low
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg">
                    <div>
                      <div className="font-medium text-white">Payment Failures</div>
                      <div className="text-sm text-white/60">
                        Notify on failed payment attempts or billing issues
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B38B3F]"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Settings className="w-5 h-5 text-[#FFD700]" />
                  <h3 className="text-lg font-bold text-white">Notification Settings</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Admin Email Recipients
                    </label>
                    <input
                      type="text"
                      defaultValue="admin@prophone.io, support@prophone.io"
                      className="w-full px-3 py-2 bg-zinc-900 border border-[#B38B3F]/20 rounded-lg text-white"
                    />
                    <p className="mt-1 text-sm text-white/50">
                      Comma-separated list of email addresses to receive admin notifications
                    </p>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Notification Retention
                    </label>
                    <select
                      defaultValue="30"
                      className="w-full px-3 py-2 bg-zinc-900 border border-[#B38B3F]/20 rounded-lg text-white"
                    >
                      <option value="7">7 days</option>
                      <option value="14">14 days</option>
                      <option value="30">30 days</option>
                      <option value="90">90 days</option>
                    </select>
                    <p className="mt-1 text-sm text-white/50">
                      How long to keep notification logs before automatic deletion
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showEmailTemplates && (
        <EmailTemplatesModal onClose={() => setShowEmailTemplates(false)} />
      )}
      {showComposer && (
        <NotificationComposer 
          onClose={() => setShowComposer(false)}
          users={[
            {
              id: '1',
              name: 'Sarah Johnson',
              email: 'sarah@example.com',
              avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
            },
            {
              id: '2', 
              name: 'Mike Chen',
              email: 'mike@example.com',
              avatar: 'https://randomuser.me/api/portraits/men/22.jpg'
            },
            {
              id: '3',
              name: 'Emma Wilson',
              email: 'emma@example.com',
              avatar: 'https://randomuser.me/api/portraits/women/28.jpg'
            }
          ]}
        />
      )}
    </div>
  );
}