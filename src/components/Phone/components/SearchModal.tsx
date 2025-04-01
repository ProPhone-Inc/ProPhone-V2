import React from 'react';
import { X, Search, Phone, MessageSquare, Users } from 'lucide-react';
import type { Chat } from '../../../modules/phone/types';

interface SearchModalProps {
  onClose: () => void;
  conversations: Chat[];
  onChatSelect: (chatId: string) => void;
}

export function SearchModal({ onClose, conversations, onChatSelect }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Chat[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  React.useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = conversations.filter(chat => {
      // Search in name
      const nameMatch = chat.name.toLowerCase().includes(query);
      
      // Search in phone number
      const numberMatch = chat.number?.toLowerCase().includes(query);
      
      // Search in messages
      const messageMatch = chat.messages.some(msg => 
        msg.content.toLowerCase().includes(query)
      );
      
      return nameMatch || numberMatch || messageMatch;
    });

    setSearchResults(results);
  }, [searchQuery, conversations]);

  const handleSelect = (chat: Chat) => {
    onChatSelect(chat.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900/95 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="p-4 border-b border-[#B38B3F]/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, contacts, and messages..."
              className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
            />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="divide-y divide-[#B38B3F]/10">
              {searchResults.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelect(chat)}
                  className="w-full p-4 text-left hover:bg-white/5 transition-colors flex items-start space-x-3"
                >
                  <div className="w-10 h-10 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                    {chat.isGroup ? (
                      <Users className="w-5 h-5" />
                    ) : /^\(\d{3}\) \d{3}-\d{4}$/.test(chat.name) ? (
                      <MessageSquare className="w-5 h-5" />
                    ) : (
                      chat.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-white">{chat.name}</div>
                    {chat.number && (
                      <div className="text-sm text-white/60 flex items-center mt-0.5">
                        <Phone className="w-3.5 h-3.5 mr-1" />
                        {chat.number}
                      </div>
                    )}
                    {chat.messages.length > 0 && (
                      <div className="text-sm text-white/40 mt-1 line-clamp-1">
                        {chat.messages[chat.messages.length - 1].content}
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery ? (
            <div className="p-8 text-center text-white/40">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No results found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="p-8 text-center text-white/40">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>Start typing to search</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#B38B3F]/20">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}