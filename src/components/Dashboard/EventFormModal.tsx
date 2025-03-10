import React from 'react';
import { X, Clock, Calendar as CalendarIcon, Users, AlignLeft, Video, MapPin, Bell, Repeat, Paperclip, Mail, Calendar, Briefcase as BriefcaseIcon, MapPin as MapPinIcon, CheckSquare as CheckSquareIcon, Tag, Flag } from 'lucide-react';
import { useDB } from '../../hooks/useDB';
import { sendTeamInvite } from '../../utils/email';

const eventTypes = [
  { 
    id: 'event', 
    label: 'Event', 
    icon: Calendar, 
    color: '#FFD700',
    description: 'Schedule meetings, appointments, and events'
  },
  { 
    id: 'out-of-office', 
    label: 'Out of Office', 
    icon: BriefcaseIcon, 
    color: '#FF6B6B',
    description: 'Mark time when you\'re away'
  },
  { 
    id: 'working-location', 
    label: 'Working Location', 
    icon: MapPinIcon, 
    color: '#4CAF50',
    description: 'Specify where you\'ll be working'
  },
  { 
    id: 'task', 
    label: 'Task', 
    icon: CheckSquareIcon, 
    color: '#2196F3',
    description: 'Add to-dos and reminders'
  }
];

interface EventFormModalProps {
  selectedDate: Date | null;
  eventForm: {
    title: string;
    type: 'event' | 'out-of-office' | 'working-location' | 'task';
    startDate: string;
    endDate: string;
    time: string;
    endTime: string;
    isAllDay: boolean;
    recurrence: string;
    location: string;
    videoConference: boolean;
    notifications: string[];
    description: string;
    attendees: string;
    attachments: string[];
  };
  setEventForm: React.Dispatch<React.SetStateAction<{
    title: string;
    type: 'event' | 'out-of-office' | 'working-location' | 'task';
    startDate: string;
    endDate: string;
    time: string;
    endTime: string;
    isAllDay: boolean;
    recurrence: string;
    location: string;
    videoConference: boolean;
    notifications: string[];
    description: string;
    attendees: string;
    attachments: string[];
  }>>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isSubmitting: boolean;
}

const taskPriorities = [
  { id: 'low', label: 'Low', color: '#4CAF50' },
  { id: 'medium', label: 'Medium', color: '#FFD700' },
  { id: 'high', label: 'High', color: '#FF6B6B' }
];

const taskLabels = [
  { id: 'feature', label: 'Feature', color: '#2196F3' },
  { id: 'bug', label: 'Bug', color: '#FF6B6B' },
  { id: 'documentation', label: 'Documentation', color: '#4CAF50' },
  { id: 'design', label: 'Design', color: '#9C27B0' }
];

export function EventFormModal({
  selectedDate,
  eventForm,
  setEventForm,
  onClose,
  onSubmit,
  isSubmitting
}: EventFormModalProps) {
  const [viewMode] = React.useState<'calendar' | 'tasks'>(eventForm.type === 'task' ? 'tasks' : 'calendar');
  const { getTeamMembers } = useDB();
  const [teamMembers, setTeamMembers] = React.useState<Array<{
    id: string;
    name: string;
    email: string;
    role: string;
  }>>([]);
  const [guests, setGuests] = React.useState<string[]>([]);
  const [guestInput, setGuestInput] = React.useState('');
  const [workingHours, setWorkingHours] = React.useState([
    { start: '09:00', end: '17:00' }
  ]);
  const [isInviting, setIsInviting] = React.useState(false);
  const [taskPriority, setTaskPriority] = React.useState('medium');
  const [selectedLabels, setSelectedLabels] = React.useState<string[]>([]);
  const [taskStage, setTaskStage] = React.useState('To Do');

  // Load team members
  React.useEffect(() => {
    const loadTeamMembers = async () => {
      const members = await getTeamMembers();
      setTeamMembers(members);
    };
    loadTeamMembers();
  }, [getTeamMembers]);

  const handleGuestInvite = async (email: string) => {
    if (!email.trim() || isInviting) return;
    
    setIsInviting(true);
    try {
      await sendTeamInvite(
        email,
        email.split('@')[0], // Temporary name until they register
        'member',
        ['calendar'] // Basic calendar access
      );
      
      if (!guests.includes(email)) {
        setGuests([...guests, email]);
      }
      setGuestInput('');
    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-zinc-900/70 backdrop-blur-xl border border-[#FFD700]/30 rounded-xl shadow-2xl w-[500px] max-h-[600px] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#FFD700]/20">
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
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {viewMode !== 'tasks' ? <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Event Type</label>
            <div className="grid grid-cols-2 gap-4">
              {eventTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setEventForm(prev => ({ ...prev, type: type.id as typeof prev.type }))}
                  disabled={viewMode === 'tasks' && type.id !== 'task'}
                  className={`
                    p-4 rounded-lg border transition-colors flex items-start space-x-3
                    ${eventForm.type === type.id
                      ? `bg-${type.color}/20 border-${type.color} text-${type.color}`
                      : 'bg-zinc-800 border-[#FFD700]/20 text-white/70 hover:bg-white/5'
                    }
                    ${viewMode === 'tasks' && type.id !== 'task' ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${type.color}/10 flex items-center justify-center flex-shrink-0`}>
                    <type.icon className="w-5 h-5" style={{ color: type.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{type.label}</div>
                    <div className="text-xs text-white/50 mt-1">{type.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div> : (
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Priority</label>
                <div className="grid grid-cols-3 gap-3">
                  {taskPriorities.map((priority) => (
                    <button
                      key={priority.id}
                      type="button"
                      onClick={() => setTaskPriority(priority.id)}
                      className={`
                        p-2 rounded-lg border transition-colors flex items-center justify-center space-x-2
                        ${taskPriority === priority.id
                          ? `bg-${priority.color}/20 border-${priority.color} text-${priority.color}`
                          : 'bg-zinc-800 border-[#FFD700]/20 text-white/70 hover:bg-white/5'
                        }
                      `}
                    >
                      <Flag className="w-4 h-4" style={{ color: priority.color }} />
                      <span>{priority.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Labels</label>
                <div className="grid grid-cols-2 gap-2">
                  {taskLabels.map((label) => (
                    <button
                      key={label.id}
                      type="button"
                      onClick={() => {
                        setSelectedLabels(prev =>
                          prev.includes(label.id)
                            ? prev.filter(id => id !== label.id)
                            : [...prev, label.id]
                        );
                      }}
                      className={`
                        p-2 rounded-lg border transition-colors flex items-center space-x-2
                        ${selectedLabels.includes(label.id)
                          ? `bg-${label.color}/20 border-${label.color} text-${label.color}`
                          : 'bg-zinc-800 border-[#FFD700]/20 text-white/70 hover:bg-white/5'
                        }
                      `}
                    >
                      <Tag className="w-4 h-4" style={{ color: label.color }} />
                      <span>{label.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Stage</label>
                <select
                  value={taskStage}
                  onChange={(e) => setTaskStage(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Title</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={eventForm.title}
                onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                placeholder="Event title"
                required
              />
            </div>
          </div>

          {viewMode === 'tasks' ? (
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Due Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm(prev => ({ 
                    ...prev, 
                    startDate: e.target.value,
                    endDate: e.target.value 
                  }))}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Start Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  value={eventForm.startDate}
                  onChange={(e) => setEventForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">End Date</label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  value={eventForm.endDate}
                  min={eventForm.startDate}
                  onChange={(e) => setEventForm(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white [color-scheme:dark]"
                  required
                />
              </div>
            </div>

            <div className="col-span-2">
              <label className="flex items-center space-x-2 text-white/70 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={eventForm.isAllDay}
                  onChange={(e) => setEventForm(prev => ({ ...prev, isAllDay: e.target.checked }))}
                  className="rounded border-[#FFD700]/30 text-[#FFD700] bg-black/40 focus:ring-[#FFD700]/50"
                />
                <span>All Day</span>
              </label>
            </div>

            {!eventForm.isAllDay && (
              <>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Start Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="time"
                      value={eventForm.time}
                      onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white [color-scheme:dark]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">End Time</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="time"
                      value={eventForm.endTime}
                      onChange={(e) => setEventForm(prev => ({ ...prev, endTime: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white [color-scheme:dark]"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>
          )}

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={eventForm.location}
                onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                placeholder="Add location"
              />
            </div>
          </div>

          {eventForm.type === 'working-location' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Working Hours</label>
                {workingHours.map((hours, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="time"
                      value={hours.start}
                      onChange={(e) => {
                        const newHours = [...workingHours];
                        newHours[index].start = e.target.value;
                        setWorkingHours(newHours);
                      }}
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-[#4CAF50]/20 rounded-lg text-white"
                    />
                    <span className="text-white/50">to</span>
                    <input
                      type="time"
                      value={hours.end}
                      onChange={(e) => {
                        const newHours = [...workingHours];
                        newHours[index].end = e.target.value;
                        setWorkingHours(newHours);
                      }}
                      className="flex-1 px-3 py-2 bg-zinc-800 border border-[#4CAF50]/20 rounded-lg text-white"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Team Members</label>
            <div className="space-y-4">
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value && !guests.includes(e.target.value)) {
                      setGuests([...guests, e.target.value]);
                    }
                  }}
                  className={`w-full pl-10 pr-4 py-2 bg-zinc-800 border rounded-lg text-white ${
                    eventForm.type === 'event' ? 'border-[#FFD700]/20' :
                    eventForm.type === 'out-of-office' ? 'border-[#FF6B6B]/20' :
                    eventForm.type === 'working-location' ? 'border-[#4CAF50]/20' :
                    'border-[#2196F3]/20'
                  }`}
                >
                  <option value="">Select team member...</option>
                  {teamMembers.map((member: any) => (
                    <option 
                      key={member.id} 
                      value={member.email}
                      disabled={guests.includes(member.email)}
                    >
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">Additional Guests</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
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
                    placeholder="Add guest email"
                    className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleGuestInvite(guestInput)}
                    disabled={!guestInput.trim() || isInviting}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-[#FFD700]/10 hover:bg-[#FFD700]/20 text-[#FFD700] rounded transition-colors disabled:opacity-50"
                  >
                    {isInviting ? 'Inviting...' : 'Invite'}
                  </button>
                </div>
              </div>
              
              {guests.length > 0 && (
                <div className="space-y-2">
                  {guests.map((guest, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-[#FFD700]/20">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-[#FFD700]/10 flex items-center justify-center">
                          <Users className="w-4 h-4 text-[#FFD700]" />
                        </div>
                        <span className="text-white">{guest}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGuests(guests.filter((_, i) => i !== index))}
                        className="text-white/50 hover:text-white/70"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-sm font-medium mb-2">Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-white/40" />
              <textarea
                value={eventForm.description}
                onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white min-h-[100px]"
                placeholder="Add description..."
              />
            </div>
          </div>

          {viewMode !== 'tasks' && <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg border border-[#FFD700]/20">
              <div className="flex items-center space-x-3">
                <Video className="w-5 h-5 text-white/40" />
                <div>
                  <div className="text-white">Add video conferencing</div>
                  <div className="text-sm text-white/50">A video meeting link will be generated</div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={eventForm.videoConference}
                  onChange={(e) => setEventForm(prev => ({ ...prev, videoConference: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD700]"></div>
              </label>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Notification</label>
              <select
                value={eventForm.notifications[0] || '30'}
                onChange={(e) => setEventForm(prev => ({ ...prev, notifications: [e.target.value] }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
              >
                <option value="0">At time of event</option>
                <option value="5">5 minutes before</option>
                <option value="10">10 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
                <option value="1440">1 day before</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Recurrence</label>
              <select
                value={eventForm.recurrence}
                onChange={(e) => setEventForm(prev => ({ ...prev, recurrence: e.target.value }))}
                className="w-full px-3 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white"
              >
                <option value="none">Does not repeat</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">Attachments</label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    // In a real app, this would open a file picker
                    console.log('Open file picker');
                  }}
                  className="w-full px-4 py-2 bg-zinc-800 border border-[#FFD700]/20 rounded-lg text-white/70 hover:text-white hover:bg-zinc-700 transition-colors text-left flex items-center space-x-2"
                >
                  <Paperclip className="w-5 h-5" />
                  <span>Add attachment</span>
                </button>
              </div>
            </div>
          </div>}

          <div className="flex space-x-3 pt-4">
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
              className="px-6 py-2 bg-gradient-to-r from-[#FFD700] via-[#FFD700] to-[#FFD700] text-black font-medium rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin mr-2" />
                  <span>Creating...</span>
                </div>
              ) : (
                `Create ${viewMode === 'tasks' ? 'Task' : 'Event'}`
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}