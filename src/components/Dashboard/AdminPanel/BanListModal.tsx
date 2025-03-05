import React from 'react';
import { X, Shield, UserX, Search } from 'lucide-react';
import { sendUnbanEmail } from '../../../utils/email';

interface BannedUser {
  email: string;
  name: string;
  bannedAt: string;
  reason: string;
}

interface BanListModalProps {
  onClose: () => void;
}

export function BanListModal({ onClose }: BanListModalProps) {
  const [bannedUsers, setBannedUsers] = React.useState<BannedUser[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<BannedUser | null>(null);
  const [showConfirmUnban, setShowConfirmUnban] = React.useState(false);

  // Simulate loading banned users
  React.useEffect(() => {
    const loadBannedUsers = async () => {
      setIsLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBannedUsers([
        {
          email: 'banned@example.com',
          name: 'John Doe',
          bannedAt: '2025-03-15',
          reason: 'Multiple violations of terms of service'
        },
        {
          email: 'spam@example.com',
          name: 'Jane Smith',
          bannedAt: '2025-03-14',
          reason: 'Spam activities'
        }
      ]);
      setIsLoading(false);
    };
    loadBannedUsers();
  }, []);

  const filteredUsers = bannedUsers.filter(user => 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnban = async (user: BannedUser) => {
    setIsLoading(true);
    try {
      await sendUnbanEmail(user.email);
      setBannedUsers(bannedUsers.filter(u => u.email !== user.email));
      setShowConfirmUnban(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Failed to unban user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-[calc(100%-2rem)] max-w-4xl max-h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Shield className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Platform Ban List</h2>
              <p className="text-white/60 text-sm">Manage banned users and email addresses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search banned users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-[#B38B3F] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserX className="w-12 h-12 text-white/20 mx-auto mb-4" />
              <p className="text-white/50">No banned users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <div
                  key={user.email}
                  className="bg-zinc-800/50 rounded-lg p-4 border border-[#B38B3F]/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{user.name}</h3>
                      <p className="text-white/60 text-sm">{user.email}</p>
                      <div className="mt-2 text-sm">
                        <span className="text-white/40">Banned on: </span>
                        <span className="text-white/70">{new Date(user.bannedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="mt-2 text-sm text-white/70">
                        <span className="text-white/40">Reason: </span>
                        {user.reason}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowConfirmUnban(true);
                      }}
                      className="px-4 py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors"
                    >
                      Remove from Ban List
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm Unban Modal */}
      {showConfirmUnban && selectedUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowConfirmUnban(false)} />
          <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl p-6 shadow-2xl transform animate-fade-in max-w-md w-full mx-auto">
            <h3 className="text-xl font-bold text-white mb-4">Remove from Ban List?</h3>
            <p className="text-white/70 mb-4">
              Are you sure you want to remove <span className="text-white">{selectedUser.email}</span> from the ban list? 
              This will allow them to create a new account.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmUnban(false)}
                className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUnban(selectedUser)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                    <span>Removing...</span>
                  </div>
                ) : (
                  'Remove from Ban List'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}