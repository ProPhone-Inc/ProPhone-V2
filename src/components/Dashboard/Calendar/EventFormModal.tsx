import React from 'react';
import { X, Clock, Calendar, Users, AlignLeft, Video, MapPin, Bell, Repeat, Paperclip } from 'lucide-react';

interface EventFormModalProps {
  selectedDate: Date | null;
  eventForm: any;
  setEventForm: React.Dispatch<React.SetStateAction<any>>;
  error?: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
  modalRef: React.RefObject<HTMLDivElement>;
}

export function EventFormModal({
  selectedDate,
  eventForm,
  setEventForm,
  error,
  onClose,
  onSubmit,
  isSubmitting,
  modalRef
}: EventFormModalProps) {
  const formRef = React.useRef<HTMLFormElement>(null);

  // Handle click outside
  const handleClickOutside = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[200] flex items-center justify-center px-4"
      onClick={handleClickOutside}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <form ref={formRef} onSubmit={onSubmit} className="p-6 space-y-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-white">
            {selectedDate ? (
              `Create Event for ${selectedDate.toLocaleDateString('default', { 
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}`
            ) : (
              'Create Event'
            )}
          </h3>

          {/* Form fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={eventForm?.title || ''}
                onChange={(e) => setEventForm((prev: any) => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                placeholder="Event title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Start Time</label>
                <input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">End Time</label>
                <input
                  type="time"
                  value={eventForm.endTime}
                  onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Location</label>
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                placeholder="Add location"
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Description</label>
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white h-24 resize-none"
                placeholder="Add description..."
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}
          </div>

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
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </div>
              ) : (
                'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}