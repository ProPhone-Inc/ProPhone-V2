import React from 'react';
import { Send, Users, User, AlertTriangle } from 'lucide-react';
import { useSystemNotifications } from '../../../hooks/useSystemNotifications';

interface NotificationComposerProps {
  onClose: () => void;
  users: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

export function NotificationComposer({ onClose, users }: NotificationComposerProps) {
  const { addNotification } = useSystemNotifications();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [notificationData, setNotificationData] = React.useState({
    title: '',
    message: '',
    type: 'announcement' as const,
    priority: 'medium' as const,
    action: {
      label: '',
      url: ''
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);

    try {
      if (selectedUsers.length === 0 && !confirm('Send to all users?')) {
        setIsProcessing(false);
        return;
      }

      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const notification = {
        ...notificationData,
        recipients: selectedUsers.length > 0 ? selectedUsers : 'all'
      };

      // Send to selected users or all if none selected
      if (selectedUsers.length === 0) {
        // Send to all users
        addNotification(notificationData);
      } else {
        // Send to selected users
        selectedUsers.forEach(userId => {
          const user = users.find(u => u.id === userId);
          if (user) {
            addNotification({
              ...notificationData,
              message: `@${user.name} ${notificationData.message}`
            });
          }
        });
      }

      onClose();
    } catch (err) {
      setError('Failed to send notification. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Send className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Send Notification</h3>
              <p className="text-white/60">Send notifications to users</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Recipients Selection */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Recipients
            </label>
            <div className="relative">
              <select
                multiple
                value={selectedUsers}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => option.value);
                  setSelectedUsers(values);
                }}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white min-h-[100px]"
              >
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <div className="absolute top-2 right-2 flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => setSelectedUsers(users.map(u => u.id))}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-xs text-[#FFD700]"
                >
                  Select All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedUsers([])}
                  className="p-1 hover:bg-white/10 rounded transition-colors text-xs text-[#FFD700]"
                >
                  Clear
                </button>
              </div>
            </div>
            <p className="mt-1 text-sm text-white/50">
              {selectedUsers.length === 0 
                ? 'No recipients selected (will send to all users)' 
                : `${selectedUsers.length} recipient${selectedUsers.length === 1 ? '' : 's'} selected`}
            </p>
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Notification Type
            </label>
            <select
              value={notificationData.type}
              onChange={(e) => setNotificationData(prev => ({ 
                ...prev, 
                type: e.target.value as typeof prev.type 
              }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="announcement">Announcement</option>
              <option value="maintenance">Maintenance</option>
              <option value="security">Security</option>
              <option value="billing">Billing</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Priority
            </label>
            <select
              value={notificationData.priority}
              onChange={(e) => setNotificationData(prev => ({ 
                ...prev, 
                priority: e.target.value as typeof prev.priority 
              }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              value={notificationData.title}
              onChange={(e) => setNotificationData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              placeholder="Enter notification title"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Message
            </label>
            <textarea
              value={notificationData.message}
              onChange={(e) => setNotificationData(prev => ({ ...prev, message: e.target.value }))}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white h-24 resize-none"
              placeholder="Enter notification message"
              required
            />
          </div>

          {/* Action (Optional) */}
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Action (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                value={notificationData.action.label}
                onChange={(e) => setNotificationData(prev => ({ 
                  ...prev, 
                  action: { ...prev.action, label: e.target.value }
                }))}
                className="px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                placeholder="Action Label"
              />
              <input
                type="url"
                value={notificationData.action.url}
                onChange={(e) => setNotificationData(prev => ({ 
                  ...prev, 
                  action: { ...prev.action, url: e.target.value }
                }))}
                className="px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                placeholder="Action URL"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !notificationData.title || !notificationData.message}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Notification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}