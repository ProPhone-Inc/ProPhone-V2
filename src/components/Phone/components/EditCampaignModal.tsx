import React from 'react';
import { X, Clock, Calendar, Globe, AlertTriangle } from 'lucide-react';
import { useCampaignSettings } from '../../../hooks/useCampaignSettings';

interface EditCampaignModalProps {
  campaignId: string;
  campaign: {
    name: string;
    schedule?: {
      daysOfWeek?: string[];
      timezone?: string;
      startTime?: string;
      endTime?: string;
      startDate?: string;
      endDate?: string;
    };
    smsRate?: number;
    status: string;
  };
  onClose: () => void;
}

export function EditCampaignModal({ campaignId, campaign, onClose }: EditCampaignModalProps) {
  const { updateSettings } = useCampaignSettings();
  const [schedule, setSchedule] = React.useState({
    daysOfWeek: campaign.schedule?.daysOfWeek || [],
    timezone: campaign.schedule?.timezone || 'America/New_York',
    startTime: campaign.schedule?.startTime || '09:00',
    endTime: campaign.schedule?.endTime || '17:00', 
    startDate: campaign.schedule?.startDate || new Date().toISOString().split('T')[0],
    endDate: campaign.schedule?.endDate
  });
  const [smsRate, setSmsRate] = React.useState(campaign.smsRate || 5);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const timezones = [
    { id: 'America/New_York', name: 'Eastern Time' },
    { id: 'America/Chicago', name: 'Central Time' },
    { id: 'America/Denver', name: 'Mountain Time' },
    { id: 'America/Los_Angeles', name: 'Pacific Time' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (schedule.daysOfWeek.length === 0) {
      setError('Please select at least one day of the week');
      return;
    }

    if (!schedule.startTime || !schedule.endTime) {
      setError('Start and end times are required');
      return;
    }

    if (!schedule.startDate) {
      setError('Start date is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSettings(campaignId, {
        schedule,
        smsRate
      });
      onClose();
    } catch (error) {
      setError('Failed to update campaign settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-2xl transform animate-fade-in">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div>
            <h2 className="text-xl font-bold text-white">Edit Campaign Settings</h2>
            <p className="text-white/60">{campaign.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">
              Days of Week <span className="text-[#FFD700]">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => {
                    if (schedule.daysOfWeek.includes(day)) {
                      setSchedule({
                        ...schedule,
                        daysOfWeek: schedule.daysOfWeek.filter(d => d !== day)
                      });
                    } else {
                      setSchedule({
                        ...schedule,
                        daysOfWeek: [...schedule.daysOfWeek, day]
                      });
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg transition-colors ${
                    schedule.daysOfWeek.includes(day)
                      ? 'bg-[#FFD700]/20 text-[#FFD700] border border-[#FFD700]/40'
                      : 'bg-zinc-800 text-white/70 hover:text-white border border-[#B38B3F]/20'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Timezone <span className="text-[#FFD700]">*</span>
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value={schedule.timezone}
                  onChange={(e) => setSchedule({ ...schedule, timezone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                >
                  {timezones.map((tz) => (
                    <option key={tz.id} value={tz.id}>{tz.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                SMS Rate (per minute) <span className="text-[#FFD700]">*</span>
              </label>
              <input
                type="number"
                min="1"
                value={smsRate}
                onChange={(e) => setSmsRate(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Start Time <span className="text-[#FFD700]">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => setSchedule({ ...schedule, startTime: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                End Time <span className="text-[#FFD700]">*</span>
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => setSchedule({ ...schedule, endTime: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Start Date <span className="text-[#FFD700]">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  value={schedule.startDate}
                  onChange={(e) => setSchedule({ ...schedule, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
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
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}