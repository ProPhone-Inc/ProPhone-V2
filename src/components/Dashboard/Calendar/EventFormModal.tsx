import React from 'react';
import { X, Clock, Calendar as CalendarIcon, Users, AlignLeft, Video, MapPin, Bell, Repeat, Paperclip, Mail, Calendar, Briefcase as BriefcaseIcon, MapPin as MapPinIcon, CheckSquare as CheckSquareIcon, Tag, Flag, AlertTriangle, Plus } from 'lucide-react';

interface EventFormModalProps {
  selectedDate: Date | null;
  eventForm: any;
  setEventForm: React.Dispatch<React.SetStateAction<any>>;
  error?: string | null;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

export function EventFormModal({
  selectedDate,
  eventForm,
  setEventForm,
  error,
  onClose,
  onSubmit,
  isSubmitting
}: EventFormModalProps) {
  const formRef = React.useRef<HTMLFormElement>(null);
  const [guests, setGuests] = React.useState<string[]>([]);
  const [guestInput, setGuestInput] = React.useState('');
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [taskPriority, setTaskPriority] = React.useState('medium');
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([]);
  const [taskStage, setTaskStage] = React.useState('To Do');

  const handleGuestInvite = (email: string) => {
    if (!email.trim()) return;
    if (!guests.includes(email)) setGuests(prev => [...prev, email]);
    setGuestInput('');
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={handleClickOutside}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl animate-fade-in">
        <form ref={formRef} onSubmit={onSubmit} className="p-6 space-y-6">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>

          <h3 className="text-xl font-bold text-white">
            {selectedDate ? `Create Event for ${selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}` : 'Create Event'}
          </h3>

          <div>
            <label className="text-white/70 text-sm">Title</label>
            <input
              type="text"
              value={eventForm?.title || ''}
              onChange={(e) => setEventForm((prev: any) => ({ ...prev, title: e.target.value }))}
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
              placeholder="Event title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-white/70 text-sm">Start Date</label>
              <input
                type="date"
                value={eventForm.startDate}
                onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                required
              />
            </div>
            <div>
              <label className="text-white/70 text-sm">End Date</label>
              <input
                type="date"
                value={eventForm.endDate}
                min={eventForm.startDate}
                onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-white/70 text-sm">Location</label>
            <input
              type="text"
              value={eventForm.location}
              onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
              placeholder="Event location"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm">Description</label>
            <textarea
              value={eventForm.description}
              onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full mt-1 px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
              placeholder="Event description"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm">Add Guests</label>
            <div className="flex space-x-2">
              <input
                type="email"
                value={guestInput}
                onChange={(e) => setGuestInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleGuestInvite(guestInput);
                  }
                }}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                placeholder="Guest email"
              />
              <button
                type="button"
                onClick={() => handleGuestInvite(guestInput)}
                disabled={!guestInput.trim()}
                className="px-3 py-2 bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded"
              >
                Invite
              </button>
            </div>
            {guests.length > 0 && (
              <ul className="mt-2 space-y-1">
                {guests.map((guest, idx) => (
                  <li key={idx} className="flex items-center justify-between px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg">
                    <span className="text-white">{guest}</span>
                    <button onClick={() => setGuests(guests.filter((_, i) => i !== idx))}>
                      <X className="w-4 h-4 text-white/70 hover:text-white" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
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
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg flex items-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Event</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}