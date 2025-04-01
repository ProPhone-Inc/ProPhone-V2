import React from 'react';
import { X, Users, FileText, Clock, Calendar, Globe, AlertTriangle, Send, Home, Flame, Sun, Bell, Megaphone, BarChart2, DollarSign, ThumbsDown, Ban, CheckCircle } from 'lucide-react';

interface CreateCampaignModalProps {
  onClose: () => void;
  onSave: (campaign: {
    name: string;
    audience: string;
    templates: string[];
    schedule: {
      daysOfWeek: string[];
      timezone: string;
      startTime: string;
      endTime: string;
      startDate: string;
      endDate?: string;
    };
    smsRate: number;
    phoneLines: string[];
  }) => void;
  audiences: Array<{
    id: string;
    name: string;
    count: number;
  }>;
  templates: Array<{
    id: string;
    name: string;
  }>;
  phoneLines: Array<{
    id: string;
    name: string;
    number: string;
    inUseBy?: string;
  }>;
}

export function CreateCampaignModal({ onClose, onSave, audiences, templates, phoneLines }: CreateCampaignModalProps) {
  const [campaignName, setCampaignName] = React.useState('');
  const [selectedAudience, setSelectedAudience] = React.useState('');
  const [selectedTemplates, setSelectedTemplates] = React.useState<string[]>([]);
  const [selectedDays, setSelectedDays] = React.useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = React.useState<string[]>(['dnc']); // Initialize with DNC
  const [timezone, setTimezone] = React.useState('America/New_York');
  const [startTime, setStartTime] = React.useState('09:00');
  const [endTime, setEndTime] = React.useState('17:00');
  const [startDate, setStartDate] = React.useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = React.useState('');
  const [smsRate, setSmsRate] = React.useState<number | ''>(0);
  const [selectedPhoneLines, setSelectedPhoneLines] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Get current time in selected timezone
  const getCurrentTime = React.useCallback((tz: string) => {
    try {
      return new Date().toLocaleTimeString('en-US', { 
        timeZone: tz,
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting timezone:', error);
      return '';
    }
  }, []);

  const timezones = [
    { id: 'America/New_York', name: 'Eastern Time' },
    { id: 'America/Chicago', name: 'Central Time' },
    { id: 'America/Denver', name: 'Mountain Time' },
    { id: 'America/Los_Angeles', name: 'Pacific Time' }
  ];

  // Calculate maximum allowed SMS rate based on selected phone lines
  const maxSmsRate = React.useMemo(() => {
    return selectedPhoneLines.length * 5; // 5 messages per minute per line
  }, [selectedPhoneLines]);

  const statusOptions = [
    { value: 'new', label: 'New', icon: <Home className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-400/20' },
    { value: 'hot', label: 'Hot', icon: <Flame className="w-4 h-4" />, color: 'text-red-400 bg-red-400/20' },
    { value: 'warm', label: 'Warm', icon: <Sun className="w-4 h-4" />, color: 'text-amber-400 bg-amber-400/20' },
    { value: 'follow-up', label: 'Follow Up', icon: <Bell className="w-4 h-4" />, color: 'text-purple-400 bg-purple-400/20' },
    { value: 'prospecting', label: 'Prospecting', icon: <Megaphone className="w-4 h-4" />, color: 'text-blue-400 bg-blue-400/20' },
    { value: 'appointment-set', label: 'Appointment Set', icon: <Calendar className="w-4 h-4" />, color: 'text-indigo-400 bg-indigo-400/20' },
    { value: 'needs-analysis', label: 'Needs Analysis', icon: <BarChart2 className="w-4 h-4" />, color: 'text-cyan-400 bg-cyan-400/20' },
    { value: 'make-offer', label: 'Make Offer', icon: <DollarSign className="w-4 h-4" />, color: 'text-green-400 bg-green-400/20' },
    { value: 'not-interested', label: 'Not Interested', icon: <ThumbsDown className="w-4 h-4" />, color: 'text-gray-400 bg-gray-400/20' },
    { value: 'dnc', label: 'DNC', icon: <Ban className="w-4 h-4" />, color: 'text-red-700 bg-red-700/20' },
    { value: 'conversion', label: 'Conversion', icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400 bg-emerald-400/20' }
  ];

  const daysOfWeek = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Ensure smsRate is a valid number before submitting
    if (smsRate === '' || isNaN(smsRate)) {
      setError('Please enter a valid SMS rate');
      return;
    }

    // Validation
    if (!campaignName.trim()) {
      setError('Campaign name is required');
      return;
    }

    if (!selectedAudience) {
      setError('Please select an audience');
      return;
    }

    if (selectedTemplates.length === 0) {
      setError('Please select at least one template');
      return;
    }

    if (selectedDays.length === 0) {
      setError('Please select at least one day of the week');
      return;
    }

    if (!startTime || !endTime) {
      setError('Start and end times are required');
      return;
    }

    if (!startDate) {
      setError('Start date is required');
      return;
    }

    if (selectedPhoneLines.length === 0) {
      setError('Please select at least one phone line');
      return;
    }

    if (smsRate < 1 || smsRate > maxSmsRate) {
      setError(`SMS rate must be between 1 and ${selectedPhoneLines.length * 5} messages per minute (5 per line)`);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave({
        name: campaignName,
        audience: selectedAudience,
        templates: selectedTemplates,
        schedule: {
          daysOfWeek: selectedDays,
          timezone,
          startTime,
          endTime,
          startDate,
        },
        smsRate,
        phoneLines: selectedPhoneLines,
        statusFilters: selectedStatuses
      });
      onClose();
    } catch (error) {
      setError('Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900 border border-[#B38B3F]/30 rounded-xl shadow-2xl w-full max-w-3xl transform animate-fade-in max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-[#B38B3F]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#B38B3F]/20 to-[#FFD700]/10 flex items-center justify-center border border-[#B38B3F]/30">
              <Send className="w-6 h-6 text-[#FFD700]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Create Campaign</h2>
              <p className="text-white/60">Set up your SMS campaign</p>
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
                Campaign Name <span className="text-[#FFD700]">*</span>
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="Enter campaign name"
                className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white placeholder-white/40"
                required
              />
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Select Audience <span className="text-[#FFD700]">*</span>
              </label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value={selectedAudience}
                  onChange={(e) => setSelectedAudience(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                >
                  <option value="">Select an audience</option>
                  {audiences.map((audience) => (
                    <option key={audience.id} value={audience.id}>
                      {audience.name} ({audience.count.toLocaleString()} contacts)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Select Templates <span className="text-[#FFD700]">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value={selectedTemplates[0] || ''}
                  onChange={(e) => setSelectedTemplates([e.target.value])}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                >
                  <option value="">Select a template</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

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
                      if (selectedDays.includes(day)) {
                        setSelectedDays(selectedDays.filter(d => d !== day));
                      } else {
                        setSelectedDays([...selectedDays, day]);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      selectedDays.includes(day)
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
                <div className="space-y-1">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                    required
                  >
                    {timezones.map((tz) => (
                      <option key={tz.id} value={tz.id}>
                        {tz.name}
                      </option>
                    ))}
                  </select>
                  </div>
                  <div className="mt-1 text-sm text-[#FFD700]">
                    Current time: {getCurrentTime(timezone)}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  SMS Rate (per minute) <span className="text-[#FFD700]">*</span>
                </label>
                <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={selectedPhoneLines.length * 5}
                  value={smsRate === '' ? '' : smsRate}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setSmsRate('');
                    } else {
                      const num = parseInt(val);
                      if (!isNaN(num) && num >= 0 && num <= selectedPhoneLines.length * 5) {
                        setSmsRate(num);
                      }
                    }
                  }}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white"
                  required
                />
                <div className="mt-1 text-xs text-white/40">
                  Maximum {selectedPhoneLines.length * 5} messages per minute ({selectedPhoneLines.length} lines × 5 messages)
                </div>
                </div>
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
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
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
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Campaign Start Date <span className="text-[#FFD700]">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg text-white [color-scheme:dark]"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Filter by Status <span className="text-white/40">(Optional)</span>
              </label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <label
                    key={status.value}
                    className={`flex items-center p-3 bg-zinc-800 border rounded-lg cursor-pointer hover:bg-zinc-800/70 transition-colors ${
                      selectedStatuses.includes(status.value)
                        ? status.value === 'dnc' ? 'border-red-700/40 bg-red-700/10' : 'border-[#FFD700]/40'
                        : 'border-[#B38B3F]/20'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedStatuses.includes(status.value)}
                      disabled={status.value === 'dnc'}
                      onChange={(e) => {
                        if (status.value === 'dnc') return; // Prevent unchecking DNC
                        if (e.target.checked) {
                          setSelectedStatuses([...selectedStatuses, status.value]);
                        } else {
                          setSelectedStatuses(selectedStatuses.filter(s => s !== status.value));
                        }
                      }}
                      className={`w-4 h-4 rounded border-[#B38B3F]/30 bg-black/40 ${
                        status.value === 'dnc' 
                          ? 'text-red-700 focus:ring-red-700/50 cursor-not-allowed' 
                          : 'text-[#FFD700] focus:ring-[#FFD700]/50'
                      }`}
                    />
                    <div className="ml-3 flex items-center">
                      <div className={`w-8 h-8 rounded-lg ${status.color.split(' ')[1]} flex items-center justify-center mr-3`}>
                        {status.icon}
                      </div>
                      <div>
                        <span className="text-white">{status.label}</span>
                        {status.value === 'dnc' && (
                          <span className="text-red-400 text-xs block">Required - Cannot be disabled</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Select Phone Lines <span className="text-[#FFD700]">*</span>
              </label>
              <div className="space-y-2">
                {phoneLines.map((line) => (
                  <label
                    key={line.id}
                    className="flex items-center p-3 bg-zinc-800 border border-[#B38B3F]/20 rounded-lg cursor-pointer hover:bg-zinc-800/70 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedPhoneLines.includes(line.id)}
                      disabled={line.inUseBy}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedPhoneLines([...selectedPhoneLines, line.id]);
                        } else {
                          setSelectedPhoneLines(selectedPhoneLines.filter(id => id !== line.id));
                        }
                      }}
                      className={`w-4 h-4 rounded border-[#B38B3F]/30 bg-black/40 ${
                        line.inUseBy 
                          ? 'text-gray-500 cursor-not-allowed' 
                          : 'text-[#FFD700] focus:ring-[#FFD700]/50'
                      }`}
                    />
                    <div className="ml-3 flex-1">
                      <div className="flex items-center">
                        <span className={line.inUseBy ? 'text-white/50' : 'text-white'}>{line.name}</span>
                        {line.inUseBy && (
                          <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs">
                            In Use
                          </span>
                        )}
                      </div>
                      <div className="text-white/60 text-sm">{line.number}</div>
                    </div>
                    <div className="text-white/40 text-sm">
                      5 msgs/min
                    </div>
                  </label>
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

        <div className="p-6 border-t border-[#B38B3F]/20 bg-zinc-900/95 backdrop-blur-sm">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gradient-to-r from-[#B38B3F] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Create Campaign</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}