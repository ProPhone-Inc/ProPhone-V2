import React from 'react';
import { X, Plus, AlertTriangle, FileText, MessageSquare } from 'lucide-react';

interface CreateTemplateModalProps {
  onClose: () => void;
  onSave: (template: {
    name: string;
    messages: string[];
    backupMessage: string;
    variables: string[];
  }) => void;
  template?: {
    id: string;
    name: string;
    content: string;
    variables: string[];
    category: string;
    createdAt: string;
  } | null;
  audienceVariables?: string[];
}

export function CreateTemplateModal({ onClose, onSave, template, audienceVariables = [] }: CreateTemplateModalProps) {
  // Parse template content if editing
  const parseTemplate = React.useCallback((content: string) => {
    const [messagesStr, backupStr] = content.split('\n===\n');
    return {
      messages: messagesStr.split('\n---\n'),
      backup: backupStr || ''
    };
  }, []);

  const [templateName, setTemplateName] = React.useState(template?.name || '');
  const [messages, setMessages] = React.useState<string[]>(() => {
    if (template?.content) {
      const { messages } = parseTemplate(template.content);
      return messages;
    }
    return [''];
  });
  const [backupMessage, setBackupMessage] = React.useState(() => {
    if (template?.content) {
      const { backup } = parseTemplate(template.content);
      return backup;
    }
    return '';
  });
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeMessageIndex, setActiveMessageIndex] = React.useState<number>(0);
  const [usedVariables, setUsedVariables] = React.useState<Set<string>>(() => 
    new Set(template?.variables || [])
  );
  const textareaRefs = React.useRef<(HTMLTextAreaElement | null)[]>([]);
  const [mappedVariables, setMappedVariables] = React.useState<string[]>([]);

  // Get mapped variables from audience upload
  React.useEffect(() => {
    // These would be the column names that were mapped during audience upload
    const mappedFields = [
      'firstName',
      'lastName',
      'fullName',
      'email',
      'address1',
      'address2',
      'city',
      'state',
      'zipCode'
    ];
    setMappedVariables(mappedFields);
  }, []);

  // Initialize refs array
  React.useEffect(() => {
    textareaRefs.current = messages.map((_, i) => textareaRefs.current[i] || null);
  }, [messages.length]);

  const insertVariable = (variable: string) => {
    const textarea = textareaRefs.current[activeMessageIndex];
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = `${before}{{${variable}}}${after}`;

    // Track used variables
    setUsedVariables(prev => new Set([...prev, variable]));

    handleMessageChange(activeMessageIndex, newText);

    // Reset cursor position after React updates the textarea
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + variable.length + 4; // +4 for {{ and }}
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleAddMessage = () => {
    if (messages.length >= 100) {
      setError('Maximum of 100 messages allowed per template');
      return;
    }
    setMessages([...messages, '']);
  };

  const handleRemoveMessage = (index: number) => {
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleMessageChange = (index: number, value: string) => {
    const newMessages = [...messages];
    newMessages[index] = value;
    setMessages(newMessages);
  };

  const getCharacterCount = (message: string) => {
    return message.length;
  };

  const getSMSPartCount = (message: string) => {
    return Math.ceil(message.length / 160) || 1;
  };

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/{{([^}]+)}}/g) || [];
    return [...new Set(matches.map(match => match.slice(2, -2)))];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!templateName.trim()) {
      setError('Template name is required');
      return;
    }

    if (!messages[0]?.trim()) {
      setError('At least one message is required');
      return;
    }

    if (!backupMessage.trim()) {
      setError('Backup message is required');
      return;
    }

    // Filter out empty messages
    const validMessages = messages.filter(msg => msg.trim());
    if (validMessages.length === 0) {
      setError('At least one non-empty message is required');
      return;
    }

    // Check that each message has a backup
    // Verify no variables in backup messages
    const backupHasVariables = /{{.*?}}/.test(backupMessage);
    if (backupHasVariables) {
      setError('Backup message cannot contain variables');
      return;
    }

    // Extract all variables used across messages
    const usedVars = validMessages.flatMap(msg => extractVariables(msg))
      .filter(variable => mappedVariables.includes(variable));
    const uniqueVariables = [...new Set(usedVars)];

    setIsSubmitting(true);
    try {
      await onSave({
        name: templateName,
        messages: validMessages,
        backupMessage,
        variables: uniqueVariables
      });
      onClose();
    } catch (error) {
      setError('Failed to save template');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-3xl transform animate-fade-in max-h-[90vh] flex flex-col">
        <div className="bg-amber-500/10 border-b border-amber-500/20 p-3 flex items-center space-x-2">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <p className="text-amber-400 text-sm">
            Carriers charge by SMS part. Every part is composed of 160 characters and counts as 1 message
          </p>
        </div>

        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <FileText className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{template ? 'Edit Template' : 'Create Template'}</h2>
              <p className="text-white/60">{template ? 'Modify existing template' : 'Create a new SMS template'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Template Name <span className="text-[#FFD700]">*</span>
              </label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                placeholder="Enter template name"
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-white/70 text-sm font-medium">
                  Messages <span className="text-[#FFD700]">*</span>
                </label>
                <span className="text-sm text-white/40">
                  {messages.length}/100 messages
                </span>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {messages.map((message, index) => (
                  <div key={index} className="relative">
                    <div className="absolute left-3 top-3 w-6 h-6 rounded-full bg-[#B38B3F]/20 flex items-center justify-center text-[#FFD700] text-sm">
                      {index + 1}
                    </div>
                    <textarea
                      ref={el => textareaRefs.current[index] = el}
                      value={message}
                      onChange={(e) => handleMessageChange(index, e.target.value)}
                      onFocus={() => setActiveMessageIndex(index)}
                      placeholder={`Enter message ${index + 1}`}
                      className="w-full pl-12 pr-4 py-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40 resize-none"
                      rows={3}
                    />
                    <div className="absolute right-3 top-3 flex items-center space-x-3 bg-zinc-900/90 px-2 py-1 rounded-lg backdrop-blur-sm">
                      <div className="text-xs">
                        <span className={getCharacterCount(message) > 160 ? 'text-amber-400' : 'text-white/40'}>
                          {getCharacterCount(message)}
                        </span>
                        <span className="text-white/40"> chars</span>
                      </div>
                      <div className="text-xs">
                        <span className={getSMSPartCount(message) > 1 ? 'text-amber-400' : 'text-white/40'}>
                          {getSMSPartCount(message)}
                        </span>
                        <span className="text-white/40"> SMS parts</span>
                      </div>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMessage(index)}
                          className="p-1 hover:bg-red-500/20 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-400" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddMessage}
                disabled={messages.length >= 100}
                className="mt-4 w-full py-2 bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700] rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>Add Message</span>
              </button>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Backup Message <span className="text-[#FFD700]">*</span>
                <span className="text-white/40 ml-1">(Used when variables don't exist)</span>
              </label>
              <div className="relative">
                <textarea
                  value={backupMessage}
                  onChange={(e) => setBackupMessage(e.target.value)}
                  placeholder="Enter backup message (no variables allowed)"
                  className="w-full px-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40 resize-none"
                  rows={3}
                  required
                />
                <div className="absolute right-3 top-3 flex items-center space-x-3 bg-zinc-900/90 px-2 py-1 rounded-lg backdrop-blur-sm">
                  <div className="text-xs">
                    <span className={getCharacterCount(backupMessage) > 160 ? 'text-amber-400' : 'text-white/40'}>
                      {getCharacterCount(backupMessage)}
                    </span>
                    <span className="text-white/40"> chars</span>
                  </div>
                  <div className="text-xs">
                    <span className={getSMSPartCount(backupMessage) > 1 ? 'text-amber-400' : 'text-white/40'}>
                      {getSMSPartCount(backupMessage)}
                    </span>
                    <span className="text-white/40"> SMS parts</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#B38B3F]/10 border border-[#B38B3F]/20 rounded-lg p-4">
              <h4 className="text-[#FFD700] font-medium mb-2">Available Variables</h4>
              <p className="text-white/70 text-sm">
                Insert mapped audience fields into your message:
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {mappedVariables.map((variable) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => insertVariable(variable)}
                    className={`px-3 py-1.5 rounded-lg transition-colors text-sm flex items-center space-x-1 ${
                      usedVariables.has(variable)
                        ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                        : 'bg-[#B38B3F]/20 hover:bg-[#B38B3F]/30 text-[#FFD700]'
                    }`}
                  >
                    <span>{variable}</span>
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </form>

        <form onSubmit={handleSubmit} className="p-6 border-t border-[#B38B3F]/20 bg-zinc-900/95 backdrop-blur-sm">
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Save Template</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}