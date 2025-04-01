import React from 'react';
import { X, MessageSquare, Plus, Tag, Search, Filter, GripVertical } from 'lucide-react';
import { CreateQuickReplyModal } from './CreateQuickReplyModal';

interface QuickQuestionsProps {
  onQuestionSelect: (question: string) => void;
  onClose: () => void;
}

interface QuickReply {
  id: string;
  content: string;
  category: string;
  attachments?: File[];
}

export function QuickReplyModal({ onClose, onSelect }: QuickQuestionsProps) {
  const [quickReplies, setQuickReplies] = React.useState<QuickReply[]>([
    {
      id: '1',
      content: 'Thank you for your interest! I will review your inquiry and get back to you shortly.',
      category: 'general'
    },
    {
      id: '2',
      content: 'I am currently assisting another client. I will reach out as soon as I am available.',
      category: 'busy'
    },
    {
      id: '3',
      content: 'Would you like to schedule a call to discuss this further?',
      category: 'follow-up'
    },
    {
      id: '4',
      content: 'Perfect! I have got that scheduled for you. You will receive a confirmation shortly.',
      category: 'confirmation'
    },
    {
      id: '5',
      content: 'Is there anything specific you would like to know about our services?',
      category: 'sales'
    }
  ]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [draggedReply, setDraggedReply] = React.useState<string | null>(null);
  const [dragOverReply, setDragOverReply] = React.useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = React.useState(false);

  const categories = [
    { id: 'all', name: 'All Replies' },
    { id: 'general', name: 'General' },
    { id: 'busy', name: 'Busy' },
    { id: 'follow-up', name: 'Follow Up' },
    { id: 'confirmation', name: 'Confirmation' },
    { id: 'sales', name: 'Sales' }
  ];

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedReply(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    setDragOverReply(id);
  };

  const handleDragEnd = () => {
    if (draggedReply && dragOverReply) {
      setQuickReplies(prev => {
        const newReplies = [...prev];
        const draggedIndex = newReplies.findIndex(r => r.id === draggedReply);
        const dropIndex = newReplies.findIndex(r => r.id === dragOverReply);
        
        const [removed] = newReplies.splice(draggedIndex, 1);
        newReplies.splice(dropIndex, 0, removed);
        
        return newReplies;
      });
    }
    setDraggedReply(null);
    setDragOverReply(null);
  };

  const filteredReplies = quickReplies.filter(reply => {
    const matchesSearch = reply.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || reply.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <MessageSquare className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Quick Replies</h2>
              <p className="text-white/60">Select a pre-written response</p>
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
          <div className="flex items-center space-x-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search quick replies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-white/40" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white px-3 py-2"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4 max-h-[400px] overflow-y-auto">
            {filteredReplies.map((reply) => (
              <button
                key={reply.id}
                draggable
                onDragStart={(e) => handleDragStart(e, reply.id)}
                onDragOver={(e) => handleDragOver(e, reply.id)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelect(reply.content)}
                className={`w-full p-4 text-left bg-zinc-800/50 rounded-xl border transition-all duration-200 flex items-center group ${
                  dragOverReply === reply.id
                    ? 'border-[#FFD700] bg-[#FFD700]/5'
                    : 'border-[#B38B3F]/20 hover:border-[#B38B3F]/40'
                }`}
              >
                <div className="mr-3 cursor-grab active:cursor-grabbing">
                  <GripVertical className="w-5 h-5 text-white/40 group-hover:text-[#FFD700] transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="text-white">{reply.content}</p>
                  <div className="text-sm text-white/60 mt-1 capitalize">{reply.category}</div>
                  {reply.attachments?.length > 0 && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Paperclip className="w-3 h-3 text-white/40" />
                      <span className="text-xs text-white/40">
                        {reply.attachments.length} attachment{reply.attachments.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-6 w-full flex items-center justify-center space-x-2 p-3 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Quick Reply</span>
          </button>
        </div>
      </div>
      
      {showCreateModal && (
        <CreateQuickReplyModal
          onClose={() => setShowCreateModal(false)}
          onSave={async (reply) => {
            const newReply = {
              id: Math.random().toString(36).substr(2, 9),
              content: reply.content,
              category: reply.category,
              attachments: reply.attachments
            };
            setQuickReplies(prev => [newReply, ...prev]);
          }}
        />
      )}
    </div>
  );
}