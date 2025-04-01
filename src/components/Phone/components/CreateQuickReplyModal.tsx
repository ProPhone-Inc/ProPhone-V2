import React from 'react';
import { X, MessageSquare, AlertTriangle, Paperclip, Image, FileText, File, Trash2 } from 'lucide-react';

interface CreateQuickReplyModalProps {
  onClose: () => void;
  onSave: (reply: { content: string; category: string; attachments: File[] }) => void;
}

export function CreateQuickReplyModal({ onClose, onSave }: CreateQuickReplyModalProps) {
  const [content, setContent] = React.useState('');
  const [category, setCategory] = React.useState('general');
  const [attachments, setAttachments] = React.useState<File[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'general', name: 'General' },
    { id: 'busy', name: 'Busy' },
    { id: 'follow-up', name: 'Follow Up' },
    { id: 'confirmation', name: 'Confirmation' },
    { id: 'sales', name: 'Sales' }
  ];

  const getCharacterCount = (text: string) => {
    return text.length;
  };

  const getSMSPartCount = (text: string) => {
    return Math.ceil(text.length / 160) || 1;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) {
      return <Image className="w-4 h-4" />;
    } else if (file.type.includes('pdf')) {
      return <FileText className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Quick reply content is required');
      return;
    }

    if (!category) {
      setError('Please select a category');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({ content: content.trim(), category, attachments });
      onClose();
    } catch (error) {
      setError('Failed to save quick reply');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              <h2 className="text-xl font-bold text-white">Create Quick Reply</h2>
              <p className="text-white/60">Create a new quick reply template</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-amber-400 text-sm">
            Carriers charge by SMS part. Every part is composed of 160 characters and counts as 1 message
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Quick Reply Content
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter quick reply content..."
                className="w-full px-4 py-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40 resize-none h-32"
                required
              />
              <div className="absolute right-3 top-3 flex items-center space-x-3 bg-zinc-900/90 px-2 py-1 rounded-lg backdrop-blur-sm">
                <div className="text-xs">
                  <span className={getCharacterCount(content) > 160 ? 'text-amber-400' : 'text-white/40'}>
                    {getCharacterCount(content)}
                  </span>
                  <span className="text-white/40"> chars</span>
                </div>
                <div className="text-xs">
                  <span className={getSMSPartCount(content) > 1 ? 'text-amber-400' : 'text-white/40'}>
                    {getSMSPartCount(content)}
                  </span>
                  <span className="text-white/40"> SMS parts</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Attachments
            </label>
            <div className="space-y-3">
              {attachments.length > 0 && (
                <div className="space-y-2">
                  {attachments.map((file, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-2 bg-zinc-800/50 border border-[#B38B3F]/20 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-lg bg-[#B38B3F]/20 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                        <div>
                          <div className="text-sm text-white font-medium">{file.name}</div>
                          <div className="text-xs text-white/60">
                            {(file.size / 1024).toFixed(1)}KB
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                multiple
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center space-x-2 p-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg hover:bg-zinc-700 transition-colors text-white/70 hover:text-white"
              >
                <Paperclip className="w-4 h-4" />
                <span>Add Attachment</span>
              </button>
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
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                'Create Quick Reply'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}