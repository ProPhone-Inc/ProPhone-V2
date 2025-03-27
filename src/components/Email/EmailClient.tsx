import React, { useEffect } from 'react';
import { Mail, Star, Clock, Send, Trash2, Archive, Tag, Search, Plus, Settings, ChevronDown, X, Paperclip, Image, Smile, ArrowRight, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface EmailAccount {
  id: string;
  email: string;
  provider: string;
  connected: boolean;
}

interface Email {
  id: string;
  from: string;
  subject: string;
  preview: string;
  date: string;
  read: boolean;
  starred: boolean;
  hasAttachments: boolean;
  labels: string[];
}

export function EmailClient() {
  const { user } = useAuth();
  const [selectedAccount, setSelectedAccount] = React.useState<EmailAccount | null>(null);
  const [showAccountModal, setShowAccountModal] = React.useState(false);
  const [isConnecting, setIsConnecting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selectedEmail, setSelectedEmail] = React.useState<Email | null>(null);
  const [showCompose, setShowCompose] = React.useState(false);
  const [accounts, setAccounts] = React.useState<EmailAccount[]>([]);
  const [emails, setEmails] = React.useState<Email[]>([]);
  const [currentFolder, setCurrentFolder] = React.useState('inbox');

  const folders = [
    { id: 'inbox', name: 'Inbox', icon: <Mail className="w-5 h-5" /> },
    { id: 'starred', name: 'Starred', icon: <Star className="w-5 h-5" /> },
    { id: 'sent', name: 'Sent', icon: <Send className="w-5 h-5" /> },
    { id: 'drafts', name: 'Drafts', icon: <Clock className="w-5 h-5" /> },
    { id: 'archive', name: 'Archive', icon: <Archive className="w-5 h-5" /> },
    { id: 'trash', name: 'Trash', icon: <Trash2 className="w-5 h-5" /> }
  ];

  // Show account modal on first load if no accounts connected
  useEffect(() => {
    if (accounts.length === 0) {
      setShowAccountModal(true);
    }
  }, [accounts.length]);

  const handleConnectEmail = async (email: string, password: string, provider: string) => {
    setIsConnecting(true);
    setError(null);
    
    try {
      // In a real app, this would connect to the email provider's API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newAccount: EmailAccount = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        provider,
        connected: true
      };
      
      setAccounts(prev => [...prev, newAccount]);
      setSelectedAccount(newAccount);
      setShowAccountModal(false);
    } catch (error) {
      setError('Failed to connect email account. Please check your credentials.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="h-full flex bg-zinc-900/50 overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-[#B38B3F]/20 bg-zinc-900/70 flex flex-col">
        <div className="p-4">
          <button
            onClick={() => setShowCompose(true)}
            className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Compose</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Email Accounts */}
          <div className="px-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/70">Accounts</h3>
              <button
                onClick={() => setShowAccountModal(true)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                <Plus className="w-4 h-4 text-[#FFD700]" />
              </button>
            </div>
            {accounts.map(account => (
              <button
                key={account.id}
                onClick={() => setSelectedAccount(account)}
                className={`w-full flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                  selectedAccount?.id === account.id
                    ? 'bg-[#FFD700]/10 text-[#FFD700]'
                    : 'hover:bg-white/5 text-white/70'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm truncate">{account.email}</span>
              </button>
            ))}
          </div>

          {/* Folders */}
          <div className="space-y-1 px-3">
            {folders.map(folder => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  currentFolder === folder.id
                    ? 'bg-[#FFD700]/10 text-[#FFD700]'
                    : 'hover:bg-white/5 text-white/70'
                }`}
              >
                {folder.icon}
                <span>{folder.name}</span>
              </button>
            ))}
          </div>

          {/* Labels */}
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-white/70">Labels</h3>
              <button className="p-1 hover:bg-white/10 rounded transition-colors">
                <Plus className="w-4 h-4 text-[#FFD700]" />
              </button>
            </div>
            <div className="space-y-1">
              {['Important', 'Work', 'Personal'].map(label => (
                <button
                  key={label}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 text-white/70 transition-colors"
                >
                  <Tag className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="h-16 border-b border-[#B38B3F]/20 flex items-center justify-between px-6">
          <div className="flex items-center flex-1">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search emails..."
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-[#FFD700]" />
            </button>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-y-auto">
          {selectedAccount ? (
            <div className="divide-y divide-[#B38B3F]/10">
              {emails.map(email => (
                <button
                  key={email.id}
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full flex items-center p-4 hover:bg-white/5 transition-colors ${
                    !email.read ? 'bg-[#B38B3F]/5' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEmails(prev => prev.map(e => 
                          e.id === email.id ? { ...e, starred: !e.starred } : e
                        ));
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        email.starred ? 'text-[#FFD700]' : 'text-white/40 hover:text-[#FFD700]'
                      }`}
                    >
                      <Star className="w-5 h-5" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className={`font-medium ${email.read ? 'text-white/70' : 'text-white'}`}>
                        {email.from}
                      </div>
                      <div className={`text-sm truncate ${email.read ? 'text-white/40' : 'text-white/70'}`}>
                        {email.subject}
                      </div>
                      <div className="text-sm text-white/40 truncate">{email.preview}</div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {email.hasAttachments && (
                        <Paperclip className="w-4 h-4 text-white/40" />
                      )}
                      <div className="text-sm text-white/40">{email.date}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <Mail className="w-16 h-16 text-white/20 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Connect Your Email</h3>
              <p className="text-white/60 mb-6">Add your email account to get started</p>
              <button
                onClick={() => setShowAccountModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
              >
                Connect Email
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAccountModal(false)} />
          <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
            <div className="p-6">
              <button
                onClick={() => setShowAccountModal(false)}
                className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-xl font-bold text-white mb-6">Connect Email Account</h3>

              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                handleConnectEmail(
                  formData.get('email') as string,
                  formData.get('password') as string,
                  formData.get('provider') as string
                );
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Email Provider
                    </label>
                    <select
                      name="provider"
                      className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      required
                    >
                      <option value="gmail">Gmail</option>
                      <option value="outlook">Outlook</option>
                      <option value="yahoo">Yahoo Mail</option>
                      <option value="icloud">iCloud Mail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                      required
                    />
                  </div>

                  {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="w-full px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <span>Connect Account</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed bottom-0 right-0 w-[600px] bg-zinc-900 border border-[#B38B3F]/30 rounded-t-xl shadow-2xl z-50 transform animate-slide-up">
          <div className="flex items-center justify-between p-4 border-b border-[#B38B3F]/20">
            <h3 className="text-lg font-medium text-white">New Message</h3>
            <button
              onClick={() => setShowCompose(false)}
              className="text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="To"
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
              <textarea
                placeholder="Write your message..."
                className="w-full h-64 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40 resize-none"
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-[#FFD700]" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-[#FFD700]" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <Smile className="w-5 h-5 text-[#FFD700]" />
                </button>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}