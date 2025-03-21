import React from 'react';
import { ArrowLeft, Clock, Calendar, Globe, AlertTriangle, Send, Ban, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useCampaignSettings } from '../../../hooks/useCampaignSettings';

interface CampaignEditPageProps {
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
  onBack: () => void;
}

export function CampaignEditPage({ campaignId, campaign, onBack }: CampaignEditPageProps) {
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
  const [showDetails, setShowDetails] = React.useState(false);

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
      onBack();
    } catch (error) {
      setError('Failed to update campaign settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-zinc-900/50 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-[#B38B3F]/20">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Campaign Details</h1>
              <p className="text-white/60">{campaign.name}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto grid grid-cols-3 gap-6">
          {/* Campaign Stats */}
          <div className="col-span-2 space-y-6">
            <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-white/60">Available Sends</div>
                  <div className="text-2xl font-bold text-white mt-1">47,196</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Total Sent</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Total Delivered</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Responses</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-white/60">Bounced</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">System Suppressed</div>
                  <div className="text-2xl font-bold text-white mt-1">278</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Total Leads</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Follow-ups</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-white/60">Refer to Agent</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Total in Queue</div>
                  <div className="text-2xl font-bold text-white mt-1">0</div>
                </div>
              </div>
            </div>
          </div>

          {/* Hot Lead Section */}
          <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 p-6">
            <div className="text-2xl font-bold text-white">HOT LEAD 0</div>
          </div>
        </div>

        {/* Imported Contacts Section */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 overflow-hidden">
            <div className="p-4 border-b border-[#B38B3F]/20 flex items-center justify-between">
              <h2 className="text-lg font-medium text-white">IMPORTED CONTACTS</h2>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-white/60 hover:text-white transition-colors"
              >
                {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>

            {showDetails && (
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-white/60 text-sm">
                        <th className="py-2 px-4">ID</th>
                        <th className="py-2 px-4">Total Prospects</th>
                        <th className="py-2 px-4">Mobile</th>
                        <th className="py-2 px-4">Landlines</th>
                        <th className="py-2 px-4">Skipped</th>
                        <th className="py-2 px-4">DNC</th>
                        <th className="py-2 px-4">Imported Progress</th>
                        <th className="py-2 px-4">Uploaded Date</th>
                        <th className="py-2 px-4">Import Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="text-white border-t border-[#B38B3F]/10">
                        <td className="py-3 px-4">518998</td>
                        <td className="py-3 px-4">25,112</td>
                        <td className="py-3 px-4">47,196</td>
                        <td className="py-3 px-4">66,538</td>
                        <td className="py-3 px-4">4</td>
                        <td className="py-3 px-4">274</td>
                        <td className="py-3 px-4">100%</td>
                        <td className="py-3 px-4">03/05/2025 11:18</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <span>Addresses imported 03-05-2025</span>
                            <Info className="w-4 h-4 text-[#FFD700] ml-2" />
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Batch Details Section */}
        <div className="max-w-6xl mx-auto mt-6">
          <div className="bg-zinc-800/50 rounded-xl border border-[#B38B3F]/20 overflow-hidden">
            <div className="p-4 border-b border-[#B38B3F]/20">
              <h2 className="text-lg font-medium text-white">BATCH DETAILS</h2>
            </div>
            <div className="p-4">
              <div className="text-center text-white/60">No data available in table</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}