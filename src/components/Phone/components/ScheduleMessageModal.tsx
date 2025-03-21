import React from 'react';
import { X, Calendar, Clock, Info } from 'lucide-react';

interface ScheduleMessageModalProps {
  onClose: () => void;
  onSchedule: (date: Date) => void;
}

export function ScheduleMessageModal({ onClose, onSchedule }: ScheduleMessageModalProps) {
  const [selectedDate, setSelectedDate] = React.useState('');
  const [selectedTime, setSelectedTime] = React.useState('');
  const [isSameDay, setIsSameDay] = React.useState(true);
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((!isSameDay && !selectedDate) || !selectedTime) {
      setError('Please select both date and time');
      return;
    }

    const scheduledDateTime = new Date();
    if (!isSameDay) {
      scheduledDateTime.setTime(new Date(`${selectedDate}T${selectedTime}`).getTime());
    } else {
      const [hours, minutes] = selectedTime.split(':');
      scheduledDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
    }
    
    if (scheduledDateTime <= new Date()) {
      setError('Please select a future time');
      return;
    }

    onSchedule(scheduledDateTime);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-md transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Clock className="w-5 h-5 text-[#FFD700]" />
            </div>
            <h3 className="text-lg font-bold text-white">Schedule Message</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-white/70 text-sm font-medium">Schedule For</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsSameDay(true)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isSameDay 
                    ? 'bg-[#FFD700]/20 text-[#FFD700]' 
                    : 'bg-zinc-800 text-white/70 hover:text-white'
                }`}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setIsSameDay(false)}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  !isSameDay 
                    ? 'bg-[#FFD700]/20 text-[#FFD700]' 
                    : 'bg-zinc-800 text-white/70 hover:text-white'
                }`}
              >
                Custom Date
              </button>
            </div>
          </div>

          {!isSameDay && (
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  required={!isSameDay}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                min={isSameDay ? new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }) : undefined}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                required
              />
            </div>
            {isSameDay && (
              <p className="mt-2 text-sm text-white/50">
                Message will be sent today at the selected time
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center space-x-2">
              <Info className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}